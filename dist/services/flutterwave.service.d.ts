import { creatVCardITf } from "../interfaces/card.interface";
export declare const chargeCard: (amount: number, cardNumber: string, cvv: string, expiryMonth: string, expiryYear: string, email: string, txRef: string, currency: string, fullname: string, pin: number) => Promise<any>;
export declare const validateCharge: (trxRef: string, otp: string) => Promise<any>;
export declare const createVirtualCard: ({ currency, amount, firstName, lastName, dob, email, phone, title, gender }: creatVCardITf) => Promise<any>;
export declare const getAllVirtualCards: () => Promise<void>;
