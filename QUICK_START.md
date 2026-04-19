# 🚀 Quick Start Guide - SmartRoute AI

## Get Up and Running in 5 Minutes

### Prerequisites Check
- ✅ Python 3.10+ installed
- ✅ Node.js 16+ installed
- ✅ PostgreSQL 16+ with PostGIS installed
- ✅ API keys ready (TomTom, OpenWeather, Google Places)

### Step 1: Database Setup (2 minutes)

```bash
# Open PostgreSQL
psql -U postgres

# Create database and enable PostGIS
CREATE DATABASE smartroute;
\c smartroute
CREATE EXTENSION postgis;
\q
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Initialize database
python init_db.py

# Start backend
python main.py
```

Backend runs on http://localhost:8000

### Step 3: Frontend Setup (1 minute)

```bash
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend runs on http://localhost:5173

### Step 4: Test the App

1. Open http://localhost:5173 in your browser
2. Click "📍 Set Start Point" and click on the map
3. Click "🎯 Set End Point" and click on the map
4. Click "🗺️ Find Routes"
5. See multiple routes with traffic predictions!

## Configuration

### Minimum .env Configuration

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartroute

# API Keys (REQUIRED for data collection)
TOMTOM_API_KEY=your_tomtom_key
OPENWEATHER_API_KEY=your_openweather_key
GOOGLE_API_KEY=your_google_key

# Security (REQUIRED)
SECRET_KEY=any-random-string-here
API_KEY_SALT=another-random-string

# Optional
CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=INFO
```

### Get API Keys (Free Tiers)

1. **TomTom:** https://developer.tomtom.com/ (2,500 requests/day)
2. **OpenWeather:** https://openweathermap.org/api (1,000 requests/day)
3. **Google Places:** https://console.cloud.google.com/ ($200 credit/month)

## Troubleshooting

### Backend won't start
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check database exists
psql -U postgres -l | grep smartroute

# Check PostGIS is enabled
psql -U postgres -d smartroute -c "SELECT PostGIS_version();"
```

### Frontend won't start
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Routes not showing
- Ensure backend is running on port 8000
- Check browser console for errors
- Try points 2-10 km apart in Bangalore area
- Verify internet connection (needs OpenStreetMap)

## What's Next?

### Optional: Generate Training Data
```bash
cd backend
python generate_sample_dataset.py 10000 csv
```

### Optional: Train ML Models
```bash
cd backend
python ml/train_tabnet.py
```

### Optional: Collect Live Data
Click "🔄 Fetch Live Data" button in the UI or:
```bash
curl -X POST http://localhost:8000/admin/fetch-data
```

## Features to Try

1. **Interactive Map**
   - Click to select start/end points
   - See multiple route options
   - Compare traffic predictions

2. **Route Comparison**
   - Distance and time for each route
   - Traffic level (color-coded)
   - Expected delay
   - Recommended best route

3. **Live Data Collection**
   - Click "Fetch Live Data" button
   - Collects real traffic, weather, events
   - Improves predictions over time

4. **User Feedback** (Coming Soon)
   - Rate prediction accuracy
   - Help improve the model
   - See model performance

## Need Help?

- 📖 Full documentation: `README.md`
- 🗺️ Map feature guide: `MAP_FEATURE_GUIDE.md`
- 🔧 Implementation details: `IMPLEMENTATION_SUMMARY.md`
- 🧠 ML details: `ML_MODEL_BLUEPRINT.md`

## Quick Commands Reference

```bash
# Start backend
cd backend && python main.py

# Start frontend
cd frontend && npm run dev

# Test routes API
python test_routes.py

# Check database
psql -U postgres -d smartroute -c "SELECT COUNT(*) FROM traffic_data;"

# View logs
tail -f backend/logs/app.log  # if logging to file
```

## Success Checklist

- [ ] PostgreSQL running with PostGIS
- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:5173
- [ ] Can click on map to select points
- [ ] Routes appear after clicking "Find Routes"
- [ ] Route cards show distance, time, traffic
- [ ] Can click routes to highlight them

If all checked, you're ready to go! 🎉

---

**Time to first route:** ~5 minutes
**Status:** Ready for production testing
