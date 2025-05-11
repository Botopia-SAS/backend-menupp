// src/controllers/auth.ts
import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import type { ResCompany, ResCompanyInsert } from '../interfaces/res_company';
import type {
  CompanyCredentials,
  CompanyCredentialsInsert,
} from '../interfaces/credentials';

const JWT_SECRET = process.env.JWT_SECRET!;

export const registerController: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { name, email, mobile, password } = req.body;
    if (!name || !email || !password || !mobile) {
      res.status(400).json({ error: 'Todos los campos son requeridos.' });
      return;
    }

    // 1) Creamos la empresa en res_company
    const { data: company, error: errCompany } = await supabase
      .from<ResCompany, ResCompanyInsert>('res_company')
      .insert({ name, email, mobile, active: true })
      .select('id, name, email, mobile')
      .single();
    if (errCompany || !company) {
      throw errCompany ?? new Error('Error al crear la empresa');
    }

    // 2) Hasheamos la password y guardamos en company_credentials
    const password_hash = await bcrypt.hash(password, 10);
    const credsInsert: CompanyCredentialsInsert = {
      company_id: company.id,
      password_hash,
    };
    const { error: errCreds } = await supabase
      .from<CompanyCredentials, CompanyCredentialsInsert>('company_credentials')
      .insert(credsInsert);
    if (errCreds) {
      // Si falla, eliminamos la empresa para no dejar datos huérfanos
      await supabase.from('res_company').delete().eq('id', company.id);
      throw errCreds;
    }

    // 3) Generamos JWT
    const token = jwt.sign(
      { companyId: company.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token, user: company });
  } catch (err: any) {
    next(err);
  }
};

export const loginController: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email y password son requeridos.' });
      return;
    }

    // 1) Buscamos la empresa por email
    const { data: company, error: errCompany } = await supabase
      .from<ResCompany>('res_company')
      .select('id, name, email, mobile')
      .eq('email', email)
      .single();
    if (errCompany || !company) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 2) Recuperamos el hash de password
    const { data: creds, error: errCreds } = await supabase
      .from<CompanyCredentials>('company_credentials')
      .select('password_hash')
      .eq('company_id', company.id)
      .single();
    if (errCreds || !creds) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 3) Comparamos el password
    const valid = await bcrypt.compare(password, creds.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 4) Emitimos JWT
    const token = jwt.sign(
      { companyId: company.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, user: company });
  } catch (err: any) {
    next(err);
  }
};
