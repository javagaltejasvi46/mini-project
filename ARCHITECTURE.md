# 🏗️ SmartRoute AI - System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React + Leaflet Map)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Interactive  │  │    Route     │  │   Traffic    │         │
│  │     Map      │  │  Comparison  │  │   Feedback   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FASTAPI BACKEND                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Routes     │  │  Prediction  │  │   Feedback   │         │
│  │     API      │  │     API      │  │     API      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                              │                                   │
│  ┌──────────────────────────┴──────────────────────┐           │
│  │           ML ORCHESTRATOR                        │           │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │           │
│  │  │  TabNet  │  │   GNN    │  │    RL    │      │           │
│  │  │  Models  │  │  Router  │  │  Engine  │      │           │
│  │  └──────────┘  └──────────┘  └──────────┘      │           │
│  └──────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  PostgreSQL  │    │   External   │    │ OpenStreetMap│
│  + PostGIS   │    │     APIs     │    │   (OSMnx)    │
│              │    │              │    │              │
│ • Traffic    │    │ • TomTom     │    │ • Road       │
│ • Predictions│    │ • Weather    │    │   Networks   │
│ • Feedback   │    │ • Places     │    │ • Routing    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Component Details

### 1. Frontend Layer

#### Interactive Map Component
```
RouteMap.jsx
├── Leaflet Map Integration
├── Click Handlers (Start/End Points)
├── Route Visualization (Polylines)
├── Route Cards (Comparison)
└── Traffic Color Coding
```

**Technologies:**
- React 18 (UI framework)
- Leaflet (Map library)
- React-Leaflet (React bindings)
- Modern CSS (Styling)

**Key Features:**
- Click-to-select locations
- Real-time route rendering
- Interactive route selection
- Responsive design

### 2. Backend Layer

#### API Endpoints

```
FastAPI Application
├── /routes/find          → Find multiple routes
├── /predict              → Traffic prediction
├── /traffic              → Traffic data query
├── /feedback             → User feedback
└── /admin/fetch-data     → Manual data collection
```

#### ML Pipeline

```
ML Orchestrator
├── TabNet Cause Classifier
│   ├── Input: 8 features (lat, lon, speed, etc.)
│   ├── Output: Traffic cause
│   └── Accuracy: 58% (improving)
│
├── TabNet Delay Regressor
│   ├── Input: 8 features
│   ├── Output: Delay in minutes
│   └── MAE: 31.9 min (improving)
│
├── GNN Route Predictor
│   ├── Input: Road network graph
│   ├── Output: Traffic level per route
│   └── Status: Heuristic (training in progress)
│
└── RL Feedback Engine
    ├── Input: User ratings
    ├── Output: Model updates
    └── Trigger: Every 100 feedback samples
```

### 3. Data Layer

#### Database Schema

```sql
-- Traffic measurements
traffic_data
├── id (PK)
├── location (PostGIS Point)
├── timestamp
├── current_speed
├── congestion_ratio
├── rain
├── accident
└── event

-- ML predictions
predictions
├── id (PK)
├── location (PostGIS Point)
├── timestamp
├── predicted_delay
├── predicted_cause
├── confidence
└── traffic_level

-- User feedback
user_feedback
├── id (PK)
├── prediction_id (FK)
├── accuracy_rating (1-5)
├── usefulness_rating (1-5)
├── actual_delay
├── actual_cause
└── timestamp

-- Model performance
model_performance
├── id (PK)
├── model_type
├── accuracy
├── mae
├── avg_user_rating
└── last_updated
```

## Data Flow Diagrams

### Route Finding Flow

```
User Clicks Map
      │
      ▼
Frontend Captures Coordinates
      │
      ▼
POST /routes/find
      │
      ▼
Backend Calculates Center & Radius
      │
      ▼
OSMnx Fetches Road Network
      │
      ▼
NetworkX Finds Multiple Routes
  ├── Shortest Path (distance)
  ├── Alternative Path (different)
  └── Fastest Path (speed)
      │
      ▼
GNN Predicts Traffic on Each Route
      │
      ▼
Sort Routes by Total Time
      │
      ▼
Return JSON Response
      │
      ▼
Frontend Renders Routes on Map
      │
      ▼
User Sees Color-Coded Routes
```

### Traffic Prediction Flow

```
User Enters Location
      │
      ▼
POST /predict
      │
      ▼
Query Recent Traffic Data
      │
      ▼
Prepare Features (8 dimensions)
      │
      ▼
TabNet Cause Classifier
      │
      ▼
TabNet Delay Regressor
      │
      ▼
GNN Spatial Predictor
      │
      ▼
Combine Predictions
      │
      ▼
Store in Database
      │
      ▼
Return to User
      │
      ▼
User Rates Prediction
      │
      ▼
RL Engine Updates Model
```

### Data Collection Flow

