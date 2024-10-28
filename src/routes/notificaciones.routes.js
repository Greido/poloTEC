// routes/notifications.js
import express from 'express';
import { getNotifications, createNotification, commentOnNotification } from '../controllers/notificaciones.controller.js';
import { validateRequired } from '../middlewares/validateToken.js';
import { isEnterprise } from '../middlewares/isEnterprise.js';

const router = express.Router();

// Ruta para obtener notificaciones (disponible para usuarios y empresas)
router.get('/', validateRequired, getNotifications);

// Ruta para que una empresa cree una nueva notificación/publicación
router.post('/', validateRequired, isEnterprise, createNotification);

// Ruta para que un usuario comente en una publicación (disponible para usuarios y empresas)
router.post('/:id/comment', validateRequired, commentOnNotification);

export default router;
