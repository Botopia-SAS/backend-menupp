import { RequestHandler } from 'express'
import { supabaseService } from '../config/supabaseClient'

export const authenticate: RequestHandler = async (req, res, next) => {
  const auth = req.headers.authorization
  console.log('[AUTH] Authorization header:', auth)

  if (!auth?.startsWith('Bearer ')) {
    console.log('[AUTH] Token missing or malformed')
    res.status(401).json({ error: 'Token missing or malformed' })
    return
  }

  const token = auth.split(' ')[1]
  console.log('[AUTH] Extracted token:', token)

  const {
    data: { user },
    error: authError,
  } = await supabaseService.auth.getUser(token)
  console.log('[AUTH] getUser →', { user, authError })
  if (authError || !user) {
    console.log('[AUTH] Unauthorized')
    res.status(401).json({ error: authError?.message || 'Unauthorized' })
    return
  }
  (req as any).userId = user.id

  req.userId = user.id
  console.log('[AUTH] userId injected:', user.id)

  next()
}
