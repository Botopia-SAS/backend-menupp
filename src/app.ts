// src/app.ts
import './config/dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import settingsRouter from './routes/settings';

const app = express();

// 1️⃣ CORS: permite peticiones desde tu frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // ej. 'http://localhost:3000'
    credentials: true,
  })
);

// 2️⃣ Body parser
app.use(express.json());

// 3️⃣ Tu API montada en /api
app.use('/', settingsRouter);

// 4️⃣ Healthcheck — ya no devuelve nada, sólo hace res.send
app.get(
  '/health',
  (_req: Request, res: Response, _next: NextFunction) => {
    res.send('OK');
  }
);

export default app;
