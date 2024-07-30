import express from "express";
import {
  createBasicData,
  getAllBasicData,
  getBasicDataById,
  updateBasicDataById,
  deleteBasicDataById,
  getOptions
} from "../controllers/basicData.controller.js";
import { validateBasicData } from "../middlewares/validateBasicData.js";
import { validateRequired } from '../middlewares/validateToken.js'; 

const router = express.Router();

// Crear un nuevo dato básico
router.post("/createBasicData", createBasicData);

// Obtener todos los datos básicos
router.get("/getallBD",validateRequired, getAllBasicData);

// Obtener un dato básico por ID
router.get("/getoneBD/:id",validateRequired, getBasicDataById);

router.get('/options', getOptions);

// Actualizar un dato básico por ID
router.put("/:id", validateBasicData, updateBasicDataById);

// Eliminar un dato básico por ID
router.delete("/:id", deleteBasicDataById);

export default router;
