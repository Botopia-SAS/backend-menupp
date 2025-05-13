// src/controllers/auth.ts
import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import type { Company, CompanyInsert } from '../interfaces/company';
import type { Credential, CredentialInsert } from '../interfaces/credentials';

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * POST /auth/register
 * Body: { name, email, mobile, password }
 */
export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email y password requeridos.' });
      return;
    }

    // src/controllers/auth.ts

    // … dentro de registerController …
    const { data: company, error: errComp } = await supabase
      .from('companies')   // <- pasamos solo el nombre de la tabla como string
      .insert({ name, email, mobile })              // <- ya no lleva el <CompanyInsert> aquí
      .select('*')                                  // <- le decimos que nos devuelva la fila completa
      .single();                                    // <- así TS sabe que company tiene id: number

    if (errComp || !company) {
      throw errComp ?? new Error('Error creando empresa');
    }

    // Ahora company.id existe y funciona sin error de TS
    const password_hash = await bcrypt.hash(password, 10);

    const { error: errCreds } = await supabase
      .from('credentials')
      .insert<CredentialInsert>({
        company_id: company.id,
        password_hash,
      });
    if (errCreds) {
      // si falla, limpiamos la empresa creada
      await supabase.from('companies').delete().eq('id', company.id);
      throw errCreds;
    }

    // 3) Emitimos JWT
    const token = jwt.sign({ userId: company.id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: company });
  } catch (err: any) {
    next(err);
  }
};

/**
 * POST /auth/login
 * Body: { email, password }
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email y password requeridos.' });
      return;
    }

    // 1) Buscamos la empresa
    const { data: company, error: errComp } = await supabase
      .from('companies')
      .select('id, name, email, mobile')
      .eq('email', email)
      .single();
    if (errComp || !company) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 2) Recuperamos el hash
    const { data: creds, error: errCreds } = await supabase
      .from('credentials')
      .select('password_hash')
      .eq('company_id', company.id)
      .single();
    if (errCreds || !creds) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 3) Comparamos la contraseña
    const valid = await bcrypt.compare(password, creds.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 4) Emitimos JWT
    const token = jwt.sign({ userId: company.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: company });
  } catch (err: any) {
    next(err);
  }
};
