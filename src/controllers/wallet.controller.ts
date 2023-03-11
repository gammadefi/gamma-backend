import { NextFunction, Request, Response } from "express";
import { UserService } from "../services"
import { transferAsset, sendNativeCoin } from "../utils";
transferAsset


class walletCOntroller {

    service:UserService;
    
    constructor() {
        this.service = new UserService()
    }

    sendMatic =async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response> => {

        const user : any = req.user;
        const {amount,to} = req.body

        try {
         //  const user = await this.service.getUserById(_id)

           const data = {
            privateKey: user.wallet[0].key,
            toAddress: to,
            fromAddress:user.wallet[0].address,
            amount
           }

           const transfer = await sendNativeCoin(data)

           return res.status(200).json({status: "success", data:transfer })


        } catch (error) {
            next(error)
        }
        
    } 
}

export default walletCOntroller

