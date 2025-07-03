const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(express.json());

// Helper function to get IP address
function getIPAddress(req) {
  // Check for forwarded headers (when behind proxy/load balancer)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  // Check for real IP header
  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }
  
  // Check for client IP from Netlify
  const clientIP = req.headers['client-ip'];
  if (clientIP) {
    return clientIP;
  }
  
  // Fallback to connection remote address
  return req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         req.ip || 
         '127.0.0.1';
}

// Helper function to get preferred language
function getPreferredLanguage(req) {
  const acceptLanguage = req.headers['accept-language'];
  if (!acceptLanguage) {
    return 'en-US';
  }
  
  // Parse Accept-Language header and return the first language
  const languages = acceptLanguage.split(',');
  const firstLanguage = languages[0].split(';')[0].trim();
  return firstLanguage;
}

// Helper function to get software information
function getSoftware(req) {
  const userAgent = req.headers['user-agent'];
  if (!userAgent) {
    return 'Unknown';
  }
  
  // Extract software information from User-Agent
  // This is a simplified version - in production you might want to use a proper User-Agent parser
  if (userAgent.includes('Chrome')) {
    return 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Safari')) {
    return 'Safari';
  } else if (userAgent.includes('Edge')) {
    return 'Edge';
  } else if (userAgent.includes('Opera')) {
    return 'Opera';
  } else {
    return userAgent.split(' ')[0] || 'Unknown';
  }
}

// API Routes
app.get('/whoami', (req, res) => {
  try {
    const response = {
      ipaddress: getIPAddress(req),
      language: getPreferredLanguage(req),
      software: getSoftware(req)
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error in /whoami:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Export the serverless function
module.exports.handler = serverless(app); 