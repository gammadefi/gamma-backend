import { TokenData } from "../types";
import { TransferNativeITF } from "../interfaces/wallet.interface";
export declare const connectToDB: (DB: string) => Promise<void>;
export declare const signJWT: (data: TokenData, secret: string, expiry: string) => string;
export declare const createVerificationCode: (n: number, expiryTimeInMinutes: number) => {
    verificationCode: string;
    expiryTimeInMinutes: Date;
};
export declare const transferAsset: () => Promise<void>;
export declare const tokenSwap: (privateKey: string, token: {
    address: string;
    decimal: number;
}, sellToken: string, buyToken: string, amount: number, myAddress: string) => Promise<void>;
export declare const sendNativeCoin: ({ privateKey, toAddress, fromAddress, amount }: TransferNativeITF) => Promise<void>;
