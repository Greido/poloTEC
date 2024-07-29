import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import basicData from './routes/basicData.routes.js';
import enterpriseRoutes from './routes/enterprise.routes.js';
import routes from "./routes/routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from 'helmet';


const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "http://localhost:3000"],
    },
  },
}));

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
dotenv.config();
app.use(morgan("dev"));
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api", routes);
app.use('/api', basicData);
app.use('/api', enterpriseRoutes);

export default app;
