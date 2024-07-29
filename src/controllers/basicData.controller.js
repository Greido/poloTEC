// basicDataController.js

import BasicData from "../schemas/basicData.model.js";

// Crear datos básicos
export const createBasicData = async (req, res) => {
  try {
    const basicData = await BasicData.create(req.body);
    res.status(201).json(basicData);
  } catch (error) {
    console.error("Error creating basic data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



// Obtener todos los datos básicos
export const getAllBasicData = async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]; // Buscar token en cookies o en headers
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const basicData = await BasicData.find();
    res.status(200).json(basicData);
  } catch (error) {
    console.error("Error fetching basic data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtener datos básicos por ID
export const getBasicDataById = async (req, res) => {
  try {
    const basicData = await BasicData.findById(req.params._id);
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
