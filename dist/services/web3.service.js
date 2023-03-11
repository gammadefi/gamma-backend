"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
axios_1.default.get("https://api-polygon-tokens.polygon.technology/tokenlists/popularTokens.tokenlist.json").then(res => console.log(res)).catch(err => console.log(err));
//# sourceMappingURL=web3.service.js.map