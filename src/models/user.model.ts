import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";
import bcrypt from "bcrypt"

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["M", "F"],
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
      unique: true,
      sparse: true,
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
    verificationCode: String,
    refreshTokens: [String],
    devices: [Schema.Types.Mixed],
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    pendingPhone: String,
    pendingEmail: String,
    verificationExpiry: Date
  },
  { timestamps: true }
);

userSchema.pre('save', async function(next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  const correct = await bcrypt.compare(password, this.password);
  return correct;
}

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
