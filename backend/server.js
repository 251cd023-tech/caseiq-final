const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
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
const searchRoutes = require('./routes/searchRoutes');
const actsRoutes = require('./routes/actsRoutes');
const sectionsRoutes = require('./routes/sectionsRoutes');
const casesRoutes = require('./routes/casesRoutes');
const aiRoutes = require('./routes/aiRoutes');
const mappingRoutes = require('./routes/mappingRoutes');
const communityRoutes = require('./routes/communityRoutes');

// Mount API Endpoints
app.use('/api/auth', authRoutes);
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
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/search/legal',
      'GET /api/search/history',
      'GET /api/acts',
      'GET /api/acts/:id',
      'GET /api/sections/search?q=',
      'GET /api/sections/:id',
      'GET /api/cases',
      'GET /api/cases/:id',
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

// Fallback error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.url}`
  });
});

// Start listening
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`⚖️  CaseIQ Legal Research API Server is running!`);
    console.log(`🚀 Listening on: http://localhost:${PORT}`);
    console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===================================================`);
  });
}

module.exports = app;
