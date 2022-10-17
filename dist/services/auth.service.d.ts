import { UserRepo, PendingUserRepo } from "../repositories";
import { IUser } from "../interfaces";
import { Device } from "../types";
declare class AuthService {
    repo: UserRepo;
    pendingRepo: PendingUserRepo;
    constructor();
    stripUser(user: IUser): any;
    signTokens(user: IUser): {
        refreshToken: string;
        accessToken: string;
    };
    login(email: string, password: string, device: Device): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
    initializeSignUp(email: string): Promise<string>;
    signUp(email: string, name: string, password: string, verificationCode: string, device: Device): Promise<any>;
    verifyDevice(email: string, device: Device, verificationCode: string): Promise<{
        user: any;
        accessToken: string;
        refreshToken: string;
    }>;
}
export default AuthService;
