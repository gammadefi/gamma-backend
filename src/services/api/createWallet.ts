import axios from "axios";

export const createWallet = async () => axios.get("https://bitcore-api.vercel.app/api")