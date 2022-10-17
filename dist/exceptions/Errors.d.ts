declare const STATUS_CODES: {
    OK: number;
    BAD_REQUEST: number;
    UN_AUTHORISED: number;
    NOT_FOUND: number;
    INTERNAL_ERROR: number;
    CONFLICT: number;
    FORBIDDEN: number;
};
declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(statusCode: number, message: string, isOperational: boolean);
}
declare class APIError extends AppError {
    constructor(statusCode?: number, message?: string, isOperational?: boolean);
}
declare class BadRequestError extends AppError {
    constructor(message?: string);
}
declare class NotFoundError extends AppError {
    constructor(message?: string);
}
declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
declare class ConflictError extends AppError {
    constructor(message?: string);
}
declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export { AppError, APIError, BadRequestError, NotFoundError, UnauthorizedError, ConflictError, ForbiddenError, STATUS_CODES, };
