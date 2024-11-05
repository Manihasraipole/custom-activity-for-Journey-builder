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
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

// Execute endpoint
app.post('/api/execute', async (req, res) => {
    try {
        console.log('Execute payload:', JSON.stringify(req.body, null, 2));
        
        // Extract activity instance
        const activity = req.body.inArguments ? req.body.inArguments[0] : {};
        
        // Log the received data
        console.log('Activity data:', {
            email: activity.email,
            name: activity.name,
            contactKey: activity.contactKey
        });

        // Send success response
        res.status(200).json({
            status: 'ok',
            message: 'Activity executed successfully'
        });
    } catch (error) {
        console.error('Execute error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to execute activity'
        });
    }
});

// Save endpoint
app.post('/api/save', (req, res) => {
    try {
        console.log('Save payload:', JSON.stringify(req.body, null, 2));
        res.status(200).json({ 
            status: 'ok',
            message: 'Configuration saved successfully'
        });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to save configuration'
        });
    }
});

// Publish endpoint
app.post('/api/publish', (req, res) => {
    try {
        console.log('Publish payload:', JSON.stringify(req.body, null, 2));
        res.status(200).json({ 
            status: 'ok',
            message: 'Activity published successfully'
        });
    } catch (error) {
        console.error('Publish error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to publish activity'
        });
    }
});

// Validate endpoint
app.post('/api/validate', (req, res) => {
    try {
        console.log('Validate payload:', JSON.stringify(req.body, null, 2));
        res.status(200).json({ 
            status: 'ok',
            message: 'Configuration is valid'
        });
    } catch (error) {
        console.error('Validate error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to validate configuration'
        });
    }
});

// Stop endpoint
app.post('/api/stop', (req, res) => {
    try {
        console.log('Stop payload:', JSON.stringify(req.body, null, 2));
        res.status(200).json({ 
            status: 'ok',
            message: 'Activity stopped successfully'
        });
    } catch (error) {
        console.error('Stop error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Failed to stop activity'
        });
    }
});

// Export the serverless function
exports.handler = serverless(app); 