// src/app.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/profile', profileRouter);
app.use('/auth', authRouter);

app.get('/', (_req, res) => {
  res.send('¡Server levantado!');
});
// justo después de tus rutas y antes de exportar app:
import type { Request, Response, NextFunction } from 'express';

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('⚠️ Error interno:', err);
  res.status(500).json({ error: err.message || 'Error interno' });
});

export default app;
