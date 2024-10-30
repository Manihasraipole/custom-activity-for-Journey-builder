'use strict';

let connection = new Postmonger.Session();
let payload = {};
let hasEndpoint = false;

connection.trigger('ready');

connection.on('initActivity', function(data) {
    if (data) {
        payload = data;
        
        // Load the saved endpoint URL if it exists
        if (payload['arguments'] && 
            payload['arguments'].execute.inArguments.length > 0 && 
            payload['arguments'].execute.inArguments[0].endpointUrl) {
            
            document.getElementById('endpointUrl').value = 
                payload['arguments'].execute.inArguments[0].endpointUrl;
            hasEndpoint = true;
        }
    }
    
    // Notify Journey Builder about the activity's readiness
    connection.trigger('ready');
});

connection.on('clickedNext', function() {
    const endpointUrl = document.getElementById('endpointUrl').value;
    
    if (!endpointUrl) {
        // Show error to user
        alert('Please provide an endpoint URL');
        connection.trigger('ready');
        return;
    }
    
    // Configure the payload with the data fields and endpoint URL
    payload['arguments'].execute.inArguments = [{
        "email": "{{Contact.Attribute.PreferredData.Email}}",
        "name": "{{Contact.Attribute.PreferredData.Name}}",
        "endpointUrl": endpointUrl
    }];
    
    hasEndpoint = true;
    connection.trigger('updateActivity', payload);
});

// Handle requestedEndpoints event
connection.on('requestedEndpoints', function() {
    // Return only configured endpoints
    if (hasEndpoint) {
        connection.trigger('requestedEndpoints', {
            endpoints: [
                'execute',
                'save',
                'publish',
                'validate',
                'stop'
            ]
        });
    }
});