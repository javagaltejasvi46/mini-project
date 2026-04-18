#!/bin/bash

echo "🚀 SmartRoute AI Setup Script"
echo "=============================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.10 or higher."
    exit 1
fi

echo "✓ Python found: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found in PATH. Make sure it's installed."
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
python3 -m pip install -r requirements.txt
cd ..

echo ""
echo "📦 Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Create PostgreSQL database: createdb smartroute"
echo "2. Enable PostGIS: psql smartroute -c 'CREATE EXTENSION postgis;'"
echo "3. Copy backend/.env.example to backend/.env and add your API keys"
echo "4. Initialize database: cd backend && python init_db.py"
echo "5. Generate training data: python generate_sample_dataset.py 10000 csv"
echo "6. Train models: python ml/train_tabnet.py"
echo "7. Start backend: python main.py"
echo "8. Start frontend: cd frontend && npm run dev"
echo ""
echo "📚 See README.md for detailed instructions"
