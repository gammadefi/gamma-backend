import { Wallet, Device } from '../types';
export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    dob: Date;
    phone: string;
    title: string;
    gender: string;
    password: string;
    walletAddress?: string;
    assets?: string[];
    wallet?: Wallet[];
    verificationCode?: string;
    devices?: Device[];
    refreshTokens: string[];
    phoneVerified?: boolean;
    _id?: string;
    pendingPhone?: string;
    pendingEmail?: string;
    verificationExpiry?: Date;
    lastSensitiveInfoUpdateTime?: Date;
}
