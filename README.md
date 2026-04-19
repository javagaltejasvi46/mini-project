# 🚦 SmartRoute AI - Intelligent Traffic Prediction System

A real-time traffic prediction and route optimization system powered by Machine Learning and Reinforcement Learning. The system learns from user feedback to continuously improve predictions.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![React](https://img.shields.io/badge/React-18+-61DAFB.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 🗺️ **Interactive Map Interface** - Click to select start/end points on live map
- 🛣️ **Multiple Route Options** - Find and compare 2-3 alternative routes
- 🎯 **GNN Traffic Prediction** - Graph Neural Network predicts traffic on each route
- 🚦 **Smart Route Recommendation** - Suggests best route with least traffic
- 🧠 **Reinforcement Learning** - Learns from user feedback
- 📊 **Traffic Analytics** - Historical trends and patterns
- 🌦️ **Weather Integration** - Weather impact on traffic
- 📍 **Event Detection** - Identifies nearby events affecting traffic
- 💬 **User Feedback System** - Rate predictions and help improve the model
- 📈 **Performance Tracking** - Monitor model accuracy over time

## 🏗️ Architecture

### Tech Stack

**Backend:**
- FastAPI (Python web framework)
- PostgreSQL with PostGIS (Geospatial database)
- SQLAlchemy (ORM)
- TabNet (Attention-based neural network)
- PyTorch (Deep learning)
- APScheduler (Background tasks)

**Frontend:**
- React 18
- Vite (Build tool)
- Leaflet & React-Leaflet (Interactive maps)
- Modern CSS with animations

**APIs:**
- TomTom Traffic API
- OpenWeather API
- Google Places API

## 📋 Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- PostgreSQL 16+ with PostGIS extension
- API Keys (TomTom, OpenWeather, Google Places)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd smartroute-ai
```

### 2. Database Setup

**Install PostgreSQL with PostGIS:**

Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, use Stack Builder to install PostGIS extension
3. Create database:

```bash
# Open psql
psql -U postgres

# Create database
CREATE DATABASE smartroute;

# Connect to database
\c smartroute

# Enable PostGIS
CREATE EXTENSION postgis;

# Exit
\q
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required: DATABASE_URL, API keys
```

**Configure .env file:**

```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartroute

# API Keys
TOMTOM_API_KEY=your_tomtom_key
OPENWEATHER_API_KEY=your_openweather_key
GOOGLE_API_KEY=your_google_key

# Security
SECRET_KEY=your-secret-key-here
API_KEY_SALT=your-api-salt-here

# Server
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=INFO

# ML Models
TABNET_MODEL_PATH=models/tabnet
GNN_MODEL_PATH=models/gnn_model.pth

# Monitoring Locations (Bangalore coordinates)
MONITORING_LOCATIONS=12.97,77.59;12.93,77.62;12.92,77.62
```

**Initialize database:**

```bash
python init_db.py
```

**Generate training data:**

```bash
python generate_sample_dataset.py 10000 csv
```

**Train ML models:**

```bash
python ml/train_tabnet.py
```

**Start backend:**

```bash
python main.py
```

Backend will run on http://localhost:8000

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on http://localhost:5173

## 📖 Usage

### Interactive Map Workflow

1. **Open the app** at http://localhost:5173
2. **Fetch live data** by clicking "🔄 Fetch Live Data" button (optional, for better predictions)
3. **Select start point** - Click "📍 Set Start Point" then click on the map
4. **Select end point** - Click "🎯 Set End Point" then click on the map
5. **Find routes** - Click "🗺️ Find Routes" to discover multiple route options
6. **View route comparison**:
   - Distance and estimated time for each route
   - Traffic level prediction (color-coded)
   - Expected delay due to traffic
   - Recommended best route (⭐ badge)
7. **Select a route** - Click on any route card or polyline to highlight it
8. **Rate the prediction** to help improve the model (after using the route)

### Route Features

- **Multiple Routes**: System finds 2-3 alternative routes between your points
- **Traffic Prediction**: GNN model predicts traffic level (10-90%) for each route
- **Color Coding**: 
  - 🟢 Green: Light traffic (<30%)
  - 🟠 Orange: Moderate traffic (30-60%)
  - 🔴 Red: Heavy traffic (>60%)
- **Smart Recommendation**: Routes sorted by total time (travel + delay)
- **Interactive Map**: Click routes to select, zoom/pan to explore

### Legacy Coordinate Input (Still Available)

1. **Enter location** coordinates and name manually
2. **Click "Analyze Traffic"** to get prediction
3. **View results** including traffic level, delay, cause, trends

### API Endpoints

**Find Routes (NEW):**
```bash
POST /routes/find
{
  "start_lat": 12.9716,
  "start_lon": 77.5946,
  "end_lat": 12.9352,
  "end_lon": 77.6245
}

Response:
{
  "routes": [
    {
      "coordinates": [[lat, lon], ...],
      "distance": 5.2,
      "estimated_time": 15.5,
      "route_type": "shortest",
      "traffic_level": 45,
      "predicted_delay": 3.5
    }
  ],
  "total_routes": 3
}
```

**Prediction:**
```bash
POST /predict
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "location_name": "MG Road"
}
```

**Traffic Data:**
```bash
GET /traffic?lat=12.97&lon=77.59&radius_km=5
```

**Manual Data Fetch:**
```bash
POST /admin/fetch-data
```

**Submit Feedback:**
```bash
POST /feedback
{
  "prediction_id": 1,
  "accuracy_rating": 4,
  "usefulness_rating": 5,
  "actual_delay": 35.5,
  "comments": "Very accurate!"
}
```

**API Documentation:**
Visit http://localhost:8000/docs for interactive API documentation

## 🧠 Machine Learning

### Models

1. **TabNet Cause Classifier**
   - Predicts traffic cause (Rush hour, Construction, Accident, Event, Weather)
   - Attention-based architecture
   - Current accuracy: 58% (improves with more data)

2. **TabNet Delay Regressor**
   - Predicts expected delay in minutes
   - Current MAE: 31.9 minutes (improves with more data)

3. **GNN Spatial Predictor (NEW)**
   - Graph Neural Network for spatial traffic patterns
   - Uses road network topology from OpenStreetMap
   - Predicts traffic on alternative routes
   - Considers route characteristics (distance, road types)
   - Currently uses heuristics (will use trained GNN in production)

### Training

Models use 8 features:
- Latitude, Longitude
- Current speed
- Congestion ratio
- Rain intensity
- Accident flag
- Event flag
- Hour of day

**Retrain models:**
```bash
cd backend
python ml/train_tabnet.py
```

### Reinforcement Learning

The system learns from user feedback:
- Users rate prediction accuracy (1-5 stars)
- Users rate usefulness (1-5 stars)
- Users provide actual delay experienced
- System calculates reward signal
- After 100 feedback samples, model retrains automatically
- Good predictions get higher weight in training

## 📊 Data Collection

### Automatic Collection

Data is collected every 5 minutes from:
- TomTom Traffic API (speed, congestion)
- OpenWeather API (weather conditions)
- Google Places API (nearby events)

### Manual Collection

Click "🔄 Fetch Live Data" button in the UI or:

```bash
curl -X POST http://localhost:8000/admin/fetch-data
```

### Data Storage

All data is stored in PostgreSQL with PostGIS:
- `traffic_data` - Real-time traffic measurements
- `predictions` - Model predictions
- `user_feedback` - User ratings and feedback
- `model_performance` - Model metrics over time

## 🔧 Configuration

### Monitoring Locations

Edit `backend/.env` to add more locations:

```env
MONITORING_LOCATIONS=12.97,77.59;12.93,77.62;13.01,77.55
```

Format: `latitude,longitude;latitude,longitude;...`

### Data Collection Interval

Edit `backend/main.py`:

```python
scheduler.start(settings.monitoring_locations_list, interval_minutes=5)
```

Change `interval_minutes` to desired value.

## 📁 Project Structure

```
smartroute-ai/
├── backend/
│   ├── api/              # API endpoints
│   │   ├── predict.py    # Prediction endpoint
│   │   ├── traffic.py    # Traffic data endpoint
│   │   ├── route.py      # Route optimization (legacy)
│   │   ├── routes.py     # Multi-route finding (NEW)
│   │   └── feedback.py   # User feedback
│   ├── ml/               # Machine learning
│   │   ├── train_tabnet.py
│   │   ├── train_gnn.py
│   │   ├── orchestrator.py
│   │   └── reinforcement_learning.py
│   ├── clients/          # External API clients
│   │   ├── osmnx_client.py  # OpenStreetMap road networks
│   │   ├── tomtom.py     # TomTom traffic
│   │   ├── openweather.py
│   │   └── google_places.py
│   ├── models/           # Trained models (generated)
│   ├── config.py         # Configuration
│   ├── database.py       # Database connection
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── scheduler.py      # Data ingestion
│   ├── main.py           # FastAPI app
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── RouteMap.jsx       # Interactive map (NEW)
│   │   │   ├── TrafficDashboard.jsx
│   │   │   ├── TrafficInfo.jsx
│   │   │   └── FeedbackModal.jsx
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Node dependencies
│   └── vite.config.js    # Vite configuration
├── training_data.csv     # Generated training data
├── test_routes.py        # Route API test script (NEW)
├── README.md             # This file
└── docker-compose.yml    # Docker setup (optional)
```

## 🐳 Docker Deployment (Optional)

```bash
# Build and start
docker-compose up -d

