import { Router } from "express";
import { uploadMiddleware, uploadFile } from '../controllers/upload.controller.js';
import { upload, uploadAvatar } from '../controllers/auth.controller.js'



const router = Router();

router.post('/upload', uploadFile);
// Ruta para subir avatar
router.post('/upload-avatar', upload.single('avatar'), uploadAvatar);

export default router;