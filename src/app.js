import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import basicData from './routes/basicData.routes.js';
import routes from "./routes/routes.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));

dotenv.config();

app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", routes);
app.use('/api',  basicData);

export default app;
