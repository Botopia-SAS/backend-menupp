// src/routes/profile.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { profileController } from '../controllers/profile';

export const profileRouter = Router();

// Todas las peticiones a /profile/* pasarán por requireAuth
profileRouter.use(requireAuth);

// Ya encaja perfectamente porque profileController es un RequestHandler
profileRouter.get('/', profileController);
