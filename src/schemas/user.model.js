import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },
  avatar: { type: String },
  baseDataId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'BasicData'
     },
     
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});



export default mongoose.model('User', userSchema);
