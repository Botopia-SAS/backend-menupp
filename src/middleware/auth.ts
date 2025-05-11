// src/middleware/auth.ts
import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const requireAuth: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token requerido' });
    return;
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as unknown as AuthRequest).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
    return;
  }
};
