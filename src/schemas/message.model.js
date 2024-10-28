// schemas/message.model.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image'], default: 'text' }, // 'text' o 'image'
    senderType: { type: String, enum: ['user', 'enterprise'], required: true }, // Agregar este campo
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
