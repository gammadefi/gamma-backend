"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    chainId: {
        type: Number,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    logoURI: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    decimals: {
        type: Number,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    environment: {
        type: String,
        required: true,
        enum: ["test", "live"],
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Token", tokenSchema);
//# sourceMappingURL=token.model.js.map