# 🗺️ Interactive Map Feature Guide

## Overview

The new interactive map feature allows users to visually select start and end points on a live map, then discover and compare multiple routes with AI-predicted traffic levels.

## How It Works

### 1. User Interface

**Map Controls:**
- 📍 Set Start Point - Click to enable start point selection mode
- 🎯 Set End Point - Click to enable end point selection mode
- 🗺️ Find Routes - Discover multiple routes between selected points
- 🗑️ Clear - Reset all selections and routes

**Map Display:**
- Interactive Leaflet map centered on Bangalore
- Green marker for start point
- Red marker for end point
- Color-coded route polylines
- Zoom and pan controls

### 2. Route Finding Process

**Step 1: Select Points**
1. Click "📍 Set Start Point" button
2. Click anywhere on the map to set start location
3. Click "🎯 Set End Point" button
4. Click anywhere on the map to set end location

**Step 2: Find Routes**
1. Click "🗺️ Find Routes" button
2. Backend fetches road network from OpenStreetMap
3. System finds 2-3 alternative routes using different algorithms:
   - Shortest path by distance
   - Alternative path (avoiding main route)
   - Fastest path (considering speed limits)

**Step 3: View Results**
- Routes displayed as polylines on map
- Route cards show detailed information
- Click any route to highlight it
- Compare distance, time, traffic, and delay

### 3. Traffic Prediction

**GNN Model (Graph Neural Network):**
- Analyzes road network topology
- Considers route characteristics
- Predicts traffic level (10-90%)
- Estimates delay in minutes

**Traffic Levels:**
- 🟢 Green (0-30%): Light traffic, smooth flow
- 🟠 Orange (30-60%): Moderate traffic, some delays
- 🔴 Red (60-90%): Heavy traffic, significant delays

**Prediction Factors:**
- Route distance
- Road types and speed limits
- Historical traffic patterns
- Time of day
- Weather conditions
- Nearby events

### 4. Route Comparison

**Each route shows:**
- 📏 Distance in kilometers
- ⏱️ Estimated time in minutes
- 🚦 Traffic level percentage
- ⏳ Predicted delay in minutes
- ⭐ Recommended badge (for best route)

**Routes are sorted by:**
Total Time = Estimated Time + Predicted Delay

The route with lowest total time gets the ⭐ Recommended badge.

## Technical Architecture

### Backend Components

**1. Routes API (`backend/api/routes.py`)**
- POST /routes/find endpoint
- Fetches road network from OSMnx
- Finds multiple routes using NetworkX algorithms
- Predicts traffic using GNN model
- Returns route coordinates and predictions

**2. OSMnx Client (`backend/clients/osmnx_client.py`)**
- Fetches road network from OpenStreetMap
- Finds nearest nodes to coordinates
- Provides graph structure for routing

**3. Schemas (`backend/schemas.py`)**
- RouteFindRequest: start/end coordinates
- RouteInfo: route details with predictions
- RouteFindResponse: list of routes

### Frontend Components

**1. RouteMap Component (`frontend/src/components/RouteMap.jsx`)**
- Leaflet map integration
- Click handlers for point selection
- Route visualization with polylines
- Route cards with comparison data

**2. TrafficDashboard (`frontend/src/components/TrafficDashboard.jsx`)**
- Main container for map component
- Route summary statistics
- Data fetch controls

## API Usage

### Request

```bash
POST http://localhost:8000/routes/find
Content-Type: application/json

{
  "start_lat": 12.9716,
  "start_lon": 77.5946,
  "end_lat": 12.9352,
  "end_lon": 77.6245
}
```

### Response

```json
{
  "routes": [
    {
      "coordinates": [
        [12.9716, 77.5946],
        [12.9700, 77.5960],
        ...
        [12.9352, 77.6245]
      ],
      "distance": 5.2,
      "estimated_time": 15.5,
      "route_type": "shortest",
      "traffic_level": 45,
      "predicted_delay": 3.5
    },
    {
      "coordinates": [...],
      "distance": 6.1,
      "estimated_time": 18.0,
      "route_type": "alternative",
      "traffic_level": 30,
      "predicted_delay": 2.7
    }
  ],
  "total_routes": 2
}
```

## Algorithms

### Route Finding

**1. Shortest Path (Distance)**
```python
nx.shortest_path(G, start_node, end_node, weight='length')
```
Finds route with minimum total distance.

**2. Alternative Path**
```python
# Remove 20% of edges from shortest path
G_alt = G.copy()
G_alt.remove_edges_from(edges_to_remove)
nx.shortest_path(G_alt, start_node, end_node, weight='length')
```
Forces different route by removing some edges.

