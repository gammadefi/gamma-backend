import { connectToDB } from "./utils"
import { DB } from "./config"
import express from 'express';

const startServer = async () => {
    const app = express();
    await connectToDB(DB);
}