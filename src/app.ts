import express from 'express';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { profileRouter } from './routes/profile';
import type { Request, Response, NextFunction } from 'express';
import { settingsRouter } from './routes/settings';

dotenv.config();
const app = express();

// ------------------
// CORS MANUAL
// ------------------
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
const WHITELIST = [FRONTEND];

app.use(((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin && WHITELIST.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  }
  // respuesta a preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
}) as express.RequestHandler);
// Fin CORS manual

app.use(express.json());

// Rutas de autenticación y perfil protegidas
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/settings', settingsRouter);
// Ruta raíz de prueba
app.get('/', (_req, res) => {
  res.send('¡Server levantado!');
});

// Manejador global de errores
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('⚠️ Error interno:', err);
  res.status(500).json({ error: err.message || 'Error interno' });
});

export default app;
