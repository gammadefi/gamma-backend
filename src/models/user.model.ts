import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      // unique: true
    },
    assets: [
      {
        type: String,
      },
    ],
    wallet: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    verificationCode: String
  },
  { timestamps: true }
);

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
