// src/routes/settings.ts
import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import {
  getBrandSettings,
  upsertBrandSettings,
  getSocialLinks,
  upsertSocialLinks,
  getSurveys,
  upsertSurveys,
} from '../controllers/settings'

export const settingsRouter = Router()

// Protegemos todas las rutas con JWT en cookie HttpOnly
settingsRouter.use(requireAuth)

// --- Brand settings ---
settingsRouter
  .get('/brand', getBrandSettings)         // GET  /settings/brand
  .post('/brand', upsertBrandSettings)     // POST /settings/brand

// --- Social links ---
settingsRouter
  .get('/social', getSocialLinks)          // GET  /settings/social
  .post('/social', upsertSocialLinks)      // POST /settings/social

// --- Surveys ---
settingsRouter
  .get('/surveys', getSurveys)             // GET  /settings/surveys
  .post('/surveys', upsertSurveys)         // POST /settings/surveys
