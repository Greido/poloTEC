import mongoose from "mongoose";
import User from "./user.model.js";
import { boolean } from "yup";

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
    type: Date,
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
      enum: ['Linux', 'IOS', 'WindowsServer','Android']
    },
    nivel: {
      type: String,
      enum: ['Básico', 'Intermedio', 'Avanzado']
    }
  }],
  experienciaHG: [{
    nombreHG: {
      type: String,
      enum: ['Sistema de Información Geográfico', 'Computacion en la Nube', 'Project Management Institute','Repositorio en la Nube','Metodologia Agiles']
    },
    nivel: {
      type: String,
      enum: ['Básico', 'Intermedio', 'Avanzado']
    }
  }],
 conocimientoTec: {
    type: String,
    required: true,
   
  },
  experienciaendesarrollo: {
    type: String,
    required: true,

  },
  experienciaEnAdministracionyGestiondeSistemas: {
    type: String,
    required: true,
   
  },
debilidadTEC: {
    type: String,
    required: true,
  
  },
  experienciaSO: {
    type: String,
    required: true,
  
  },
});
  


const BasicData = mongoose.model("BasicData", basicDataSchema);

export default BasicData;
