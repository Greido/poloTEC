// controllers/messageController.js
import Message from '../schemas/message.model.js';
import jwt from 'jsonwebtoken';

const TOKEN_SECRET = process.env.TOKEN_SECRET; // Asegúrate de tener la variable de entorno definida

// Enviar un mensaje
export const sendMessage = async (req, res) => {
    const { receiverId, content, type } = req.body; // Obtiene el ID del receptor y contenido del mensaje
    const token = req.cookies.token; // Obtiene el token de las cookies

    if (!token) {
        return res.status(403).send('Se requiere un token para autenticarse.');
    }

    try {
        // Verifica el token y obtiene el ID del usuario
        const decoded = jwt.verify(token, TOKEN_SECRET);
        console.log("Usuario autenticado:", decoded);

        // Validar que el contenido no sea nulo
        if (!content) {
            return res.status(400).json({ error: "El contenido del mensaje es obligatorio." });
        }

        // Crea un nuevo mensaje
        const newMessage = new Message({
            senderId: decoded.id, // Usa el ID del usuario decodificado
            receiverId,
            content,
            type,
        });

        await newMessage.save();
        res.status(200).json(newMessage);
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ message: 'Error al enviar el mensaje', error });
    }
};

// Obtener mensajes de un usuario
export const getMessages = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).send('Se requiere un token para autenticarse.');
    }

    try {
        // Verifica el token y obtiene el ID del usuario
        const decoded = jwt.verify(token, TOKEN_SECRET);
        console.log("Usuario autenticado:", decoded);

        const messages = await Message.find({
            $or: [{ senderId: decoded.id }, { receiverId: decoded.id }] // Busca mensajes donde el usuario es remitente o receptor
        }).populate('senderId receiverId', 'name senderType'); // Popula con los nombres de usuario

        res.status(200).json(messages);
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).json({ message: 'Error al obtener mensajes', error });
    }
};
