import {Wallet, Device} from '../types'

export interface IUser {
    email: string;
    name: string;
    password: string;
    walletAddress?: string;
    assets?: string[];
    wallet?: Wallet[];
    verificationCode?: string;
    devices?: Device[];
    refreshTokens: string[];
    _id?: string
}