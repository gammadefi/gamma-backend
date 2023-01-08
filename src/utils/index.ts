import mongoose from "mongoose";
import { TokenData } from "../types";
import jwt from "jsonwebtoken";
import Web3 from "web3";
import BigNumber from "bignumber";
import TX from "ethereumjs-tx";
import crypto from "crypto";
import {ABI} from './ABI'
import qs from "qs";
import {ZERO_EX_ADDRESS} from '../config'
import moment from 'moment';

const web3 = new Web3("https://mainnet.infura.io/v3/your-project-id");

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

export const createVerificationCode = (n: number, expiryTimeInMinutes: number): {verificationCode: string, expiryTimeInMinutes: Date} => {
  let code = "";
  const expiryTime = moment().add(expiryTimeInMinutes, 'minutes').toDate()
  

  for (let i = 0; i <= n; i++) code += crypto.randomInt(0, 9);

  return {verificationCode: code, expiryTimeInMinutes: expiryTime};
};

const contractAbi: any = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
];

export const transferAsset = async (data: object) => {
  web3.eth.accounts.wallet.add("privateKey of fromwallet");

  var tokenAddress = ""; //Tether token(USDT)
  var fromAddress = "0x3df...";
  var tokenInst = new web3.eth.Contract(contractAbi, tokenAddress);
  tokenInst.methods
    .transfer("receiver address", " amounts")
    .send({ from: fromAddress, gas: 100000 }, function (error, result) {
      //get callback from function which is your transaction key
      if (!error) {
        console.log(result);
        //// handleSuccessTrue();
      } else {
        console.log(error);
        web3.eth.getBalance(fromAddress, (err, bal) => {
          alert(
            "Your account has " +
              web3.utils.fromWei(bal, "ether") +
              ", Insufficient funds for gas * price + value on your wallet"
          );
        });
        // handleSuccessFalse();
      }
    });
  //Finally, you can check if usdt tranaction success through this code.
  tokenInst.methods
    .balanceOf("receiver addrerss")
    .call()
    .then(console.log)
    .catch(console.error);
};

export const tokenSwap = async (
  privateKey: string,
  token: {address: string, decimal: number},
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
    sellAmount: String(amount * (10 ** token.decimal)),
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

export const sendNativeCoin = async () => {
  const nonce = await web3.eth.getTransactionCount("userAdress", "latest"); // nonce starts counting from 0

  const transaction = {
    to: "0x31B98D14007bDEe637298086988A0bBd31184523", // faucet address to return eth
    value: web3.utils.toWei('0.0001', "ether"),
    gas: 30000,
    maxFeePerGas: 1000000108,
    nonce: nonce,
    // optional data field to send message or execute smart contract
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    transaction,
    "PRIVATE_KEY"
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
      } else {
        console.log(
          "❗Something went wrong while submitting your transaction:",
          error
        );
      }
    }
  );
};
