# PostgreSQL Database Setup Script for SmartRoute AI
# Run this after PostGIS is installed

Write-Host "SmartRoute AI - Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Set PostgreSQL bin path
$PSQL = "C:\Program Files\PostgreSQL\18\bin\psql.exe"

# Prompt for password
Write-Host "Enter your PostgreSQL 'postgres' user password:" -ForegroundColor Yellow
$password = Read-Host -AsSecureString
$env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($password))

Write-Host ""
Write-Host "Step 1: Checking if database exists..." -ForegroundColor Green
$dbExists = & $PSQL -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname='smartroute';"

if ($dbExists -match "1") {
    Write-Host "✓ Database 'smartroute' already exists" -ForegroundColor Green
} else {
    Write-Host "Creating database 'smartroute'..." -ForegroundColor Yellow
    & $PSQL -U postgres -c "CREATE DATABASE smartroute;"
    Write-Host "✓ Database created successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Enabling PostGIS extension..." -ForegroundColor Green
& $PSQL -U postgres -d smartroute -c "CREATE EXTENSION IF NOT EXISTS postgis;"

Write-Host ""
Write-Host "Step 3: Verifying PostGIS installation..." -ForegroundColor Green
$postgisVersion = & $PSQL -U postgres -d smartroute -t -c "SELECT PostGIS_version();"

if ($postgisVersion) {
    Write-Host "✓ PostGIS is installed: $postgisVersion" -ForegroundColor Green
} else {
    Write-Host "✗ PostGIS installation failed. Please install PostGIS using Stack Builder." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 4: Creating sample table to test spatial features..." -ForegroundColor Green
& $PSQL -U postgres -d smartroute -c @"
CREATE TABLE IF NOT EXISTS test_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location GEOGRAPHY(Point, 4326)
);
"@

Write-Host "✓ Test table created" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✓ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Your database connection string:" -ForegroundColor Yellow
Write-Host "postgresql://postgres:YOUR_PASSWORD@localhost:5432/smartroute" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy backend/.env.example to backend/.env" -ForegroundColor White
Write-Host "2. Update DATABASE_URL in .env with your password" -ForegroundColor White
Write-Host "3. Get API keys for external services" -ForegroundColor White
Write-Host "4. Start implementing the backend!" -ForegroundColor White
Write-Host ""

# Clear password from environment
$env:PGPASSWORD = ""
