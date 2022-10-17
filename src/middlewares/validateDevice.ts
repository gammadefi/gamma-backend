import { IPRequest } from "../types";
import { Response, NextFunction, RequestHandler } from "express";
import { UnauthorizedError } from "../exceptions";
import isIp from "isip";

export default (): RequestHandler => {
  return (req: IPRequest, res: Response, next: NextFunction) => {
    try {
      const { devicename, deviceip } = req.headers;

      if (!devicename || !deviceip)
        throw new UnauthorizedError(
          `Device details not passed in request headers!`
        );

      if (!isIp(deviceip as string))
        throw new UnauthorizedError(`Invalid Ip address`);

      req.device = {
        name: devicename as string,
        ip: deviceip as string,
        verified: false,
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};
