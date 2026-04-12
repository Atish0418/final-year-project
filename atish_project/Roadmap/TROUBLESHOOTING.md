# Troubleshooting Guide

Common issues and solutions for Ollama Deep Researcher

## Quick Diagnostics

Run this first to identify issues:

```bash
python test_setup.py
```

This will check:
- ✓ Python version
- ✓ Package installations
- ✓ Ollama connection
- ✓ Search API functionality
- ✓ Configuration files

---

## Common Issues

### 1. Python Import Errors

#### Error: `ModuleNotFoundError: No module named 'langgraph'`

**Cause**: Dependencies not installed

**Solution**:
```bash
# Reinstall dependencies
pip install -e .

# Or with uv
uv pip install -e .

# Verify installation
python -c "import langgraph; print('OK')"
```

#### Error: `ModuleNotFoundError: No module named 'ollama_deep_researcher'`

**Cause**: Project not installed in editable mode

**Solution**:
```bash
# Make sure you're in the project directory
cd ollama-deep-researcher

# Install in editable mode
pip install -e .
```

---

### 2. Ollama Connection Issues

#### Error: `Connection refused` or `Cannot connect to Ollama`

**Cause**: Ollama service not running

**Solution**:
```bash
# Start Ollama service
ollama serve

# In another terminal, verify
curl http://localhost:11434/api/tags

# Or check with Python
python -c "import requests; print(requests.get('http://localhost:11434/api/tags').status_code)"
```

#### Error: `No models found`

**Cause**: No models downloaded

**Solution**:
```bash
# List available models
ollama list

# Pull a model
ollama pull llama3.2:1b

# Verify
ollama list
```

#### Error: `Model not found: <model_name>`

**Cause**: Model name in .env doesn't match installed model

**Solution**:
```bash
# Check installed models
ollama list

# Update .env to match exact model name
# Example: LOCAL_LLM=llama3.2:1b
```

---

### 3. LMStudio Issues

#### Error: `Cannot connect to LMStudio`

**Cause**: LMStudio server not running or wrong URL

**Solution**:
1. Open LMStudio
2. Go to "Local Server" tab
3. Load a model
4. Click "Start Server"
5. Verify URL in .env matches (default: `http://localhost:1234/v1`)

```bash
# Test connection
curl http://localhost:1234/v1/models
```

#### Error: `Model not loaded in LMStudio`

**Cause**: No model loaded in LMStudio server

**Solution**:
1. Open LMStudio
2. Go to "Local Server" tab
3. Select a model from dropdown
4. Click "Load Model"
5. Wait for model to load
6. Update LOCAL_LLM in .env with exact model name

---

### 4. Search API Issues

#### Error: `Search timeout` or `No results returned`

**Cause**: Internet connection or API issues

**Solution**:
```bash
# Test internet connection
ping google.com

# Test DuckDuckGo search
python -c "from ollama_deep_researcher.utils import duckduckgo_search; print(duckduckgo_search('test', max_results=1))"

# Try different search API in .env
SEARCH_API=duckduckgo  # No API key needed
```

#### Error: `Tavily API key invalid`

**Cause**: Invalid or missing Tavily API key

