// api/index.ts
import 'dotenv/config';         // o tu ./src/config/dotenv
import { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
