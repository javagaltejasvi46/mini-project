# SmartRoute AI Setup Script for Windows
Write-Host "🚀 SmartRoute AI Setup Script" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.10 or higher." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16 or higher." -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
try {
    $pgVersion = psql --version 2>&1
    Write-Host "✓ PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL not found in PATH. Make sure it's installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Cyan
Set-Location backend
python -m pip install -r requirements.txt
Set-Location ..

Write-Host ""
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Cyan
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create PostgreSQL database using pgAdmin or psql"
Write-Host "2. Enable PostGIS extension in the database"
Write-Host "3. Copy backend\.env.example to backend\.env and add your API keys"
Write-Host "4. Initialize database: cd backend; python init_db.py"
Write-Host "5. Generate training data: python generate_sample_dataset.py 10000 csv"
Write-Host "6. Train models: python ml\train_tabnet.py"
Write-Host "7. Start backend: python main.py"
Write-Host "8. Start frontend: cd frontend; npm run dev"
Write-Host ""
Write-Host "📚 See README.md for detailed instructions" -ForegroundColor Cyan
