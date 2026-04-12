# Ollama Deep Researcher - Automated Setup Script for Windows
# Run this script in PowerShell: .\setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ollama Deep Researcher - Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Step 1: Check Python
Write-Host "[1/8] Checking Python installation..." -ForegroundColor Yellow
if (Test-Command python) {
    $pythonVersion = python --version
    Write-Host "✓ Python found: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found!" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ from https://www.python.org/downloads/" -ForegroundColor Red
    Write-Host "Make sure to check 'Add Python to PATH' during installation" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check Ollama
Write-Host ""
Write-Host "[2/8] Checking Ollama installation..." -ForegroundColor Yellow
if (Test-Command ollama) {
    $ollamaVersion = ollama --version
    Write-Host "✓ Ollama found: $ollamaVersion" -ForegroundColor Green
    
    # Check if Ollama is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 5
        Write-Host "✓ Ollama service is running" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠ Ollama is installed but not running" -ForegroundColor Yellow
        Write-Host "Starting Ollama service..." -ForegroundColor Yellow
        Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
        Start-Sleep -Seconds 3
    }
} else {
    Write-Host "✗ Ollama not found!" -ForegroundColor Red
    Write-Host "Please install Ollama from https://ollama.ai" -ForegroundColor Yellow
    Write-Host "Or continue with LMStudio (you'll need to configure it manually)" -ForegroundColor Yellow
    $continue = Read-Host "Continue without Ollama? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Step 3: Check for models
Write-Host ""
Write-Host "[3/8] Checking for Ollama models..." -ForegroundColor Yellow
if (Test-Command ollama) {
    $models = ollama list 2>&1
    if ($models -match "llama3.2:1b|llama3.2:3b|qwen2.5:7b") {
        Write-Host "✓ Compatible model found" -ForegroundColor Green
    } else {
        Write-Host "⚠ No compatible models found" -ForegroundColor Yellow
        Write-Host "Available models to download:" -ForegroundColor Cyan
        Write-Host "  1. llama3.2:1b (Fastest, ~1.3GB)" -ForegroundColor White
        Write-Host "  2. llama3.2:3b (Balanced, ~2GB)" -ForegroundColor White
        Write-Host "  3. qwen2.5:7b (Best quality, ~4.7GB)" -ForegroundColor White
        
        $choice = Read-Host "Download a model? (1/2/3/n)"
        switch ($choice) {
            "1" { 
                Write-Host "Downloading llama3.2:1b..." -ForegroundColor Yellow
                ollama pull llama3.2:1b 
            }
            "2" { 
                Write-Host "Downloading llama3.2:3b..." -ForegroundColor Yellow
                ollama pull llama3.2:3b 
            }
            "3" { 
                Write-Host "Downloading qwen2.5:7b..." -ForegroundColor Yellow
                ollama pull qwen2.5:7b 
            }
            default { 
                Write-Host "Skipping model download" -ForegroundColor Yellow 
            }
        }
    }
}

# Step 4: Install uv (optional but recommended)
Write-Host ""
Write-Host "[4/8] Checking uv package manager..." -ForegroundColor Yellow
if (Test-Command uv) {
    Write-Host "✓ uv is already installed" -ForegroundColor Green
} else {
    Write-Host "⚠ uv not found" -ForegroundColor Yellow
    $installUv = Read-Host "Install uv for faster package management? (y/n)"
    if ($installUv -eq "y") {
        Write-Host "Installing uv..." -ForegroundColor Yellow
        pip install uv
        Write-Host "✓ uv installed" -ForegroundColor Green
    }
}

# Step 5: Install project dependencies
Write-Host ""
Write-Host "[5/8] Installing project dependencies..." -ForegroundColor Yellow
if (Test-Command uv) {
    Write-Host "Using uv for installation..." -ForegroundColor Cyan
    uv pip install -e .
} else {
    Write-Host "Using pip for installation..." -ForegroundColor Cyan
    pip install -e .
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Step 6: Install Playwright browsers
Write-Host ""
Write-Host "[6/8] Installing Playwright browsers..." -ForegroundColor Yellow
playwright install chromium

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Playwright browsers installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Playwright installation had issues (non-critical)" -ForegroundColor Yellow
}

# Step 7: Setup .env file
Write-Host ""
Write-Host "[7/8] Setting up environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "⚠ .env file already exists" -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite existing .env? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Keeping existing .env file" -ForegroundColor Cyan
    } else {
        Copy-Item ".env.example" ".env" -Force
        Write-Host "✓ .env file created from template" -ForegroundColor Green
    }
} else {
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created from template" -ForegroundColor Green
}

# Step 8: Test the setup
Write-Host ""
Write-Host "[8/8] Testing the setup..." -ForegroundColor Yellow

# Test Python imports
Write-Host "Testing Python packages..." -ForegroundColor Cyan
$testImport = python -c "import langgraph; import langchain_ollama; print('OK')" 2>&1
if ($testImport -match "OK") {
    Write-Host "✓ Python packages working" -ForegroundColor Green
} else {
    Write-Host "✗ Python package test failed" -ForegroundColor Red
}

# Test Ollama connection
if (Test-Command ollama) {
    Write-Host "Testing Ollama connection..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/tags" -UseBasicParsing -TimeoutSec 5
        Write-Host "✓ Ollama connection working" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Cannot connect to Ollama" -ForegroundColor Red
        Write-Host "Try running: ollama serve" -ForegroundColor Yellow
    }
}

# Create output directory
if (-not (Test-Path "roadmap_outputs")) {
    New-Item -ItemType Directory -Path "roadmap_outputs" | Out-Null
    Write-Host "✓ Created roadmap_outputs directory" -ForegroundColor Green
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review and edit .env file if needed" -ForegroundColor White
Write-Host "2. Start the development server:" -ForegroundColor White
Write-Host "   uvx --refresh --from `"langgraph-cli[inmem]`" --with-editable . --python 3.11 langgraph dev" -ForegroundColor Cyan
Write-Host "3. Open http://localhost:2024 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see SETUP_GUIDE.md" -ForegroundColor Yellow
Write-Host ""

# Ask if user wants to start the server
$startServer = Read-Host "Start the development server now? (y/n)"
if ($startServer -eq "y") {
    Write-Host ""
    Write-Host "Starting LangGraph development server..." -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev
}
