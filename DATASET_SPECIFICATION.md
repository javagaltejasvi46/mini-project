# SmartRoute AI - Dataset Specification

## Overview

This document specifies the exact format, ranges, and units for the training dataset. Use this as a template for data collection and synthesis.

---

## 1. Traffic Data Table Schema

### Table: `traffic_data`

| Column | Type | Unit | Range | Description | Source |
|--------|------|------|-------|-------------|--------|
| `id` | INTEGER | - | 1 to ∞ | Auto-increment primary key | Database |
| `location` | GEOGRAPHY(POINT) | WGS84 | Lat: 12.8-13.2, Lon: 77.4-77.8 | Geographic coordinates (Bangalore) | Input |
| `timestamp` | TIMESTAMP | UTC | Any valid datetime | When data was collected | System |
| `current_speed` | FLOAT | km/h | 0-80 | Current traffic speed | TomTom API |
| `congestion_ratio` | FLOAT | Ratio | 0.0-5.0 | Traffic congestion level | Calculated |
| `rain` | FLOAT | mm/hour | 0-50 | Rainfall intensity | OpenWeather API |
| `accident` | BOOLEAN | - | 0 or 1 | Accident reported nearby | Manual/News |
| `event` | BOOLEAN | - | 0 or 1 | Event happening nearby | Google Places API |
| `road_segment_id` | INTEGER | - | NULL or valid ID | Associated road segment | Database |

---

## 2. Sample Dataset (CSV Format)

### File: `training_data.csv`

```csv
id,latitude,longitude,timestamp,current_speed,congestion_ratio,rain,accident,event,cause_label,delay_minutes
1,12.9716,77.5946,2026-04-18 08:30:00,15.5,3.2,0.0,0,0,0,38.4
2,12.9716,77.5946,2026-04-18 08:35:00,12.3,3.8,0.0,0,0,0,45.6
3,12.9716,77.5946,2026-04-18 08:40:00,18.2,2.9,0.0,0,0,0,34.8
4,12.9789,77.5996,2026-04-18 09:00:00,8.5,4.5,0.0,0,1,3,45.0
5,12.9789,77.5996,2026-04-18 09:05:00,10.2,4.2,0.0,0,1,3,42.0
6,12.9716,77.5946,2026-04-18 14:30:00,35.8,1.5,2.5,0,0,4,12.0
7,12.9716,77.5946,2026-04-18 14:35:00,32.1,1.8,3.2,0,0,4,14.4
8,12.9789,77.5996,2026-04-18 16:45:00,5.2,4.8,0.0,1,0,2,72.0
9,12.9789,77.5996,2026-04-18 16:50:00,6.8,4.6,0.0,1,0,2,69.0
10,12.9716,77.5946,2026-04-18 18:30:00,22.5,2.5,0.0,0,0,0,30.0
```

---

## 3. Detailed Attribute Specifications

### 3.1 Geographic Coordinates

**Latitude** (`latitude`)
- **Unit**: Degrees (WGS84)
- **Range**: 12.8 to 13.2 (Bangalore area)
- **Precision**: 4 decimal places (±11 meters)
- **Example**: 12.9716
- **Key Locations**:
  - MG Road: 12.9716, 77.5946
  - Chinnaswamy Stadium: 12.9789, 77.5996
  - Electronic City: 12.8456, 77.6603
  - Whitefield: 12.9698, 77.7499

**Longitude** (`longitude`)
- **Unit**: Degrees (WGS84)
- **Range**: 77.4 to 77.8 (Bangalore area)
- **Precision**: 4 decimal places (±11 meters)
- **Example**: 77.5946

### 3.2 Traffic Speed

**Current Speed** (`current_speed`)
- **Unit**: Kilometers per hour (km/h)
- **Range**: 0 to 80 km/h
- **Typical Values**:
  - Gridlock: 0-10 km/h
  - Heavy traffic: 10-20 km/h
  - Moderate traffic: 20-35 km/h
  - Light traffic: 35-50 km/h
  - Free flow: 50-80 km/h
- **Source**: TomTom Traffic API (`currentSpeed` field)
- **Example**: 15.5 km/h

**Free Flow Speed** (for calculation only)
- **Unit**: km/h
- **Range**: 40-80 km/h
- **Source**: TomTom Traffic API (`freeFlowSpeed` field)
- **Usage**: Calculate congestion_ratio

### 3.3 Congestion Ratio

