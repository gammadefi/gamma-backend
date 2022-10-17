import { UserRepo, PendingUserRepo } from "../repositories";
import { IPendingUser, IUser } from "../interfaces";
import { ForbiddenError, UnauthorizedError } from "../exceptions";
import { signJWT, createVerificationCode } from "../utils";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "../config";
import { Device } from "../types";
import { createWallet } from "./api/createWallet";

class AuthService {
  repo: UserRepo;
  pendingRepo: PendingUserRepo;

  constructor() {
    this.repo = new UserRepo();
    this.pendingRepo = new PendingUserRepo();
  }

  // Helper method to strip user object of sensitive info
  public stripUser(user: IUser): any {
    const { password, refreshTokens, devices, ...restOfUser } = (user as any)._doc;
    return restOfUser;
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
      const verificationCode = createVerificationCode(5);
      await this.repo.update(user._id, { verificationCode });
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
    let verificationCode = createVerificationCode(5);

    if (!pendingUser)
      pendingUser = await this.pendingRepo.create(email, verificationCode);
    else if (pendingUser && pendingUser.verified === true)
      throw new ForbiddenError(`A user already exists with the email ${email}`);
    else await this.pendingRepo.update(email, { verificationCode });

    // Send verification code to user's email

    return verificationCode;
  }

  public async signUp(
    email: string,
    name: string,
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

    device.verified = true;

    let genWallet : any ;
    let genWalletAddress:string;

   await createWallet().then((resp) => {
      console.log(resp.data.ETH[0], resp.data.ETH[0].address )
      genWallet = resp.data.ETH[0]
      genWalletAddress = resp.data.ETH[0].address
       
  })
  
  console.log(genWallet)
    const newUser = await this.repo.createUser({
      email,
      name,
      password,
      verificationCode,
      refreshTokens: [],
      devices: [device],
      wallet:genWallet,
      walletAddress:genWalletAddress
    });

    // Send welcome mail

    await this.pendingRepo.update(email, { verified: true });

    return this.stripUser(newUser);
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
    user.save();

    const userToReturn = this.stripUser(user);

    return { user: userToReturn, accessToken, refreshToken };
  }
}

export default AuthService;
