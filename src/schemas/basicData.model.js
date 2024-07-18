import mongoose from "mongoose";
import User from "../schemas/user.model.js";

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
  },
  fechaNacimiento: {
    type: String,
    required: true,
  },
  areaInteres: {
    type: String,
  },
  genero: {
    type: String,
  },
  cursos: {
    type: String,
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
  experienciaLP: [{
    nombreLP: {
      type: String,
      enum: ['Java', 'C#', 'VisualBasic','NET','JavaScript','HTML/CSS','C/C++','Python','PHP']
    },
    nivel: {
      type: String,
      enum: ['Básico', 'Intermedio', 'Avanzado']
    }
  }],
  experienciaBD: [{
    nombreBD: {
      type: String,
      enum: ['SQL Server', 'PostgreSQL', 'MongoDB','Oracle','MySQL']
    },
    nivel: {
      type: String,
      enum: ['Básico', 'Intermedio', 'Avanzado']
    }
  }],
  experienciaSO: [{
    nombreSO: { 
      type: String, 
      enum: ['Windows', 'Linux', 'macOS', 'iOS'], 
      required: true 
    },
    nivel: { 
      type: String, 
      enum: ['Básico', 'Intermedio', 'Avanzado'], 
      required: true 
    }
  }],
  experienciaHG: [{
    nombreHG: { 
      type: String, 
      enum: ['JIRA', 'Trello', 'Asana', 'Computación en la Nube','Sistema de Información Geográfico', 'Project Management Institute'], 
      required: true 
    },
    nivel: { 
      type: String, 
      enum: ['Básico', 'Intermedio', 'Avanzado'], 
      required: true 
    }
  }],
  
  conocimientoTec: {
    type: String,
  },
  experienciaendesarrollo: {
    type: String,
    required: true,
  },
  experienciaEnAdministracionyGestiondeSistemas: {
    type: String,
  },
  debilidadTEC: {
    type: String,
  },
});

const BasicData = mongoose.model("BasicData", basicDataSchema);

export default BasicData;
