# Setup Process Flowchart

Visual guide to setting up Ollama Deep Researcher

## Setup Flow Diagram

```mermaid
graph TD
    Start([Start Setup]) --> CheckPython{Python 3.11+<br/>Installed?}
    
    CheckPython -->|No| InstallPython[Install Python 3.11+<br/>from python.org]
    CheckPython -->|Yes| CheckLLM{Choose LLM<br/>Provider}
    InstallPython --> CheckLLM
    
    CheckLLM -->|Ollama| InstallOllama[Install Ollama<br/>from ollama.ai]
    CheckLLM -->|LMStudio| InstallLMStudio[Install LMStudio<br/>from lmstudio.ai]
    
    InstallOllama --> PullModel[Pull Model:<br/>ollama pull llama3.2:1b]
    InstallLMStudio --> LoadModel[Load Model<br/>in LMStudio]
    
    PullModel --> CloneRepo[Clone Repository]
    LoadModel --> CloneRepo
    
    CloneRepo --> InstallDeps{Choose Install<br/>Method}
    
    InstallDeps -->|Automated| RunScript[Run setup.ps1]
    InstallDeps -->|Manual| ManualInstall[pip install -e .]
    
    RunScript --> InstallPlaywright[playwright install chromium]
    ManualInstall --> InstallPlaywright
    
    InstallPlaywright --> ConfigEnv[Copy .env.example to .env<br/>Edit configuration]
    
    ConfigEnv --> TestSetup[Run: python test_setup.py]
    
    TestSetup --> AllPass{All Tests<br/>Pass?}
    
    AllPass -->|No| FixIssues[Fix Issues:<br/>- Check Ollama running<br/>- Verify .env config<br/>- Reinstall packages]
    FixIssues --> TestSetup
    
    AllPass -->|Yes| StartServer[Start Dev Server:<br/>uvx langgraph dev]
    
    StartServer --> OpenBrowser[Open Browser:<br/>http://localhost:2024]
    
    OpenBrowser --> TryQuery[Try Research Query]
    
    TryQuery --> Success([Setup Complete!<br/>Ready to Research])
    
    style Start fill:#4CAF50,stroke:#2E7D32,stroke-width:3px,color:#fff
    style Success fill:#4CAF50,stroke:#2E7D32,stroke-width:3px,color:#fff
    style CheckPython fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style CheckLLM fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style InstallDeps fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style AllPass fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style TestSetup fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
    style FixIssues fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
```

## Detailed Steps

### Phase 1: Prerequisites (Green)
1. **Check Python** - Verify Python 3.11+ is installed
2. **Choose LLM** - Select Ollama or LMStudio
3. **Install & Configure** - Set up your chosen LLM provider

### Phase 2: Installation (Blue)
4. **Clone Repository** - Get the project code
5. **Install Dependencies** - Choose automated or manual installation
6. **Install Playwright** - Set up web scraping capabilities

### Phase 3: Configuration (Purple)
7. **Setup Environment** - Configure .env file
8. **Test Setup** - Run verification script
9. **Fix Issues** - Resolve any problems (if needed)

### Phase 4: Launch (Green)
10. **Start Server** - Launch LangGraph development server
11. **Open Browser** - Access the web interface
12. **Try Query** - Test with a research topic

## Time Estimates

| Phase | Time Required | Notes |
|-------|---------------|-------|
| Prerequisites | 10-30 min | Depends on download speeds |
| Installation | 5-10 min | Faster with automated script |
| Configuration | 2-5 min | Quick edits to .env |
| Testing | 2-3 min | Automated verification |
| First Query | 1-5 min | Depends on model size |
| **Total** | **20-53 min** | First-time setup |

## Quick Decision Tree

```mermaid
graph TD
    Start([Need to Setup?]) --> HasPython{Have Python<br/>3.11+?}
    
    HasPython -->|Yes| HasLLM{Have Ollama<br/>or LMStudio?}
    HasPython -->|No| InstallPython[⏱️ 10 min:<br/>Install Python]
    
    InstallPython --> HasLLM
    
    HasLLM -->|Yes| HasModel{Have Model<br/>Downloaded?}
    HasLLM -->|No| InstallLLM[⏱️ 15 min:<br/>Install Ollama]
    
    InstallLLM --> HasModel
    
    HasModel -->|Yes| QuickSetup[⏱️ 10 min:<br/>Run setup.ps1]
    HasModel -->|No| GetModel[⏱️ 5-20 min:<br/>Download Model]
    
    GetModel --> QuickSetup
    QuickSetup --> Done([Ready!])
    
    style Start fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style Done fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style HasPython fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style HasLLM fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style HasModel fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
```

