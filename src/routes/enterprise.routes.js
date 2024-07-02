import express from 'express';
import { enterpriseRegister, 
         enterpriseLogin,
         enterpriseLogout, 
         enterpriseForgotPassword, 
        enterpriseResetPassword, 
        enterpriseProfile } 
     from '../controllers/enterprise.controller.js';
import { validateRequired } from '../middlewares/validateToken.js'; 
const router = express.Router();

router.post('/enterprise/register', enterpriseRegister);
router.post('/enterprise/login', enterpriseLogin);
router.post('/enterprise/logout', validateRequired, enterpriseLogout);
router.get('/enterprise/profile', validateRequired, enterpriseProfile);
router.post('/enterprise/forgot-password', enterpriseForgotPassword);
router.post('/enterprise/reset-password', enterpriseResetPassword);
export default router;
