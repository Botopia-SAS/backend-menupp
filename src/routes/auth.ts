// src/routes/auth.ts
import { Router } from 'express';
import { registerController, loginController } from '../controllers/auth';

export const authRouter = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
