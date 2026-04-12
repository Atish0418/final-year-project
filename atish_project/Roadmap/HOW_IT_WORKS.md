# How Local Deep Researcher Works

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [Workflow](#workflow)
5. [Configuration System](#configuration-system)
6. [Features](#features)

---

## Project Overview

Local Deep Researcher is a fully local web research assistant that uses LLMs hosted by Ollama or LMStudio to perform iterative web research. It generates search queries, gathers results, summarizes findings, identifies knowledge gaps, and repeats the process to create comprehensive research reports with structured roadmaps and visual diagrams.

### Key Capabilities
- Fully local LLM execution (Ollama or LMStudio)
- Multiple search API support (DuckDuckGo, Tavily, Perplexity, SearXNG)
- Iterative research with gap analysis
- Automatic query optimization
- Structured roadmap generation
- Visual Mermaid diagram creation
- Markdown report with citations

---

## Architecture

### Technology Stack
- **Framework**: LangGraph (for workflow orchestration)
- **LLM Providers**: Ollama, LMStudio
- **Search APIs**: DuckDuckGo, Tavily, Perplexity, SearXNG
- **Language**: Python 3.11+
- **State Management**: LangGraph StateGraph
- **Configuration**: Pydantic models with environment variables

### Project Structure
```
local-deep-researcher/
├── src/ollama_deep_researcher/
│   ├── __init__.py              # Package initialization
│   ├── configuration.py         # Configuration management
│   ├── state.py                 # State definitions
│   ├── graph.py                 # Main workflow graph
│   ├── prompts.py               # LLM prompts
│   ├── utils.py                 # Utility functions
│   ├── lmstudio.py             # LMStudio integration
│   └── mermaid_renderer.py     # Diagram rendering
├── .env                         # Environment configuration
├── langgraph.json              # LangGraph configuration
├── pyproject.toml              # Project dependencies
└── README.md                   # Documentation
```

---

## Core Components

### 1. Configuration System (`configuration.py`)

The configuration system uses Pydantic models to manage all settings with a clear priority order:

**Priority Order**:
1. Environment variables (highest)
2. LangGraph UI configuration
3. Default values in Configuration class (lowest)

**Key Configuration Options**:
```python
class Configuration(BaseModel):
    max_web_research_loops: int = 1          # Research depth
    local_llm: str = "llama3.2:1b"          # Model name
    llm_provider: Literal["ollama", "lmstudio"] = "ollama"
    search_api: Literal["perplexity", "tavily", "duckduckgo", "searxng"]
    fetch_full_page: bool = True             # Include full page content
    ollama_base_url: str = "http://localhost:11434/"
    lmstudio_base_url: str = "http://localhost:1234/v1"
    strip_thinking_tokens: bool = True       # Remove <think> tags
    use_tool_calling: bool = False           # Use tool calling vs JSON mode
    generate_roadmap: bool = True            # Generate learning roadmap
    process_sources_individually: bool = True # Loop through sources
    generate_mermaid_diagram: bool = True    # Generate visual diagram
```

### 2. State Management (`state.py`)

The system uses dataclasses to manage state throughout the research process:

```python
@dataclass(kw_only=True)
class SummaryState:
    research_topic: str                      # User's research topic
    search_query: str                        # Current search query
    web_research_results: list               # Accumulated search results
    sources_gathered: list                   # All sources used
    research_loop_count: int = 0            # Current iteration
    running_summary: str                     # Evolving summary
    roadmap: str                            # Structured learning roadmap
    mermaid_diagram: str                    # Visual diagram code
```

### 3. LLM Integration

#### Ollama Integration
```python
llm = ChatOllama(
    base_url=configurable.ollama_base_url,
    model=configurable.local_llm,
    temperature=0,
    format="json"  # For structured output
)
```

#### LMStudio Integration (`lmstudio.py`)
Custom wrapper around ChatOpenAI for LMStudio's OpenAI-compatible API with JSON mode support and automatic response cleaning.

### 4. Search Integration (`utils.py`)

#### Supported Search APIs

**DuckDuckGo** (Default - No API key required)
**Tavily** (Requires API key)
**Perplexity** (Uses sonar-pro model)
**SearXNG** (Requires local instance)

All search functions return standardized format:
```python
{
    "results": [
        {
            "title": "...",
            "url": "...",
            "content": "...",
            "raw_content": "..."  # If fetch_full_page=True
        }
    ]
}
```

---

## Workflow

### Graph Execution Flow

```
START
  ↓
generate_query → Generate optimized search query
  ↓
web_research → Execute web search
  ↓
summarize_sources → Create/update summary
  ↓
reflect_on_summary → Identify knowledge gaps
  ↓
route_research → Continue or finalize?
  ├─→ web_research (if more loops needed)
  └─→ finalize_summary
        ↓
      route_after_finalize → Generate roadmap?
        ├─→ generate_roadmap
        │     ↓
        │   route_after_roadmap → Generate diagram?
        │     ├─→ generate_mermaid_diagram → END
        │     └─→ END
        └─→ END
```

### Node Descriptions

#### 1. `generate_query`
Creates an optimized search query from the research topic using automatic query enhancement based on topic category.

#### 2. `web_research`
Executes web search using configured API, deduplicates results, and formats with citations.

#### 3. `summarize_sources`
Creates or updates running summary. Can process sources individually or all at once based on configuration.

#### 4. `reflect_on_summary`
Analyzes current summary to identify knowledge gaps and generates follow-up query.

#### 5. `finalize_summary`
Prepares final output with deduplicated sources and markdown formatting.

#### 6. `generate_roadmap`
Transforms summary into structured learning roadmap with phases, skills, tools, and milestones.

#### 7. `generate_mermaid_diagram`
Creates visual flowchart from roadmap and automatically renders to HTML/PNG/SVG files.

---

## Configuration System

### Environment Variables

**Example `.env`**:
```bash
# Search Configuration
SEARCH_API=duckduckgo
TAVILY_API_KEY=tvly-xxxxx
PERPLEXITY_API_KEY=pplx-xxxxx

# LLM Configuration
LLM_PROVIDER=ollama
LOCAL_LLM=llama3.2:1b
OLLAMA_BASE_URL=http://localhost:11434
LMSTUDIO_BASE_URL=http://localhost:1234/v1

# Research Configuration
MAX_WEB_RESEARCH_LOOPS=3
FETCH_FULL_PAGE=True
STRIP_THINKING_TOKENS=True
USE_TOOL_CALLING=False

# Feature Flags
GENERATE_ROADMAP=True
PROCESS_SOURCES_INDIVIDUALLY=True
GENERATE_MERMAID_DIAGRAM=True
```

---

## Features

### 1. Automatic Query Optimization

Automatically enhances search queries based on topic category:
- Career topics → adds "career path", "skills", "roadmap", "2026"
- Technical topics → adds "tutorial", "guide", "best practices", "2026"
- Tools/frameworks → adds "getting started", "latest", "2026"

### 2. Paragraph-Based Loop Processing

Processes sources individually for better comprehension and prevents repetition with similarity checks.

### 3. Thinking Token Removal

Cleans up model outputs that include reasoning tokens enclosed in `<think>` tags.

### 4. Structured Output Modes

Supports both JSON mode and tool calling for structured outputs, with automatic fallbacks.

### 5. Mermaid Diagram Rendering

Automatically renders diagrams to:
- HTML (interactive, always works)
- PNG (via Mermaid.ink API)
- SVG (via Mermaid.ink API)

---

## Summary

Local Deep Researcher combines local LLM execution, iterative research with gap analysis, multiple search APIs, automatic query optimization, and professional visualizations to create comprehensive research reports with structured roadmaps and visual diagrams.