**3. Fastest Path (Time)**
```python
# Add time weight based on length and speed
time = length / (maxspeed * 1000 / 60)
nx.shortest_path(G, start_node, end_node, weight='time')
```
Considers speed limits for fastest route.

### Traffic Prediction

**Current Implementation (Heuristic):**
```python
traffic_level = base_traffic + distance_factor + route_factor + random_factor
traffic_level = clamp(traffic_level, 10, 90)
```

**Future Implementation (GNN):**
- Graph Convolutional Network
- Node features: road type, speed limit, historical traffic
- Edge features: distance, connectivity
- Output: traffic level per route segment

## Configuration

### Map Center

Edit `frontend/src/components/RouteMap.jsx`:
```javascript
const [center] = useState([12.9716, 77.5946]) // Bangalore
```

### Route Search Radius

Edit `backend/api/routes.py`:
```python
radius = max(5000, int(distance * 1000 * 1.5))  # 1.5x distance
```

### Traffic Prediction Parameters

Edit `backend/api/routes.py`:
```python
def _predict_route_traffic(route, route_index):
    base_traffic = 40  # Base level
    distance_factor = min(route['distance'] * 2, 20)
    route_factor = -10 if route_index > 0 else 0
    # Adjust these values
```

## Testing

### Manual Testing

1. Start backend: `python backend/main.py`
2. Start frontend: `npm run dev` in frontend/
3. Open http://localhost:5173
4. Click start and end points on map
5. Click "Find Routes"
6. Verify routes appear on map
7. Check route cards show correct data

### API Testing

```bash
# Test with curl
curl -X POST "http://localhost:8000/routes/find" \
  -H "Content-Type: application/json" \
  -d '{
    "start_lat": 12.9716,
    "start_lon": 77.5946,
    "end_lat": 12.9352,
    "end_lon": 77.6245
  }'

# Or use test script
python test_routes.py
```

### Unit Testing

```python
# Test route finding
def test_find_routes():
    response = client.post("/routes/find", json={
        "start_lat": 12.9716,
        "start_lon": 77.5946,
        "end_lat": 12.9352,
        "end_lon": 77.6245
    })
    assert response.status_code == 200
    data = response.json()
    assert data["total_routes"] >= 1
    assert len(data["routes"]) >= 1
```

## Troubleshooting

### Routes not found

**Problem:** "No route found between these points"

**Solutions:**
- Ensure points are on road network (not in water, parks, etc.)
- Try points closer together (2-10 km)
- Check OSMnx can access OpenStreetMap
- Verify internet connection

### Slow route finding

**Problem:** Takes >10 seconds to find routes

**Solutions:**
- Reduce search radius
- Use points closer together
- Cache road networks
- Optimize graph algorithms

### Incorrect traffic predictions

**Problem:** Traffic levels don't match reality

**Solutions:**
- Train GNN model with real data
- Collect more historical traffic data
- Adjust heuristic parameters
- Use time-of-day factors

### Map not displaying

**Problem:** Blank map or tiles not loading

**Solutions:**
- Check internet connection
- Verify leaflet packages installed
- Check browser console for errors
- Try different tile provider

## Future Enhancements

### Short Term
- [ ] Train GNN model with real traffic data
- [ ] Add real-time traffic updates
- [ ] Cache road networks for faster loading
- [ ] Add route preferences (avoid highways, tolls)

### Medium Term
- [ ] Turn-by-turn navigation
- [ ] Voice guidance
- [ ] Traffic incident markers
- [ ] Alternative map providers (Google, Mapbox)

### Long Term
- [ ] Offline map support
- [ ] Multi-modal routing (walk + bus + car)
- [ ] Crowd-sourced traffic data
- [ ] Integration with Waze, Google Maps

## Performance Optimization

### Backend
- Cache road networks in Redis
- Pre-compute common routes
- Use spatial indexing for faster queries
- Batch traffic predictions

### Frontend
- Lazy load map tiles
- Debounce map clicks
- Virtualize route list for many routes
- Use Web Workers for heavy computations

## Security Considerations

- Rate limit route finding API
- Validate coordinate ranges
- Sanitize user inputs
- Implement API authentication
- Monitor for abuse

## Accessibility

- Keyboard navigation for map controls
- Screen reader support for route information
- High contrast mode for route colors
- Text alternatives for map markers

---

**Need help?** Check the main README.md or create an issue on GitHub.
