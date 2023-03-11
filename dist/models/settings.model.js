"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const settingsSchema = new mongoose_1.Schema({
    verificationCodeExpiry: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Setting", settingsSchema);
//# sourceMappingURL=settings.model.js.map