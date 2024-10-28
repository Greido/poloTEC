// routes/messages.js
import express from 'express';
import { sendMessage, getMessages } from '../controllers/message.controller.js';
import { validateEnterprise } from '../middlewares/authorizeEmpresa.js';

const router = express.Router();

// Enviar un mensaje
router.post('/send',validateEnterprise, sendMessage);

// Obtener mensajes de un usuario
router.get('/recibir/:userId',validateEnterprise, getMessages);

export default router;
