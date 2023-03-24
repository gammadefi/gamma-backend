import nodemailer from "nodemailer"
import { EMAIL_ADDRESS, EMAIL_PASSWORD } from "../config";

export const sendEmail = async (email : string, body : any, subject: string ) => {
    let transporter = nodemailer.createTransport({
        host: "mail.privateemail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: EMAIL_ADDRESS, // generated ethereal user
          pass: EMAIL_PASSWORD, // generated ethereal password
        },
      });

    //   console.log(EMAIL_ADDRESS, EMAIL_PASSWORD);
      

      const info = await transporter.sendMail({
        from: '<no-reply@gammapay.finance>', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line // plain text body
        html: body, // html body
      });

    //   console.log(info);
      

      return info

}