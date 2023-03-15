import Joi from "joi";

export const transferSchema = Joi.object({
    amount : Joi.string().required(), 
    to : Joi.string().required(), 
    tokenAddress :Joi.string().required(),
  });