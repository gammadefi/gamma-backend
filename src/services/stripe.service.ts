import * as stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../config";

const client = new stripe.Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

export const createHolder = async (
  name: string,
  email: string,
  phoneNumber: string,
  status: "active" | "inactive"
) => {
  const cardHolder = await client.issuing.cardholders.create({
    name,
    email,
    phone_number: phoneNumber,
    status,
    type: "individual",
    billing: {
      address: {
        line1: "854 Avocado Ave.",
        city: "Newport Beach",
        state: "CA",
        postal_code: "99901",
        country: "US",
      },
    },
  });

  console.log(cardHolder);
};

createHolder(
  "Mark Smith",
  "mark.smith@example.co.uk",
  "(+44) (0)1234 567890",
  "active"
);
