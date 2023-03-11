import { NextFunction, Response } from "express";
import { SettingsService } from "../services";
import { ProtectedRequest } from "../types";
declare class SettingsController {
    service: SettingsService;
    constructor();
    get: (req: ProtectedRequest, res: Response, next: NextFunction) => Promise<Response>;
    update: (req: ProtectedRequest, res: Response, next: NextFunction) => Promise<Response>;
    create: (req: ProtectedRequest, res: Response, next: NextFunction) => Promise<Response>;
}
export default SettingsController;
