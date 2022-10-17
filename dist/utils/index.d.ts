import { TokenData } from "../types";
export declare const connectToDB: (DB: string) => Promise<void>;
export declare const signJWT: (data: TokenData, secret: string, expiry: string) => string;
export declare const createVerificationCode: (n: number) => string;
