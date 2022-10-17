import { Request } from "express";

export type Wallet = {privateKey: string, publicKey: string, seedPhrase: string}
export type TokenData = { id: string; resourceType: string };
export type Device = { name: string; ip: string; verified: boolean };

export interface IPRequest extends Request {
    device: Device
}