```
APScheduler (Every 5 min)
      │
      ▼
For Each Monitoring Location:
      │
      ├─► TomTom API → Speed, Congestion
      │
      ├─► OpenWeather API → Rain, Conditions
      │
      └─► Google Places API → Nearby Events
      │
      ▼
Combine Data
      │
      ▼
Store in PostgreSQL
      │
      ▼
Available for Predictions
```

## Technology Stack

### Backend
```
Python 3.10+
├── FastAPI (Web framework)
├── SQLAlchemy (ORM)
├── PostgreSQL + PostGIS (Database)
├── PyTorch (Deep learning)
├── TabNet (Attention networks)
├── NetworkX (Graph algorithms)
├── OSMnx (Road networks)
├── APScheduler (Background tasks)
└── Pydantic (Data validation)
```

### Frontend
```
Node.js 16+
├── React 18 (UI framework)
├── Vite (Build tool)
├── Leaflet (Maps)
├── React-Leaflet (React bindings)
└── Modern CSS (Styling)
```

### External Services
```
APIs
├── TomTom Traffic API (Real-time traffic)
├── OpenWeather API (Weather data)
├── Google Places API (Events)
└── OpenStreetMap (Road networks via OSMnx)
```

## Deployment Architecture

### Development
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  PostgreSQL │
│ localhost:  │     │ localhost:  │     │ localhost:  │
│    5173     │     │    8000     │     │    5432     │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Production (Docker)
```
┌──────────────────────────────────────────────────────┐
│                    Docker Network                     │
│                                                       │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐        │
│  │  Nginx   │──▶│  Backend │──▶│PostgreSQL│        │
│  │  :80     │   │  :8000   │   │  :5432   │        │
│  └──────────┘   └──────────┘   └──────────┘        │
│       │                                              │
│       ▼                                              │
│  ┌──────────┐                                       │
│  │ Frontend │                                       │
│  │  Static  │                                       │
│  └──────────┘                                       │
└──────────────────────────────────────────────────────┘
```

## Security Architecture

### Authentication & Authorization
```
User Request
      │
      ▼
API Key Validation (Optional)
      │
      ▼
Rate Limiting
      │
      ▼
CORS Check
      │
      ▼
Input Validation (Pydantic)
      │
      ▼
Business Logic
      │
      ▼
Database Query (Parameterized)
      │
      ▼
Response
```

### Security Measures
- ✅ CORS configuration
- ✅ Input validation (Pydantic schemas)
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Environment variables for secrets
- ✅ Rate limiting (planned)
- ✅ API authentication (planned)

## Scalability Considerations

### Current Capacity
- Concurrent users: ~100
- Requests per second: ~10
- Database size: ~1 GB
- Response time: 1-5 seconds

### Scaling Strategies

#### Horizontal Scaling
```
Load Balancer
      │
      ├─► Backend Instance 1
      ├─► Backend Instance 2
      └─► Backend Instance 3
            │
            ▼
      PostgreSQL Primary
            │
            ├─► Read Replica 1
            └─► Read Replica 2
```

#### Caching Strategy
```
Request
   │
   ▼
Redis Cache (Road Networks)
   │
   ├─► Cache Hit → Return
   │
   └─► Cache Miss
         │
         ▼
   Fetch from OSMnx
         │
         ▼
   Store in Cache
         │
         ▼
   Return
```

#### Performance Optimizations
- Cache road networks in Redis
- Pre-compute common routes
- Use spatial indexing (PostGIS)
- Batch traffic predictions
- CDN for frontend assets
- Database connection pooling

## Monitoring & Observability

### Metrics to Track
```
Application Metrics
├── Request rate (req/sec)
├── Response time (ms)
├── Error rate (%)
├── Active users
└── Database queries/sec

ML Metrics
├── Prediction accuracy (%)
├── Model inference time (ms)
├── Feedback count
├── Model update frequency
└── Training time (min)

Infrastructure Metrics
├── CPU usage (%)
├── Memory usage (MB)
├── Disk I/O (MB/s)
├── Network traffic (MB/s)
└── Database connections
```

### Logging Strategy
```
Application Logs
├── INFO: Normal operations
├── WARNING: Potential issues
├── ERROR: Failures
└── DEBUG: Detailed debugging

Access Logs
├── Request method & path
├── Response status
├── Response time
└── User agent

ML Logs
├── Prediction requests
├── Model updates
├── Training events
└── Performance metrics
```

## Future Architecture Enhancements

### Phase 1 (1-2 months)
- [ ] Redis caching layer
- [ ] API authentication
- [ ] Rate limiting
- [ ] Monitoring dashboard

### Phase 2 (3-6 months)
- [ ] Microservices architecture
- [ ] Message queue (RabbitMQ/Kafka)
- [ ] Real-time updates (WebSockets)
- [ ] Mobile API

### Phase 3 (6-12 months)
- [ ] Multi-region deployment
- [ ] CDN integration
- [ ] Advanced ML pipeline
- [ ] Auto-scaling

---

**Architecture Version:** 1.0.0
**Last Updated:** April 19, 2026
