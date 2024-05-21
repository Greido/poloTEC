import express from "express";
import {
  createBasicData,
  getAllBasicData,
  getBasicDataById,
  updateBasicDataById,
  deleteBasicDataById,
} from "../controllers/basicData.controller.js";
import { validateBasicData } from "../middlewares/validateBasicData.js";

const router = express.Router();

// Crear un nuevo dato básico
router.post("/createBasicData", createBasicData);

// Obtener todos los datos básicos
router.get("/getallBD", getAllBasicData);

// Obtener un dato básico por ID
router.get("/getoneBD/:id", getBasicDataById);

// Actualizar un dato básico por ID
router.put("/:id", validateBasicData, updateBasicDataById);

// Eliminar un dato básico por ID
router.delete("/:id", deleteBasicDataById);

export default router;
