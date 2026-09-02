const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting Vite dev server (5173) and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or same-origin)
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev mode
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const savedCasesRoutes = require('./routes/savedCasesRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const lawComparisonRoutes = require('./routes/lawComparisonRoutes');
const searchRoutes = require('./routes/searchRoutes');
const actsRoutes = require('./routes/actsRoutes');
const sectionsRoutes = require('./routes/sectionsRoutes');
const casesRoutes = require('./routes/casesRoutes');
const aiRoutes = require('./routes/aiRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const communityRoutes = require('./routes/communityRoutes');

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/saved-cases', savedCasesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/law-comparison', lawComparisonRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/acts', actsRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/law-mappings', mappingRoutes);
app.use('/api/community', communityRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'CaseIQ Legal AI Platform',
    database: 'PostgreSQL (caseiq)',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/auth/me',
      'POST /api/auth/forgot-password',
      'GET /api/profile',
      'PUT /api/profile',
      'POST /api/saved-cases',
      'DELETE /api/saved-cases/:caseId',
      'GET /api/saved-cases',
      'GET /api/dashboard/stats',
      'GET /api/dashboard/recent-searches',
      'GET /api/dashboard/research-history',
      'POST /api/law-comparison',
      'POST /api/search/legal',
      'GET /api/search',
      'GET /api/search/history',
      'GET /api/acts',
      'GET /api/acts/:id',
      'GET /api/sections/search?q=',
      'GET /api/sections/:id',
      'GET /api/cases',
      'GET /api/cases/:id',
      'GET /api/cases/:id/precedents',
      'GET /api/cases/:id/relationships',
      'POST /api/ai/case-analysis',
      'GET /api/law-mappings',
      'GET /api/law-mappings/:id',
      'GET /api/community/posts',
      'POST /api/community/posts',
      'GET /api/community/posts/:id/comments',
      'POST /api/community/posts/:id/comments',
      'POST /api/community/posts/:id/upvote'
    ]
  });
});

// Clean JSON error handler (no raw stack traces in responses)
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    message: err.message || 'Internal server error'
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.url}`,
    message: `Endpoint not found: ${req.method} ${req.url}`
  });
});

// Start listening & initialize PostgreSQL database
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`===================================================`);
    console.log(`⚖️  CaseIQ Legal Research API Server is running!`);
    console.log(`🚀 Listening on: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);

    // Automatically check / create database and tables
    await initDatabase();
  });
}

module.exports = app;
