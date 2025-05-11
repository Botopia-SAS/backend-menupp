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

export default app;
