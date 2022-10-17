import mongoose from "mongoose";
import { TokenData } from "../types";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export const connectToDB = async (DB: string) => {
  mongoose
    .connect(DB)
    .then(() => console.log("Connected to DB successfully!"))
    .catch((err) =>
      console.log(`An error occured while connecting to DB: ${err}`)
    );
};

export const signJWT = (data: TokenData, secret: string, expiry: string): string => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiry
  })
  return token;
}

export const createVerificationCode = (n: number): string => {
  let code = ''

  for (let i = 0; i <= n; i++) code += crypto.randomInt(0, 9);

  return code
}