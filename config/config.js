import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const PHONE_NUMBER = process.env.PHONE_NUMBER;



export { PORT, VERIFY_TOKEN, WHATSAPP_TOKEN, SECRET_TOKEN, PHONE_NUMBER };
