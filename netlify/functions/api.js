const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Handle execute endpoint
app.post('/execute', async (req, res) => {
    try {
        console.log('Received data from Journey Builder:', req.body);
        
        const inArguments = req.body.inArguments[0];
        const endpointUrl = inArguments.endpointUrl;
        const headers = inArguments.headers || {};
        const bodyTemplate = inArguments.bodyTemplate || {};
        
        if (!endpointUrl) {
            throw new Error('External endpoint URL is required');
        }
        
        // Replace placeholders in body template with actual values
        const processedBody = JSON.parse(
            JSON.stringify(bodyTemplate).replace(
                /{{Contact\.Attribute\.PreferredData\.Email}}/g,
                inArguments.email
            ).replace(
                /{{Contact\.Attribute\.PreferredData\.Name}}/g,
                inArguments.name
            )
        );
        
        try {
            const response = await axios({
                method: 'post',
                url: endpointUrl,
                headers: headers,
                data: processedBody
            });
            
            console.log('External endpoint response:', response.data);
            res.status(200).json({
                status: 'ok',
                message: 'Data successfully sent to external endpoint'
            });
        } catch (error) {
            console.error('Error sending to external endpoint:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to send data to external endpoint',
                details: error.message
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Internal server error'
        });
    }
});

// Other endpoints
app.post('/save', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/validate', (req, res) => {
    console.log('Validate payload:', req.body);
    
    try {
        // Check if we have all required configurations
        const inArguments = req.body.inArguments || 
            (req.body.arguments && req.body.arguments.execute && req.body.arguments.execute.inArguments);

        if (!inArguments || !inArguments.length || !inArguments[0].endpointUrl) {
            return res.status(400).json({
                status: 'error',
                message: 'Endpoint URL is required for configuration'
            });
        }

        // Validate endpoint URL format
        try {
            new URL(inArguments[0].endpointUrl);
        } catch (e) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid endpoint URL format'
            });
        }

        // If headers are provided, validate JSON format
        if (inArguments[0].headers) {
            try {
                if (typeof inArguments[0].headers !== 'object') {
                    throw new Error('Headers must be an object');
                }
            } catch (e) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid headers format'
                });
            }
        }

        // If body template is provided, validate JSON format
        if (inArguments[0].bodyTemplate) {
            try {
                if (typeof inArguments[0].bodyTemplate !== 'object') {
                    throw new Error('Body template must be an object');
                }
            } catch (e) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Invalid body template format'
                });
            }
        }

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Validation failed'
        });
    }
});

app.post('/publish', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/stop', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

module.exports.handler = serverless(app); 