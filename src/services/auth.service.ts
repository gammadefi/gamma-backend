import {
  UserRepo,
  PendingUserRepo,
  AdminRepo,
  SettingsRepo,
} from "../repositories";
import { IAdmin, IPendingUser, IUser } from "../interfaces";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../exceptions";
import { signJWT, createVerificationCode } from "../utils";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config";
import { Device } from "../types";
import { createWallet } from "./api/createWallet";
import moment from "moment";

class AuthService {
  repo: UserRepo;
  pendingRepo: PendingUserRepo;
  adminRepo: AdminRepo;
  settingsRepo: SettingsRepo;

  constructor() {
    this.repo = new UserRepo();
    this.pendingRepo = new PendingUserRepo();
    this.adminRepo = new AdminRepo();
    this.settingsRepo = new SettingsRepo();
  }

  // Helper method to strip user object of sensitive info
  public stripUser(
    resource: IUser | IAdmin,
    resourceType: "user" | "admin"
  ): any {
    if (resourceType === "user") {
      const { password, refreshTokens, devices, ...restOfUser } = (
        resource as any
      )._doc;
      return restOfUser;
    } else {
      const { password, refreshTokens, ...restOfAdmin } = (resource as any)
        ._doc;
      return restOfAdmin;
    }
  }


  public async getVerificationCodeExpiry(): Promise<number> {
    const settings = await this.settingsRepo.get();
    const verificationCodeExpiry = !settings
      ? 10
      : settings.verificationCodeExpiry;
    return verificationCodeExpiry
  }

  // Helper method to check if expiry time of verification code has passed
  public checkExpiryTime(time: Date): void {
    if (moment().isAfter(time))
      throw new UnauthorizedError(`Verification code expired!`);
  }

