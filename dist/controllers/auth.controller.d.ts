import { AuthService } from "../services";
import { Request, Response, NextFunction } from "express";
import { IPRequest } from "../types";
declare class AuthController {
    service: AuthService;
    constructor();
    initReg: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    register: (req: IPRequest, res: Response, next: NextFunction) => Promise<Response>;
    login: (req: IPRequest, res: Response, next: NextFunction) => Promise<Response>;
    verifyDevice: (req: IPRequest, res: Response, next: NextFunction) => Promise<Response>;
}
export default AuthController;
