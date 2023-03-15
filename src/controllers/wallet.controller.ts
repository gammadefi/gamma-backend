import { NextFunction, Request, Response } from "express";
import { UserService } from "../services";
import { transferAsset, sendNativeCoin } from "../utils";
transferAsset;

class WalletController {
  service: UserService;

  constructor() {
    this.service = new UserService();
  }

  sendAssets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user: any = req.user;
    const { amount, to, tokenAddress } = req.body;
    if (tokenAddress === "0x0000000000000000000000000000000000001010") {
      try {
        //  const user = await this.service.getUserById(req.)

        console.log(user.wallet[0]);
        

        const data = {
          privateKey: user.wallet[0].key,
          toAddress: to,
          fromAddress: user.wallet[0].address,
          amount,
        };

        const transfer = await sendNativeCoin(data);

        // console.log(transfer);
        

        return res.status(200).json({ status: "success", data: transfer });
      } catch (error) {
        next(error);
      }
    } else {
        const data = {
            privateKey: user.wallet[0].key,
            toAddress: to,
            fromAddress: user.wallet[0].address,
            amount,
            tokenAddress
          };

      try {
        const transfer = await transferAsset(data)
        // console.log(transfer);
        

        return res.status(200).json({status:"success", data: transfer})
      } catch (error) {
        // console.log(error);
        
        next({message:error.message.replace("Returned error:","").replace("INTERNAL_ERROR:","")});
      }
    }
  };
}

export default WalletController;
