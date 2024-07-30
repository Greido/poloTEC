import { Router } from 'express';
import {
  login,
  register,
  logout,
  profile,
  seeAllUsers,
  sendEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/auth.controller.js';
import { validateRequired } from '../middlewares/validateToken.js';

const router = Router();

router.post('/register', register);
router.post('/login',  login);
router.post('/logout', validateRequired, logout);

router.get('/profile',validateRequired, profile);
router.get('/allUsers',validateRequired, seeAllUsers);
router.post('/send-email', sendEmail);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
