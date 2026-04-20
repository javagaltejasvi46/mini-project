# SANJAYA Insight Engine

> Intelligent real-time traffic prediction and route optimization for Bangalore, powered by ML and a modern dark-themed dashboard.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## What it does

SANJAYA is a full-stack traffic intelligence platform. You type a place name (e.g. "MG Road, Bangalore"), the app geocodes it via OpenStreetMap Nominatim, fetches the road network, runs ML models to predict traffic conditions, and returns multiple route options with delay estimates — all displayed on a live Leaflet map.

---

## Screenshots

The dashboard has four pages accessible from the sidebar:

| Page | Description |
|---|---|
| **Oracle Dashboard** | Main prediction interface — enter a route, get traffic analysis, chart, and alternate routes on a map |
| **Neural Flow Optimizer** | Dedicated route finder with a full-screen map and optimization panel |
| **Predictive Hub** | ML model performance metrics, RL feedback buffer, and zone-level traffic aggregation |
| **System Health** | Live Leaflet map of all monitoring nodes with real sensor data |

---

## Tech Stack

**Backend**
- FastAPI + Uvicorn
- PostgreSQL 16+ with PostGIS (geospatial queries)
- SQLAlchemy ORM
- TabNet (attention-based neural network for traffic cause + delay prediction)
- PyTorch
- OSMnx + NetworkX (road network fetching and pathfinding)
- APScheduler (automatic data ingestion every 5 minutes)

**Frontend**
- React 19 + Vite
- Tailwind CSS 3 (Material Design 3 dark theme)
- React Router v7
- Leaflet + React-Leaflet (interactive maps)
- Nominatim geocoding (place name → coordinates, no API key needed)

**External APIs**
- TomTom Traffic API — live speed and congestion data
- OpenWeather API — rain and weather conditions
- Google Places API — nearby event detection

---

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 16+ with PostGIS extension
- API keys for TomTom, OpenWeather, and Google Places

---

## Setup

### 1. Clone

```bash
git clone https://github.com/javagaltejasvi46/mini-project.git
cd mini-project
```

### 2. Database

Install PostgreSQL with PostGIS, then:

```sql
psql -U postgres
CREATE DATABASE smartroute;
\c smartroute
CREATE EXTENSION postgis;
\q
```

### 3. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DATABASE_URL and API keys
```

**`.env` reference:**

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/smartroute

TOMTOM_API_KEY=your_key
OPENWEATHER_API_KEY=your_key
GOOGLE_API_KEY=your_key

SECRET_KEY=any-random-string
API_KEY_SALT=any-random-string

CORS_ORIGINS=http://localhost:5173
LOG_LEVEL=INFO

TABNET_MODEL_PATH=models/tabnet
GNN_MODEL_PATH=models/gnn_model.pth

# Bangalore monitoring locations (lat,lon pairs separated by semicolon)
MONITORING_LOCATIONS=12.97,77.59;12.93,77.62;12.92,77.62
```

**Initialize and train:**

```bash
# Create database tables
python init_db.py

# Generate 10,000 training samples
python generate_sample_dataset.py 10000 csv

# Train TabNet models (cause classifier + delay regressor)
python ml/train_tabnet.py

# Start the backend
python main.py
```

Backend runs at `http://localhost:8000`  
Interactive API docs at `http://localhost:8000/docs`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Usage

1. Open `http://localhost:5173`
2. On the **Oracle Dashboard**, type an origin (e.g. `MG Road, Bangalore`) and destination (e.g. `Whitefield, Bangalore`) in the search fields — suggestions appear from OpenStreetMap
3. Select both locations from the dropdown, then click **Predict Traffic**
4. The app returns:
   - Traffic level, cause, expected delay, and prediction confidence
   - A 2-hour traffic trends chart
   - Up to 3 alternate routes on a live map with traffic predictions per route
   - Nearby sensor data (if live data has been fetched)
5. Click **Select** on any route to highlight it on the map
6. Click **Rate This Prediction** to submit feedback — this feeds the reinforcement learning loop

