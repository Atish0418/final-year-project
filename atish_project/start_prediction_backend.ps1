# Start the Career Prediction Backend
Write-Host "Starting Career Prediction AI Backend..." -ForegroundColor Cyan

# Check for Python
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

# Change to the Career-Prediction directory
cd Career-Prediction

# Check if model files exist
if (!(Test-Path "career_model_labeled.pkl")) {
    Write-Host "Error: Model file 'career_model_labeled.pkl' not found." -ForegroundColor Red
    Write-Host "Please ensure the trained model is in the Career-Prediction folder." -ForegroundColor Yellow
    exit 1
}

# Install dependencies if needed
Write-Host "Verifying dependencies..." -ForegroundColor Gray
pip install fastapi uvicorn pandas scikit-learn scipy pydantic -q

# Run the server
python server.py
