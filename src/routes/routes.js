import { Router } from "express";
import { uploadMiddleware, uploadFile } from '../controllers/upload.controller.js';



const router = Router();

router.post('/upload', uploadFile);

export default router;