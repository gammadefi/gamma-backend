import { Types } from "mongoose";

export interface ISettings {
    verificationCodeExpiry: number;
    createdBy: Types.ObjectId
}