import { NextFunction, Response } from "express";
import { SettingsService } from "../services";
import { AdminAction, ProtectedRequest } from "../types";
import moment from "moment";
import { Types } from "mongoose";

class SettingsController {
  service: SettingsService;

  constructor() {
    this.service = new SettingsService();
  }

  get = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const settings = await this.service.getSettings();
      return res.status(200).json({ status: "success", data: settings });
    } catch (err: any) {
      next(err);
    }
  };

  update = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      // Get Admin data from request
      const admin = req.admin;

      // Update data and get update time
      const updatedSettings = await this.service.updateSettings(req.body, admin);

      // Return updated settings
      return res.status(200).json({ status: "success", data: updatedSettings });
    } catch (err: any) {
      next(err);
    }
  };

  create = async (
    req: ProtectedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      // Get admin details
      const admin = req.admin;

      // Create settings
      const settings = await this.service.createSettings({
        createdBy: new Types.ObjectId(admin._id),
        ...req.body,
      });

      return res.status(201).json({ status: "success", data: settings });
    } catch (err: any) {
      next(err);
    }
  };
}

export default SettingsController;