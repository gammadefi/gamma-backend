import { AuthService } from "../services";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IPRequest } from "../types";
declare class AuthController {
    service: AuthService;
    constructor();
    initReg: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    registerAdmin: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    register: (req: IPRequest, res: Response, next: NextFunction) => Promise<Response>;
    login: (resourceType: "admin" | "user") => RequestHandler;
    verifyDevice: (resourceType: "admin" | "user") => RequestHandler;
    sendCode: (resourceType: "admin" | "user") => RequestHandler;
    updatePhoneOrMail: (channel: "phone" | "email") => RequestHandler;
    verifyPhoneOrMail: (channel: "phone" | "email") => RequestHandler;
}
export default AuthController;