**Congestion Ratio** (`congestion_ratio`)
- **Unit**: Dimensionless ratio
- **Range**: 0.0 to 5.0
- **Calculation**: `max(0, 1 - (current_speed / free_flow_speed))`
- **Interpretation**:
  - 0.0-0.5: Free flow
  - 0.5-1.5: Light congestion
  - 1.5-2.5: Moderate congestion
  - 2.5-3.5: Heavy congestion
  - 3.5-5.0: Severe congestion/gridlock
- **Example**: 3.2 (heavy congestion)

**Calculation Example**:
```python
current_speed = 15.5  # km/h
free_flow_speed = 50.0  # km/h
congestion_ratio = max(0, 1 - (15.5 / 50.0))
# Result: 0.69 (but can be scaled up for severity)

# Alternative scaling for better representation:
congestion_ratio = (free_flow_speed - current_speed) / 10
# Result: (50 - 15.5) / 10 = 3.45
```

### 3.4 Weather Data

**Rain** (`rain`)
- **Unit**: Millimeters per hour (mm/h)
- **Range**: 0 to 50 mm/h
- **Typical Values**:
  - No rain: 0 mm/h
  - Light rain: 0.1-2.5 mm/h
  - Moderate rain: 2.5-10 mm/h
  - Heavy rain: 10-50 mm/h
  - Very heavy rain: >50 mm/h
- **Source**: OpenWeather API (`rain.1h` field)
- **Example**: 2.5 mm/h (moderate rain)

**Additional Weather Fields** (optional):
- Temperature: 15-35°C (Bangalore)
- Humidity: 40-90%
- Wind speed: 0-20 km/h
- Visibility: 1-10 km

### 3.5 Incident Flags

**Accident** (`accident`)
- **Unit**: Boolean (0 or 1)
- **Range**: 0 (no accident) or 1 (accident reported)
- **Source**: Manual labeling, news APIs, or TomTom incidents
- **Impact**: Typically causes 50-100% increase in delay
- **Example**: 0 (no accident)

**Event** (`event`)
- **Unit**: Boolean (0 or 1)
- **Range**: 0 (no event) or 1 (event nearby)
- **Source**: Google Places API (nearby events within 2km)
- **Examples**:
  - Cricket match at Chinnaswamy Stadium
  - Concert at Bangalore Palace
  - Festival celebration
  - Tech conference
- **Impact**: Typically causes 30-80% increase in traffic
- **Example**: 1 (event happening)

### 3.6 Labels (for supervised learning)

**Cause Label** (`cause_label`)
- **Unit**: Integer category (0-4)
- **Range**: 0 to 4
- **Categories**:
  - 0: Heavy rush hour traffic
  - 1: Road construction ahead
  - 2: Traffic accident reported
  - 3: Special event in the area
  - 4: Weather conditions affecting traffic
- **Source**: Manual labeling or rule-based
- **Example**: 0 (rush hour)

**Delay Minutes** (`delay_minutes`)
- **Unit**: Minutes
- **Range**: 0 to 120 minutes
- **Typical Values**:
  - No delay: 0-5 minutes
  - Light delay: 5-15 minutes
  - Moderate delay: 15-30 minutes
  - Heavy delay: 30-60 minutes
  - Severe delay: 60+ minutes
- **Calculation**: Based on congestion_ratio and cause
- **Example**: 38.4 minutes

---

## 4. Data Distribution Guidelines

### 4.1 Temporal Distribution

**Time of Day** (samples needed per hour):
- 00:00-06:00 (Night): 10% of samples
- 06:00-10:00 (Morning Rush): 25% of samples
- 10:00-16:00 (Midday): 20% of samples
- 16:00-20:00 (Evening Rush): 30% of samples
- 20:00-24:00 (Night): 15% of samples

**Day of Week**:
- Weekdays (Mon-Fri): 70% of samples
- Weekends (Sat-Sun): 30% of samples

**Seasons** (Bangalore):
- Summer (Mar-May): 25%
- Monsoon (Jun-Sep): 35%
- Post-Monsoon (Oct-Nov): 20%
- Winter (Dec-Feb): 20%

### 4.2 Cause Distribution

Target distribution for `cause_label`:
- Rush hour (0): 40% of samples
- Construction (1): 15% of samples
- Accident (2): 10% of samples
- Event (3): 20% of samples
- Weather (4): 15% of samples

### 4.3 Congestion Distribution

