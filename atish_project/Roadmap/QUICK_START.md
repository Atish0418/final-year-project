# Quick Start Guide

Get up and running with Ollama Deep Researcher in 5 minutes!

## Prerequisites

- Windows 10/11
- Python 3.11+
- Internet connection

## Installation (5 Steps)

### 1. Install Ollama

```bash
# Download and install from https://ollama.ai
# Then pull a model:
ollama pull llama3.2:1b
```

### 2. Clone & Navigate

```bash
git clone <repository-url>
cd ollama-deep-researcher
```

### 3. Install Dependencies

```bash
pip install -e .
playwright install chromium
```

### 4. Configure Environment

```bash
# Copy example config
copy .env.example .env

# Edit .env - minimum required:
# SEARCH_API=duckduckgo
# LLM_PROVIDER=ollama
# LOCAL_LLM=llama3.2:1b
```

### 5. Test Setup

```bash
python test_setup.py
```

## Run the Application

### Option 1: LangGraph Studio (Recommended)

```bash
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev
```

Then open: http://localhost:2024

### Option 2: Python Script

```python
from ollama_deep_researcher.graph import graph

result = graph.invoke({
    "research_topic": "Python programming basics"
})

print(result["running_summary"])
```

## Example Research Topics

Try these in LangGraph Studio:

```json
{"research_topic": "Full Stack Developer career path"}
{"research_topic": "Machine Learning fundamentals"}
{"research_topic": "Docker containerization"}
{"research_topic": "React best practices 2026"}
```

## Common Commands

```bash
# Start Ollama
ollama serve

# List models
ollama list

# Pull a model
ollama pull llama3.2:1b

# Test setup
python test_setup.py

# Start dev server
uvx --refresh --from "langgraph-cli[inmem]" --with-editable . --python 3.11 langgraph dev
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Ollama not responding | Run `ollama serve` |
| Module not found | Run `pip install -e .` |
| No models found | Run `ollama pull llama3.2:1b` |
| Port 2024 in use | Add `--port 8080` to dev command |
| Search timeout | Check internet connection |

## Configuration Tips

### For Faster Results
```bash
MAX_WEB_RESEARCH_LOOPS=1
FETCH_FULL_PAGE=False
LOCAL_LLM=llama3.2:1b
```

### For Better Quality
```bash
MAX_WEB_RESEARCH_LOOPS=3
FETCH_FULL_PAGE=True
LOCAL_LLM=qwen2.5:7b
SEARCH_API=tavily  # Requires API key
```

## Output Files

Results are saved in `roadmap_outputs/`:
- `<topic>_diagram.html` - Interactive diagram
- `<topic>_diagram.png` - PNG image
- `<topic>_diagram.svg` - Vector image

## Next Steps

1. ✅ Complete setup
2. ✅ Run test query
3. 📖 Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for details
4. 📖 Read [HOW_IT_WORKS.md](HOW_IT_WORKS.md) for architecture
5. 🎨 Customize prompts in `src/ollama_deep_researcher/prompts.py`
6. 🔧 Adjust configuration in `.env`

## Getting Help

- **Setup Issues**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **How It Works**: See [HOW_IT_WORKS.md](HOW_IT_WORKS.md)
- **Full Documentation**: See [README.md](README.md)

## Automated Setup (Windows)

Run the PowerShell setup script:

```powershell
.\setup.ps1
```

This will:
- ✓ Check prerequisites
- ✓ Install dependencies
- ✓ Configure environment
- ✓ Test the setup
- ✓ Optionally start the server

---

**Ready to research? Start the server and try your first query! 🚀**
