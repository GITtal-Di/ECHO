// Server Configuration
module.exports = {
  PORT: process.env.PORT || 5000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // AI Integration Endpoints (to be implemented by teammate)
  AI_SERVICE: {
    BASE_URL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
    ENDPOINTS: {
      ANALYZE_START: '/api/analysis/start',
      ANALYZE_MESSAGE: '/api/analysis/message',
      ANALYZE_END: '/api/analysis/end',
      MODERATION: '/api/moderation/check'
    }
  }
};
