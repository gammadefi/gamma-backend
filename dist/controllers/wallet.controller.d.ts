import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
declare class WalletController {
    service: UserService;
    constructor();
    sendAssets: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
}
export default WalletController;
