# 🚀 Quick Start Guide

Get SmartRoute AI up and running in 5 minutes!

## Prerequisites

Make sure you have these installed:
- Python 3.8 or higher
- Node.js 16 or higher
- npm (comes with Node.js)

## Option 1: Automated Setup (Windows)

Simply run the PowerShell script:

```powershell
.\start-dev.ps1
```

This will:
1. Check your Python and Node.js installations
2. Install all dependencies
3. Start both backend and frontend servers
4. Open in separate terminal windows

## Option 2: Manual Setup

### Step 1: Start the Backend

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 2: Start the Frontend

Open a NEW terminal and run:

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### Step 3: Open Your Browser

Navigate to: `http://localhost:5173`

## Using the Application

1. **Enter Location**: Type a location name and coordinates
   - Or click one of the "Quick Locations" buttons

2. **Predict Traffic**: Click the "🔍 Predict Traffic" button

3. **View Results**:
   - Traffic level and reason
   - Interactive traffic trends chart
   - Alternate route suggestions
   - Smart recommendations

## Testing the API

Visit `http://localhost:8000/docs` to see the interactive API documentation (Swagger UI).

Try the `/predict` endpoint with this sample data:

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "location_name": "Times Square"
}
```

## Troubleshooting

### Backend won't start
- Make sure Python 3.8+ is installed: `python --version`
- Try: `pip install --upgrade pip` then reinstall requirements

### Frontend won't start
- Make sure Node.js is installed: `node --version`
- Delete `node_modules` folder and run `npm install` again
- Try: `npm cache clean --force`

### CORS errors
- Make sure backend is running on port 8000
- Check that frontend is making requests to `http://localhost:8000`

### Port already in use
- Backend: Change port in `backend/main.py` (line: `uvicorn.run(app, host="0.0.0.0", port=8000)`)
- Frontend: Vite will automatically suggest another port

## Next Steps

- Read [README.md](README.md) for detailed features
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand the codebase

## Need Help?

- Check the console for error messages
- Ensure all dependencies are installed
- Verify both servers are running
- Check that ports 8000 and 5173 are available

Happy coding! 🎉
