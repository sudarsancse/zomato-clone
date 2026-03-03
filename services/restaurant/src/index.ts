import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import { Request, Response } from "express";
import { connectDb } from "./config/db.js";
dotenv.config();

// 🔥 Force Cloudflare DNS (fix for MongoDB SRV errors on Windows)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const PORT = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Restaurant API is working 🚀");
});

//! ALL ROUTERS

app.listen(PORT, () => {
  console.log(`Auth Server is running on port ${PORT}`);
  // MONGODB Connection
  connectDb();
});
