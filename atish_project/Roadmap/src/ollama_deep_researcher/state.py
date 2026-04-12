"""State definitions for the research assistant graph."""
import operator
from dataclasses import dataclass, field

from typing_extensions import Annotated


@dataclass(kw_only=True)
class SummaryState:
    """The main state for the summary graph."""
    research_topic: str = field(default=None)  # Report topic
    search_query: str = field(default=None)  # Search query
    web_research_results: Annotated[list, operator.add] = field(default_factory=list)
    sources_gathered: Annotated[list, operator.add] = field(default_factory=list)
    research_loop_count: int = field(default=0)  # Research loop count
    running_summary: str = field(default=None)  # Final report
    roadmap: str = field(default=None)  # Structured roadmap
    mermaid_diagram: str = field(default=None)  # Mermaid diagram code


@dataclass(kw_only=True)
class SummaryStateInput:
    """The input state for the summary graph."""
    research_topic: str = field(default=None)  # Report topic


@dataclass(kw_only=True)
class SummaryStateOutput:
    """The output state for the summary graph."""
    running_summary: str = field(default=None)  # Final report
    roadmap: str = field(default=None)  # Structured roadmap
    mermaid_diagram: str = field(default=None)  # Mermaid diagram code
