import mongoose from "mongoose";
import { TokenData } from "../types";
import jwt from 'jsonwebtoken'
import Web3 from "web3";
import BigNumber from "bignumber"
import TX from 'ethereumjs-tx'
import crypto from 'crypto'
import qs from 'qs'

export const connectToDB = async (DB: string) => {
  mongoose
    .connect(DB)
    .then(() => console.log("Connected to DB successfully!"))
    .catch((err) =>
      console.log(`An error occured while connecting to DB: ${err}`)
    );
};

export const signJWT = (data: TokenData, secret: string, expiry: string): string => {
  const token = jwt.sign(data, secret, {
    expiresIn: expiry
  })
  return token;
}

export const createVerificationCode = (n: number): string => {
  let code = ''

  for (let i = 0; i <= n; i++) code += crypto.randomInt(0, 9);

  return code
}


const contractAbi:any = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  }
];


export const transferAsset = async(data:object) => {
  const web3 = new Web3('https://mainnet.infura.io/v3/your-project-id')
  web3.eth.accounts.wallet.add('privateKey of fromwallet');
  
  var tokenAddress = ''//Tether token(USDT)
  var fromAddress = '0x3df...'
  var tokenInst = new web3.eth.Contract(contractAbi,tokenAddress);
  tokenInst.methods.transfer("receiver address"," amounts").send({from: fromAddress, gas: 100000},function (error, result){ //get callback from function which is your transaction key
      if(!error){
          console.log(result);
         //// handleSuccessTrue();
      } else{
          console.log(error);
          web3.eth.getBalance(fromAddress, (err,bal) => { alert('Your account has ' + web3.utils.fromWei(bal, 'ether') + ', Insufficient funds for gas * price + value on your wallet')});
         // handleSuccessFalse();
      }
  });
  //Finally, you can check if usdt tranaction success through this code.
  tokenInst.methods.balanceOf("receiver addrerss").call().then(console.log)
  .catch(console.error);

}

export const tokenSwap = async () => {
  const web3 = new Web3('https://mainnet.infura.io/v3/your-project-id')
  web3.eth.accounts.wallet.add('privateKey of fromwallet');
  const ZERO_EX_ADDRESS = '0xdef1c0ded9bec7f1a1670819833240f027b25eff';
  const DAI_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  
  // Selling 100 DAI for ETH.
  const params = {
      sellToken: 'DAI',
      buyToken: 'ETH',
      // Note that the DAI token uses 18 decimal places, so `sellAmount` is `100 * 10^18`.    
      sellAmount: '100000000000000000000',
      takerAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
  }
  
  // Set up a DAI allowance on the 0x contract if needed.
  const dai = new web3.eth.Contract(contractAbi, DAI_ADDRESS);
  const currentAllowance = new BigNumber(
      dai.methods.allowance(params.takerAddress, ZERO_EX_ADDRESS).call()
  );
  if (currentAllowance.isLessThan(params.sellAmount)) {
      await dai.methods
          .approve(ZERO_EX_ADDRESS, params.sellAmount)
          .send({ from: params.takerAddress });
  }
  
  // Fetch the swap quote.
  const response = await fetch(
      `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`
  );
  
  // Perform the swap.
  await web3.eth.sendTransaction(await response.json());
}