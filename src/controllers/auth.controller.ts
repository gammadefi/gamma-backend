import { AuthService } from "../services";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { IPRequest, ProtectedRequest } from "../types";
import { BadRequestError } from "../exceptions";

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
        .json({ status: "success", messsage:"verifation code sent" });
      } catch (err) {
        next(err);
      }
    };
    
  registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const data = await this.service.signupAdmin(req.body.email, req.body.password);
      return res.status(200).json({status: "success", data})
    } catch(err: any) {
      next(err);
    }
  }


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
        // phone,
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
        // phone,
        password,
        verificationCode,
        req.device
      );
      return res.status(201).json({ status: "success", data: user });
    } catch (err) {
      next(err);
    }
  };

  login = (resourceType: "admin" | "user"): RequestHandler => {
    return async (
      req: IPRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        const { email, password } = req.body;

        const device = req.device;

        const data = await this.service.login(
          email,
          password,
          device,
          resourceType
        );

        return res
          .cookie("jwt", data.refreshToken, {
            httpOnly: true,
            // maxAge:
          })
          .status(200)
          .json({
            status: "success",
            data,
          });
      } catch (err: any) {
        next(err);
      }
    };
  };

  verifyDevice = (resourceType: "admin" | "user"): RequestHandler => {
    return async (
      req: IPRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        const { email, verificationCode } = req.body;

        const data = await this.service.verifyDevice(
          email,
          req.device,
          verificationCode,
          resourceType
        );

        return res
          .cookie("jwt", data.refreshToken, {
            httpOnly: true,
            // maxAge:
          })
          .status(200)
          .json({
            status: "success",
            data,
          });
      } catch (err: any) {
        next(err);
      }
    };
  };

  sendCode = (resourceType: "admin" | "user"): RequestHandler => {
    return async (
      req: ProtectedRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        let value: string;
        
        const resource = resourceType === "user" ? req.user: req.admin;

        const channel = req.params.channel;

        if (channel === "phone") value = (resource as any).phone;
        else if (channel === "email") value = (resource as any).email;
        else
          throw new BadRequestError(
            `Invalid channel type passed in request parameters!`
          );

        await this.service.sendCode(
          channel as "phone" | "email",
          value,
          resourceType
        );
        return res.status(200).json({ status: "success" });
      } catch (err: any) {
        next(err);
      }
    };
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

  verifyPhoneOrMail = (channel: "phone" | "email"): RequestHandler => {
    return async (
      req: ProtectedRequest,
      res: Response,
      next: NextFunction
    ): Promise<Response> => {
      try {
        const { value, verificationCode } = req.body;
        const updatedUser = await this.service.verifyPhoneOrMail(
          channel,
          verificationCode,
          value
        );
        return res.status(200).json({ status: "success", data: updatedUser });
      } catch (err: any) {
        next(err);
      }
    };
  };

}

export default AuthController;
