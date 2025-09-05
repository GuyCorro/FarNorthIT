// netlify/functions/send-email.js
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
const { ClientSecretCredential } = require('@azure/identity');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { name, contact, time, message } = JSON.parse(event.body);
        
        if (!name || !contact || !time || !message) {
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({ 
                    success: false, 
                    error: 'All fields are required' 
                })
            };
        }

        // Microsoft Graph API Configuration
        const clientId = '7b7e6993-f7bd-4d04-b0c4-70f125a9f813';
        const clientSecret = process.env.CLIENT_SECRET;
        const tenantId = process.env.TENANT_ID;

        if (!clientSecret || !tenantId) {
            throw new Error('Environment variables not set');
        }

        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
        const authProvider = new TokenCredentialAuthenticationProvider(credential, {
            scopes: ['https://graph.microsoft.com/.default']
        });
        
        const graphClient = Client.initWithMiddleware({
            authProvider: authProvider
        });
        
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
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({ 
                success: false, 
                error: 'Failed to send email: ' + error.message
            })
        };
    }
};
