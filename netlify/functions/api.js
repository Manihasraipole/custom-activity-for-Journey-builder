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
    res.status(200).json({ status: 'ok' });
});

app.post('/publish', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.post('/stop', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

module.exports.handler = serverless(app); 