import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import db, { initDatabase } from './db/database';
import { seed } from './db/seed';
import authRoutes from './routes/auth.routes';
import propertiesRoutes from './routes/properties.routes';
import requirementsRoutes from './routes/requirements.routes';
import enquiriesRoutes from './routes/enquiries.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '0.0.0.0';

// Initialize SQLite schema
initDatabase();

// Auto-seed initial data if fresh database (only in local dev or when AUTO_SEED is set)
const shouldAutoSeed = process.env.AUTO_SEED === 'true' || (process.env.NODE_ENV !== 'production' && !process.env.CI);
try {
  const propCount = (db.prepare('SELECT COUNT(*) as c FROM properties').get() as any)?.c || 0;
  if (propCount === 0 && shouldAutoSeed) {
    console.log('Database empty. Populating initial seed data (properties, owners, demo users)...');
    seed();
  }
} catch (err: any) {
  console.error('Auto-seed error:', err?.message || err);
}

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/requirements', requirementsRoutes);
app.use('/api/enquiries', enquiriesRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (for Render / uptime monitors)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RentNest House Rental Consultancy API',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if present (for Render unified deployment)
const possibleDistPaths = [
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist')
];

const clientDistPath = possibleDistPaths.find(p => fs.existsSync(p));

if (clientDistPath) {
  console.log(`📦 Serving client production build from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Catch-all route to support client-side React router
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Bind to 0.0.0.0 as required by Render
app.listen(PORT, HOST, () => {
  console.log(`🚀 RentNest Server running on http://${HOST}:${PORT}`);
});
