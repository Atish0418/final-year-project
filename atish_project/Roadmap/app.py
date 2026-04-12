from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from threading import Thread
import time

# Import the LangGraph workflow and state
from ollama_deep_researcher.graph import graph
from ollama_deep_researcher.state import SummaryStateInput
from langchain_core.runnables import RunnableConfig

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/generate")
def generate_roadmap(req: QueryRequest):
    try:
        if not req.query or len(req.query.strip()) < 3:
            raise HTTPException(status_code=400, detail="Query is too short")
            
        print(f"Generating roadmap for: {req.query}")
        
        # Define input state
        initial_state = SummaryStateInput(research_topic=req.query)
        
        # Configure settings for execution
        # We read from environment variables or use defaults
        import os
        config = RunnableConfig(
            configurable={
                "search_api": os.getenv("SEARCH_API", "duckduckgo"),
                "max_web_research_loops": int(os.getenv("MAX_WEB_RESEARCH_LOOPS", "1")),
                "generate_roadmap": True,
                "generate_mermaid_diagram": True,
                "llm_provider": os.getenv("LLM_PROVIDER", "ollama"),
                "local_llm": os.getenv("LOCAL_LLM", "llama3.2:1b")
            }
        )
        
        # Run graph
        result = graph.invoke(initial_state, config)
        
        return {
            "success": True,
            "summary": result.get("running_summary", ""),
            "roadmap": result.get("roadmap", ""),
            "mermaid_diagram": result.get("mermaid_diagram", "")
        }
    except Exception as e:
        print(f"Error generating roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount frontend files
app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    print("Starting Roadmap Backend on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
