import "./importEnvs";

const PORT: string = process.env.PORT;
const ENV: string = process.env.ENV;
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY;
let DB: string;

if (ENV === "production") DB = process.env.DB_PROD;
else DB = process.env.DB_DEV;

export {
  PORT,
  ENV,
  DB,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};