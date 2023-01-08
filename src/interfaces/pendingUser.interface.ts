export interface IPendingUser {
    email: string;
    verificationCode: string;
    verificationExpiry: Date;
    verified: boolean;
}