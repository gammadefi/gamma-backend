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
exports.default = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validationOptions = {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true,
            };
            const validated = yield schema.validateAsync(req.body, validationOptions);
            req.body = validated;
            next();
        }
        catch (err) {
            console.log(err);
            const errMessages = [];
            err.details.map((e) => errMessages.push(e.message));
            err.statusCode = 409;
            err.message = errMessages.join(",");
            next(err);
        }
    });
};
//# sourceMappingURL=validateReqBody.js.map