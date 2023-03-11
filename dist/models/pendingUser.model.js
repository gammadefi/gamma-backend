"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const pendingUserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationExpiry: Date
});
const PendingUser = (0, mongoose_1.model)("Pending User", pendingUserSchema);
exports.default = PendingUser;
//# sourceMappingURL=pendingUser.model.js.map