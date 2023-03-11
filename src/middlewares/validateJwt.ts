import { ProtectedRequest, TokenData } from "../types";
import { Response, NextFunction, RequestHandler } from "express";
import { UnauthorizedError } from "../exceptions";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../config";
import { UserRepo, AdminRepo } from "../repositories";
import moment from "moment";

const userRepo = new UserRepo();
const adminRepo = new AdminRepo();

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

      let resource;

      if (decoded.resourceType === "user") {
        resource = await userRepo.getById(decoded.id);
        req.user = resource;
      } else if (decoded.resourceType === "admin") {
        resource = await adminRepo.getById(decoded.id);
        req.admin = resource
      }

      if (!resource) throw new UnauthorizedError(`Resource recently deleted!`);

      if (
        resource.lastSensitiveInfoUpdateTime &&
        moment(decoded.iat).isBefore(resource.lastSensitiveInfoUpdateTime)
      )
        throw new UnauthorizedError(
          `Sensitive information changed recently, please log in again!`
        );

      // console.log("RESOURCE", resource)

      next();
    } catch (err: any) {
      next(err);
    }
  };
}
