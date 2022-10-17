import { Request } from "express";
export declare type Wallet = {
    privateKey: string;
    publicKey: string;
    seedPhrase: string;
};
export declare type TokenData = {
    id: string;
    resourceType: string;
};
export declare type Device = {
    name: string;
    ip: string;
    verified: boolean;
};
export interface IPRequest extends Request {
    device: Device;
}
