import { Router } from "express";
import { uploadMiddleware, uploadFile } from '../controllers/upload.controller.js';



const router = Router();

router.post('/upload', uploadMiddleware, uploadFile);

export default router;