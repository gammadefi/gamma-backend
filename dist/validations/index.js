"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdminSchema = exports.updateSettingsSchema = exports.createSettingsSchema = exports.verifyPhoneOrMailSchema = exports.updateEmailorPhoneSchema = exports.verifyDeviceSchema = exports.registerSchema = exports.loginSchema = exports.initRegSchema = void 0;
const authSchemas_1 = require("./authSchemas");
Object.defineProperty(exports, "initRegSchema", { enumerable: true, get: function () { return authSchemas_1.initRegSchema; } });
Object.defineProperty(exports, "loginSchema", { enumerable: true, get: function () { return authSchemas_1.loginSchema; } });
Object.defineProperty(exports, "registerSchema", { enumerable: true, get: function () { return authSchemas_1.registerSchema; } });
Object.defineProperty(exports, "verifyDeviceSchema", { enumerable: true, get: function () { return authSchemas_1.verifyDeviceSchema; } });
Object.defineProperty(exports, "updateEmailorPhoneSchema", { enumerable: true, get: function () { return authSchemas_1.updateEmailorPhoneSchema; } });
Object.defineProperty(exports, "verifyPhoneOrMailSchema", { enumerable: true, get: function () { return authSchemas_1.verifyPhoneOrMailSchema; } });
Object.defineProperty(exports, "registerAdminSchema", { enumerable: true, get: function () { return authSchemas_1.registerAdminSchema; } });
const settingsSchemas_1 = require("./settingsSchemas");
Object.defineProperty(exports, "createSettingsSchema", { enumerable: true, get: function () { return settingsSchemas_1.createSettingsSchema; } });
Object.defineProperty(exports, "updateSettingsSchema", { enumerable: true, get: function () { return settingsSchemas_1.updateSettingsSchema; } });
//# sourceMappingURL=index.js.map