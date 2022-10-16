import mongoose from "mongoose";

export const connectToDB = async (DB: string) => {
  mongoose
    .connect(DB)
    .then(() => console.log("Connected to DB successfully!"))
    .catch((err) =>
      console.log(`An error occured while connecting to DB: ${err}`)
    );
};


