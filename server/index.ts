import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { AuthRoutes } from "./app/routes/AuthRoutes";
import { ProductRoutes } from "./app/routes/ProductRoutes";
import { createServer } from "http";
import { initSocketIO } from "./app/socket/socketConn";

dotenv.config();

const app = express();
const httpServer = createServer(app);
export const io = initSocketIO(httpServer);

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Referral System Server is running...");
});

app.use("/auth", AuthRoutes);
app.use("/products", ProductRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
