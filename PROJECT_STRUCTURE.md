# Project Structure

```
smartroute-ai/
│
├── backend/                          # FastAPI Backend
│   ├── main.py                       # Main API application
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Docker configuration
│   ├── .dockerignore                 # Docker ignore file
│   └── README.md                     # Backend documentation
│
├── frontend/                         # React Frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── TrafficDashboard.jsx  # Main dashboard component
│   │   │   ├── TrafficDashboard.css
│   │   │   ├── LocationInput.jsx     # Location input form
│   │   │   ├── LocationInput.css
│   │   │   ├── TrafficInfo.jsx       # Traffic information display
│   │   │   ├── TrafficInfo.css
│   │   │   ├── TrafficChart.jsx      # Traffic trends chart
│   │   │   ├── TrafficChart.css
│   │   │   ├── AlternateRoutes.jsx   # Route suggestions
│   │   │   └── AlternateRoutes.css
│   │   ├── App.jsx                   # Root component
│   │   ├── App.css                   # Global app styles
│   │   ├── index.css                 # Base styles
│   │   └── main.jsx                  # Entry point
│   ├── package.json                  # Node dependencies
│   ├── vite.config.js                # Vite configuration
│   └── index.html                    # HTML template
│
├── README.md                         # Main documentation
├── DEPLOYMENT.md                     # Deployment guide
├── PROJECT_STRUCTURE.md              # This file
├── .gitignore                        # Git ignore rules
└── start-dev.ps1                     # Windows startup script

```

## Component Architecture

### Backend (FastAPI)
- **main.py**: REST API with CORS enabled
  - `POST /predict`: Traffic prediction endpoint
  - Returns traffic data, reasons, and alternate routes
  - Currently uses mock data (placeholder for ML model)

### Frontend (React + Vite)

#### TrafficDashboard
Main container component that orchestrates the entire application flow.

#### LocationInput
- User input form for location details
- Quick location buttons for demo
- Validates and submits data to backend

#### TrafficInfo
- Displays current traffic level with animated circle
- Shows traffic reason and prediction confidence
- Color-coded traffic status

#### TrafficChart
- Visualizes traffic trends over time
- Dual bar chart (traffic level + speed)
- Interactive hover effects
- Statistics cards

#### AlternateRoutes
- Lists suggested alternate routes
- Shows distance, time, and traffic level
- Smart recommendations section
- Route selection buttons

## Design Features

- **Gradient backgrounds**: Purple gradient theme
- **Glass morphism**: Frosted glass effect on cards
- **Smooth animations**: Fade-in, slide, and bounce effects
- **Responsive design**: Mobile-first approach
- **Interactive elements**: Hover effects and transitions
- **Modern typography**: Inter font family
- **Color-coded data**: Traffic levels with semantic colors

## Data Flow

1. User enters location → LocationInput
2. Form submission → API call to backend
3. Backend processes → Returns mock prediction data
4. Dashboard receives data → Updates state
5. Child components render → Display results
   - TrafficInfo: Current status
   - TrafficChart: Historical trends
   - AlternateRoutes: Route options

## Future Integration Points

- Replace mock data with real ML model predictions
- Add real-time traffic API integration
- Implement user authentication
- Add route history and favorites
- Enable push notifications
- Integrate mapping services (Google Maps, Mapbox)
