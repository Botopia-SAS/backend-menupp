// src/interfaces/auth.ts

// Representa la fila tal como viene de la base
export interface CompanyAuth {
  id: number;
  email: string;
  password_hash: string;
  name?: string;
  created_at?: string;
}

// Representa el objeto que insertas (sin id ni created_at)
export interface CompanyAuthInsert {
  email: string;
  password_hash: string;
  name?: string;
}
