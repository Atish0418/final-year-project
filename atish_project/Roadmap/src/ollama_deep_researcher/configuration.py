"""Configuration module for the research assistant."""
import os
from enum import Enum
from typing import Any, Literal, Optional

from langchain_core.runnables import RunnableConfig
from pydantic import BaseModel, Field


class SearchAPI(Enum):
    """The supported search APIs."""
    PERPLEXITY = "perplexity"
    TAVILY = "tavily"
    DUCKDUCKGO = "duckduckgo"
    SEARXNG = "searxng"


class Configuration(BaseModel):
    """The configurable fields for the research assistant."""

    max_web_research_loops: int = Field(
        default=1,
        title="Research Depth",
        description="Number of research iterations to perform",
    )
    local_llm: str = Field(
        default="llama3.2:1b",
        title="LLM Model Name",
        description="Name of the LLM model to use",
    )
    llm_provider: Literal["ollama", "lmstudio"] = Field(
        default="ollama",
        title="LLM Provider",
        description="Provider for the LLM (Ollama or LMStudio)",
    )
    search_api: Literal["perplexity", "tavily", "duckduckgo", "searxng"] = Field(
        default="duckduckgo", title="Search API", description="Web search API to use"
    )
    fetch_full_page: bool = Field(
        default=True,
        title="Fetch Full Page",
        description="Include the full page content in the search results",
    )
    ollama_base_url: str = Field(
        default="http://localhost:11434/",
        title="Ollama Base URL",
        description="Base URL for Ollama API",
    )
    lmstudio_base_url: str = Field(
        default="http://localhost:1234/v1",
        title="LMStudio Base URL",
        description="Base URL for LMStudio OpenAI-compatible API",
    )
    strip_thinking_tokens: bool = Field(
        default=True,
        title="Strip Thinking Tokens",
        description="Whether to strip <think> tokens from model responses",
    )
    use_tool_calling: bool = Field(
        default=False,
        title="Use Tool Calling",
        description="Use tool calling instead of JSON mode for structured output",
    )
    generate_roadmap: bool = Field(
        default=True,
        title="Generate Roadmap",
        description="Generate a structured learning roadmap at the end of research",
    )
    process_sources_individually: bool = Field(
        default=True,
        title="Process Sources Individually",
        description="Process each source separately in a loop for better comprehension",
    )
    generate_mermaid_diagram: bool = Field(
        default=True,
        title="Generate Mermaid Diagram",
        description="Generate a visual Mermaid flowchart diagram from the roadmap",
    )

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> "Configuration":
        """Create a Configuration instance from a RunnableConfig."""
        configurable = (
            config["configurable"] if config and "configurable" in config else {}
        )

        # Get raw values from environment or config
        raw_values: dict[str, Any] = {
            name: os.environ.get(name.upper(), configurable.get(name))
            for name in cls.model_fields.keys()
        }

        # Filter out None values and convert string booleans
        values = {}
        for k, v in raw_values.items():
            if v is not None:
                # Convert string booleans to actual booleans
                if isinstance(v, str):
                    if v.lower() in ('true', '1', 'yes'):
                        values[k] = True
                    elif v.lower() in ('false', '0', 'no'):
                        values[k] = False
                    else:
                        values[k] = v
                else:
                    values[k] = v

        return cls(**values)
