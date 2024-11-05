const express = require('express');
const serverless = require('serverless-http');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Execute endpoint
app.post('/api/execute', async (req, res) => {
    try {
        console.log('Execute payload:', req.body);
        
        // Here you would typically process the inArguments
        const inArguments = req.body.inArguments[0];
        
        // Log the received data
        console.log('Received data:', {
            email: inArguments.email,
            name: inArguments.name,
            contactKey: inArguments.contactKey
        });

        // Send success response
        res.status(200).json({
            status: 'ok',
            message: 'Data received successfully'
        });
    } catch (error) {
        console.error('Execute error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// Save endpoint
app.post('/api/save', (req, res) => {
    console.log('Save payload:', req.body);
    res.status(200).json({ status: 'ok' });
});

// Publish endpoint
app.post('/api/publish', (req, res) => {
    console.log('Publish payload:', req.body);
    res.status(200).json({ status: 'ok' });
});

// Validate endpoint
app.post('/api/validate', (req, res) => {
    console.log('Validate payload:', req.body);
    res.status(200).json({ status: 'ok' });
});

// Stop endpoint
app.post('/api/stop', (req, res) => {
    console.log('Stop payload:', req.body);
    res.status(200).json({ status: 'ok' });
});

// Export the serverless function
exports.handler = serverless(app); 