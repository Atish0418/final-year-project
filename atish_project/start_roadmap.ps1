# Roadmap Backend Starter Script
# This script installs dependencies and starts the FastAPI server for roadmap generation.

Write-Host "--- Career Compass Roadmap Backend Starter ---" -ForegroundColor Cyan

# Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit
}

# Navigate to roadmap directory
cd roadmap

# Create virtual environment if it doesn't exist
if (!(Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\.venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -e .
pip install fastapi uvicorn pydantic python-dotenv httpx langchain-core langchain-ollama langgraph langchain-openai

# Start server
Write-Host "Starting Roadmap Backend on http://localhost:8000" -ForegroundColor Green
Write-Host "Make sure Ollama is running!" -ForegroundColor Cyan
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
