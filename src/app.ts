import express, { Application, Request, Response } from "express"
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes";
import { errHandler } from "./exceptions";


export default async (app: Application) => {
  // Log to console using morgan if app is in development
  if (process.env.ENV === "dev") app.use(morgan("development"));

  // CORS
  app.use(cors());
  app.use(helmet());

  // Request body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  // Cookie parser
  app.use(cookieParser());
  app.use(compression());

  // Application Routes
  app.use("/auth", authRouter);

  // Catch and handle all 404 errors
  app.all("*", function (req: Request, res: Response): Response {
    return res.sendStatus(404);
  });

  app.use(errHandler);
}


