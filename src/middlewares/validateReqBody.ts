import joi, { Schema, ValidationOptions } from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";

export default (schema: Schema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationOptions: ValidationOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
      };

      const validated = await schema.validateAsync(req.body, validationOptions);

      req.body = validated;

      next();
    } catch (err: any) {
      next(err);
    }
  };
};
