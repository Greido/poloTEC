import mongoose from "mongoose";
const knowledgeLevels = [
  "No tiene conocimientos en el área.",
  "Tiene conocimientos básicos, pero no puede realizar tareas por su cuenta.",
  "Tiene conocimientos básicos, puede realizar tareas sencillas.",
  "Tiene experiencia, puede realizar tareas complejas.",
  "Amplia experiencia en el área, con certificaciones que avalan sus conocimientos."
];

const basicDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  localidad: {
    type: String,
    enum: [
      'La Rioja', 'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut',
      'Córdoba', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy',
      'La Pampa', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
      'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
      'Santiago del Estero', 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
      'Tucumán', 'Extranjero'
    ],
    required: true,
  },
  estudios: {
    type: String,
    enum: [
      '', 'Secundario Completo', 'Pregrado', 'Grado', 'Posgrado',
      'No tiene una educación formal.'
    ],
    required: true,
  },
  especializacion: {
    type: String,
    enum: [
      '', 'Soporte Técnico', 'Desarrollador Front-end', 'Desarrollador Back-end',
      'Desarrollador Full-Stack', 'Gestión de Bases de Datos', 'Análisis de Datos',
      'Marketing', 'Comunicación / Prensa', 'Politólogos', 'Abogacía / Legales',
      'Contaduría', 'Antropología', 'Administración y Gestión Organizacional',
      'Lengua extranjera', 'QA / Automatización', 'Otra Área'
    ],
    required: true,
  },
  genero: {
    type: String,
    enum: ['', 'Masculino', 'Femenino', 'LGTB+', 'No especifica'],
    required: true,
  },
  titulo: String,
  curso_polo: String,
  fecha_de_nacimiento: { type: Date, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  residencia: {
    type: String,
    enum: ['argentina', 'exterior'],
    required: true,
  },
  reside_en_exterior: {
    type: String,
    required: function() {
      return this.residencia === 'exterior';
    }
  },

  sqlServer: {
    type: String,
    enum: [
      'Nulo', 
      'Básico (necesito tutoría)', 
      'Básico (comandos propios)', 
      'Intermedio', 
      'Avanzado (con certificaciones)'
    ], 
    default: 'Nulo',
    required: true
  },
  mysql: {
    type: String,
    enum: [
      'Nulo', 
      'Básico (necesito tutoría)', 
      'Básico (comandos propios)', 
      'Intermedio', 
      'Avanzado (con certificaciones)'
    ], 
    default: 'Nulo',
    required: true
  },
  postgre: {
    type: String,
    enum: [
      'Nulo', 
      'Básico (necesito tutoría)', 
      'Básico (comandos propios)', 
      'Intermedio', 
      'Avanzado (con certificaciones)'
    ], 
    default: 'Nulo',
    required: true
  },
  oracle: {
    type: String,
    enum: [
      'Nulo', 
      'Básico (necesito tutoría)', 
      'Básico (comandos propios)', 
      'Intermedio', 
      'Avanzado (con certificaciones)'
    ], // Definir las opciones directamente
    default: 'Nulo', // Valor predeterminado
    required: true,
  },
  extraDb: { type: String, default: '' },

  java: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  net: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  c: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  cTag: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  javascript: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  python: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  visualbasic: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  htmlCss: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  php: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },


  linux: {
    type: String,
    enum: ['Nulo', 'Básico', 'Intermedio', 'Avanzado', 'Experto'], // Opciones directamente en el enum
    default: 'Nulo',
    required: true
  },
  windowsServer: {
    type: String,
    enum: ['Nulo', 'Básico', 'Intermedio', 'Avanzado', 'Experto'],
    default: 'Nulo',
    required: true
  },
  ios: {
    type: String,
    enum: ['Nulo', 'Básico', 'Intermedio', 'Avanzado', 'Experto'],
    default: 'Nulo',
    required: true
  },
  android: {
    type: String,
    enum: ['Nulo', 'Básico', 'Intermedio', 'Avanzado', 'Experto'],
    default: 'Nulo',
    required: true
  },

  sistemas_geo: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  github: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  computacion_nube: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  metodologias_agiles: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  pmi: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  ciencia_de_datos: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  data_wh: {
    type: String,
    enum: knowledgeLevels,
    default: 'Nulo'
  },
  extra_it: { type: String, default: '' },
  experiencia_dev: { type: String, default: '' },
  experiencia_it: { type: String, default: '' },
  debilidades: { type: String, default: '' },
  extra_sistemas: { type: String, default: '' },
  ingles: {
    type: String,
    enum: ['Nulo', 'Básico', 'Intermedio', 'Avanzado', 'Nativo'], // Definir las opciones directamente
    default: 'Nulo', // Valor predeterminado
  },
  extra_idiomas: { type: String, default: '' },
  trabajo_actual: { type: String, default: '' },
  disponibilidad: { type: String, default: '' },
  remuneracion_actual: { type: String, default: '' },
  remuneracion_pretendida: { type: String, default: '' },
 
});

const BasicData = mongoose.model("BasicData", basicDataSchema);

export default BasicData;
