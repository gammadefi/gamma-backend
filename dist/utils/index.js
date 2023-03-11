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
exports.sendNativeCoin = exports.tokenSwap = exports.transferAsset = exports.createVerificationCode = exports.signJWT = exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const web3_1 = __importDefault(require("web3"));
const bignumber_1 = __importDefault(require("bignumber"));
const crypto_1 = __importDefault(require("crypto"));
const ABI_1 = require("./ABI");
const qs_1 = __importDefault(require("qs"));
const config_1 = require("../config");
const moment_1 = __importDefault(require("moment"));
const web3 = new web3_1.default("https://rpc-mumbai.matic.today");
const connectToDB = (DB) => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default
        .connect(DB)
        .then(() => console.log("Connected to DB successfully!"))
        .catch((err) => console.log(`An error occured while connecting to DB: ${err}`));
});
exports.connectToDB = connectToDB;
const signJWT = (data, secret, expiry) => {
    const token = jsonwebtoken_1.default.sign(data, secret, {
        expiresIn: expiry,
    });
    return token;
};
exports.signJWT = signJWT;
const createVerificationCode = (n, expiryTimeInMinutes) => {
    let code = "";
    const expiryTime = (0, moment_1.default)().add(expiryTimeInMinutes, 'minutes').toDate();
    for (let i = 0; i <= n; i++)
        code += crypto_1.default.randomInt(0, 9);
    return { verificationCode: code, expiryTimeInMinutes: expiryTime };
};
exports.createVerificationCode = createVerificationCode;
const contractAbi = [
    {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function",
    },
];
const transferAsset = () => __awaiter(void 0, void 0, void 0, function* () {
    web3.eth.accounts.wallet.add("84e4653e5b1147b57d6ff86a5d0d02f1b3efe629640e5d7c3502f32e63b7e35d");
    const privateKey = "84e4653e5b1147b57d6ff86a5d0d02f1b3efe629640e5d7c3502f32e63b7e35d";
    var tokenAddress = "0x0eba3661D65Ee65A695aF944875c900ea853411f";
    var fromAddress = "0x4Ea1A7A0f05C66Bf7eaa2140445419b1FF775586";
    let contract = new web3.eth.Contract(ABI_1.ABI, tokenAddress, { from: fromAddress });
    let amount = web3.utils.toHex(10e18);
    const nonce = yield web3.eth.getTransactionCount(fromAddress, "latest");
    let rawTransaction = {
        'from': fromAddress,
        'gasPrice': web3.utils.toHex(20 * 1e9),
        'gasLimit': web3.utils.toHex(210000),
        'to': tokenAddress,
        'value': 0x0,
        'data': contract.methods.transfer('0x0D63663dEF0c2AbDb87a42C56D442f7A4bf419A8', amount).encodeABI(),
        'nonce': nonce
    };
    const signedTx = yield web3.eth.accounts.signTransaction(rawTransaction, privateKey);
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
        if (!error) {
            console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
            return {
                code: "success",
                message: "transaction successfull"
            };
        }
        else {
            console.log("❗Something went wrong while submitting your transaction:", error);
            return {
                code: "failed",
                message: "❗Something went wrong while submitting your transaction"
            };
        }
    });
});
exports.transferAsset = transferAsset;
const tokenSwap = (privateKey, token, sellToken, buyToken, amount, myAddress) => __awaiter(void 0, void 0, void 0, function* () {
    web3.eth.accounts.wallet.add(privateKey);
    const params = {
        sellToken,
        buyToken,
        sellAmount: String(amount * (10 ** token.decimal)),
        takerAddress: myAddress,
    };
    const tokenName = new web3.eth.Contract(ABI_1.ABI, token.address);
    const currentAllowance = new bignumber_1.default(tokenName.methods.allowance(params.takerAddress, config_1.ZERO_EX_ADDRESS).call());
    if (currentAllowance.isLessThan(params.sellAmount)) {
        yield tokenName.methods
            .approve(config_1.ZERO_EX_ADDRESS, params.sellAmount)
            .send({ from: params.takerAddress });
    }
    const response = yield fetch(`https://api.0x.org/swap/v1/quote?${qs_1.default.stringify(params)}`);
    const res = yield web3.eth.sendTransaction(yield response.json());
    console.log(res);
});
exports.tokenSwap = tokenSwap;
const sendNativeCoin = ({ privateKey, toAddress, fromAddress, amount }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var balance = yield web3.eth.getBalance(fromAddress);
        console.log(web3.utils.toDecimal(balance));
    }
    catch (error) {
        console.log(error);
    }
    const nonce = yield web3.eth.getTransactionCount(fromAddress, "latest");
    console.log(nonce);
    const transaction = {
        to: "0x4Ea1A7A0f05C66Bf7eaa2140445419b1FF775586",
        value: web3.utils.toWei(amount.toString(), "ether"),
        gas: 30000,
        nonce: nonce,
    };
    const signedTx = yield web3.eth.accounts.signTransaction(transaction, privateKey);
    console.log(signedTx);
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
        if (!error) {
            return {
                status: "success",
                message: "transaction successfull",
                hash
            };
        }
        else {
            return {
                status: "failed",
                message: "❗Something went wrong while submitting your transaction"
            };
        }
    });
});
exports.sendNativeCoin = sendNativeCoin;
//# sourceMappingURL=index.js.map