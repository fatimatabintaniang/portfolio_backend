// src/index.js
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import api from './routes/AllRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerSpec = JSON.parse(readFileSync(join(__dirname, 'swagger.json'), 'utf-8'));

const app = new Hono();
const PORT = process.env.PORT || 3001;

// Middleware
app.use('*', logger());
// app.use('*', cors({
//   origin: [process.env.FRONTEND_URL || 'http://localhost:5173', '*'],
//   allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//   allowHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

app.use('*', cors({
  origin: process.env.FRONTEND_URL,
  allowMethods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowHeaders: ['Content-Type','Authorization'],
}));

// Health check
app.get('/', (c) => c.json({
  status: 'ok',
  message: '🚀 Portfolio API is running!',
  version: '1.0.0',
  docs: '/swagger'
}));

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/openapi.json' }));

// OpenAPI JSON spec
// app.get('/openapi.json', (c) => {
//   swaggerSpec.servers = [{ url: `http://localhost:${PORT}`, description: 'Development server' }];
//   return c.json(swaggerSpec);
// });

app.get('/openapi.json', (c) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  swaggerSpec.servers = [{ url: baseUrl, description: 'Server' }];
  return c.json(swaggerSpec);
});

// API routes
app.route('/api', api);

// 404 handler
app.notFound((c) => c.json({ success: false, error: 'Route not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ success: false, error: 'Internal server error' }, 500);
});

// Start server
serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Portfolio API running on http://localhost:${info.port}`);
  console.log(`📚 Swagger docs at http://localhost:${info.port}/swagger`);
});

export default app;