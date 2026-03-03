import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import { Request, Response } from "express";
import cloudinary from "cloudinary";
import uploadRouter from "./routes/cloudinary.js";
dotenv.config();

// 🔥 Force Cloudflare DNS (fix for MongoDB SRV errors on Windows)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const PORT = process.env.PORT || 5002;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY } = process.env;
if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_SECRET_KEY) {
  throw new Error("Mising cloudinary env variable");
}

cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_SECRET_KEY,
});
app.get("/", (req: Request, res: Response) => {
  res.send("Utils API is working 🚀");
});

//! ALL ROUTERS
app.use("/api", uploadRouter);

app.listen(PORT, () => {
  console.log(`Utils Server is running on port ${PORT}`);
  // MONGODB Connection
});
