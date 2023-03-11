import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
declare class walletCOntroller {
    service: UserService;
    constructor();
    sendMatic: (req: Request, res: Response, next: NextFunction) => Promise<Response>;
}
export default walletCOntroller;
