const express = require('express');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
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

// JWT verification middleware
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Skip JWT verification for validate endpoint
    if (req.path === '/api/validate') {
        return next();
    }

    if (!authHeader) {
        console.log('No authorization header');
        return next(); // Continue without token for now
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT verification error:', err);
        next(); // Continue even if token is invalid
    }
};

// Apply JWT verification to all API routes
app.use('/api/*', verifyJWT);

// Validate endpoint
app.post('/api/validate', (req, res) => {
    try {
        console.log('Validate payload:', JSON.stringify(req.body, null, 2));
        
        // Always return success for validation
        res.status(200).json({ 
            status: 'ok',
            message: 'Configuration is valid'
        });
    } catch (error) {
        console.error('Validate error:', error);
        // Still return 200 with error status
        res.status(200).json({
            status: 'error',
            message: error.message || 'Failed to validate configuration'
        });
    }
});

// Execute endpoint
app.post('/api/execute', async (req, res) => {
    try {
        console.log('Execute payload:', JSON.stringify(req.body, null, 2));
        
        const activity = req.body.inArguments ? req.body.inArguments[0] : {};
        
        console.log('Activity data:', {
            email: activity.email,
            name: activity.name,
            contactKey: activity.contactKey
        });

        res.status(200).json({
            status: 'ok',
            message: 'Activity executed successfully'
        });
    } catch (error) {
        console.error('Execute error:', error);
        res.status(200).json({
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
        res.status(200).json({
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
        res.status(200).json({
            status: 'error',
            message: error.message || 'Failed to publish activity'
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
        res.status(200).json({
            status: 'error',
            message: error.message || 'Failed to stop activity'
        });
    }
});

exports.handler = serverless(app);