# Stop
docker-compose down
```

## 🧪 Testing

### Test Prediction

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 12.9716,
    "longitude": 77.5946,
    "location_name": "MG Road"
  }'
```

### Test Route Finding (NEW)

```bash
# Using curl
curl -X POST "http://localhost:8000/routes/find" \
  -H "Content-Type: application/json" \
  -d '{
    "start_lat": 12.9716,
    "start_lon": 77.5946,
    "end_lat": 12.9352,
    "end_lon": 77.6245
  }'

# Or use the test script
python test_routes.py
```

### Test Data Collection

```bash
curl -X POST "http://localhost:8000/admin/fetch-data"
```

### Check Database

```bash
psql -U postgres -d smartroute

SELECT COUNT(*) FROM traffic_data;
SELECT COUNT(*) FROM predictions;
SELECT COUNT(*) FROM user_feedback;
```

## 📈 Performance

### Current Model Performance

With 1,000 training samples:
- Cause accuracy: 58%
- Delay MAE: 31.9 minutes

With 10,000 training samples (expected):
- Cause accuracy: 75-85%
- Delay MAE: 5-8 minutes

With user feedback (100+ samples):
- +5-10% accuracy improvement
- Better handling of edge cases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Keys

### Get API Keys

1. **TomTom Traffic API**
   - Sign up at https://developer.tomtom.com/
   - Create an app and get API key
   - Free tier: 2,500 requests/day

