"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHolder = void 0;
const stripe = __importStar(require("stripe"));
const config_1 = require("../config");
const client = new stripe.Stripe(config_1.STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
});
const createHolder = (name, email, phoneNumber, status) => __awaiter(void 0, void 0, void 0, function* () {
    const cardHolder = yield client.issuing.cardholders.create({
        name,
        email,
        phone_number: phoneNumber,
        status,
        type: "individual",
        billing: {
            address: {
                line1: "854 Avocado Ave.",
                city: "Newport Beach",
                state: "CA",
                postal_code: "99901",
                country: "US",
            },
        },
    });
    console.log(cardHolder);
});
exports.createHolder = createHolder;
(0, exports.createHolder)("Mark Smith", "mark.smith@example.co.uk", "(+44) (0)1234 567890", "active");
//# sourceMappingURL=stripe.service.js.map