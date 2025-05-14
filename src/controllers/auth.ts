// src/controllers/auth.ts
import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { supabase } from '../config/supabase';
import type { CompanyInsert } from '../interfaces/company';
import type { CredentialInsert } from '../interfaces/credentials';

const JWT_SECRET = process.env.JWT_SECRET!;
const ONE_HOUR = 60 * 60; // en segundos

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

    // 1) Creamos la compañía
    const { data: company, error: errComp } = await supabase
      .from('companies')
      .insert({ name, email, mobile })
      .select('*')
      .single();
    if (errComp || !company) {
      throw errComp ?? new Error('Error creando empresa');
    }

    // 2) Hasheamos la contraseña y guardamos credenciales
    const password_hash = await bcrypt.hash(password, 10);
    const { error: errCreds } = await supabase
      .from('credentials')
      .insert<CredentialInsert>({
        company_id: company.id,
        password_hash,
      });
    if (errCreds) {
      // rollback
      await supabase.from('companies').delete().eq('id', company.id);
      throw errCreds;
    }

    // 3) Generamos el JWT
    const token = jwt.sign({ userId: company.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // 4) Enviamos el token en cookie HttpOnly
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ONE_HOUR,
        path: '/',
      })
    );

    // 5) Respondemos sólo con el usuario
    res.status(201).json({ user: company });
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

    // 2) Recuperamos hash de la contraseña
    const { data: creds, error: errCreds } = await supabase
      .from('credentials')
      .select('password_hash')
      .eq('company_id', company.id)
      .single();
    if (errCreds || !creds) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 3) Comparamos
    const valid = await bcrypt.compare(password, creds.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Credenciales inválidas.' });
      return;
    }

    // 4) Generamos JWT
    const token = jwt.sign({ userId: company.id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // 5) Enviamos cookie HttpOnly
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ONE_HOUR,
        path: '/',
      })
    );

    // 6) Respondemos sólo con el usuario
    res.status(200).json({ user: company });
  } catch (err: any) {
    next(err);
  }
};

// src/controllers/auth.ts  (añádelo al final)
export const logoutController = (_req: Request, res: Response) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
  );
  res.json({ ok: true });
};

