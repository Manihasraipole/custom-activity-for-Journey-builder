const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../customActivity')));

app.use((req, res, next) => {
    console.log(`Request path: ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(path.join(__dirname, '../customActivity/index.html'));
});

app.use((req, res) => {
    console.log(`404 - Not Found: ${req.path}`);
    res.status(404).sendFile(path.join(__dirname, '../customActivity/404.html'));
});

// Handle execute endpoint
app.post('/execute', async (req, res) => {
    try {
        console.log('Received data from Journey Builder:', req.body);
        
        // Extract data from the inArguments
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
        
        console.log('Sending data to external endpoint:', endpointUrl, dataToSend);

        try {
            const response = await axios.post(endpointUrl, dataToSend);
            console.log('External endpoint response:', response.data);
            
            res.status(200).json({
                status: 'ok',
                message: 'Data successfully sent to external endpoint'
            });
        } catch (error) {
            console.error('Error sending to external endpoint:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to send data to external endpoint'
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

// Improved save endpoint
app.post('/save', (req, res) => {
    console.log('Save payload:', req.body);
    
    // Validate that we have the required configuration
    if (!req.body.arguments || 
        !req.body.arguments.execute || 
        !req.body.arguments.execute.inArguments || 
        !req.body.arguments.execute.inArguments[0].endpointUrl) {
        
        return res.status(400).json({
            status: 'error',
            message: 'Endpoint URL is required for configuration'
        });
    }
    
    res.status(200).json({ status: 'ok' });
});

// Improved validate endpoint
app.post('/validate', (req, res) => {
    console.log('Validate payload:', req.body);
    
    // Check if we have all required configurations
    if (!req.body.arguments || 
        !req.body.arguments.execute || 
        !req.body.arguments.execute.inArguments || 
        !req.body.arguments.execute.inArguments[0].endpointUrl) {
        
        return res.status(400).json({
            status: 'error',
            message: 'Activity is not configured properly. Please provide an endpoint URL.'
        });
    }
    
    res.status(200).json({ status: 'ok' });
});

app.post('/publish', (req, res) => {
    console.log('Publish payload:', req.body);
    res.status(200).json({ status: 'ok' });
});

app.post('/stop', (req, res) => {
    console.log('Stop payload:', req.body);
    res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 