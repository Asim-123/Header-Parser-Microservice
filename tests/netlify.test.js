const request = require('supertest');
const { handler } = require('../netlify/functions/api');

// Mock the serverless-http handler
const app = require('express')();
app.use('/.netlify/functions/api', (req, res, next) => {
  // Simulate the Netlify function environment
  req.url = req.url.replace('/.netlify/functions/api', '');
  handler(req, res, next);
});

describe('Netlify Serverless Function', () => {
  describe('GET /.netlify/functions/api/whoami', () => {
    it('should return a JSON object with ipaddress key', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('ipaddress');
      expect(typeof response.body.ipaddress).toBe('string');
      expect(response.body.ipaddress).toBeTruthy();
    });

    it('should return a JSON object with language key', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('language');
      expect(typeof response.body.language).toBe('string');
      expect(response.body.language).toBeTruthy();
    });

    it('should return a JSON object with software key', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('software');
      expect(typeof response.body.software).toBe('string');
      expect(response.body.software).toBeTruthy();
    });

    it('should return all required fields in the response', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .expect(200);

      expect(response.body).toEqual({
        ipaddress: expect.any(String),
        language: expect.any(String),
        software: expect.any(String)
      });
    });

    it('should handle x-forwarded-for header correctly', async () => {
      const testIP = '192.168.1.100';
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .set('X-Forwarded-For', testIP)
        .expect(200);

      expect(response.body.ipaddress).toBe(testIP);
    });

    it('should handle client-ip header from Netlify', async () => {
      const testIP = '10.0.0.1';
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .set('Client-IP', testIP)
        .expect(200);

      expect(response.body.ipaddress).toBe(testIP);
    });

    it('should parse Accept-Language header correctly', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .set('Accept-Language', 'en-US,en;q=0.9,es;q=0.8')
        .expect(200);

      expect(response.body.language).toBe('en-US');
    });

    it('should parse User-Agent header for Chrome', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .set('User-Agent', userAgent)
        .expect(200);

      expect(response.body.software).toBe('Chrome');
    });

    it('should handle missing Accept-Language header', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .unset('Accept-Language')
        .expect(200);

      expect(response.body.language).toBe('en-US');
    });

    it('should handle missing User-Agent header', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/whoami')
        .unset('User-Agent')
        .expect(200);

      expect(response.body.software).toBe('Unknown');
    });
  });

  describe('Health check endpoint', () => {
    it('should provide health check endpoint', async () => {
      const response = await request(app)
        .get('/.netlify/functions/api/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
}); 