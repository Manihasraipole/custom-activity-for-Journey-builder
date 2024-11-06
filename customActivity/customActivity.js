'use strict';

function initializeActivity() {
    let connection = new Postmonger.Session();
    let payload = {};
    let hasEndpoint = false;
    let initialized = false;

    // Show loading state
    showLoading(true);

    // Only trigger ready once
    connection.trigger('ready');

    // Set a shorter timeout for initialization
    const initTimeout = setTimeout(() => {
        if (!initialized) {
            console.log('Initialization timeout - retrying...');
            connection.trigger('ready');
            
            // Set a final timeout
            setTimeout(() => {
                if (!initialized) {
                    showError('Connection timeout. Please refresh the page.');
                    showLoading(false);
                }
            }, 5000);
        }
    }, 5000);

    connection.on('initActivity', function(data) {
        console.log('initActivity triggered with data:', data);
        initialized = true;
        clearTimeout(initTimeout);
        showLoading(false);

        if (data) {
            payload = data;
        }

        // Initialize default payload if empty
        payload = payload || {};
        payload['arguments'] = payload['arguments'] || {};
        payload['arguments'].execute = payload['arguments'].execute || {};
        payload['arguments'].execute.inArguments = payload['arguments'].execute.inArguments || [{}];
        payload['metaData'] = payload['metaData'] || {};
        payload['metaData'].isConfigured = true;

        // Set default values if none exist
        const defaultValues = {
            endpointUrl: '',
            headers: '{\n    "Content-Type": "application/json"\n}',
            bodyTemplate: '{\n    "email": "{{Contact.Attribute.PreferredData.Email}}",\n    "name": "{{Contact.Attribute.PreferredData.Name}}"\n}'
        };

        // Try to load saved values
        try {
            const inArgs = payload['arguments'].execute.inArguments[0];
            
            document.getElementById('endpointUrl').value = inArgs.endpointUrl || defaultValues.endpointUrl;
            document.getElementById('headers').value = inArgs.headers ? 
                JSON.stringify(inArgs.headers, null, 4) : defaultValues.headers;
            document.getElementById('bodyTemplate').value = inArgs.bodyTemplate ? 
                JSON.stringify(inArgs.bodyTemplate, null, 4) : defaultValues.bodyTemplate;
            
            hasEndpoint = !!inArgs.endpointUrl;
        } catch (e) {
            console.error('Error loading saved values:', e);
            // Set default values if there's an error
            document.getElementById('endpointUrl').value = defaultValues.endpointUrl;
            document.getElementById('headers').value = defaultValues.headers;
            document.getElementById('bodyTemplate').value = defaultValues.bodyTemplate;
        }

        // Enable the save button
        document.getElementById('saveEndpoint').disabled = false;

        // Validate saved endpoint
        if (data && data.arguments && data.arguments.execute.inArguments) {
            const inArgs = data.arguments.execute.inArguments[0];
            if (!inArgs || !inArgs.endpointUrl) {
                payload['metaData'].isConfigured = false;
                showError('No valid endpoint configured');
            }
        }
    });

    // Remove the duplicate ready trigger from the click handler
    document.getElementById('saveEndpoint').addEventListener('click', function() {
        saveConfiguration();
    });

    connection.on('clickedNext', function() {
        saveConfiguration();
    });

    function saveConfiguration() {
        const endpointUrl = document.getElementById('endpointUrl').value.trim();
        const headers = document.getElementById('headers').value.trim();
        const bodyTemplate = document.getElementById('bodyTemplate').value.trim();

        // Add validation for endpoint URL
        if (!endpointUrl) {
            showError('Endpoint URL is required');
            return;
        }

        try {
            // Validate URL format
            new URL(endpointUrl);
            
            // Validate JSON formats
            const headerObj = headers ? JSON.parse(headers) : {};
            const bodyObj = bodyTemplate ? JSON.parse(bodyTemplate) : {};

            // Update the payload with validated data
            payload['arguments'].execute.inArguments = [{
                "endpointUrl": endpointUrl,
                "headers": headerObj,
                "bodyTemplate": bodyObj,
                "email": "{{Contact.Attribute.PreferredData.Email}}",
                "name": "{{Contact.Attribute.PreferredData.Name}}",
                "contactKey": "{{Contact.Key}}"
            }];

            // Ensure the payload has required properties
            payload['metaData'] = payload['metaData'] || {};
            payload['metaData'].isConfigured = true;

            // Add validation status
            payload['isValid'] = true;
            
            console.log('Saving validated configuration:', payload);
            connection.trigger('updateActivity', payload);
            
            showSuccess('Configuration saved and validated successfully!');
        } catch (e) {
            console.error('Validation error:', e);
            if (e instanceof TypeError) {
                showError('Invalid endpoint URL format');
            } else {
                showError('Invalid JSON format in headers or body template');
            }
            payload['isValid'] = false;
            connection.trigger('updateActivity', payload);
        }
    }
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
    console.error(message);
}

function showSuccess(message) {
    const successDiv = document.getElementById('saveSuccess');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
    console.log(message);
}

function showLoading(show) {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.style.display = show ? 'flex' : 'none';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActivity);
} else {
    initializeActivity();
}