- Free flow (0.0-0.5): 15%
- Light (0.5-1.5): 20%
- Moderate (1.5-2.5): 25%
- Heavy (2.5-3.5): 25%
- Severe (3.5-5.0): 15%

---

## 5. Sample Data Generation Script

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_dataset(n_samples=10000):
    """Generate synthetic training dataset"""
    
    np.random.seed(42)
    
    # Bangalore coordinates (key locations)
    locations = [
        (12.9716, 77.5946),  # MG Road
        (12.9789, 77.5996),  # Chinnaswamy Stadium
        (12.9698, 77.7499),  # Whitefield
        (12.8456, 77.6603),  # Electronic City
        (13.0358, 77.6208),  # Manyata Tech Park
    ]
    
    data = []
    start_date = datetime(2026, 1, 1)
    
    for i in range(n_samples):
        # Random timestamp
        timestamp = start_date + timedelta(minutes=np.random.randint(0, 60*24*120))
        hour = timestamp.hour
        
        # Random location
        lat, lon = locations[np.random.randint(0, len(locations))]
        lat += np.random.uniform(-0.01, 0.01)
        lon += np.random.uniform(-0.01, 0.01)
        
        # Determine scenario based on time and random factors
        is_rush_hour = (6 <= hour <= 10) or (16 <= hour <= 20)
        has_event = np.random.random() < 0.2
        has_accident = np.random.random() < 0.1
        has_rain = np.random.random() < 0.15
        
        # Generate traffic speed based on scenario
        if has_accident:
            current_speed = np.random.uniform(5, 15)
            cause = 2
        elif has_event:
            current_speed = np.random.uniform(10, 25)
            cause = 3
        elif has_rain:
            current_speed = np.random.uniform(20, 40)
            cause = 4
        elif is_rush_hour:
            current_speed = np.random.uniform(10, 30)
            cause = 0
        else:
            current_speed = np.random.uniform(30, 70)
            cause = 1 if np.random.random() < 0.3 else 0
        
        # Calculate congestion
        free_flow_speed = np.random.uniform(50, 70)
        congestion_ratio = max(0, (free_flow_speed - current_speed) / 10)
        congestion_ratio = min(5.0, congestion_ratio)
        
        # Rain amount
        rain = np.random.uniform(2, 15) if has_rain else 0.0
        
        # Calculate delay
        delay = congestion_ratio * (10 + np.random.uniform(-2, 5))
        
        data.append({
            'id': i + 1,
            'latitude': round(lat, 4),
            'longitude': round(lon, 4),
            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'current_speed': round(current_speed, 1),
            'congestion_ratio': round(congestion_ratio, 2),
            'rain': round(rain, 1),
            'accident': int(has_accident),
            'event': int(has_event),
            'cause_label': cause,
            'delay_minutes': round(delay, 1)
        })
    
    df = pd.DataFrame(data)
    return df

