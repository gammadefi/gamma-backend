import { Request } from "express";
import { IUser } from "./interfaces";

export type Wallet = {address: string, key: string, Mnemonic: string}
export type TokenData = { id: string; resourceType: string };
export type Device = { name: string; ip: string; verified: boolean };

export interface IPRequest extends Request {
    device: Device
}

export interface ProtectedRequest extends IPRequest {
    user?: IUser
}