  // Helper function to sign tokens
  public signTokens(
    resource: IUser | IAdmin,
    resourceType: "user" | "admin"
  ): {
    refreshToken: string;
    accessToken: string;
  } {
    const dataToSign = { id: resource._id, resourceType };

    const accessToken = signJWT(
      dataToSign,
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = signJWT(
      dataToSign,
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );

    return { refreshToken, accessToken };
  }

  // public async sendVerificationCode()

  public async login(
    email: string,
    password: string,
    device: Device,
    resourceType: "admin" | "user"
  ): Promise<{
    user?: any;
    admin?: any;
    accessToken: string;
    refreshToken: string;
  }> {
    let resource: any;

    if (resourceType === "user") resource = await this.repo.whereOne({ email });
    else resource = await this.adminRepo.whereOne({ email });

    if (!resource || !resource.comparePassword(password))
      throw new UnauthorizedError(
        `No ${resourceType} found with email or password!`
      );

    // Getting user's devices
    const devices = resource.devices;

    let deviceFound = false;

    // Mapping through devices to see if device has already been verified
    devices.map((el: Device) => {
      if (
        el.ip === device.ip &&
        el.name === device.name &&
        el.verified === true
      )
        deviceFound = true;
    });

    // Send verification code and throw error if device not found or verified
    if (!deviceFound) {
      const verificationCodeExpiry = await this.getVerificationCodeExpiry();
      const verificationData = createVerificationCode(
        5,
        verificationCodeExpiry
      );
      const dataToUpdate = {
        verificationCode: verificationData.verificationCode,
        verificationExpiry: verificationData.expiryTimeInMinutes,
      };

      if (resourceType === "user")
        await this.repo.update(resource._id, dataToUpdate);
      else await this.adminRepo.update(resource._id, dataToUpdate);
      // Send email here telling user/admin to authenticate new device

      // Throw Error
      throw new UnauthorizedError(`Unauthenticated device`);
    }

    const { refreshToken, accessToken } = this.signTokens(
      resource,
      resourceType
    );

    const refreshTokens = resource.refreshTokens;
    refreshTokens.push(refreshToken);

    await resource.save();

    const resourceToReturn = this.stripUser(resource, resourceType);
    const dataToReturn: {
      user?: any;
      admin?: any;
      accessToken: string;
      refreshToken: string;
    } = { accessToken, refreshToken };

    if (resourceType === "user") dataToReturn.user = resourceToReturn;
    else dataToReturn.admin = resourceToReturn;

    return dataToReturn;
  }

  public async signupAdmin(email: string, password: string): Promise<any> {
    const admin = await this.adminRepo.whereOne({ email });

    if (admin)
      throw new ForbiddenError(
        `An admin already exists with the email ${email}`
      );

    const newAdmin = await this.adminRepo.createUser({
      email,
      password,
      refreshTokens: [],
      actions: [],
      active: true,
      verificationCode: "",
      devices: [],
    } as IAdmin);

    return this.stripUser(newAdmin, "admin");
  }

  public async initializeSignUp(email: string): Promise<string> {
    let pendingUser = await this.pendingRepo.getOne(email);
    const verificationCodeExpiry = await this.getVerificationCodeExpiry();
    let verificationData = createVerificationCode(
      5,
      verificationCodeExpiry
    );

    if (!pendingUser)
      pendingUser = await this.pendingRepo.create(
        email,
        verificationData.verificationCode,
        verificationData.expiryTimeInMinutes
      );
    else if (pendingUser && pendingUser.verified === true)
      throw new ForbiddenError(`A user already exists with the email ${email}`);
    else
      await this.pendingRepo.update(email, {
        verificationCode: verificationData.verificationCode,
        verificationExpiry: verificationData.expiryTimeInMinutes,
      });

    // Send verification code to user's email

    return verificationData.verificationCode;
  }

  public async signUp(
    email: string,
    firstName: string,
    lastName: string,
    dob: Date,
    title: string,
    gender: string,
    // phone: string,
    password: string,
    verificationCode: string,
    device: Device
  ): Promise<any> {
    const user = await this.repo.whereOne({ email });
    if (user)
      throw new ForbiddenError(`A user already exists with the email ${email}`);

    const pendingUser = await this.pendingRepo.getOne(email);
    if (!pendingUser) throw new ForbiddenError(`User not initialized!`);

    if (verificationCode !== pendingUser.verificationCode)
      throw new UnauthorizedError(`User verification failed!`);

    this.checkExpiryTime(pendingUser.verificationExpiry);

    device.verified = true;

    let genWallet: any;
    let genWalletAddress: string;

    await createWallet().then((resp) => {
      console.log(resp.data.ETH[0], resp.data.ETH[0].address);
      genWallet = resp.data.ETH[0];
      genWalletAddress = resp.data.ETH[0].address;
    });

    // console.log(genWallet);
    const newUser = await this.repo.createUser({
      email,
      firstName,
      lastName,
      dob,
      title,
      gender,
      // phone: "",
      // pendingPhone: phone,
      password,
      verificationCode,
      refreshTokens: [],
      devices: [device],
      wallet: [genWallet],
      walletAddress: genWalletAddress,
    } as any);

    // Send welcome mail

    await this.pendingRepo.update(email, { verified: true });

    return this.stripUser(newUser, "user");
  }

  public async sendCode(
    channel: "email" | "phone",
    value: string,
    resourceType: "admin" | "user"
  ): Promise<boolean> {
    let resource;

    if (resourceType === "admin")
      resource = await this.adminRepo.whereOne({ email: value });
    else {
      if (channel === "email")
        resource = await this.repo.whereOne({ email: value });
      else resource = await this.repo.whereOne({ phone: value });
    }

    if (!resource)
      throw new NotFoundError(
        `No ${resourceType} found with phone number or email!`
      );

    const verificationCodeExpiry = await this.getVerificationCodeExpiry();
    const verificationData = createVerificationCode(
      5,
      verificationCodeExpiry
    );

    // Send email if verification channel is email

    // Send text message if verification channel is phone

    const dataToUpdate = {
      verificationCode: verificationData.verificationCode,
      verificationExpiry: verificationData.expiryTimeInMinutes,
    };

    if (resourceType === "user")
      await this.repo.update(resource._id, dataToUpdate);
    else await this.adminRepo.update(resource._id, dataToUpdate);

    return true;
  }

  public async updatePhoneOrEmail(
    channel: "email" | "phone",
    value: string,
    userId: string
  ): Promise<boolean> {
    let existingUser: any;
    let pendingElUser: any;
    const verificationCodeExpiry = await this.getVerificationCodeExpiry();
    const verificationData = createVerificationCode(
      5,
      verificationCodeExpiry
    );
    let updateFields: any = {
      verificationCode: verificationData.verificationCode,
      verificationExpiry: verificationData.expiryTimeInMinutes,
    };
    let pendingElUserUpdateFields: any = {};

    if (channel === "email") {
      existingUser = await this.repo.whereOne({ email: value });
      pendingElUser = await this.repo.whereOne({ pendingEmail: value });
      pendingElUserUpdateFields.pendingEmail = "";
      updateFields.pendingEmail = value;
    } else {
      existingUser = await this.repo.whereOne({ phone: value });
      pendingElUser = await this.repo.whereOne({ pendingPhone: value });
      pendingElUserUpdateFields.pendingPhone = "";
      updateFields.pendingPhone = value;
    }

    if (existingUser)
      throw new ForbiddenError(`A user already exists with this ${channel}`);

    if (pendingElUser)
      await this.repo.update(pendingElUser._id, pendingElUserUpdateFields);

    // Send email to user if channel is email

    // Send verification code to user's number if channel is phone

    // Change time of last sensitive data update to current time
    updateFields.lastSensitiveInfoUpdateTime = new Date(Date.now());
    await this.repo.update(userId, updateFields);

    return true;
  }

  public async verifyPhoneOrMail(
    channel: "phone" | "email",
    verificationCode: string,
    value: string
  ): Promise<IUser> {
    let filter: object;
    let updateFields: any = { verificationCode: "" };

    if (channel === "phone") {
      filter = { pendingPhone: value };
      updateFields = {
        ...updateFields,
        phone: value,
        pendingPhone: "",
        phoneVerified: true,
      };
    } else {
      filter = { pendingEmail: value };
      updateFields = { ...updateFields, email: value, pendingEmail: "" };
    }

    const user: any = await this.repo.whereOne(filter);

    if (!user)
      throw new NotFoundError("No user found with phone number or email");

    if (verificationCode != user.verificationCode)
      throw new UnauthorizedError(`Invalid verification code!`);

    this.checkExpiryTime(user.verificationExpiry);

    // Change time of last sensitive data update to current time
    updateFields.lastSensitiveInfoUpdateTime = new Date(Date.now());
    const updatedUser = await this.repo.update(user._id, updateFields);

    return this.stripUser(updatedUser, "user");
  }

  public async verifyDevice(
    email: string,
    device: Device,
    verificationCode: string,
    resourceType: "admin" | "user"
  ): Promise<{
    user?: any;
    admin?: any;
    accessToken: string;
    refreshToken: string;
  }> {
    let resource;

    if (resourceType === "user") resource = await this.repo.whereOne({ email });
    else resource = await this.adminRepo.whereOne({ email });

    if (!resource) throw new ForbiddenError(`No user found`);

    if (verificationCode !== resource.verificationCode)
      throw new UnauthorizedError(`Invalid verification code!`);

    // Getting user device
    const devices = resource.devices;

    // Getting all devices not equal to the current device
    const newDevices = devices.filter((el: Device) => el.ip !== device.ip);

    // Setting device to verified and adding it to array of user's devices
    device.verified = true;
    newDevices.push(device);

    // Getting user's refresh tokens and adding newly created refresh token
    const refreshTokens = resource.refreshTokens;
    const { refreshToken, accessToken } = this.signTokens(
      resource,
      resourceType
    );
    refreshTokens.push(refreshToken);

    // Saving user object
    resource.devices = newDevices;
    resource.refreshTokens = refreshTokens;
    resource.verificationCode = "";
    resource.save();

    const userToReturn = this.stripUser(resource, resourceType);

    const dataToReturn: {
      user?: any;
      admin?: any;
      accessToken: string;
      refreshToken: string;
    } = { accessToken, refreshToken };

    if (resourceType === "user") dataToReturn.user = userToReturn;
    else dataToReturn.admin = userToReturn;

    return dataToReturn;
  }
}

export default AuthService;
