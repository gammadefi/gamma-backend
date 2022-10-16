import {Wallet} from '../types'

export interface IUser {
    email: string;
    name: string;
    password: string;
    walletAddress?: string;
    assets?: string[];
    wallet: Wallet[];
    verificationCode?: number;
}