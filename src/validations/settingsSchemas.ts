import Joi from "joi";

export const createSettingsSchema = Joi.object({
  verificationCodeExpiry: Joi.number().required(),
});

export const updateSettingsSchema = Joi.object({
  verificationCodeExpiry: Joi.number(),
});
