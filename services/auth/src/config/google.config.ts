import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRT = process.env.GOOGLE_CLIENT_SECRT;

export const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  "authMessage",
);
