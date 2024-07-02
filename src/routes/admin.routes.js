import express from 'express';
import { authorizeAdmin } from '../middlewares/auth.js';

const router = express.Router();

router.get('/admin/dashboard', authorizeAdmin, (req, res) => {
  // Route accessible only to admins
  res.json({ message: 'Welcome to admin dashboard' });
});

export default router;
