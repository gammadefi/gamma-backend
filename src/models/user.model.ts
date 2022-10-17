import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";
import bcrypt from "bcrypt"

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
      unique: true,
      sparse: true
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
    devices: [Schema.Types.Mixed]
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
