import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
declare class UserController {
    service: UserService;
    constructor();
    getAll: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    getAllPending: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    getUser: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    getAPendingUser: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
}
export default UserController;
