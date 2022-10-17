import { connectToDB } from "./utils"
import { DB, PORT } from "./config";
import express from "express";
import createExpressApp from "./app";
import http from "http";

const startServer = async () => {
  const app = express();

  await connectToDB(DB);

  await createExpressApp(app);

  const server = http.createServer(app);

  server
    .listen(PORT, () =>
      console.log(`Starting Gamma Backend on port ${PORT}...`)
    )
    .on("listening", () => console.log(`Gamma Backend Running.`))
    .on("error", (err) => {
      console.log(
        `An error occured on Gamma Backend, ${err}\nShutting down app..`
      );
      process.exit();
    });
};

startServer();