import { NextFunction, RequestHandler, Response } from "express";
import { UnauthorizedError } from "../exceptions";
import { ProtectedRequest } from "../types";

export default (resource: "admin" | "user"): RequestHandler => {
  return (req: ProtectedRequest, res: Response, next: NextFunction) => {
    // console.log(req);
    if (resource === "admin" && !req.admin) {
      throw new UnauthorizedError(
        "Not signed in, please sign in as an admin to continue!"
      );
    } else if (resource === "user" && !req.user) {
      throw new UnauthorizedError(
        "Not signed in, please sign in as user to continue!"
      );
    }
    next();
  };
};
