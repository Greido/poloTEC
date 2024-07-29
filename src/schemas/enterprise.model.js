import mongoose from 'mongoose';

const enterpriseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cuil: {
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
    enum: ['enterprise'],
    default: 'enterprise', 
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const Enterprise = mongoose.model('Enterprise', enterpriseSchema);

export default Enterprise;
