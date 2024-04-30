import { Router } from "express";
import {
  login,
  register,
  logout,
  profile,
  seeAllUsers,
  updateUser,
} from "../controllers/auth.controller.js";
//Companies functions

import {
  enterpriseRegister,
  enterpriseLogin,
} from "../controllers/enterprise.controller.js";

import { validateRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", validateRequired, profile);
router.get("/allUsers", seeAllUsers);
router.put("/update/:id", updateUser);


/* Routes for companies 

  abbreviation as "CO" 

*/

router.post("/coregister", enterpriseRegister);
router.post("/cologin", enterpriseLogin);
export default router;
