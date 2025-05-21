// src/app.ts
import './config/dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import settingsRouter from './routes/settings';

const app = express();

// 1️⃣ CORS: permite peticiones (incluyendo preflight OPTIONS)
//    desde tu frontend y con credenciales (cookies / Authorization header)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,  // p.ej. 'http://localhost:3000' o 'https://menu.aisentral.co'
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

// 2️⃣ Body parser para JSON
app.use(express.json());

// 3️⃣ Monta todas las rutas de settings bajo /api/settings
app.use('/api/settings', settingsRouter);

// 4️⃣ Healthcheck en /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.send('OK');
});

export default app;
