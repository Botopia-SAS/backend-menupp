import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { profileController } from '../controllers/profile';

export const profileRouter = Router();

// Todas las peticiones a /profile/* pasarán por requireAuth
profileRouter.use(requireAuth);

// Ahora profileController podrá hacer:
// const req2 = req as AuthRequest;
// console.log('companyId:', req2.userId);
profileRouter.get('/', profileController);