# Generate dataset
df = generate_sample_dataset(10000)
df.to_csv('training_data.csv', index=False)
print(f"Generated {len(df)} samples")
print("\nDataset statistics:")
print(df.describe())
print("\nCause distribution:")
print(df['cause_label'].value_counts().sort_index())
```

---

## 6. Data Quality Checklist

### ✅ Completeness
- [ ] All required columns present
- [ ] No missing values in critical fields
- [ ] Timestamps are sequential and valid
- [ ] Geographic coordinates within Bangalore bounds

### ✅ Consistency
- [ ] Speed values are non-negative
- [ ] Congestion ratio between 0 and 5
- [ ] Rain values are non-negative
- [ ] Boolean flags are 0 or 1
- [ ] Cause labels are 0-4

### ✅ Accuracy
- [ ] Speeds match typical Bangalore traffic
- [ ] Congestion correlates with speed
- [ ] Rain values are realistic
- [ ] Event flags match actual events
- [ ] Delays are proportional to congestion

### ✅ Diversity
- [ ] All hours of day represented
- [ ] All days of week represented
- [ ] All cause types represented
- [ ] Various weather conditions
- [ ] Multiple locations covered

---

## 7. Real API Response Examples

### TomTom Traffic API Response
```json
{
  "flowSegmentData": {
    "frc": "FRC3",
    "currentSpeed": 15,
    "freeFlowSpeed": 50,
    "currentTravelTime": 240,
    "freeFlowTravelTime": 72,
    "confidence": 0.95,
    "roadClosure": false
  }
}
```

**Extract**:
- `current_speed` = `currentSpeed` (15 km/h)
- `free_flow_speed` = `freeFlowSpeed` (50 km/h)
- `congestion_ratio` = (50 - 15) / 10 = 3.5

### OpenWeather API Response
```json
{
  "weather": [{"main": "Rain", "description": "moderate rain"}],
  "main": {
    "temp": 25.5,
    "humidity": 78
  },
  "rain": {
    "1h": 3.2
  },
  "wind": {
    "speed": 4.5
  }
}
```

**Extract**:
- `rain` = `rain.1h` (3.2 mm/h)
- Optional: temperature, humidity, wind

### Google Places API Response
```json
{
  "results": [
    {
      "name": "IPL Cricket Match",
      "vicinity": "M Chinnaswamy Stadium",
      "geometry": {
        "location": {"lat": 12.9789, "lng": 77.5996}
      }
    }
  ]
}
```

**Extract**:
- `event` = 1 if `results.length > 0`, else 0

---

## 8. Minimum Dataset Requirements

### For Initial Training (MVP)
- **Samples**: 10,000 minimum
- **Duration**: 2 weeks of continuous collection
- **Locations**: 5+ key locations
- **Time Coverage**: All hours of day
- **Cause Coverage**: All 5 cause types

### For Production Quality
- **Samples**: 50,000+ recommended
- **Duration**: 4-8 weeks of continuous collection
- **Locations**: 10+ locations across Bangalore
- **Time Coverage**: Multiple weeks, all days
- **Cause Coverage**: Balanced distribution

---

## 9. Data Validation Rules

```python
def validate_sample(row):
    """Validate a single data sample"""
    
    errors = []
    
    # Geographic bounds (Bangalore)
    if not (12.8 <= row['latitude'] <= 13.2):
        errors.append("Latitude out of bounds")
    if not (77.4 <= row['longitude'] <= 77.8):
        errors.append("Longitude out of bounds")
    
    # Speed validation
    if not (0 <= row['current_speed'] <= 80):
        errors.append("Speed out of range")
    
    # Congestion validation
    if not (0 <= row['congestion_ratio'] <= 5):
        errors.append("Congestion ratio out of range")
    
    # Rain validation
    if row['rain'] < 0:
        errors.append("Rain cannot be negative")
    
    # Boolean validation
    if row['accident'] not in [0, 1]:
        errors.append("Accident must be 0 or 1")
    if row['event'] not in [0, 1]:
        errors.append("Event must be 0 or 1")
    
    # Cause validation
    if row['cause_label'] not in [0, 1, 2, 3, 4]:
        errors.append("Invalid cause label")
    
    # Delay validation
    if row['delay_minutes'] < 0:
        errors.append("Delay cannot be negative")
    
    # Logical consistency
    if row['current_speed'] > 50 and row['congestion_ratio'] > 2:
        errors.append("High speed with high congestion is inconsistent")
    
    return errors
```

---

## 10. Export Formats

### CSV Format (Recommended)
```csv
id,latitude,longitude,timestamp,current_speed,congestion_ratio,rain,accident,event,cause_label,delay_minutes
1,12.9716,77.5946,2026-04-18 08:30:00,15.5,3.2,0.0,0,0,0,38.4
```

### JSON Format
```json
[
  {
    "id": 1,
    "latitude": 12.9716,
    "longitude": 77.5946,
    "timestamp": "2026-04-18T08:30:00Z",
    "current_speed": 15.5,
    "congestion_ratio": 3.2,
    "rain": 0.0,
    "accident": false,
    "event": false,
    "cause_label": 0,
    "delay_minutes": 38.4
  }
]
```

### NumPy Format (for ML)
```python
# Features (X)
X = np.array([
    [15.5, 3.2, 0.0, 0, 0],  # [speed, congestion, rain, accident, event]
    # ... more samples
])

# Labels (y)
y_cause = np.array([0, ...])  # Cause labels
y_delay = np.array([38.4, ...])  # Delay values
```

---

## Summary

Use this specification to:
1. ✅ Understand exact data format and ranges
2. ✅ Generate synthetic training data
3. ✅ Validate collected data
4. ✅ Ensure data quality and consistency
5. ✅ Prepare data for ML training

**Key Ranges**:
- Speed: 0-80 km/h
- Congestion: 0-5 ratio
- Rain: 0-50 mm/h
- Delay: 0-120 minutes
- Coordinates: Bangalore area (12.8-13.2, 77.4-77.8)
