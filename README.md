# 🚌 SmartRoute AI - Traffic Prediction System

```
   _____ __  __          _____ _______ _____   ____  _    _ _______ ______          _____ 
  / ____|  \/  |   /\   |  __ \__   __|  __ \ / __ \| |  | |__   __|  ____|   /\   |_   _|
 | (___ | \  / |  /  \  | |__) | | |  | |__) | |  | | |  | |  | |  | |__     /  \    | |  
  \___ \| |\/| | / /\ \ |  _  /  | |  |  _  /| |  | | |  | |  | |  |  __|   / /\ \   | |  
  ____) | |  | |/ ____ \| | \ \  | |  | | \ \| |__| | |__| |  | |  | |____ / ____ \ _| |_ 
 |_____/|_|  |_/_/    \_\_|  \_\ |_|  |_|  \_\\____/ \____/   |_|  |______/_/    \_\_____|
                                                                                            
```

A modern web application that uses deep neural networks to predict traffic patterns and suggest alternate routes for bus travelers.

## Features

- 🚦 Real-time traffic prediction
- 📊 Interactive traffic trend visualization
- 🗺️ Alternate route suggestions
- 💡 Smart travel recommendations
- 📍 Location-based analysis
- 🎯 High prediction confidence metrics

## Tech Stack

### Backend
- FastAPI (Python web framework)
- Pydantic (Data validation)
- Uvicorn (ASGI server)

### Frontend
- React 18
- Vite (Build tool)
- Modern CSS with animations
- Responsive design

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Run the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Start both backend and frontend servers
2. Open your browser to `http://localhost:5173`
3. Enter a location name and coordinates (or use quick location buttons)
4. Click "Predict Traffic" to get analysis
5. View traffic trends, reasons, and alternate routes

## API Endpoints

### POST /predict
Predicts traffic for a given location

Request body:
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "location_name": "Downtown"
}
```

Response includes:
- Current traffic level
- Traffic reason
- Prediction confidence
- Time-series traffic data
- Alternate routes
- Smart recommendations

## Future Enhancements

- Integration with real deep learning model
- Real-time traffic data from APIs
- User authentication
- Route history tracking
- Mobile app version
- Push notifications for traffic alerts

## Note

Currently uses placeholder data for demonstration. The deep neural network model integration is planned for future releases.
