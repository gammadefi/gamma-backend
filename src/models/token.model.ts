import { model, Schema } from "mongoose";
import { IToken } from "../interfaces";

const tokenSchema = new Schema<IToken>(
  {
    chainId: {
      type: Number,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    logoURI: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    decimals: {
      type: Number,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    environment: {
      type: String,
      required: true,
      enum: ["test", "live"],
    },
  },
  { timestamps: true }
);

export default model<IToken>("Token", tokenSchema);
