# Header Parser Microservice

A full-stack JavaScript application that parses HTTP request headers and returns information about the client's IP address, preferred language, and software.

## Features

- **IP Address Detection**: Extracts client IP from various headers (X-Forwarded-For, X-Real-IP, etc.)
- **Language Detection**: Parses Accept-Language header to determine preferred language
- **Software Detection**: Analyzes User-Agent header to identify browser/software
- **Modern UI**: Clean, responsive frontend for testing the API
- **Comprehensive Testing**: Full test suite with Jest and Supertest
- **CORS Support**: Cross-origin resource sharing enabled

## API Endpoints

### GET /api/whoami

Returns a JSON object containing:
- `ipaddress`: The client's IP address
- `language`: The client's preferred language
- `software`: The client's browser/software

#### Example Response

```json
{
  "ipaddress": "192.168.1.100",
  "language": "en-US",
  "software": "Chrome"
}
```

#### Example Usage

```bash
# cURL
curl https://your-domain.com/api/whoami

# JavaScript
fetch('/api/whoami')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Header-Parser-Microservice
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run the test suite
- `npm test -- --coverage` - Run tests with coverage report

## Project Structure

```
Header-Parser-Microservice/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── jest.config.js         # Jest configuration
├── tests/
│   └── server.test.js     # Test suite
├── public/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # CSS styles
│   └── script.js          # Frontend JavaScript
└── README.md              # This file
```

## How It Works

### IP Address Detection

The service checks for IP addresses in the following order:
1. `X-Forwarded-For` header (for requests behind proxies)
2. `X-Real-IP` header
3. Connection remote address
4. Fallback to localhost

### Language Detection

Parses the `Accept-Language` header and returns the first preferred language:
- `Accept-Language: en-US,en;q=0.9,es;q=0.8` → `en-US`
- `Accept-Language: fr-FR,fr;q=0.9` → `fr-FR`

### Software Detection

Analyzes the `User-Agent` header to identify the browser:
- Chrome, Firefox, Safari, Edge, Opera
- Falls back to the first word of the User-Agent string
- Returns "Unknown" if no User-Agent is provided

## Testing

The application includes comprehensive tests that verify:

- ✅ Returns JSON object with `ipaddress` key
- ✅ Returns JSON object with `language` key  
- ✅ Returns JSON object with `software` key
- ✅ Handles various header combinations
- ✅ Graceful error handling
- ✅ Edge cases and missing headers

Run the tests:
```bash
npm test
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3000)

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Testing**: Jest, Supertest
- **Development**: Nodemon

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

MIT License - see LICENSE file for details 