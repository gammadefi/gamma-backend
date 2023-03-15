import {
  initRegSchema,
  loginSchema,
  registerSchema,
  verifyDeviceSchema,
  updateEmailorPhoneSchema,
  verifyPhoneOrMailSchema,
  registerAdminSchema
} from "./authSchemas";

import {
  createSettingsSchema,
  updateSettingsSchema
} from './settingsSchemas'

import { transferSchema } from "./wallerSchemas";

export { initRegSchema, loginSchema, registerSchema, verifyDeviceSchema, updateEmailorPhoneSchema, verifyPhoneOrMailSchema, createSettingsSchema, updateSettingsSchema, registerAdminSchema, transferSchema };
