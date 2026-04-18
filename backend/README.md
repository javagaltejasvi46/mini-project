# SmartRoute AI - Traffic Prediction Backend

Real-time traffic prediction and route optimization system using PostgreSQL + PostGIS, FastAPI, and ML pipeline (TabNet → GNN → A* routing).

## Features

- Real-time traffic data ingestion from TomTom, OpenWeather, and Google Places
- PostgreSQL with PostGIS for geospatial queries
- ML-powered traffic prediction (cause and delay)
- A* routing algorithm with traffic-weighted edges
- RESTful API with FastAPI
- Automated data ingestion scheduler

## Prerequisites

- Python 3.11+
- PostgreSQL 14+ with PostGIS 3.3+
- Redis (optional, for caching)
- API Keys: Google Maps, OpenWeather, TomTom

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your credentials:

```bash
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartroute
GOOGLE_API_KEY=your_google_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
TOMTOM_API_KEY=your_tomtom_api_key
```

### 3. Setup Database

```bash
# Create database and enable PostGIS
psql -U postgres -c "CREATE DATABASE smartroute;"
psql -U postgres -d smartroute -c "CREATE EXTENSION postgis;"
```

### 4. Run the Server

```bash
python main.py
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## API Endpoints

### GET /traffic
Query traffic data by location

```bash
curl "http://localhost:8000/traffic?lat=12.97&lon=77.59&radius_km=2"
```

### POST /predict
Get traffic predictions for a location

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d '{"latitude": 12.97, "longitude": 77.59, "location_name": "MG Road"}'
```

### GET /route
Calculate optimal routes between two points

```bash
curl "http://localhost:8000/route?source_lat=12.97&source_lon=77.59&dest_lat=12.93&dest_lon=77.62"
```

## Docker Deployment

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration management
├── database.py          # Database connection
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── scheduler.py         # Data ingestion scheduler
├── api/                 # API endpoints
│   ├── traffic.py
│   ├── predict.py
│   └── route.py
├── clients/             # External API clients
│   ├── base.py
│   ├── tomtom.py
│   ├── openweather.py
│   ├── google_places.py
│   └── osmnx_client.py
├── ml/                  # ML pipeline
│   ├── orchestrator.py
│   ├── tabnet_predictor.py
│   ├── gnn_predictor.py
│   └── astar_router.py
└── data/                # Static data files
    └── bangalore_venues.json
```

## Configuration

All configuration is managed through environment variables in `.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_API_KEY`: Google Maps API key
- `OPENWEATHER_API_KEY`: OpenWeather API key
- `TOMTOM_API_KEY`: TomTom Traffic API key
- `MONITORING_LOCATIONS`: Semicolon-separated lat,lon pairs for data ingestion
- `ENVIRONMENT`: development or production
- `LOG_LEVEL`: INFO, DEBUG, WARNING, ERROR

## Development

### Run Tests

```bash
pytest
```

### Code Quality

```bash
# Format code
black .

# Lint
flake8 .
```

## System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB

**Recommended:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB SSD

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `Get-Service postgresql-x64-18`
- Check connection string in `.env`
- Ensure PostGIS extension is enabled

### API Key Issues
- Verify API keys are valid and have sufficient quota
- Check API key permissions and enabled services

### Import Errors
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Verify Python version: `python --version` (should be 3.11+)

## License

MIT
