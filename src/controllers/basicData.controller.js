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
      return res.status(403).send('A token is required for authentication');
    }
    console.log(token);
    const decoded = jwt.verify(token, TOKEN_SECRET);
    console.log(decoded);
    

    // Crea los datos básicos
    const basicData = await BasicData.create({
      ...basicDataFields,
      user: decoded.id, // Asocia el ID del usuario
    });

    // Encuentra el usuario y actualiza su campo `basicData`
    await User.findByIdAndUpdate(userId, { basicData: basicData._id });

    res.status(201).json(basicData);
  } catch (error) {
    console.error("Error creating basic data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Obtener todos los datos básicos
export const getAllBasicData = async (req, res) => {
  try {
    const basicData = await BasicData.find();
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

// Obtener datos básicos por ID
export const getBasicDataById = async (req, res) => {
  const { id } = req.params; // El ID del usuario viene como parámetro en la URL

  try {
    // Verifica si el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Encuentra los datos básicos asociados al usuario
    const basicData = await BasicData.findOne({ user: id });
    if (!basicData) {
      return res.status(404).json({ error: "Basic data not found for this user" });
    }

    res.status(200).json(basicData);
  } catch (error) {
    console.error("Error fetching basic data by user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Actualizar datos básicos por ID
export const updateBasicDataById = async (req, res) => {
  try {
    const basicData = await BasicData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!basicData) {
      return res.status(404).json({ error: "Basic data not found" });
    }
    res.status(200).json(basicData);
  } catch (error) {
    console.error("Error updating basic data:", error);
    res.status(500).json({ error: "Internal server error" });
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
