#!/usr/bin/env python3
"""Test script to verify Ollama Deep Researcher setup.

Run this after installation to ensure everything is working correctly.
"""

import os
import sys
from pathlib import Path


def print_header(text):
    """Print a formatted header."""

def print_status(check_name, status, message=""):
    """Print status with color coding."""
    if message:
        pass

def test_python_version():
    """Check Python version."""
    print_header("Python Version Check")
    version = sys.version_info
    is_valid = version.major == 3 and version.minor >= 11
    print_status(
        "Python Version",
        is_valid,
        f"Python {version.major}.{version.minor}.{version.micro} " +
        ("(OK)" if is_valid else "(Need 3.11+)")
    )
    return is_valid

def test_imports():
    """Test required package imports."""
    print_header("Package Import Tests")
    
    packages = [
        ("langgraph", "LangGraph"),
        ("langchain_ollama", "LangChain Ollama"),
        ("langchain_community", "LangChain Community"),
        ("tavily", "Tavily"),
        ("duckduckgo_search", "DuckDuckGo Search"),
        ("markdownify", "Markdownify"),
        ("httpx", "HTTPX"),
        ("dotenv", "Python Dotenv"),
    ]
    
    all_passed = True
    for package, name in packages:
        try:
            __import__(package)
            print_status(name, True)
        except ImportError as e:
            print_status(name, False, str(e))
            all_passed = False
    
    return all_passed

def test_project_imports():
    """Test project-specific imports."""
    print_header("Project Module Tests")
    
    modules = [
        ("ollama_deep_researcher.configuration", "Configuration"),
        ("ollama_deep_researcher.state", "State"),
        ("ollama_deep_researcher.graph", "Graph"),
        ("ollama_deep_researcher.utils", "Utils"),
        ("ollama_deep_researcher.prompts", "Prompts"),
    ]
    
    all_passed = True
    for module, name in modules:
        try:
            __import__(module)
            print_status(name, True)
        except ImportError as e:
            print_status(name, False, str(e))
            all_passed = False
    
    return all_passed

def test_env_file():
    """Check if .env file exists."""
    print_header("Environment Configuration")
    
    env_exists = Path(".env").exists()
    print_status(".env file", env_exists, 
                 "Found" if env_exists else "Not found - copy from .env.example")
    
    if env_exists:
        # Load and check key variables
        from dotenv import load_dotenv
        load_dotenv()
        
        required_vars = [
            "SEARCH_API",
            "LLM_PROVIDER",
            "LOCAL_LLM",
        ]
        
        all_set = True
        for var in required_vars:
            value = os.getenv(var)
            is_set = value is not None and value != ""
            print_status(f"  {var}", is_set, 
                        f"= {value}" if is_set else "Not set")
            all_set = all_set and is_set
        
        return all_set
    
    return False

def test_ollama_connection():
    """Test connection to Ollama."""
    print_header("Ollama Connection Test")
    
    try:
        import requests
        from dotenv import load_dotenv
        load_dotenv()
        
        ollama_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        
        try:
            response = requests.get(f"{ollama_url}/api/tags", timeout=5)
            if response.status_code == 200:
                data = response.json()
                models = data.get("models", [])
                print_status("Ollama Connection", True, f"Connected to {ollama_url}")
                
                if models:
                    for model in models:
                        pass
                    return True
                else:
                    print_status("Ollama Models", False, "No models found - run 'ollama pull llama3.2:1b'")
                    return False
            else:
                print_status("Ollama Connection", False, f"HTTP {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print_status("Ollama Connection", False, 
                        "Cannot connect - is Ollama running? Try 'ollama serve'")
            return False
        except requests.exceptions.Timeout:
            print_status("Ollama Connection", False, "Connection timeout")
            return False
    except ImportError:
        print_status("Ollama Connection", False, "requests package not installed")
        return False

def test_search_api():
    """Test search API functionality."""
    print_header("Search API Test")
    
    try:
        from ollama_deep_researcher.utils import duckduckgo_search
        
        result = duckduckgo_search("test query", max_results=1, fetch_full_page=False)
        
        if result and "results" in result and len(result["results"]) > 0:
            print_status("DuckDuckGo Search", True, 
                        f"Found {len(result['results'])} result(s)")
            return True
        else:
            print_status("DuckDuckGo Search", False, "No results returned")
            return False
    except Exception as e:
        print_status("DuckDuckGo Search", False, str(e))
        return False

def test_output_directory():
    """Check if output directory exists."""
    print_header("Output Directory")
    
    output_dir = Path("roadmap_outputs")
    if not output_dir.exists():
        output_dir.mkdir(parents=True, exist_ok=True)
        print_status("roadmap_outputs/", True, "Created")
    else:
        print_status("roadmap_outputs/", True, "Exists")
    
    return True

def test_graph_initialization():
    """Test if the graph can be initialized."""
    print_header("Graph Initialization Test")
    
    try:
        from ollama_deep_researcher.graph import graph
        print_status("Graph Import", True, "Successfully imported graph")
        
        # Check if graph has expected nodes
        if hasattr(graph, 'nodes'):
            len(graph.nodes) if hasattr(graph.nodes, '__len__') else 0
            print_status("Graph Structure", True, "Graph initialized with nodes")
        
        return True
    except Exception as e:
        print_status("Graph Initialization", False, str(e))
        return False

def main():
    """Run all tests."""
    results = []
    
    # Run all tests
    results.append(("Python Version", test_python_version()))
    results.append(("Package Imports", test_imports()))
    results.append(("Project Modules", test_project_imports()))
    results.append(("Environment Config", test_env_file()))
    results.append(("Ollama Connection", test_ollama_connection()))
    results.append(("Search API", test_search_api()))
    results.append(("Output Directory", test_output_directory()))
    results.append(("Graph Initialization", test_graph_initialization()))
    
    # Summary
    print_header("Test Summary")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        pass
    
    
    if passed == total:
        return 0
    else:
        return 1

if __name__ == "__main__":
    sys.exit(main())
