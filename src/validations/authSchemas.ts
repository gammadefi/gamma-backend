import Joi from "joi";

export const initRegSchema = Joi.object({
  email: Joi.string().required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().required(),
  name: Joi.string().required(),
  password: Joi.string().required(),
  verificationCode: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const verifyDeviceSchema = Joi.object({
  email: Joi.string().required(),
  verificationCode: Joi.string().required(),
});
