const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const config = require('./config/server.config');
const { initRedisClient, closeRedis } = require('./utils/redis.client');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: config.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000
});

// Initialize Redis (will continue with in-memory if Redis unavailable)
initRedisClient();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const analysisRoutes = require('./routes/analysis.routes');

// API Routes
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Import socket handlers
const socketHandler = require('./controllers/socket.controller');
socketHandler(io);

// Start server
server.listen(config.PORT, () => {
  console.log(`🚀 Server running on port ${config.PORT}`);
  console.log(`🔌 WebSocket server ready`);
  console.log(`💾 HYBRID: In-memory + Redis backup enabled`);
  console.log(`🤖 AI integration: HuggingFace Spaces (imagine-08-echo)`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await closeRedis();
  process.exit(0);
});

module.exports = { app, io };
