// basicDataController.js
import BasicData from "../schemas/basicData.model.js";
import User from "../schemas/user.model.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";


// Crear datos básicos
export const createBasicData = async (req, res) => {
  try {
    const { userId, ...basicDataFields } = req.body;

    console.log("Datos enviados al modelo:", req.body);

    const token = req.cookies.token;
    if (!token) {
      return res.status(403).send('Se requiere un token para autenticarse.');
    }

    const decoded = jwt.verify(token, TOKEN_SECRET);
    console.log(decoded);

    // Validar que el campo email no sea nulo
    if (!basicDataFields.email) {
      return res.status(400).json({ error: "El campo email es obligatorio." });
    }

    // Busca los datos básicos existentes para el usuario
    const existingData = await BasicData.findOne({ user: decoded.id });

    if (existingData) {
      // Si ya existen datos, actualiza en lugar de crear
      const updatedData = await BasicData.findByIdAndUpdate(existingData._id, {
        ...basicDataFields,
        user: decoded.id, // Asocia el ID del usuario
      }, { new: true }); // Devuelve el documento actualizado

      return res.status(200).json(updatedData);
    }

    // Crea los datos básicos si no existen
    const basicData = await BasicData.create({
      ...basicDataFields,
      user: decoded.id, // Asocia el ID del usuario
    });

    res.status(201).json(basicData);
  } catch (error) {
    if (error.code === 11000) {
      // Error de duplicado (email ya registrado)
      return res.status(400).json({ error: "El email ya está registrado." });
    }
    console.error("Error al crear los datos básicos:", error);
    res.status(500).json({ error: "Error al crear los datos básicos." });
  }
};


// Obtener todos los datos básicos
export const getAllBasicData = async (req, res) => {
  try {
    // Verificar el rol de la entidad autenticada (empresa o usuario)
    const role = res.locals.decoded.role;

    // Si el rol es 'enterprise', obtiene todos los datos de los usuarios
    if (role === 'enterprise') {
      const allBasicData = await BasicData.find().populate('user');
      return res.status(200).json(allBasicData);
    }

    // Si el rol es 'user', obtiene solo los datos del usuario actual
    const userId = res.locals.user._id;
    const userBasicData = await BasicData.find({ user: userId }).populate('user');

    if (!userBasicData || userBasicData.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos básicos para el usuario." });
    }

    res.status(200).json(userBasicData);
  } catch (error) {
    console.error("Error al obtener datos básicos:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};


// Obtener datos básicos por ID
export const getBasicDataById = async (req, res) => {
  try {
    const userId = res.locals.user ? res.locals.user._id : null; // Obtén el ID del usuario de res.locals

    if (!userId) {
      return res.status(404).json({ error: "No se encontró el ID del usuario" });
    }

    const basicData = await BasicData.findOne({ user: userId }).populate('user');
    
    if (!basicData) {
      return res.status(404).json({ error: "Basic data not found" });
    }
    
    res.status(200).json(basicData);
  } catch (error) {
    console.error("Error fetching basic data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getOptions = (req, res) => {
  const options = {
    experienciaLP: ['JavaScript', 'Python', 'Java'], 
    experienciaBD: ['MySQL', 'PostgreSQL', 'MongoDB'],
    experienciaSO: ['Windows', 'Linux', 'macOS'],
    experienciaHG: ['JIRA', 'Trello', 'Asana']
  };

  res.json(options);
};



// Actualizar datos básicos por ID
// Actualizar datos básicos por ID (usando el userId del usuario autenticado)
export const updateBasicDataById = async (req, res) => {
  try {
    const userId = res.locals.user ? res.locals.user._id : null; // Obtén el ID del usuario autenticado desde res.locals

    if (!userId) {
      return res.status(404).json({ error: "No se encontró el ID del usuario" });
    }

    // Encuentra los datos básicos vinculados al usuario
    const basicData = await BasicData.findOneAndUpdate(
      { user: userId },  // Busca los datos por el userId
      req.body,          // Actualiza con los datos enviados en el cuerpo de la solicitud
      { new: true }      // Devuelve el documento actualizado
    );

    if (!basicData) {
      return res.status(404).json({ error: "No se encontraron datos básicos para este usuario" });
    }

    // Respuesta exitosa con los datos actualizados
    res.status(200).json(basicData);
  } catch (error) {
    console.error("Error actualizando datos básicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Eliminar datos básicos por ID
export const deleteBasicDataById = async (req, res) => {
  try {
    const basicData = await BasicData.findByIdAndDelete(req.params.id);
    if (!basicData) {
      return res.status(404).json({ error: "Basic data not found" });
    }
    res.status(200).json({ message: "Basic data deleted successfully" });
  } catch (error) {
    console.error("Error deleting basic data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
