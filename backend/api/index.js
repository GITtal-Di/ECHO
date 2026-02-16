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

module.exports = (req, res) => {
  // Set CORS headers
  setCorsHeaders(req, res);

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.setHeader('Content-Type', 'application/json');

  // Health check
  if (req.url === '/health') {
    return res.status(200).end(JSON.stringify({
      status: 'OK',
      message: 'Server is running',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    }));
  }

  // Root endpoint
  if (req.url === '/' || req.url === '') {
    return res.status(200).end(JSON.stringify({
      name: 'ECHO Backend API',
      version: '1.0.0',
      status: 'running',
      environment: process.env.NODE_ENV || 'production'
    }));
  }

  return res.status(404).end(JSON.stringify({ error: 'Route not found' }));
};
