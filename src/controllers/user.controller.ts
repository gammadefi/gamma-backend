import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../exceptions";
import { UserService } from "../services";
import { Types } from "mongoose";

class UserController {
  service: UserService;

  constructor() {
    this.service = new UserService();
  }

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { limit, skip } = req.query;
      const limitValue = limit ? Number(limit) : 20;
      const offsetValue = skip ? Number(skip) : 0;

      const users = await this.service.getAllUsers(offsetValue, limitValue);
      return res.status(200).json({ status: "success", data: users });
    } catch (err: any) {
      next(err);
    }
  };

  getAllPending = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { limit, skip } = req.query;
      const limitValue = limit ? Number(limit) : 20;
      const offsetValue = skip ? Number(skip) : 0;

      const users = await this.service.getAllPendingUsers(
        offsetValue,
        limitValue
      );
      return res.status(200).json({ status: "success", data: users });
    } catch (err: any) {
      next(err);
    }
  };

  getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { email } = req.params;
      if (!email) throw new BadRequestError(`No email address provided`);
      const user = await this.service.getOneUser({ email });
      return res.status(200).json({ status: "success", data: user });
    } catch (err: any) {
      next(err);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError(`No id provided`);

      if (!Types.ObjectId.isValid(id)) throw new BadRequestError(`Invalid id`);

      const user = await this.service.getUserById(id);

      return res.status(200).json({status: "success", data: user})
    } catch (err: any) {
      next(err);
    }
  };

  getAPendingUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { email } = req.params;
      if (!email) throw new BadRequestError(`No email address provided`);
      const user = await this.service.getPendingUser(email);
      return res.status(200).json({ status: "success", data: user });
    } catch (err: any) {
      next(err);
    }
  };
}

export default UserController;
