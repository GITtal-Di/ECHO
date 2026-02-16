module.exports = (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // Handle OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Health check
    if (req.url === '/health') {
        return res.status(200).json({
            status: 'OK',
            message: 'Health check passed'
        });
    }

    // Root endpoint
    return res.status(200).json({
        name: 'ECHO Backend API',
        version: '1.0.0',
        status: 'running'
    });
};
