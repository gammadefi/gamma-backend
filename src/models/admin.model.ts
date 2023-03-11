import { Schema, model } from "mongoose";
import { IAdmin } from "../interfaces";
import bcrypt from "bcrypt";

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshTokens: [String],
    verificationExpiry: Date,
    actions: [
      {
        type: Schema.Types.Mixed,
      },
    ],
    active: Boolean,
    devices: [Schema.Types.Mixed],
    verificationCode: String,
    pendingEmail: String,
    lastSensitiveInfoUpdateTime: Date
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }
  next();
});

adminSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const correct = await bcrypt.compare(password, this.password);
  return correct;
};

const AdminModel = model<IAdmin>("Admin", adminSchema);

export default AdminModel;