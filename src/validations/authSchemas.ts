import Joi from "joi";

export const initRegSchema = Joi.object({
  email: Joi.string().required(),
});

export const registerAdminSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required().min(8)
})

export const registerSchema = Joi.object({
  email: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dob: Joi.date().required(),
  title: Joi.string().required(),
  gender: Joi.string().valid("M", "F").required(),
  // phone: Joi.string().required(),
  password: Joi.string().required().min(8),
  verificationCode: Joi.string().disallow("").required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const verifyDeviceSchema = Joi.object({
  email: Joi.string().required(),
  verificationCode: Joi.string().disallow("").required(),
});

export const updateEmailorPhoneSchema = Joi.object({
  value: Joi.string().required()
});

export const verifyPhoneOrMailSchema = Joi.object({
  value: Joi.string().required(),
  verificationCode: Joi.string().disallow("").required(),
});