import { Router } from 'express';
import { getEvents, createEvent, updateEvent, deleteEvent, getEventsByUserId } from '../controllers/calendar.controller.js';
import authMiddleware from '../middlewares/authCalendar.js';
import { validateRequired } from '../middlewares/validateToken.js';
import { validateEnterprise } from '../middlewares/authorizeEmpresa.js';

const router = Router();

// Rutas protegidas
router.get('/events/:id?',validateRequired, validateEnterprise,getEvents);
router.post('/events',createEvent);
router.get('/api/events/:id', validateRequired,validateEnterprise,getEventsByUserId); 
router.put('/events/:id',validateRequired,validateEnterprise, updateEvent);
router.delete('/events/:id', validateRequired,validateEnterprise,deleteEvent);

export default router;
