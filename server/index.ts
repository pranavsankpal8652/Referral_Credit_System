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

// Middleware order matters:
// 1. Parse JSON bodies
app.use(express.json());

// 2. Parse cookies for all routes
app.use(cookieParser());

// 3. Enable CORS with explicit origins and credentials true
app.use(
  cors({
    origin: [
      "http://localhost:3000", // your local frontend origin
      "https://referral-credit-system-ten.vercel.app", // deployed frontend origin
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Referral System Server is running...");
});

app.use("/auth", AuthRoutes);
app.use("/products", ProductRoutes);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    httpServer.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
