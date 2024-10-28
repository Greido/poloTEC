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
import { validateEnterprise } from "../middlewares/authorizeEmpresa.js";

const router = express.Router();

// Crear un nuevo dato básico
router.post("/createBasicData", validateRequired, createBasicData);

// Obtener todos los datos básicos (disponible solo para empresas)
router.get("/getallBD", validateRequired, validateEnterprise, getAllBasicData);

// Obtener un dato básico por ID
router.get("/getoneBD/:id", validateRequired, getBasicDataById);

router.get('/options', getOptions);

// Actualizar un dato básico por ID
router.put("/updateBD/:id", validateRequired, updateBasicDataById);

// Eliminar un dato básico por ID
router.delete("/:id", validateRequired, deleteBasicDataById);

export default router;
