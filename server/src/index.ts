import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './db/database';
import authRoutes from './routes/auth.routes';
import propertiesRoutes from './routes/properties.routes';
import requirementsRoutes from './routes/requirements.routes';
import enquiriesRoutes from './routes/enquiries.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize SQLite schema & auto-seed if fresh
initDatabase();

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RentNest House Rental Consultancy API',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build if present (for single-service unified deployment on Render)
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving client production build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Catch-all route to support React client-side routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 RentNest Server running on port ${PORT}`);
});
