"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
class TokenService {
    constructor() {
        this.getTokens = (environment) => __awaiter(this, void 0, void 0, function* () { return this.repo.where({ environment }); });
        this.getToken = (address) => __awaiter(this, void 0, void 0, function* () { return this.repo.where({ address }); });
        this.repo = new repositories_1.TokenRepo();
    }
}
exports.default = TokenService;
;
//# sourceMappingURL=token.service.js.map