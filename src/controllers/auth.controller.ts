import { AuthService } from "../services";
import { Request, Response, NextFunction } from "express";
import { IPRequest } from "../types";

class AuthController {
  service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  initReg = async(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { email } = req.body;

      const verificationCode = await this.service.initializeSignUp(email);

      return res
        .status(200)
        .json({ status: "success", data: verificationCode });
    } catch (err) {
      next(err);
    }
  }

  register = async(
    req: IPRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { email, name, password, verificationCode } = req.body;

      const user = await this.service.signUp(
        email,
        name,
        password,
        verificationCode,
        req.device
      );
      return res.status(201).json({ status: "success", data: user });
    } catch (err) {
      next(err);
    }
  }

  login = async (
    req: IPRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { email, password } = req.body;

      const device = req.device;

      const { refreshToken, accessToken, user } = await this.service.login(
        email,
        password,
        device
      );

      return res
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          // maxAge:
        })
        .status(200)
        .json({
          status: "success",
          data: { refreshToken, accessToken, user },
        });
    } catch (err: any) {
      next(err);
    }
  }

  verifyDevice = async (
    req: IPRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const { email, verificationCode } = req.body;

      const { user, refreshToken, accessToken } =
        await this.service.verifyDevice(email, req.device, verificationCode);

      return res
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          // maxAge:
        })
        .status(200)
        .json({
          status: "success",
          data: { refreshToken, accessToken, user },
        });
    } catch (err: any) {
      next(err);
    }
  }
}

export default AuthController;
