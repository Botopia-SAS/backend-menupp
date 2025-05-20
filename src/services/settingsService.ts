// src/services/settingsService.ts
import { supabase } from '../config/supabaseClient';

export async function getByUser<T>(
  table: string,
  userId: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)              // <— sin genérico aquí
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  // casteamos data a T | null
  return data as T | null;
}

export async function upsertByUser<T>(
  table: string,
  payload: T & { user_id: string }
): Promise<T> {
  // Supabase devuelve los resultados por defecto
  const { data, error } = await supabase
    .from(table)              // <— sin genérico aquí tampoco
    .upsert(payload, { onConflict: 'user_id' });

  if (error) throw new Error(error.message);

  // Supabase nos devuelve un array de filas
  const rows = (data as T[] | null) ?? [];
  return rows[0];
}
