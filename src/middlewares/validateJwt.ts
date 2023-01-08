import { ProtectedRequest, TokenData } from "../types";
import { Response, NextFunction, RequestHandler } from "express";
import { UnauthorizedError } from "../exceptions";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import { UserRepo } from "../repositories";

const userRepo = new UserRepo();

export default function (): RequestHandler {
  return async (req: ProtectedRequest, res: Response, next: NextFunction) => {
    try {
      const { authorization } = req.headers;

      if (!authorization)
        throw new UnauthorizedError(`No authorization headers passed`);

      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (!bearer || !token)
        throw new UnauthorizedError(
          `Token not passed in authorization headers`
        );

      if (bearer !== "Bearer")
        throw new UnauthorizedError(
          `Bearer not passed in authorization headers`
        );

      const decoded: any = jwt.verify(token, String(ACCESS_TOKEN_SECRET));

      const user = await userRepo.getById(decoded.id);

      if (!user) throw new UnauthorizedError("User recently deleted!");

      req.user = user;

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
