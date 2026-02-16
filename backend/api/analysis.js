const { initRedisClient } = require('../utils/redis.client');
const {
  analyzeMessage,
  fullAnalysis,
  parseSentiment
} = require('../services/analysis.service');

// Initialize Redis once
initRedisClient();

// CORS configuration
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://echo-y3zi.vercel.app';
const allowedOrigins = Array.isArray(CORS_ORIGIN)
  ? CORS_ORIGIN
  : CORS_ORIGIN.split(',').map(origin => origin.trim());

// Helper to set CORS headers
const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin || '';
  if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
};

// Helper to parse JSON body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const body = await parseBody(req);

    // Route: POST /api/analysis/analyze
    if (req.method === 'POST' && req.url.includes('analyze') && !req.url.includes('start')) {
      const { text } = body;
      if (!text) {
        return res.status(400).json({ error: 'Text field is required' });
      }
      const result = await analyzeMessage(text);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).end(JSON.stringify(result));
    }

    // Route: POST /api/analysis/full
    if (req.method === 'POST' && req.url.includes('full')) {
      const { text } = body;
      if (!text) {
        return res.status(400).json({ error: 'Text field is required' });
      }
      const result = await fullAnalysis(text);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).end(JSON.stringify(result));
    }

    // Route: POST /api/analysis/start
    if (req.method === 'POST' && req.url.includes('start')) {
      const { sessionId, userId1, userId2, timestamp } = body;
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).end(JSON.stringify({
        success: true,
        sessionId,
        analysisStarted: true
      }));
    }

    // Route: POST /api/analysis/sentiment
    if (req.method === 'POST' && req.url.includes('sentiment')) {
      const { text } = body;
      if (!text) {
        return res.status(400).json({ error: 'Text field is required' });
      }
      const analysis = await analyzeMessage(text);
      const sentiment = parseSentiment(analysis.analysis);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).end(JSON.stringify({ sentiment, rawAnalysis: analysis.analysis }));
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(404).end(JSON.stringify({ error: 'Route not found' }));
  } catch (error) {
    console.error('❌ Analysis API Error:', error.message);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).end(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }));
  }
};
