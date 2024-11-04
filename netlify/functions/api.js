exports.handler = async function(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    const path = event.path.split('/').pop();

    try {
        switch (path) {
            case 'validate':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            case 'publish':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            case 'save':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            case 'execute':
                const data = JSON.parse(event.body);
                // Log the incoming data
                console.log('Execute data:', data);
                
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            case 'stop':
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({ success: true })
                };

            default:
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'Not Found' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
}; 