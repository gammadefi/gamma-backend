import { AuthService } from "../services";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IPRequest, ProtectedRequest } from "../types";
import { BadRequestError } from "src/exceptions";

class AuthController {
  service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  initReg = async (
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
  };

  register = async (
    req: IPRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    try {
      const {
        email,
        firstName,
        lastName,
        dob,
        title,
        gender,
        phone,
        password,
        verificationCode,
      } = req.body;
      const user = await this.service.signUp(
        email,
        firstName,
        lastName,
        dob,
        title,
        gender,
        phone,
        password,
        verificationCode,
        req.device
      );
      return res.status(201).json({ status: "success", data: user });
    } catch (err) {
      next(err);
    }
  };

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
  };

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
  };

  sendCode = async (
      req: ProtectedRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        let value: string;

        const channel = req.params.channel;

        if (channel === "phone") value = req.user.phone;
        else if (channel === "email") value = req.user.email;
        else throw new BadRequestError(`Invalid channel type passed in request parameters!`)

        await this.service.sendCode(channel as "phone" | "email", value);
        return res.status(200).json({ status: "success" });
      } catch (err: any) {
        next(err);
      }
  };

  updatePhoneOrMail = (channel: "phone" | "email"): RequestHandler => {
    return async (
      req: ProtectedRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        const { value } = req.body;
        await this.service.updatePhoneOrEmail(channel, value, req.user._id);
        return res.status(200).json({ status: "success" });
      } catch (err: any) {
        next(err);
      }
    };
  };

  verifyPhoneOrMail = (
    channel: "phone" | "email"
  ): RequestHandler => {
    return async (
      req: ProtectedRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        const {value, verificationCode} = req.body;
        const updatedUser = await this.service.verifyPhoneOrMail(channel, verificationCode, value);
        return res.status(200).json({status: "success", data: updatedUser});
      } catch (err: any) {
        next(err);
      }
    };
  };
}

export default AuthController;
