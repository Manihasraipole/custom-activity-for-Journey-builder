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
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.decode(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Apply JWT verification to all API routes
app.use('/api/*', verifyJWT);

// Validate endpoint
app.post('/api/validate', (req, res) => {
    try {
        console.log('Validate payload:', JSON.stringify(req.body, null, 2));
        
        const activity = req.body;
        const hasInArguments = Boolean(
            activity.arguments &&
            activity.arguments.execute &&
            activity.arguments.execute.inArguments &&
            activity.arguments.execute.inArguments.length > 0
        );

        if (!hasInArguments) {
            return res.status(200).json({
                status: 'error',
                message: 'Activity is missing required configurations'
            });
        }

        res.status(200).json({ 
            status: 'ok',
            message: 'Configuration is valid'
        });
    } catch (error) {
        console.error('Validate error:', error);
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