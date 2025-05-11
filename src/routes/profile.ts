// src/routes/profile.ts
import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { profileController } from '../controllers/profile';

export const profileRouter = Router();

// BOTH requireAuth and profileController are now RequestHandler
profileRouter.get('/', requireAuth, profileController);
