// src/controllers/profile.ts
import type { RequestHandler } from 'express';
import type { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const profileController: RequestHandler = async (req, res, next) => {
  try {
    // casteamos para recuperar el userId inyectado por requireAuth
    const { userId } = req as unknown as AuthRequest;

    if (!userId) {
      res.status(401).json({ error: 'No autenticado' });
      return;                // <-- no devolvemos el res.json, solo paramos la ejecución
    }

    const { data: company, error } = await supabase
      .from('companies')
      .select('id,name,email,mobile')
      .eq('id', userId)
      .single();

    if (error || !company) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;                // <-- idem
    }

    res.json({ user: company });
    return;                  // <-- opcional, deja claro que aquí acaba la función

  } catch (err) {
    next(err);
    return;                  // <-- opcional
  }
};
