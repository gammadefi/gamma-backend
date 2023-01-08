import {
  FLUTTERWAVE_ENCRYPTION_KEY,
  FLUTTERWAVE_SECRET_KEY,
  FLUTTERWAVE_PUBLIC_KEY,
} from "../config";

import flutterSDK from "flutterwave-node-v3";
import axios from "axios";

const client = new flutterSDK(FLUTTERWAVE_PUBLIC_KEY, FLUTTERWAVE_SECRET_KEY);

export const chargeCard = async (
  amount: number,
  cardNumber: string,
  cvv: string,
  expiryMonth: string,
  expiryYear: string,
  email: string,
  txRef: string,
  currency: string,
  fullname: string,
  pin: number
) => {
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
      enckey: FLUTTERWAVE_ENCRYPTION_KEY,
    };

    const res = await client.Charge.card(data, FLUTTERWAVE_ENCRYPTION_KEY);

    console.log("INITIAL RESPONSE DATA", res);

    if (res.status === "success" && res.meta.authorization.mode === "pin") {
      let secondData = data;
      secondData["authorization"] = {
        mode: "pin",
        fields: ["pin"],
        pin: pin,
      };
      const recall = await client.Charge.card(secondData);

      console.log("PIN SENT", recall);

      return recall.data.flw_ref;
    } else {
      console.log(res);
      return res.message;
    }
  } catch (err: any) {
    console.log(err);
    throw err;
  }
};

export const validateCharge = async (trxRef: string, otp: string) => {
    const validate = await client.Charge.validate({
       otp,
       flw_ref: trxRef,
    });

    console.log(validate);

    if (validate.status === "success") {
        return "success"
    } else {
        return validate.message
    }
}

export const createVirtualCard = async (
  currency: string,
  amount: number,
  firstName: string,
  lastName: string,
  dob: string,
  email: string,
  phone: string,
  title: string,
  gender: string
) => {
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
    const res = await client.VirtualCard.create({
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

    // const res = await axios.post("https://api.flutterwave.com/v3/virtual-cards", data, {
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer ${FLUTTERWAVE_SECRET_KEY}`
    //     }
    // })

    // console.log(res.data)
  } catch (err: any) {
    console.log(err.response.data);
    throw err;
  }
};

export const getAllVirtualCards = async () => {
  try {
    const cards = await client.VirtualCard.fetch_all();
    console.log("CARDS FROM SDK", cards);
    const res = await axios.get(
      "https://api.flutterwave.com/v3/virtual-cards",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );
    console.log("CARDS FROM REST", res.data);
  } catch (err: any) {
    console.log(err.response.data);
    throw err;
  }
};

// getAllVirtualCards();
createVirtualCard("USD", 10, "Panam", "Hebron", "2002/05/03", "panampraisehebron@gmail.com", "08056834458", "MR", "M");
// chargeCard(
//   100,
//   "5258585922666506",
//   "883",
//   "09",
//   "31",
//   "panampraisehebron@gmail.com",
//   "MC-3243g",
//   "USD",
//   "HEBRON PANAM PRAISE",
//   3310
// ).then((res)=>console.log("RESPONSE", res));
// validateCharge("FLW-MOCK-a3f077ccd26e5970929feea5975441df", "12345");
