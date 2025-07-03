exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Helper function to get IP address
    function getIPAddress(headers) {
      // Check for forwarded headers (when behind proxy/load balancer)
      const forwarded = headers['x-forwarded-for'];
      if (forwarded) {
        return forwarded.split(',')[0].trim();
      }
      
      // Check for real IP header
      const realIP = headers['x-real-ip'];
      if (realIP) {
        return realIP;
      }
      
      // Check for client IP from Netlify
      const clientIP = headers['client-ip'];
      if (clientIP) {
        return clientIP;
      }
      
      // Check for Netlify's client IP header
      const netlifyIP = headers['x-nf-client-connection-ip'];
      if (netlifyIP) {
        return netlifyIP;
      }
      
      // Fallback
      return '127.0.0.1';
    }

    // Helper function to get preferred language
    function getPreferredLanguage(headers) {
      const acceptLanguage = headers['accept-language'];
      if (!acceptLanguage) {
        return 'en-US';
      }
      
      // Parse Accept-Language header and return the first language
      const languages = acceptLanguage.split(',');
      const firstLanguage = languages[0].split(';')[0].trim();
      return firstLanguage;
    }

    // Helper function to get software information
    function getSoftware(headers) {
      const userAgent = headers['user-agent'];
      if (!userAgent) {
        return 'Unknown';
      }
      
      // Extract software information from User-Agent
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
        const firstPart = userAgent.split(' ')[0];
        // Remove version numbers and return just the software name
        return firstPart.split('/')[0] || 'Unknown';
      }
    }

    // Get the response data
    const response = {
      ipaddress: getIPAddress(event.headers),
      language: getPreferredLanguage(event.headers),
      software: getSoftware(event.headers)
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 