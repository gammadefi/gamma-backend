"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_CODES = exports.ForbiddenError = exports.ConflictError = exports.UnauthorizedError = exports.NotFoundError = exports.BadRequestError = exports.APIError = exports.AppError = void 0;
const STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
    CONFLICT: 409,
    FORBIDDEN: 403
};
exports.STATUS_CODES = STATUS_CODES;
class AppError extends Error {
    constructor(statusCode, message, isOperational) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
class APIError extends AppError {
    constructor(statusCode = STATUS_CODES.INTERNAL_ERROR, message = 'Internal Server Error', isOperational = true) {
        super(statusCode, message, isOperational);
    }
}
exports.APIError = APIError;
class BadRequestError extends AppError {
    constructor(message = 'Bad request') {
        super(STATUS_CODES.BAD_REQUEST, message, true);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(STATUS_CODES.NOT_FOUND, message, true);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends AppError {
    constructor(message = 'Not authprized') {
        super(STATUS_CODES.UN_AUTHORISED, message, true);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(STATUS_CODES.CONFLICT, message, true);
    }
}
exports.ConflictError = ConflictError;
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(STATUS_CODES.FORBIDDEN, message, true);
    }
}
exports.ForbiddenError = ForbiddenError;
//# sourceMappingURL=Errors.js.map