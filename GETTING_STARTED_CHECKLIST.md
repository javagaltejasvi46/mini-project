# ✅ Getting Started Checklist

Follow this checklist to get SmartRoute AI running on your machine.

## Prerequisites Check

- [ ] Python 3.8+ installed
  ```bash
  python --version
  ```

- [ ] Node.js 16+ installed
  ```bash
  node --version
  ```

- [ ] npm installed (comes with Node.js)
  ```bash
  npm --version
  ```

- [ ] Git installed (optional, for version control)
  ```bash
  git --version
  ```

---

## Installation Steps

### Option A: Quick Start (Recommended for Windows)

- [ ] Open PowerShell in project directory
- [ ] Run the startup script:
  ```powershell
  .\start-dev.ps1
  ```
- [ ] Wait for both servers to start
- [ ] Open browser to http://localhost:5173

### Option B: Manual Setup

#### Backend Setup
- [ ] Open terminal/command prompt
- [ ] Navigate to backend folder:
  ```bash
  cd backend
  ```
- [ ] Install Python dependencies:
  ```bash
  pip install -r requirements.txt
  ```
- [ ] Start the backend server:
  ```bash
  python main.py
  ```
- [ ] Verify backend is running at http://localhost:8000
- [ ] Check API docs at http://localhost:8000/docs

#### Frontend Setup
- [ ] Open a NEW terminal/command prompt
- [ ] Navigate to frontend folder:
  ```bash
  cd frontend
  ```
- [ ] Install Node dependencies:
  ```bash
  npm install
  ```
- [ ] Start the development server:
  ```bash
  npm run dev
  ```
- [ ] Verify frontend is running at http://localhost:5173

---

## First Run Verification

- [ ] Open http://localhost:5173 in your browser
- [ ] You should see the SmartRoute AI homepage with purple gradient
- [ ] Try clicking a "Quick Location" button
- [ ] Click "🔍 Predict Traffic"
- [ ] Verify you see:
  - [ ] Traffic level circle with animation
  - [ ] Traffic reason card
  - [ ] Interactive traffic chart
  - [ ] Alternate routes (3 cards)
  - [ ] Smart recommendations

---

## API Testing

- [ ] Open http://localhost:8000/docs
- [ ] Click on "POST /predict"
- [ ] Click "Try it out"
- [ ] Use this test data:
  ```json
  {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "location_name": "Test Location"
  }
  ```
- [ ] Click "Execute"
- [ ] Verify you get a 200 response with traffic data

---

## Troubleshooting

### If Backend Won't Start

- [ ] Check Python version (must be 3.8+)
- [ ] Try upgrading pip:
  ```bash
  pip install --upgrade pip
  ```
- [ ] Reinstall requirements:
  ```bash
  pip install -r requirements.txt --force-reinstall
  ```
- [ ] Check if port 8000 is already in use
- [ ] Look for error messages in terminal

### If Frontend Won't Start

- [ ] Check Node.js version (must be 16+)
- [ ] Delete node_modules and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```
- [ ] Clear npm cache:
  ```bash
  npm cache clean --force
  ```
- [ ] Check if port 5173 is already in use
- [ ] Look for error messages in terminal

### If You See CORS Errors

- [ ] Verify backend is running on port 8000
- [ ] Check backend terminal for CORS-related errors
- [ ] Ensure frontend is making requests to http://localhost:8000
- [ ] Restart both servers

### If Data Doesn't Load

- [ ] Open browser console (F12)
- [ ] Check for network errors
- [ ] Verify API endpoint is correct
- [ ] Test API directly at http://localhost:8000/docs
- [ ] Check both servers are running

---

## Next Steps After Setup

- [ ] Read [README.md](README.md) for project overview
- [ ] Explore [FEATURES.md](FEATURES.md) for detailed features
- [ ] Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand code
- [ ] Review [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for styling guide
- [ ] Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

---

## Development Workflow

### Making Changes

#### Backend Changes
- [ ] Edit files in `backend/` folder
- [ ] Save the file
- [ ] Backend auto-reloads (FastAPI hot reload)
- [ ] Test changes at http://localhost:8000

#### Frontend Changes
- [ ] Edit files in `frontend/src/` folder
- [ ] Save the file
- [ ] Frontend auto-reloads (Vite HMR)
- [ ] See changes instantly in browser

### Testing
- [ ] Test backend API at http://localhost:8000/docs
- [ ] Test frontend UI at http://localhost:5173
- [ ] Check browser console for errors (F12)
- [ ] Check terminal for server errors

---

## Common Tasks

### Stop Servers
- [ ] Press `Ctrl + C` in each terminal window
- [ ] Or close the terminal windows

### Restart Servers
- [ ] Stop servers (Ctrl + C)
- [ ] Run startup commands again
- [ ] Or use `.\start-dev.ps1` script

### View Logs
- [ ] Backend logs: Check terminal running `python main.py`
- [ ] Frontend logs: Check terminal running `npm run dev`
- [ ] Browser logs: Open DevTools (F12) → Console tab

### Update Dependencies

Backend:
```bash
cd backend
pip install -r requirements.txt --upgrade
```

Frontend:
```bash
cd frontend
npm update
```

---

## Ready to Deploy?

When you're ready for production:
- [ ] Read [DEPLOYMENT.md](DEPLOYMENT.md)
- [ ] Build frontend: `npm run build`
- [ ] Test production build
- [ ] Choose hosting platform
- [ ] Configure environment variables
- [ ] Deploy!

---

## Need Help?

- 📖 Check documentation files in project root
- 🐛 Look for error messages in terminals
- 🔍 Search for similar issues online
- 💬 Review code comments in source files

---

**Congratulations! You're all set up! 🎉**

Start building amazing traffic prediction features!
