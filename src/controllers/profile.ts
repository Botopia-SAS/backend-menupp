// src/controllers/profile.ts
import type { RequestHandler } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../config/supabase';

export const profileController: RequestHandler = async (req, res, next) => {
  try {
    const userId = ((req as unknown) as AuthRequest).userId!;
    const { data, error } = await supabase
      .from('company_auth')
      .select('id, email, name, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      res.status(500).json({ error });
    res.json({ user: data });
    return;
    }

    res.json({ user: data });
  } catch (err) {
    next(err);
  }
};
