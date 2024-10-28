// controllers/notificationController.js
import Notification from '../schemas/notificaciones.model.js';

// Obtener notificaciones (usuarios y empresas)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ time: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las notificaciones' });
  }
};

// Crear una nueva notificación (solo para empresas)
export const createNotification = async (req, res) => {
  const { message, imageUrl } = req.body;
  const { decoded } = res.locals;

  try {
    const newNotification = new Notification({
      userId: decoded.id,
      message,
      imageUrl,
    });

    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la notificación' });
  }
};

// Comentar en una notificación (usuarios y empresas)
export const commentOnNotification = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const { decoded } = res.locals;

  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    // Agrega el comentario a la lista de comentarios de la notificación
    notification.comments.push({
      userId: decoded.id,
      role: decoded.role,
      comment,
      time: new Date(),
    });

    await notification.save();
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el comentario' });
  }
};
