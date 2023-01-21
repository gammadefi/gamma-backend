import { NextFunction, Request, Response } from "express"
import { APP_WALLET_ADDRESS } from "../config";
import { PromiseITF } from "../interfaces/wallet.interface";
import { UserService } from "../services";
import { createVirtualCard } from "src/services/flutterwave.service"
import { sendNativeCoin } from "../utils";
import { creatVCardITf } from "src/interfaces/card.interface";

class cardController {

    service:UserService;
    constructor() {
       this.service =  new UserService
    }

    createVCard = async (
        req: Request, 
        res: Response,
        next:NextFunction) : Promise<Response> => {
 

            

            const user: any = req.user;
            const {amount} = req.body
    
            try {
              //  const user = await this.service.getUserById(_id)

                const body : creatVCardITf = {
                    currency : "USD",
                    amount,
                    firstName:user.firstName,
                    lastName: user.lastName,
                    dob: user.dob,
                    email: user.email,
                    title: user.title,
                    gender: user.gender,
                    phone: user.phone
                }

                const createV = await createVirtualCard(body)
                
        
                const data = {
                    privateKey: user.wallet[0].key,
                    toAddress: APP_WALLET_ADDRESS,
                    fromAddress:user.wallet[0].address,
                    amount
                }
        
                const transfer:any  = await sendNativeCoin(data)

                return res.status(200).json({status: "success", message:"card created successfully" })

            }
            catch (error) {
                next(error)         
            }
    }


    fundVCard = async (
        req: Request, 
        res: Response,
        next:NextFunction) : Promise<Response> => {

            try {


                return res.status(200).json({status: "success", message:"card created successfully" })
            } catch (error) {
                next(error)
            }

    }

    getAllVcard =async (
        req:Request, 
        res:Response, 
        next: NextFunction) : Promise<Response> => {
            try {
                return res.status(200).json({status: "success", message:"fetched successfully" })
                
                
            } catch (error) {
                next(error)
            }
        
    }

    

    }

    


export default cardController