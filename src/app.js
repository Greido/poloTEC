import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

dotenv.config();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api", authRoutes);

export default app;
