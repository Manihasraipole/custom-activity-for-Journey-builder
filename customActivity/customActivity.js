'use strict';

function initializeActivity() {
    let connection = new Postmonger.Session();
    let payload = {};
    let hasEndpoint = false;

    connection.trigger('ready');

    connection.on('initActivity', function(data) {
        if (data) {
            payload = data;
            
            // Load the saved configuration if it exists
            if (payload['arguments'] && 
                payload['arguments'].execute &&
                payload['arguments'].execute.inArguments &&
                payload['arguments'].execute.inArguments.length > 0) {
                
                const inArgs = payload['arguments'].execute.inArguments[0];
                
                // Restore saved values
                if (inArgs.endpointUrl) {
                    document.getElementById('endpointUrl').value = inArgs.endpointUrl;
                    hasEndpoint = true;
                }
                if (inArgs.headers) {
                    document.getElementById('headers').value = JSON.stringify(inArgs.headers, null, 2);
                }
                if (inArgs.bodyTemplate) {
                    document.getElementById('bodyTemplate').value = JSON.stringify(inArgs.bodyTemplate, null, 2);
                }
            }
        }
        
        connection.trigger('ready');
    });

    connection.on('clickedNext', function() {
        saveConfiguration();
    });

    function validateConfiguration() {
        const endpointUrl = document.getElementById('endpointUrl').value.trim();
        const headers = document.getElementById('headers').value.trim();
        const bodyTemplate = document.getElementById('bodyTemplate').value.trim();
        
        let isValid = true;
        let errorMessage = '';

        // Validate URL
        if (!endpointUrl) {
            isValid = false;
            errorMessage = 'Please provide an endpoint URL';
        }

        // Validate headers if provided
        if (headers) {
            try {
                JSON.parse(headers);
            } catch (e) {
                isValid = false;
                errorMessage = 'Invalid JSON format in headers';
            }
        }

        // Validate body template if provided
        if (bodyTemplate) {
            try {
                JSON.parse(bodyTemplate);
            } catch (e) {
                isValid = false;
                errorMessage = 'Invalid JSON format in body template';
            }
        }

        return { isValid, errorMessage };
    }

    function saveConfiguration() {
        const validation = validateConfiguration();
        
        if (!validation.isValid) {
            showError(validation.errorMessage);
            connection.trigger('ready');
            return;
        }

        const endpointUrl = document.getElementById('endpointUrl').value.trim();
        const headers = document.getElementById('headers').value.trim();
        const bodyTemplate = document.getElementById('bodyTemplate').value.trim();

        // Configure the payload
        payload['arguments'].execute.inArguments = [{
            "endpointUrl": endpointUrl,
            "headers": headers ? JSON.parse(headers) : {},
            "bodyTemplate": bodyTemplate ? JSON.parse(bodyTemplate) : {},
            "email": "{{Contact.Attribute.PreferredData.Email}}",
            "name": "{{Contact.Attribute.PreferredData.Name}}",
            "contactKey": "{{Contact.Key}}"
        }];

        // Set the activity as configured
        payload['metaData'].isConfigured = true;

        hasEndpoint = true;
        connection.trigger('updateActivity', payload);
    }

    // Handle requestedEndpoints event
    connection.on('requestedEndpoints', function() {
        if (hasEndpoint) {
            connection.trigger('requestedEndpoints', {
                endpoints: ['execute', 'save', 'publish', 'validate', 'stop']
            });
        }
    });
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActivity);
} else {
    initializeActivity();
}