import { UserRepo, PendingUserRepo, AdminRepo, SettingsRepo } from "../repositories";
import { IAdmin, IUser } from "../interfaces";
import { Device } from "../types";
declare class AuthService {
    repo: UserRepo;
    pendingRepo: PendingUserRepo;
    adminRepo: AdminRepo;
    settingsRepo: SettingsRepo;
    constructor();
    stripUser(resource: IUser | IAdmin, resourceType: "user" | "admin"): any;
    getVerificationCodeExpiry(): Promise<number>;
    checkExpiryTime(time: Date): void;
    signTokens(resource: IUser | IAdmin, resourceType: "user" | "admin"): {
        refreshToken: string;
        accessToken: string;
    };
    login(email: string, password: string, device: Device, resourceType: "admin" | "user"): Promise<{
        user?: any;
        admin?: any;
        accessToken: string;
        refreshToken: string;
    }>;
    signupAdmin(email: string, password: string): Promise<any>;
    initializeSignUp(email: string): Promise<string>;
    signUp(email: string, firstName: string, lastName: string, dob: Date, title: string, gender: string, password: string, verificationCode: string, device: Device): Promise<any>;
    sendCode(channel: "email" | "phone", value: string, resourceType: "admin" | "user"): Promise<boolean>;
    updatePhoneOrEmail(channel: "email" | "phone", value: string, userId: string): Promise<boolean>;
    verifyPhoneOrMail(channel: "phone" | "email", verificationCode: string, value: string): Promise<IUser>;
    verifyDevice(email: string, device: Device, verificationCode: string, resourceType: "admin" | "user"): Promise<{
        user?: any;
        admin?: any;
        accessToken: string;
        refreshToken: string;
    }>;
}
export default AuthService;
