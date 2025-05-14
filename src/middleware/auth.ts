// src/middleware/auth.ts
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

// Extendemos la interfaz de Express.Request
export interface AuthRequest extends Request {
  userId: number;
}

const JWT_SECRET = process.env.JWT_SECRET!;

export const requireAuth: RequestHandler = (req, res, next) => {
  try {
    const raw = req.headers.cookie;
    if (!raw) throw new Error('No cookie');
    const { token } = cookie.parse(raw);
    if (!token) throw new Error('No token');
    const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    (req as AuthRequest).userId = payload.userId;
    next();
  } catch {
    res.status(401).json({ error: 'No autenticado' });
  }
};