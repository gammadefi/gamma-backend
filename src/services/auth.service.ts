import { UserRepo, PendingUserRepo } from "../repositories";
import { IPendingUser, IUser } from "../interfaces";
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

  constructor() {
    this.repo = new UserRepo();
    this.pendingRepo = new PendingUserRepo();
  }

  // Helper method to strip user object of sensitive info
  public stripUser(user: IUser): any {
    const { password, refreshTokens, devices, ...restOfUser } = (user as any)
      ._doc;
    return restOfUser;
  }

  // Helper method to check if expiry time of verification code has passed
  public checkExpiryTime(time: Date): void {
    if (moment().isAfter(time)) throw new UnauthorizedError(`Verification code expired!`);
  }

  // Helper function to sign tokens
  public signTokens(user: IUser): {
    refreshToken: string;
    accessToken: string;
  } {
    const dataToSign = { id: user._id, resourceType: "user" };

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

  public async login(
    email: string,
    password: string,
    device: Device
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user: any = await this.repo.whereOne({ email });

    if (!user || !user.comparePassword(password))
      throw new UnauthorizedError(`No user found with email or password!`);

    // Getting user's devices
    const devices = user.devices;

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
      const verificationData = createVerificationCode(5, 10);
      await this.repo.update(user._id, { verificationCode: verificationData.verificationCode, verificationExpiry: verificationData.expiryTimeInMinutes });
      // Send email here telling user to authenticate new device

      // Throw Error
      throw new UnauthorizedError(`Unauthenticated device`);
    }

    const { refreshToken, accessToken } = this.signTokens(user);

    const refreshTokens = user.refreshTokens;
    refreshTokens.push(refreshToken);

    await user.save();

    const userToReturn = this.stripUser(user);

    return { user: userToReturn, accessToken, refreshToken };
  }

  public async initializeSignUp(email: string): Promise<string> {
    let pendingUser = await this.pendingRepo.getOne(email);
    let verificationData = createVerificationCode(5, 10);

    if (!pendingUser)
      pendingUser = await this.pendingRepo.create(email, verificationData.verificationCode, verificationData.expiryTimeInMinutes);
    else if (pendingUser && pendingUser.verified === true)
      throw new ForbiddenError(`A user already exists with the email ${email}`);
    else await this.pendingRepo.update(email, { verificationCode: verificationData.verificationCode, verificationExpiry: verificationData.expiryTimeInMinutes });

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
    phone: string,
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

    console.log(genWallet);
    const newUser = await this.repo.createUser({
      email,
      firstName,
      lastName,
      dob,
      title,
      gender,
      phone: "",
      pendingPhone: phone,
      password,
      verificationCode,
      refreshTokens: [],
      devices: [device],
      wallet: [genWallet],
      walletAddress: genWalletAddress,
    });

    // Send welcome mail

    await this.pendingRepo.update(email, { verified: true });

    return this.stripUser(newUser);
  }

  public async sendCode(
    channel: "email" | "phone",
    value: string
  ): Promise<boolean> {
    let user;

    if (channel === "email") user = await this.repo.whereOne({ email: value });
    else user = await this.repo.whereOne({ phone: value });

    if (!user)
      throw new NotFoundError("No user found with phone number or email!");

    const verificationData = createVerificationCode(5, 10);

    // Send email if verification channel is email

    // Send text message if verification channel is phone

    await this.repo.update(user._id, { verificationCode: verificationData.verificationCode, verificationExpiry: verificationData.expiryTimeInMinutes });

    return true;
  }

  public async updatePhoneOrEmail(
    channel: "email" | "phone",
    value: string,
    userId: string
  ): Promise<boolean> {
    let existingUser: any;
    let pendingElUser: any;
    const verificationData = createVerificationCode(5, 10);
    let updateFields: any = { verificationCode: verificationData.verificationCode, verificationExpiry: verificationData.expiryTimeInMinutes };
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

    await this.repo.update(userId, updateFields);

    return true;
  }

  public async verifyPhoneOrMail(
    channel: "phone" | "email",
    verificationCode: string,
    value: string
  ): Promise<IUser> {
    let filter: object;
    let updateFields: object = { verificationCode: "" };

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

    const updatedUser = await this.repo.update(user._id, updateFields);

    return this.stripUser(updatedUser);
  }

  public async verifyDevice(
    email: string,
    device: Device,
    verificationCode: string
  ): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const user: any = await this.repo.whereOne({ email });
    if (!user) throw new ForbiddenError(`No user found`);

    if (verificationCode !== user.verificationCode)
      throw new UnauthorizedError(`Invalid verification code!`);

    // Getting user device
    const devices = user.devices;

    // Getting all devices not equal to the current device
    const newDevices = devices.filter((el: Device) => el.ip !== device.ip);

    // Setting device to verified and adding it to array of user's devices
    device.verified = true;
    newDevices.push(device);

    // Getting user's refresh tokens and adding newly created refresh token
    const refreshTokens = user.refreshTokens;
    const { refreshToken, accessToken } = this.signTokens(user);
    refreshTokens.push(refreshToken);

    // Saving user object
    user.devices = newDevices;
    user.refreshTokens = refreshTokens;
    user.verificationCode = "";
    user.save();

    const userToReturn = this.stripUser(user);

    return { user: userToReturn, accessToken, refreshToken };
  }
}

export default AuthService;