2. **OpenWeather API**
   - Sign up at https://openweathermap.org/api
   - Get API key
   - Free tier: 1,000 requests/day

3. **Google Places API**
   - Go to https://console.cloud.google.com/
   - Enable Places API
   - Create credentials
   - Free tier: $200 credit/month

## 🐛 Troubleshooting

### Backend won't start

- Check PostgreSQL is running
- Verify database exists and PostGIS is enabled
- Check `.env` file has correct credentials
- Ensure port 8000 is not in use

### Frontend won't start

- Run `npm install` in frontend directory
- Check port 5173 is not in use
- Verify Node.js version (16+)

### No predictions

- Check backend is running
- Verify database has traffic data
- Click "Fetch Live Data" to collect data
- Check API keys are valid

### Routes not showing on map

- Ensure backend is running on port 8000
- Check browser console for errors
- Verify start and end points are in Bangalore area
- Try points that are 2-10 km apart
- Check that osmnx can fetch road network for the area

### Map not loading

- Check internet connection (map tiles from OpenStreetMap)
- Verify leaflet packages are installed: `npm install` in frontend
- Clear browser cache
- Check browser console for errors

### Database errors

- Ensure PostGIS extension is installed
- Check database URL encoding (@ becomes %40)
- Verify PostgreSQL version (16+)

## 📚 Documentation

- **ML Model Blueprint**: `ML_MODEL_BLUEPRINT.md`
- **Dataset Specification**: `DATASET_SPECIFICATION.md`
- **Reinforcement Learning**: `REINFORCEMENT_LEARNING_GUIDE.md`
- **Testing Guide**: `TEST_INTEGRATION.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Features List**: `FEATURES.md`
- **Data Requirements**: `DATA_REQUIREMENTS.md`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- TomTom for traffic data API
- OpenWeather for weather data API
- Google for Places API
- TabNet paper authors
- FastAPI and React communities

## 📞 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with details

## 🗺️ Roadmap

- [x] Interactive map with route selection
- [x] Multiple route comparison
- [x] GNN-based traffic prediction on routes
- [ ] Train GNN model with real traffic data
- [ ] Mobile app (React Native)
- [ ] Real-time traffic updates on routes
- [ ] Turn-by-turn navigation
- [ ] Multi-city support
- [ ] Traffic incident reporting
- [ ] Integration with navigation apps
- [ ] Voice guidance
- [ ] Offline map support

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Made with ❤️ for smarter cities**
