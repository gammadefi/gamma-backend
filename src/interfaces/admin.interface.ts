import { AdminAction, Device } from "../types";

export interface IAdmin {
  email: string;
  password: string;
  refreshTokens: string[];
  _id?: string;
  verificationExpiry?: Date;
  actions: AdminAction[];
  active: boolean;
  verificationCode: string;
  devices?: Device[];
  pendingEmail: string;
  lastSensitiveInfoUpdateTime?: Date;
}