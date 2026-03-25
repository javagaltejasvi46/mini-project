# Deployment Guide

## Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Running Locally

1. Start the backend:
```bash
cd backend
pip install -r requirements.txt
python main.py
```

2. Start the frontend (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

3. Access the application at `http://localhost:5173`

## Production Deployment

### Backend Deployment (FastAPI)

#### Option 1: Docker
```bash
cd backend
docker build -t smartroute-backend .
docker run -p 8000:8000 smartroute-backend
```

#### Option 2: Cloud Platforms
- **Heroku**: Use Procfile with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **AWS EC2**: Install dependencies and run with systemd service
- **Google Cloud Run**: Deploy as containerized application
- **Railway/Render**: Connect GitHub repo and auto-deploy

### Frontend Deployment

#### Build for Production
```bash
cd frontend
npm run build
```

#### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder or connect GitHub
- **AWS S3 + CloudFront**: Upload `dist` folder to S3 bucket
- **GitHub Pages**: Use `gh-pages` package

### Environment Variables

#### Backend (.env)
```
CORS_ORIGINS=https://your-frontend-domain.com
PORT=8000
```

#### Frontend (.env)
```
VITE_API_URL=https://your-backend-domain.com
```

Update the API URL in frontend code:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

## Production Checklist

- [ ] Update CORS origins in backend
- [ ] Set up SSL certificates (HTTPS)
- [ ] Configure environment variables
- [ ] Set up monitoring and logging
- [ ] Enable rate limiting on API
- [ ] Optimize frontend build (minification, compression)
- [ ] Set up CDN for static assets
- [ ] Configure database (when real model is integrated)
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry, etc.)

## Scaling Considerations

- Use load balancer for multiple backend instances
- Implement caching (Redis) for frequent requests
- Use CDN for frontend assets
- Consider serverless functions for API endpoints
- Implement database connection pooling
