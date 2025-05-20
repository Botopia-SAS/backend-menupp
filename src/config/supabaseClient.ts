import { createClient } from '@supabase/supabase-js'

/** Service Role Key: ignora RLS, lo usas en el servidor */
export const supabaseService = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/** Anon Key: lo usa el frontend, no hace falta en el servidor */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
