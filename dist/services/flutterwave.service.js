"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVirtualCards = exports.createVirtualCard = exports.validateCharge = exports.chargeCard = void 0;
const config_1 = require("../config");
const flutterwave_node_v3_1 = __importDefault(require("flutterwave-node-v3"));
const axios_1 = __importDefault(require("axios"));
const client = new flutterwave_node_v3_1.default(config_1.FLUTTERWAVE_PUBLIC_KEY, config_1.FLUTTERWAVE_SECRET_KEY);
const chargeCard = (amount, cardNumber, cvv, expiryMonth, expiryYear, email, txRef, currency, fullname, pin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            amount,
            card_number: cardNumber,
            cvv,
            expiry_month: expiryMonth,
            expiry_year: expiryYear,
            email,
            tx_ref: txRef,
            currency,
            fullname,
            enckey: config_1.FLUTTERWAVE_ENCRYPTION_KEY,
        };
        const res = yield client.Charge.card(data);
        console.log("INITIAL RESPONSE DATA", res);
        if (res.status === "success" && res.meta.authorization.mode === "pin") {
            let secondData = data;
            secondData["authorization"] = {
                mode: "pin",
                fields: ["pin"],
                pin: pin,
            };
            const recall = yield client.Charge.card(secondData);
            console.log("PIN SENT", recall);
            return recall.data.flw_ref;
        }
        else {
            console.log(res);
            return res.message;
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.chargeCard = chargeCard;
const validateCharge = (trxRef, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const validate = yield client.Charge.validate({
        otp,
        flw_ref: trxRef,
    });
    console.log(validate);
    if (validate.status === "success") {
        return "success";
    }
    else {
        return validate.message;
    }
});
exports.validateCharge = validateCharge;
const createVirtualCard = ({ currency, amount, firstName, lastName, dob, email, phone, title, gender }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            currency,
            amount,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
            email,
            phone,
            title,
            gender,
        };
        const res = yield client.VirtualCard.create({
            currency,
            amount,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
            email,
            phone,
            title,
            gender,
        });
        console.log(res);
        return res;
    }
    catch (err) {
        console.log(err.response.data);
        throw err;
    }
});
exports.createVirtualCard = createVirtualCard;
const getAllVirtualCards = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cards = yield client.VirtualCard.fetch_all();
        console.log("CARDS FROM SDK", cards);
        const res = yield axios_1.default.get("https://api.flutterwave.com/v3/virtual-cards", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${config_1.FLUTTERWAVE_SECRET_KEY}`,
            },
        });
        console.log("CARDS FROM REST", res.data);
    }
    catch (err) {
        console.log(err.response.data);
        throw err;
    }
});
exports.getAllVirtualCards = getAllVirtualCards;
//# sourceMappingURL=flutterwave.service.js.map