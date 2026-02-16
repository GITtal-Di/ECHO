let analysisService;
try {
    const { initRedisClient } = require('../utils/redis.client');
    initRedisClient();
    analysisService = require('../services/analysis.service');
} catch (e) {
    console.warn('Service warning:', e.message);
    analysisService = {
        analyzeMessage: () => Promise.resolve({ success: false, error: 'Service unavailable' }),
        fullAnalysis: () => Promise.resolve({ success: false, error: 'Service unavailable' }),
        parseSentiment: () => ({})
    };
}

const { analyzeMessage, fullAnalysis, parseSentiment } = analysisService;

// Parse JSON body helper
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
};

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

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
