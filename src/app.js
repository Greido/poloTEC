import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import basicData from './routes/basicData.routes.js';
import enterpriseRoutes from './routes/enterprise.routes.js';
import calendarRoutes from './routes/calendar.routes.js';
import messageRoutes from './routes/message.routes.js';
import notificationsRoutes from './routes/notificaciones.routes.js';
import routes from "./routes/routes.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200
};

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "http://localhost:5173"],
    },
  },
}));

// Crear carpetas necesarias si no existen
const createUploadsDir = () => {
  const uploadsDir = path.resolve('../uploads'); // Cambia aquí para usar la ruta base
  const avatarsDir = path.join(uploadsDir, 'avatars');

  // Crear la carpeta uploads si no existe
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Crear la carpeta avatars dentro de uploads si no existe
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir);
  }
};

createUploadsDir(); 
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
dotenv.config();
app.use(morgan("dev"));
app.use(express.json());

// Obtener el directorio actual desde import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Hacer pública la carpeta de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", authRoutes);
app.use("/api", routes);
app.use('/api', basicData);
app.use('/api', enterpriseRoutes);
app.use('/api', calendarRoutes);
app.use('/api', messageRoutes);
app.use('/api', notificationsRoutes);

export default app;
