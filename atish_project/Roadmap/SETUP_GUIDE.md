# Step-by-Step Setup Guide for Ollama Deep Researcher

This guide will walk you through setting up the Ollama Deep Researcher project from scratch on Windows.

## Table of Contents
1. [Prerequisites Installation](#step-1-prerequisites-installation)
2. [Install Python](#step-2-install-python)
3. [Install LLM Provider](#step-3-install-llm-provider)
4. [Clone the Project](#step-4-clone-the-project)
5. [Install Project Dependencies](#step-5-install-project-dependencies)
6. [Configure Environment](#step-6-configure-environment)
7. [Test the Setup](#step-7-test-the-setup)
8. [Run the Application](#step-8-run-the-application)
9. [Verify Everything Works](#step-9-verify-everything-works)

---

## Step 1: Prerequisites Installation

### Check Python Version

Open PowerShell or Command Prompt and check if Python is installed:

```bash
python --version
```

You need Python 3.11 or higher. If not installed, proceed to Step 2.

---

## Step 2: Install Python

### Option A: Using Official Python Installer (Recommended)

1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download Python 3.11 or 3.12 (latest stable)
3. Run the installer
4. **IMPORTANT**: Check "Add Python to PATH" during installation
5. Click "Install Now"
6. Verify installation:

```bash
python --version
pip --version
```

### Option B: Using Chocolatey (Windows Package Manager)

```bash
# Install Chocolatey first (if not installed)
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Python
choco install python311 -y

# Verify
python --version
```

---

## Step 3: Install LLM Provider

You need either Ollama OR LMStudio. Choose one:

### Option A: Install Ollama (Recommended for Beginners)

1. **Download Ollama**
   - Go to [ollama.ai](https://ollama.ai)
   - Click "Download for Windows"
   - Run the installer

2. **Verify Ollama Installation**

```bash
ollama --version
```

3. **Pull a Model**

For quick testing (smaller model):
```bash
ollama pull llama3.2:1b
```

For better quality (larger model):
```bash
ollama pull qwen2.5:7b
```

Or for the best results:
```bash
ollama pull llama3.2:3b
```

4. **Verify Ollama is Running**

```bash
# Check if Ollama service is running
curl http://localhost:11434/api/tags
```

If you get a response with model information, Ollama is working!

### Option B: Install LMStudio (Alternative)

1. **Download LMStudio**
   - Go to [lmstudio.ai](https://lmstudio.ai)
   - Download for Windows
   - Install the application

2. **Load a Model**
   - Open LMStudio
   - Go to "Search" tab
   - Search for "Qwen2.5-7B-Instruct" or "Llama-3.2-3B-Instruct"
   - Download the model
   - Go to "Local Server" tab
   - Load the model
   - Click "Start Server"

3. **Verify LMStudio Server**
   - Ensure server is running on `http://localhost:1234`
   - Check the status in LMStudio interface

---

## Step 4: Clone the Project

### Option A: Using Git

1. **Install Git** (if not installed)
   - Download from [git-scm.com](https://git-scm.com/download/win)
   - Or using Chocolatey: `choco install git -y`

2. **Clone the Repository**

```bash
# Navigate to your projects folder
cd C:\Users\YourUsername\Projects

# Clone the repository
git clone <repository-url>
cd ollama-deep-researcher
```

### Option B: Download ZIP

1. Download the project as ZIP from GitHub
2. Extract to your desired location
3. Open terminal in that folder

```bash
cd C:\path\to\ollama-deep-researcher
```

---

## Step 5: Install Project Dependencies

### Option A: Using uv (Recommended - Faster)

1. **Install uv Package Manager**

```bash
# Using pip
pip install uv
```

Or using PowerShell:
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

2. **Install Project Dependencies**

```bash
# Install the project in editable mode
uv pip install -e .
```

3. **Install Playwright Browsers**

```bash
playwright install chromium
```

### Option B: Using pip (Traditional Method)

1. **Create Virtual Environment**

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On PowerShell:
.\venv\Scripts\Activate.ps1

# On Command Prompt:
.\venv\Scripts\activate.bat
```

2. **Install Dependencies**

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Install project
pip install -e .
```

3. **Install Playwright Browsers**

```bash
playwright install chromium
```

---

## Step 6: Configure Environment

1. **Copy Example Environment File**

```bash
# Copy .env.example to .env
copy .env.example .env
```

2. **Edit .env File**

Open `.env` in your favorite text editor (Notepad, VS Code, etc.) and configure:

### Basic Configuration (Minimum Required)

```bash
# Search Configuration
SEARCH_API=duckduckgo              # No API key needed!

# LLM Configuration - Choose ONE:

# If using Ollama:
LLM_PROVIDER=ollama
LOCAL_LLM=llama3.2:1b              # Or qwen2.5:7b, llama3.2:3b
OLLAMA_BASE_URL=http://localhost:11434

# If using LMStudio:
# LLM_PROVIDER=lmstudio
# LOCAL_LLM=qwen2.5-7b-instruct     # Model name in LMStudio
# LMSTUDIO_BASE_URL=http://localhost:1234/v1

# Research Configuration
MAX_WEB_RESEARCH_LOOPS=1           # Start with 1, increase later
FETCH_FULL_PAGE=True
GENERATE_ROADMAP=True
GENERATE_MERMAID_DIAGRAM=True
```

### Optional: Add API Keys (For Better Search Results)

```bash
# Optional: Tavily Search (better results)
# Get free API key from https://tavily.com
TAVILY_API_KEY=tvly-xxxxx

# Optional: Perplexity Search
# Get API key from https://www.perplexity.ai
PERPLEXITY_API_KEY=pplx-xxxxx
```

3. **Save the .env File**

---

## Step 7: Test the Setup

### Test 1: Verify Python Packages

```bash
python -c "import langgraph; import langchain_ollama; print('✓ Packages installed successfully')"
```

### Test 2: Verify Ollama Connection (if using Ollama)

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Or using Python
python -c "import requests; r = requests.get('http://localhost:11434/api/tags'); print('✓ Ollama connected' if r.status_code == 200 else '✗ Ollama not responding')"
```

### Test 3: Verify LMStudio Connection (if using LMStudio)

```bash
# Check LMStudio server
curl http://localhost:1234/v1/models
```

### Test 4: Test Search API

```bash
python -c "from ollama_deep_researcher.utils import duckduckgo_search; result = duckduckgo_search('test query', max_results=1); print('✓ Search working' if result['results'] else '✗ Search failed')"
```

---

## Step 8: Run the Application

### Method 1: Using LangGraph CLI (Recommended)

1. **Start the Development Server**

```bash
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev
```

2. **Access the Application**
   - Open your browser
   - Go to `http://localhost:2024`
   - You should see LangGraph Studio interface

### Method 2: Using Python Script

Create a test script `test_research.py`:

```python
from ollama_deep_researcher.graph import graph

# Run research
result = graph.invoke({
    "research_topic": "Python programming basics"
})

# Print results
print("\n=== SUMMARY ===")
print(result["running_summary"])

if result.get("roadmap"):
    print("\n=== ROADMAP ===")
    print(result["roadmap"])

if result.get("mermaid_diagram"):
    print("\n=== DIAGRAM ===")
    print(result["mermaid_diagram"])
```

Run it:
```bash
python test_research.py
```

### Method 3: Using Docker

1. **Install Docker Desktop**
   - Download from [docker.com](https://www.docker.com/products/docker-desktop)
   - Install and start Docker Desktop

2. **Build and Run**

```bash
# Build the image
docker build -t ollama-deep-researcher .

# Run the container
docker run -p 2024:2024 ^
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 ^
  -e SEARCH_API=duckduckgo ^
  ollama-deep-researcher
```

---

## Step 9: Verify Everything Works

### Quick Test Research

1. **Start the server** (if using LangGraph CLI):
```bash
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev
```

2. **Open LangGraph Studio** at `http://localhost:2024`

3. **Run a test query**:
   - Input: `{"research_topic": "Machine Learning basics"}`
   - Click "Run"
   - Wait for results

4. **Check outputs**:
   - Summary should appear
   - Roadmap should be generated
   - Diagram files should be in `roadmap_outputs/` folder

### Expected Output Structure

```
roadmap_outputs/
├── machine_learning_basics_diagram.html
├── machine_learning_basics_diagram.png
└── machine_learning_basics_diagram.svg
```

---

## Troubleshooting Common Issues

### Issue 1: "Module not found" Error

**Solution:**
```bash
# Reinstall dependencies
pip install -e .
```

### Issue 2: Ollama Not Responding

**Solution:**
```bash
# Check if Ollama is running
ollama serve

# In another terminal, test
ollama list
```

### Issue 3: Playwright Browser Not Found

**Solution:**
```bash
# Install browsers
playwright install chromium

# Or all browsers
playwright install
```

### Issue 4: Port 2024 Already in Use

**Solution:**
```bash
# Use a different port
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev --port 8080
```

### Issue 5: Search API Timeout

**Solution:**
- Check your internet connection
- Try a different search API in `.env`:
```bash
SEARCH_API=tavily  # If you have API key
```

### Issue 6: LLM Response Too Slow

**Solution:**
- Use a smaller model:
```bash
ollama pull llama3.2:1b
```
- Update `.env`:
```bash
LOCAL_LLM=llama3.2:1b
```

---

## Next Steps

### 1. Customize Configuration

Edit `.env` to adjust:
- `MAX_WEB_RESEARCH_LOOPS` - Increase for deeper research (2-5)
- `FETCH_FULL_PAGE` - Set to `False` for faster searches
- Try different models for better quality

### 2. Try Different Research Topics

```python
# Career research
{"research_topic": "Full Stack Developer career path"}

# Technical research
{"research_topic": "Docker containerization best practices"}

# Learning roadmap
{"research_topic": "Data Science learning path"}
```

### 3. Explore Advanced Features

- Add Tavily API key for better search results
- Try different LLM models
- Customize prompts in `src/ollama_deep_researcher/prompts.py`
- Adjust diagram styling in `mermaid_renderer.py`

### 4. Integration

Use the graph in your own Python projects:

```python
from ollama_deep_researcher.graph import graph

result = graph.invoke({
    "research_topic": "Your topic here"
})

# Access results
summary = result["running_summary"]
roadmap = result["roadmap"]
diagram = result["mermaid_diagram"]
```

---

## Quick Reference Commands

```bash
# Start Ollama
ollama serve

# Pull a model
ollama pull llama3.2:1b

# Install dependencies
pip install -e .

# Install browsers
playwright install chromium

# Start development server
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev

# Run tests
python test_research.py
```

---

## Getting Help

- Check `README.md` for detailed documentation
- Read `HOW_IT_WORKS.md` for architecture details
- Open an issue on GitHub for bugs
- Check Ollama docs: [ollama.ai/docs](https://ollama.ai/docs)
- Check LangGraph docs: [langchain-ai.github.io/langgraph](https://langchain-ai.github.io/langgraph/)

---

## Success Checklist

- [ ] Python 3.11+ installed
- [ ] Ollama or LMStudio installed and running
- [ ] Model downloaded and loaded
- [ ] Project dependencies installed
- [ ] Playwright browsers installed
- [ ] `.env` file configured
- [ ] LangGraph dev server starts successfully
- [ ] Test research query completes
- [ ] Output files generated in `roadmap_outputs/`

**Congratulations! Your Ollama Deep Researcher is ready to use! 🎉**