**For better predictions:** Click **Initiate Scan** in the sidebar (or **Fetch Live Data** on the dashboard) to pull fresh traffic data from TomTom, OpenWeather, and Google Places for all monitoring locations.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/predict` | Traffic prediction for a single point |
| `POST` | `/routes/find` | Find 1–3 routes between two points with traffic predictions |
| `GET` | `/traffic` | Nearby traffic sensor data (`?lat=&lon=&radius_km=`) |
| `POST` | `/feedback` | Submit user feedback (triggers RL update) |
| `GET` | `/feedback/stats` | Feedback statistics and RL buffer status |
| `GET` | `/model/performance` | ML model accuracy metrics |
| `POST` | `/admin/fetch-data` | Manually trigger live data ingestion |
| `GET` | `/health` | Backend health check |

**Example — find routes:**

```bash
curl -X POST http://localhost:8000/routes/find \
  -H "Content-Type: application/json" \
  -d '{
    "start_lat": 12.9757,
    "start_lon": 77.6011,
    "end_lat": 12.9698,
    "end_lon": 77.7499
  }'
```

---

## ML Models

### TabNet Cause Classifier
Predicts the cause of traffic congestion from 5 categories:
- Rush hour, Road construction, Traffic accident, Special event, Weather

### TabNet Delay Regressor
Predicts expected delay in minutes based on current conditions.

Both models use 8 features: latitude, longitude, current speed, congestion ratio, rain intensity, accident flag, event flag, hour of day.

### Route Traffic Prediction
Uses heuristics based on route distance and time of day. Designed to be replaced with a trained GNN model using real traffic data.

### Reinforcement Learning
After 100 user feedback submissions, the system automatically retrains with feedback-weighted samples. Accurate predictions get higher weight in the next training cycle.

**Retrain manually:**
```bash
cd backend
python ml/train_tabnet.py
```

---

## Project Structure

```
mini-project/
├── backend/
│   ├── api/
│   │   ├── predict.py        # POST /predict
│   │   ├── routes.py         # POST /routes/find
│   │   ├── traffic.py        # GET /traffic
│   │   ├── feedback.py       # POST /feedback, GET /model/performance
│   │   └── route.py          # Legacy route endpoint
│   ├── clients/
│   │   ├── tomtom.py
│   │   ├── openweather.py
│   │   ├── google_places.py
│   │   └── osmnx_client.py
│   ├── ml/
│   │   ├── train_tabnet.py
│   │   ├── tabnet_predictor.py
│   │   ├── orchestrator.py
│   │   └── reinforcement_learning.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── scheduler.py
│   ├── main.py
│   ├── init_db.py
│   ├── generate_sample_dataset.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MainContent.jsx         # Oracle Dashboard
│   │   │   ├── NeuralFlowOptimizer.jsx # Flow Analysis page
│   │   │   ├── PredictiveHub.jsx       # Predictive Hub page
│   │   │   ├── SystemHealthNode.jsx    # System Health page
│   │   │   ├── LocationInput.jsx       # Route search with Nominatim
│   │   │   ├── PlaceSearchInput.jsx    # Geocoding input component
│   │   │   ├── TrafficInfo.jsx         # Traffic analysis card
│   │   │   ├── TrafficChart.jsx        # Traffic trends bar chart
│   │   │   ├── AlternateRoutes.jsx     # Route map + route list
│   │   │   ├── NearbyTraffic.jsx       # Sensor data (collapsible)
│   │   │   ├── FeedbackModal.jsx       # Prediction rating modal
│   │   │   ├── TopNavBar.jsx           # Top navigation with search
│   │   │   ├── SideNavBar.jsx          # Sidebar with sliding indicator
│   │   │   └── Layout.jsx
│   │   ├── hooks/
│   │   │   ├── useReveal.js            # Scroll-triggered animations
│   │   │   └── useNominatim.js         # Place name geocoding
│   │   ├── api.js                      # Centralized API client
│   │   ├── App.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## Troubleshooting

**Backend won't start**
- Confirm PostgreSQL is running and PostGIS is enabled
- Check `DATABASE_URL` in `.env` — if your password contains `@`, encode it as `%40`
- Make sure port 8000 is free

**No predictions / fallback data only**
- The backend returns fallback predictions when the DB has no traffic data near your query point
- Click **Initiate Scan** to populate the database, then try again
- Predictions improve significantly after live data is collected

**Routes take a long time**
- The first request for a new area downloads the road network from OpenStreetMap (~5–15s)
- Subsequent requests for the same area use the in-memory cache and return in under 2s

**Frontend won't start**
- Run `npm install` in the `frontend/` directory
- Requires Node.js 18+

**Place search not working**
- Nominatim requires an internet connection
- Type at least 3 characters before suggestions appear
- Results are biased to India — for other cities, type the full city name

---

## License

MIT — see [LICENSE](LICENSE)

---

*Built for smarter cities.*
