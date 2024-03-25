import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";

const app = express();

dotenv.config();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api", authRoutes);

export default app;
