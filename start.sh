#!/bin/bash
# Quick start script for Business Listing Platform
# This script sets up and starts the entire platform locally

set -e

echo "=== Business Listing Platform - Quick Start ==="
echo ""

# Check prerequisites
echo "Checking prerequisites..."
command -v python3 >/dev/null 2>&1 || { echo "ERROR: Python 3 is required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "ERROR: Node.js is required"; exit 1; }
command -v docker >/dev/null 2>&1 && echo "Docker: ✓" || echo "Docker: not found (install for full setup)"
echo "Python: $(python3 --version)"
echo "Node: $(node --version)"
echo ""

# Start services
echo "Starting development servers..."
echo ""

# Start backend
echo "Starting backend on port 8000..."
cd "$(dirname "$0")/backend"
pip install -q -r requirements.txt 2>/dev/null
python run.py &

# Start frontend
echo "Starting frontend on port 5173..."
cd "$(dirname "$0")/frontend"
npm run dev &

echo ""
echo "=== Services Started ==="
echo "  Frontend:  http://localhost:5173"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/api/v1/docs"
echo ""
echo "Stop with: pkill -f 'run.py|vite'"
