const express = require('express');
const cors = require('cors');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const { ClientSecretCredential } = require('@azure/identity');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Microsoft Graph API Configuration
const clientId = '7b7e6993-f7bd-4d04-b0c4-70f125a9f813';
const clientSecret = process.env.CLIENT_SECRET; // Set this as environment variable
const tenantId = process.env.TENANT_ID; // Set this as environment variable

// Debug: Check if environment variables are set
console.log('Environment check:');
console.log('CLIENT_SECRET:', clientSecret ? 'Set' : 'Not set');
console.log('TENANT_ID:', tenantId ? 'Set' : 'Not set');

// Initialize Microsoft Graph client
function getGraphClient() {
    if (!clientSecret || !tenantId) {
        throw new Error('CLIENT_SECRET and TENANT_ID environment variables must be set');
    }
    
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
        scopes: ['https://graph.microsoft.com/.default']
    });
    
    return Client.initWithMiddleware({
        authProvider: authProvider
    });
}

// API endpoint to send email
app.post('/api/send-email', async (req, res) => {
    console.log('Received email request:', req.body);
    
    try {
        const { name, contact, time, message } = req.body;
        
        if (!name || !contact || !time || !message) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                success: false, 
                error: 'All fields are required' 
            });
        }

        console.log('Attempting to send email...');
        const graphClient = getGraphClient();
        
        const emailBody = {
            message: {
                subject: `New Contact Form Submission from ${name}`,
                body: {
                    contentType: 'HTML',
                    content: `
                        <h2>New Contact Form Submission</h2>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Contact:</strong> ${contact}</p>
                        <p><strong>Best Time to Contact:</strong> ${time}</p>
                        <p><strong>Message:</strong></p>
                        <p>${message}</p>
                        <hr>
                        <p><em>This message was sent from the Far North IT website contact form.</em></p>
                    `
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: 'guy.corrigan@farnorthit.com.au'
                        }
                    }
                ]
            }
        };

        await graphClient.api('/me/sendMail').post(emailBody);
        console.log('Email sent successfully');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email: ' + error.message
        });
    }
});

// Test endpoint to check if server is running
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test the server: http://localhost:${PORT}/api/test`);
});
