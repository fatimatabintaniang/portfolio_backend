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
const PORT = parseInt(process.env.PORT) || 3001;

app.use('*', logger());

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => c.json({
  status: 'ok',
  message: '🚀 Portfolio API is running!',
  version: '1.0.0',
  docs: '/swagger'
}));

app.get('/swagger', swaggerUI({ url: '/openapi.json' }));

app.get('/openapi.json', (c) => {
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
  swaggerSpec.servers = [{ url: baseUrl, description: 'Server' }];
  return c.json(swaggerSpec);
});

app.route('/api', api);

app.notFound((c) => c.json({ success: false, error: 'Route not found' }, 404));

app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ success: false, error: 'Internal server error' }, 500);
});

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`🚀 Portfolio API running on http://localhost:${info.port}`);
  console.log(`📚 Swagger docs at http://localhost:${info.port}/swagger`);
});

export default app;