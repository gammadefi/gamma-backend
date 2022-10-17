import { IPRequest } from "../types";
import { Response, NextFunction, RequestHandler } from "express";
import { UnauthorizedError } from "../exceptions";
import isIp from "isip";

export default (): RequestHandler => {
  return (req: IPRequest, res: Response, next: NextFunction) => {
    try {
      const { deviceName, deviceIp } = req.headers;

      if (!deviceName || !deviceIp)
        throw new UnauthorizedError(
          `Device details not passed in request headers!`
        );

      if (!isIp(deviceIp as string))
        throw new UnauthorizedError(`Invalid Ip address`);

      req.device = { name: deviceName as string, ip: deviceIp as string, verified: false };

      next();
    } catch (err) {
      next(err);
    }
  };
};
