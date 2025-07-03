const request = require('supertest');
const app = require('../server');

describe('Header Parser Microservice', () => {
  describe('GET /api/whoami', () => {
    it('should return a JSON object with ipaddress key', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('ipaddress');
      expect(typeof response.body.ipaddress).toBe('string');
      expect(response.body.ipaddress).toBeTruthy();
    });

    it('should return a JSON object with language key', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('language');
      expect(typeof response.body.language).toBe('string');
      expect(response.body.language).toBeTruthy();
    });

    it('should return a JSON object with software key', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('software');
      expect(typeof response.body.software).toBe('string');
      expect(response.body.software).toBeTruthy();
    });

    it('should return all required fields in the response', async () => {
      const response = await request(app)
        .get('/api/whoami')
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
        .get('/api/whoami')
        .set('X-Forwarded-For', testIP)
        .expect(200);

      expect(response.body.ipaddress).toBe(testIP);
    });

    it('should handle x-real-ip header correctly', async () => {
      const testIP = '10.0.0.1';
      const response = await request(app)
        .get('/api/whoami')
        .set('X-Real-IP', testIP)
        .expect(200);

      expect(response.body.ipaddress).toBe(testIP);
    });

    it('should parse Accept-Language header correctly', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .set('Accept-Language', 'en-US,en;q=0.9,es;q=0.8')
        .expect(200);

      expect(response.body.language).toBe('en-US');
    });

    it('should parse User-Agent header for Chrome', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      const response = await request(app)
        .get('/api/whoami')
        .set('User-Agent', userAgent)
        .expect(200);

      expect(response.body.software).toBe('Chrome');
    });

    it('should parse User-Agent header for Firefox', async () => {
      const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0';
      const response = await request(app)
        .get('/api/whoami')
        .set('User-Agent', userAgent)
        .expect(200);

      expect(response.body.software).toBe('Firefox');
    });

    it('should parse User-Agent header for Safari', async () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15';
      const response = await request(app)
        .get('/api/whoami')
        .set('User-Agent', userAgent)
        .expect(200);

      expect(response.body.software).toBe('Safari');
    });

    it('should handle missing Accept-Language header', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .unset('Accept-Language')
        .expect(200);

      expect(response.body.language).toBe('en-US');
    });

    it('should handle missing User-Agent header', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .unset('User-Agent')
        .expect(200);

      expect(response.body.software).toBe('Unknown');
    });

    it('should handle complex Accept-Language header', async () => {
      const response = await request(app)
        .get('/api/whoami')
        .set('Accept-Language', 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7')
        .expect(200);

      expect(response.body.language).toBe('fr-FR');
    });

    it('should handle unknown User-Agent', async () => {
      const userAgent = 'CustomBot/1.0';
      const response = await request(app)
        .get('/api/whoami')
        .set('User-Agent', userAgent)
        .expect(200);

      expect(response.body.software).toBe('CustomBot');
    });
  });

  describe('Other endpoints', () => {
    it('should serve the main page', async () => {
      const response = await request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', /html/);

      expect(response.text).toContain('Header Parser Microservice');
    });

    it('should provide health check endpoint', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 404 for unknown routes', async () => {
      await request(app)
        .get('/unknown')
        .expect(404)
        .expect('Content-Type', /json/);
    });
  });

  describe('Error handling', () => {
    it('should handle malformed requests gracefully', async () => {
      // This test ensures the server doesn't crash on malformed requests
      const response = await request(app)
        .get('/api/whoami')
        .set('X-Forwarded-For', 'invalid-ip-format')
        .expect(200);

      // Should still return a response even with invalid IP format
      expect(response.body).toHaveProperty('ipaddress');
      expect(response.body).toHaveProperty('language');
      expect(response.body).toHaveProperty('software');
    });
  });
}); 