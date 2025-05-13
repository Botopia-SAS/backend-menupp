// src/index.ts
import dotenv from 'dotenv';
dotenv.config();                   // ← carga .env en desarrollo

import app from './app';

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
