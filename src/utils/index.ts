import mongoose from "mongoose";
import { TokenData } from "../types";
import jwt from "jsonwebtoken";
import Web3 from "web3";
import BigNumber from "bignumber";
import TX from "ethereumjs-tx";
import crypto from "crypto";
import { ABI } from "./ABI";
import qs from "qs";
import { ZERO_EX_ADDRESS } from "../config";
import moment from "moment";
import { TransferNativeITF } from "../interfaces/wallet.interface";

const web3 = new Web3("https://rpc-mumbai.matic.today");

export const connectToDB = async (DB: string) => {
  mongoose
    .connect(DB)
    .then(() => console.log("Connected to DB successfully!"))
    .catch((err) =>
      console.log(`An error occured while connecting to DB: ${err}`)
    );
};

export const signJWT = (
  data: TokenData,
  secret: string,
  expiry: string
): string => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiry,
  });
  return token;
};

export const createVerificationCode = (
  n: number,
  expiryTimeInMinutes: number
): { verificationCode: string; expiryTimeInMinutes: Date } => {
  let code = "";
  const expiryTime = moment().add(expiryTimeInMinutes, "minutes").toDate();

  for (let i = 0; i <= n; i++) code += crypto.randomInt(0, 9);

  return { verificationCode: code, expiryTimeInMinutes: expiryTime };
};


export const transferAsset = async ({
  privateKey,
  toAddress,
  fromAddress,
  amount,
  tokenAddress
}) => {
  // const privateKey =
  //   "84e4653e5b1147b57d6ff86a5d0d02f1b3efe629640e5d7c3502f32e63b7e35d";
  web3.eth.accounts.wallet.add(
    privateKey
  );
  
  // var tokenAddress = "0x0eba3661D65Ee65A695aF944875c900ea853411f"; //Tether token(USDT)
  // var fromAddress = "0x4Ea1A7A0f05C66Bf7eaa2140445419b1FF775586";

  let contract = new web3.eth.Contract(ABI, tokenAddress, {
    from: fromAddress,
  });
  let amountHex = web3.utils.toHex(amount * 1e18);

  const nonce = await web3.eth.getTransactionCount(fromAddress, "latest");

  let rawTransaction = {
    from: fromAddress,
    gasPrice: web3.utils.toHex(20 * 1e9),
    gasLimit: web3.utils.toHex(210000),
    to: tokenAddress,
    value: 0x0,
    data: contract.methods
      .transfer(toAddress, amountHex)
      .encodeABI(),
    nonce: nonce,
  };
  const signedTx = await web3.eth.accounts.signTransaction(
    rawTransaction,
    privateKey
  );

  web3.eth.sendSignedTransaction(
    signedTx.rawTransaction,
    function (error, hash) {
      if (!error) {
        console.log(
          "🎉 The hash of your transaction is: ",
          hash,
          "\n Check Alchemy's Mempool to view the status of your transaction!"
        );
        return {
          code: "success",
          message: "transaction successfull",
        };
      } else {
        console.log(
          "❗Something went wrong while submitting your transaction:",
          error
        );

        return {
          code: "failed",
          message: "❗Something went wrong while submitting your transaction",
        };
      }
    }
  );
};

export const tokenSwap = async (
  privateKey: string,
  token: { address: string; decimal: number },
  sellToken: string,
  buyToken: string,
  amount: number,
  myAddress: string
) => {
  web3.eth.accounts.wallet.add(privateKey);
  // const DAI_ADDRESS = tokenAddress;

  // Selling 100 DAI for ETH.
  const params = {
    sellToken,
    buyToken,
    // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.
    sellAmount: String(amount * 10 ** token.decimal),
    takerAddress: myAddress,
  };

  // Set up a DAI allowance on the 0x contract if needed.
  const tokenName = new web3.eth.Contract(ABI, token.address);
  const currentAllowance = new BigNumber(
    tokenName.methods.allowance(params.takerAddress, ZERO_EX_ADDRESS).call()
  );
  if (currentAllowance.isLessThan(params.sellAmount)) {
    await tokenName.methods
      .approve(ZERO_EX_ADDRESS, params.sellAmount)
      .send({ from: params.takerAddress });
  }

  // Fetch the swap quote.
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );

  // Perform the swap.
  const res = await web3.eth.sendTransaction(await response.json());
  console.log(res);
};

export const sendNativeCoin = async ({
  privateKey,
  toAddress,
  fromAddress,
  amount,
}: TransferNativeITF) => {
  try {
    var balance = await web3.eth.getBalance(fromAddress); //Will give value in.
    console.log(web3.utils.toDecimal(balance));
  } catch (error) {
    console.log(error);
  }

  const nonce = await web3.eth.getTransactionCount(fromAddress, "latest"); // nonce starts counting from 0

  // console.log(nonce);

  const transaction = {
    to: "0x4Ea1A7A0f05C66Bf7eaa2140445419b1FF775586", // faucet address to return eth
    value: web3.utils.toWei(amount.toString(), "ether"),
    gas: 30000,
    nonce: nonce,
    // optional data field to send message or execute smart contract
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    transaction,
    privateKey
  );

  console.log(signedTx);

  web3.eth.sendSignedTransaction(
    signedTx.rawTransaction,
    function (error, hash) {
      if (!error) {
        // console.log(
        //   "🎉 The hash of your transaction is: ",
        //   hash,
        //   "\n Check Alchemy's Mempool to view the status of your transaction!"
        // );
        return {
          status: "success",
          message: "transaction successfull",
          hash,
        };
      } else {
        // console.log(
        //   "❗Something went wrong while submitting your transaction:",
        //   error
        // );

        return {
          status: "failed",
          message: "❗Something went wrong while submitting your transaction",
        };
      }
    }
  );
};
