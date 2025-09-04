# Far North IT Website

Professional IT support and managed services website for Cairns, Queensland.

## Features

- Modern, responsive website design
- Contact form with Microsoft Graph API email integration
- No popup authentication required for users

## Setup Instructions

### Prerequisites

1. Node.js installed on your system
2. Azure AD app with Microsoft Graph API permissions
3. Client Secret and Tenant ID from your Azure AD app

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   CLIENT_SECRET=your_client_secret_here
   TENANT_ID=your_tenant_id_here
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Azure AD Configuration

Make sure your Azure AD app has the following permissions:
- Microsoft Graph API: `Mail.Send` (Application permission)
- Microsoft Graph API: `User.Read` (Application permission)

## How It Works

1. Users fill out the contact form on the website
2. Form data is sent to the backend API (`/api/send-email`)
3. Backend authenticates with Microsoft Graph API using client credentials
4. Email is sent to `guy.corrigan@farnorthit.com.au` using the authenticated service account
5. User receives confirmation message

## Deployment

For production deployment, make sure to:
1. Set proper environment variables
2. Use HTTPS
3. Configure your hosting provider to run Node.js applications
4. Set up proper CORS settings if needed

## File Structure

```
├── index.html          # Main website page
├── css/
│   └── styles.css      # Website styles
├── js/
│   └── scripts.js      # Frontend JavaScript
├── assets/
│   └── images/         # Website images
├── server.js           # Express server with email API
├── package.json        # Node.js dependencies
└── README.md           # This file
```
