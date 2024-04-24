import mongoose from "mongoose";
import User from "./user.model.js";

const basicDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  genero: {
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
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const BasicData = mongoose.model("BasicData", basicDataSchema);

export default BasicData;
