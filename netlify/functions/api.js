const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Validate endpoint
app.post('/api/validate', (req, res) => {
    console.log('Validate payload:', JSON.stringify(req.body, null, 2));
    res.status(200).json({
        valid: true
    });
});

// Execute endpoint
app.post('/api/execute', async (req, res) => {
    try {
        console.log('Execute payload:', JSON.stringify(req.body, null, 2));
        res.status(200).json({
            status: 'ok'
        });
    } catch (error) {
        console.error('Execute error:', error);
        res.status(200).json({
            status: 'error',
            message: error.message
        });
    }
});

// Save endpoint
app.post('/api/save', (req, res) => {
    console.log('Save payload:', JSON.stringify(req.body, null, 2));
    res.status(200).json({
        status: 'ok'
    });
});

// Publish endpoint
app.post('/api/publish', (req, res) => {
    console.log('Publish payload:', JSON.stringify(req.body, null, 2));
    res.status(200).json({
        status: 'ok'
    });
});

// Stop endpoint
app.post('/api/stop', (req, res) => {
    console.log('Stop payload:', JSON.stringify(req.body, null, 2));
    res.status(200).json({
        status: 'ok'
    });
});

exports.handler = serverless(app);