"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_EXPIRY = exports.ACCESS_TOKEN_EXPIRY = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.DB = exports.ENV = exports.PORT = void 0;
require("./importEnvs");
const PORT = process.env.PORT;
exports.PORT = PORT;
const ENV = process.env.ENV;
exports.ENV = ENV;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;
exports.ACCESS_TOKEN_EXPIRY = ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;
exports.REFRESH_TOKEN_EXPIRY = REFRESH_TOKEN_EXPIRY;
let DB;
exports.DB = DB;
if (ENV === "production")
    exports.DB = DB = process.env.DB_PROD;
else
    exports.DB = DB = process.env.DB_DEV;
//# sourceMappingURL=index.js.map