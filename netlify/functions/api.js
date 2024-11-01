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
        
        if (!endpointUrl) {
            throw new Error('External endpoint URL is required');
        }
        
        const dataToSend = {
            userEmail: inArguments.email,
            userName: inArguments.name,
            source: 'SFMC'
        };
        
        try {
            const response = await axios.post(endpointUrl, dataToSend);
            res.status(200).json({
                status: 'ok',
                message: 'Data successfully sent to external endpoint'
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Failed to send data to external endpoint'
            });
        }
    } catch (error) {
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