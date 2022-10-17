"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errHandler = exports.ForbiddenError = exports.ConflictError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.APIError = exports.AppError = void 0;
const Errors_1 = require("./Errors");
Object.defineProperty(exports, "AppError", { enumerable: true, get: function () { return Errors_1.AppError; } });
Object.defineProperty(exports, "APIError", { enumerable: true, get: function () { return Errors_1.APIError; } });
Object.defineProperty(exports, "BadRequestError", { enumerable: true, get: function () { return Errors_1.BadRequestError; } });
Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function () { return Errors_1.NotFoundError; } });
Object.defineProperty(exports, "UnauthorizedError", { enumerable: true, get: function () { return Errors_1.UnauthorizedError; } });
Object.defineProperty(exports, "ConflictError", { enumerable: true, get: function () { return Errors_1.ConflictError; } });
Object.defineProperty(exports, "ForbiddenError", { enumerable: true, get: function () { return Errors_1.ForbiddenError; } });
const ErrorException_1 = __importDefault(require("./ErrorException"));
exports.errHandler = ErrorException_1.default;
//# sourceMappingURL=index.js.map