**Solution**:
1. Get API key from [tavily.com](https://tavily.com)
2. Update .env:
```bash
TAVILY_API_KEY=tvly-your-actual-key-here
```

#### Error: `Perplexity API error`

**Cause**: Invalid API key or rate limit

**Solution**:
1. Verify API key at [perplexity.ai](https://www.perplexity.ai)
2. Check rate limits
3. Switch to DuckDuckGo temporarily:
```bash
SEARCH_API=duckduckgo
```

---

### 5. Playwright/Web Scraping Issues

#### Error: `Playwright browser not found`

**Cause**: Playwright browsers not installed

**Solution**:
```bash
# Install Chromium browser
playwright install chromium

# Or install all browsers
playwright install

# Verify
playwright --version
```

#### Error: `Timeout fetching URL`

**Cause**: Website blocking or slow response

**Solution**:
- This is normal for some websites
- The tool will fall back to snippets
- Try setting `FETCH_FULL_PAGE=False` in .env for faster results

---

### 6. Configuration Issues

#### Error: `.env file not found`

**Cause**: Environment file not created

**Solution**:
```bash
# Copy example file
copy .env.example .env

# Edit with your settings
notepad .env
```

#### Error: `Invalid configuration value`

**Cause**: Typo or invalid value in .env

**Solution**:
Check these common mistakes:
```bash
# Wrong (typo)
SEARCH_API=duckduckgo_search

# Correct
SEARCH_API=duckduckgo

# Wrong (invalid provider)
LLM_PROVIDER=openai

# Correct
LLM_PROVIDER=ollama

# Wrong (boolean as string)
FETCH_FULL_PAGE="True"

# Correct
FETCH_FULL_PAGE=True
```

---

### 7. LangGraph Server Issues

#### Error: `Port 2024 already in use`

**Cause**: Another process using port 2024

**Solution**:
```bash
# Use different port
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev --port 8080

# Or find and kill process on port 2024
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 2024).OwningProcess | Stop-Process
```

#### Error: `uvx command not found`

**Cause**: uv not installed or not in PATH

**Solution**:
```bash
# Install uv
pip install uv

# Or use pip directly
pip install langgraph-cli[inmem]
langgraph dev
```

---

### 8. Performance Issues

#### Issue: Research takes too long

**Solution**:
```bash
# Use faster settings in .env
MAX_WEB_RESEARCH_LOOPS=1
FETCH_FULL_PAGE=False
LOCAL_LLM=llama3.2:1b  # Smaller, faster model
```

#### Issue: Out of memory

**Solution**:
```bash
# Use smaller model
ollama pull llama3.2:1b

# Update .env
LOCAL_LLM=llama3.2:1b

# Reduce research depth
MAX_WEB_RESEARCH_LOOPS=1
```

#### Issue: Slow model responses

**Solution**:
1. Check CPU/GPU usage
2. Close other applications
3. Use smaller model:
```bash
ollama pull llama3.2:1b
```
4. Consider GPU acceleration (if available)

---

### 9. Output/Results Issues

#### Issue: No diagram files generated

**Cause**: Mermaid diagram generation disabled or failed

**Solution**:
```bash
# Enable in .env
GENERATE_MERMAID_DIAGRAM=True

# Check output directory exists
mkdir roadmap_outputs

# Check for errors in console output
```

#### Issue: Diagram files are empty or corrupted

**Cause**: Internet connection issue (for PNG/SVG) or invalid Mermaid syntax

**Solution**:
- HTML diagram should always work (offline)
- PNG/SVG require internet (uses Mermaid.ink API)
- Check console for Mermaid syntax errors
- View HTML file in browser as fallback

#### Issue: Summary is repetitive

**Cause**: Too many research loops or model hallucination

**Solution**:
```bash
# Reduce loops
MAX_WEB_RESEARCH_LOOPS=1

# Enable anti-repetition
PROCESS_SOURCES_INDIVIDUALLY=False
```

---

### 10. Windows-Specific Issues

#### Error: `Execution policy` error when running PowerShell scripts

**Cause**: PowerShell execution policy restriction

**Solution**:
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run setup script
.\setup.ps1
```

#### Error: `'python' is not recognized`

**Cause**: Python not in PATH

**Solution**:
1. Reinstall Python with "Add to PATH" checked
2. Or manually add to PATH:
   - Search "Environment Variables" in Windows
   - Edit PATH variable
   - Add Python installation directory

#### Error: Long path issues

**Cause**: Windows path length limitation

**Solution**:
```powershell
# Enable long paths (Run as Administrator)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

---

## Diagnostic Commands

### Check Python Environment
```bash
python --version
pip --version
pip list | grep langgraph
```

### Check Ollama
```bash
ollama --version
ollama list
curl http://localhost:11434/api/tags
```

### Check Project Installation
```bash
python -c "from ollama_deep_researcher.graph import graph; print('OK')"
```

### Check Configuration
```bash
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('LLM:', os.getenv('LLM_PROVIDER')); print('Model:', os.getenv('LOCAL_LLM')); print('Search:', os.getenv('SEARCH_API'))"
```

### Test Search
```bash
python -c "from ollama_deep_researcher.utils import duckduckgo_search; result = duckduckgo_search('test', max_results=1); print('Results:', len(result['results']))"
```

---

## Getting More Help

### 1. Run Full Diagnostics
```bash
python test_setup.py
```

### 2. Check Logs
Look for error messages in:
- Terminal output
- LangGraph Studio console
- Ollama logs (if running as service)

### 3. Enable Debug Mode
```python
# Add to your test script
import logging
logging.basicConfig(level=logging.DEBUG)
```

### 4. Community Support
- Open an issue on GitHub with:
  - Output of `python test_setup.py`
  - Error messages
  - Your .env configuration (remove API keys!)
  - Operating system and Python version

### 5. Documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [HOW_IT_WORKS.md](HOW_IT_WORKS.md) - Architecture
- [README.md](README.md) - Full documentation

---

## Prevention Tips

### Regular Maintenance
```bash
# Update dependencies
pip install --upgrade -e .

# Update Ollama
# Download latest from ollama.ai

# Update models
ollama pull llama3.2:1b
```

### Best Practices
1. Always run `python test_setup.py` after changes
2. Keep .env file backed up
3. Use version control for custom prompts
4. Monitor disk space (models can be large)
5. Restart Ollama service periodically

### Performance Optimization
```bash
# Optimal settings for speed
MAX_WEB_RESEARCH_LOOPS=1
FETCH_FULL_PAGE=False
LOCAL_LLM=llama3.2:1b
PROCESS_SOURCES_INDIVIDUALLY=False

# Optimal settings for quality
MAX_WEB_RESEARCH_LOOPS=3
FETCH_FULL_PAGE=True
LOCAL_LLM=qwen2.5:7b
SEARCH_API=tavily
```

---

**Still having issues? Run `python test_setup.py` and share the output when asking for help! 🔧**
