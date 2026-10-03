import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { examRouter } from './routes/exams.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logger for dev transparency
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', examRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[ServerError]:", err);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(config.port, () => {
  console.log(`====================================================`);
  console.log(`  SkillForge AI Adaptive Backend is running!`);
  console.log(`  Local URL: http://localhost:${config.port}`);
  console.log(`  Gemini Key Configured: ${Boolean(config.geminiApiKey)}`);
  console.log(`====================================================`);
});
