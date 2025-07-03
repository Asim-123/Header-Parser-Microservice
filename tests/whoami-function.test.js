const { handler } = require('../netlify/functions/whoami');

describe('Netlify Whoami Function', () => {
  it('should return a JSON object with ipaddress key', async () => {
    const event = {
      httpMethod: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'x-forwarded-for': '192.168.1.100'
      }
    };

    const result = await handler(event, {});
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body).toHaveProperty('ipaddress');
    expect(typeof body.ipaddress).toBe('string');
    expect(body.ipaddress).toBe('192.168.1.100');
  });

  it('should return a JSON object with language key', async () => {
    const event = {
      httpMethod: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8'
      }
    };

    const result = await handler(event, {});
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body).toHaveProperty('language');
    expect(typeof body.language).toBe('string');
    expect(body.language).toBe('en-US');
  });

  it('should return a JSON object with software key', async () => {
    const event = {
      httpMethod: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8'
      }
    };

    const result = await handler(event, {});
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body).toHaveProperty('software');
    expect(typeof body.software).toBe('string');
    expect(body.software).toBe('Chrome');
  });

  it('should return all required fields in the response', async () => {
    const event = {
      httpMethod: 'GET',
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'x-forwarded-for': '192.168.1.100'
      }
    };

    const result = await handler(event, {});
    const body = JSON.parse(result.body);

    expect(result.statusCode).toBe(200);
    expect(body).toEqual({
      ipaddress: expect.any(String),
      language: expect.any(String),
      software: expect.any(String)
    });
  });

  it('should handle OPTIONS request for CORS', async () => {
    const event = {
      httpMethod: 'OPTIONS',
      headers: {}
    };

    const result = await handler(event, {});

    expect(result.statusCode).toBe(200);
    expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(result.body).toBe('');
  });
}); 