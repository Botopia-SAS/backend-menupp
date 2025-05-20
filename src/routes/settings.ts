// src/routes/settings.ts
import { Router, RequestHandler } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getBrand,
  upsertBrand,
  getSocial,
  upsertSocial,
  getSurvey,
  upsertSurvey,
} from '../controllers/settingsController';

const router = Router();

// Aplica autenticación + RLS client a todas las rutas
router.use(authenticate);

// Brand settings
router.get('/brand', getBrand as unknown as RequestHandler);
router.post('/brand', upsertBrand as unknown as RequestHandler);

// Social settings
router.get('/social', getSocial as unknown as RequestHandler);
router.post('/social', upsertSocial as unknown as RequestHandler);

// Survey settings
router.get('/survey', getSurvey as unknown as RequestHandler);
router.post('/survey', upsertSurvey as unknown as RequestHandler);

export default router;
