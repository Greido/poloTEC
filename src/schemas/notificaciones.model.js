// models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  imageUrl: { type: String },
  time: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
});

export default mongoose.model('Notification', notificationSchema);