## Troubleshooting Flow

```mermaid
graph TD
    Issue([Having Issues?]) --> WhatIssue{What's Wrong?}
    
    WhatIssue -->|Import Error| ReinstallPkg[pip install -e .]
    WhatIssue -->|Ollama Error| CheckOllama{Ollama Running?}
    WhatIssue -->|Search Error| CheckInternet[Check Internet<br/>Connection]
    WhatIssue -->|Model Error| CheckModel[ollama list<br/>Verify model exists]
    
    CheckOllama -->|No| StartOllama[ollama serve]
    CheckOllama -->|Yes| CheckPort[Check port 11434]
    
    ReinstallPkg --> TestAgain[python test_setup.py]
    StartOllama --> TestAgain
    CheckPort --> TestAgain
    CheckInternet --> TestAgain
    CheckModel --> PullModel[ollama pull llama3.2:1b]
    PullModel --> TestAgain
    
    TestAgain --> Works{Tests Pass?}
    Works -->|Yes| Success([Fixed!])
    Works -->|No| GetHelp[Check SETUP_GUIDE.md<br/>or open GitHub issue]
    
    style Issue fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style Success fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style WhatIssue fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style Works fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style GetHelp fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
```

## Model Selection Guide

```mermaid
graph LR
    Start([Choose Model]) --> Priority{Priority?}
    
    Priority -->|Speed| Fast[llama3.2:1b<br/>~1.3GB<br/>⚡ Fastest]
    Priority -->|Balance| Balanced[llama3.2:3b<br/>~2GB<br/>⚖️ Balanced]
    Priority -->|Quality| Quality[qwen2.5:7b<br/>~4.7GB<br/>🎯 Best Quality]
    
    Fast --> Download1[ollama pull<br/>llama3.2:1b]
    Balanced --> Download2[ollama pull<br/>llama3.2:3b]
    Quality --> Download3[ollama pull<br/>qwen2.5:7b]
    
    Download1 --> Ready([Ready to Use])
    Download2 --> Ready
    Download3 --> Ready
    
    style Start fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style Ready fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style Priority fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style Fast fill:#00BCD4,stroke:#00838F,stroke-width:2px,color:#fff
    style Balanced fill:#FF9800,stroke:#E65100,stroke-width:2px,color:#fff
    style Quality fill:#9C27B0,stroke:#6A1B9A,stroke-width:2px,color:#fff
```

## Configuration Options Flow

```mermaid
graph TD
    Config([Configure .env]) --> SearchAPI{Search API?}
    
    SearchAPI -->|Free| UseDDG[SEARCH_API=duckduckgo<br/>No API key needed]
    SearchAPI -->|Better Results| UseTavily[SEARCH_API=tavily<br/>Get key from tavily.com]
    
    UseDDG --> Loops{Research Depth?}
    UseTavily --> Loops
    
    Loops -->|Quick| Loop1[MAX_WEB_RESEARCH_LOOPS=1<br/>⚡ Fast]
    Loops -->|Thorough| Loop3[MAX_WEB_RESEARCH_LOOPS=3<br/>📚 Comprehensive]
    
    Loop1 --> Content{Content Detail?}
    Loop3 --> Content
    
    Content -->|Snippets| Snippet[FETCH_FULL_PAGE=False<br/>⚡ Faster]
    Content -->|Full Pages| FullPage[FETCH_FULL_PAGE=True<br/>📄 More Detail]
    
    Snippet --> Features{Features?}
    FullPage --> Features
    
    Features --> EnableAll[GENERATE_ROADMAP=True<br/>GENERATE_MERMAID_DIAGRAM=True<br/>✨ All Features]
    
    EnableAll --> Done([Configuration Complete])
    
    style Config fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style Done fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff
    style SearchAPI fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style Loops fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style Content fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    style Features fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
```

## View These Diagrams

To view these Mermaid diagrams:

1. **GitHub**: View this file on GitHub (renders automatically)
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy diagram code to [mermaid.live](https://mermaid.live)
4. **LangGraph Studio**: Diagrams render in the documentation viewer

## Next Steps

After reviewing the flowcharts:

1. Follow **[QUICK_START.md](QUICK_START.md)** for rapid setup
2. Use **[SETUP_GUIDE.md](SETUP_GUIDE.md)** for detailed instructions
3. Run `setup.ps1` for automated installation
4. Run `python test_setup.py` to verify everything works

---

**Visual learner? These flowcharts show you exactly what to do! 📊**
