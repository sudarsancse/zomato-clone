import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import dns from "node:dns/promises";
import { connectDb } from "./config/db.js";
import authRoute from "./Routes/auth.js";
import { Request, Response } from "express";
dotenv.config();

// 🔥 Force Cloudflare DNS (fix for MongoDB SRV errors on Windows)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("API is working 🚀");
});

//! ALL ROUTERS
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`Auth Server is running on port ${PORT}`);
  // MONGODB Connection
  connectDb();
});
