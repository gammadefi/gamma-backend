import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
declare class cardController {
    service: UserService;
    constructor();
    createVCard: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    fundVCard: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
    getAllVcard: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
}
export default cardController;
