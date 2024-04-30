import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    required: true,
    trim: true,
  },
  localidad: {
    type: String,
    required: true,
  },
  educacion: {
    type: String,
    required: true,
  },
  titulos: {
    type: String,
    required: true,
  },
  fechaNacimiento: {
    type: String,
    required: true,
  },
  areaInteres: {
    type: String,
    required: true,
  },
  cursos: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  residencia: {
    type: String,
  },
});

export default mongoose.model("User", userSchema);
