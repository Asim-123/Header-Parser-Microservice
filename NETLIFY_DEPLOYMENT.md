# Netlify Deployment Guide

This guide will help you deploy your Header Parser Microservice to Netlify.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- A Netlify account (free tier available)
- Your project pushed to a Git repository

## Deployment Steps

### 1. Prepare Your Repository

Make sure your project is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository

### 3. Configure Build Settings

In the deploy settings, configure:

- **Build command**: `npm run build`
- **Publish directory**: `public`
- **Functions directory**: `netlify/functions`

### 4. Environment Variables (Optional)

You can set environment variables in Netlify's dashboard:
- Go to Site settings > Environment variables
- Add any environment variables your app needs

### 5. Deploy

Click "Deploy site" and wait for the build to complete.

## Project Structure for Netlify

```
Header-Parser-Microservice/
├── netlify.toml              # Netlify configuration
├── netlify/
│   └── functions/
│       └── api.js            # Serverless function
├── public/                   # Static files (publish directory)
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── package.json
└── README.md
```

## API Endpoints

After deployment, your API will be available at:

- **Main endpoint**: `https://your-site.netlify.app/.netlify/functions/api/whoami`
- **Health check**: `https://your-site.netlify.app/.netlify/functions/api/health`

## Testing Your Deployment

1. Visit your Netlify site URL
2. Click the "Test API" button
3. Verify that you get a JSON response with:
   - `ipaddress`
   - `language`
   - `software`

## Custom Domain (Optional)

1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your domain

## Troubleshooting

### Common Issues

1. **Build fails**: Check the build logs in Netlify dashboard
2. **Function not found**: Ensure `netlify/functions/api.js` exists
3. **CORS errors**: The function includes CORS headers automatically

### Debugging

- Check Netlify function logs in the dashboard
- Use the Netlify CLI for local testing:
  ```bash
  npm install -g netlify-cli
  netlify dev
  ```

## Performance

- Netlify functions have a cold start time
- Functions timeout after 10 seconds (free tier)
- Consider upgrading for better performance

## Cost

- **Free tier**: 125,000 function invocations per month
- **Pro tier**: 1,000,000 function invocations per month
- Check [Netlify pricing](https://netlify.com/pricing) for current rates

## Security

- Functions run in a secure, isolated environment
- Environment variables are encrypted
- HTTPS is enabled by default

## Monitoring

- View function logs in Netlify dashboard
- Monitor function execution times
- Set up notifications for failures

## Updates

To update your deployment:

1. Push changes to your Git repository
2. Netlify will automatically rebuild and deploy
3. Check the deploy logs for any issues

## Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [Netlify Community](https://community.netlify.com/) 