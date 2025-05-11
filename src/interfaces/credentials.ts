// src/interfaces/credentials.ts

/** Lo que devuelve la tabla company_credentials */
export interface CompanyCredentials {
  company_id: number;
  password_hash: string;
  reset_token?: string;
  reset_expires_at?: string;
  created_at: string;
  updated_at: string;
}

/** Lo que necesitas insertar al registrar */
export interface CompanyCredentialsInsert {
  company_id: number;
  password_hash: string;
}
