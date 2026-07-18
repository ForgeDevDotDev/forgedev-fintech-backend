import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes';
import { requestLogger } from './middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// TODO: Add rate limiting middleware
// FIXME: We should have an API key or JWT auth here
// For now, no auth is implemented

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'forgedev-fintech-backend' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`ForgeDev Fintech API running on port ${PORT}`);
});

export default app;
