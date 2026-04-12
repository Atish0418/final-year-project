"""Main LangGraph workflow definition for the research assistant."""
import json

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langchain_ollama import ChatOllama
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, Field
from typing_extensions import Literal

from ollama_deep_researcher.configuration import Configuration
from ollama_deep_researcher.lmstudio import ChatLMStudio

# Import Mermaid renderer
from ollama_deep_researcher.mermaid_renderer import (
    render_mermaid_to_image,
    save_mermaid_html,
)
from ollama_deep_researcher.prompts import (
    get_current_date,
    json_mode_query_instructions,
    json_mode_reflection_instructions,
    mermaid_diagram_instructions,
    query_writer_instructions,
    reflection_instructions,
    roadmap_generator_instructions,
    summarizer_instructions,
    tool_calling_query_instructions,
    tool_calling_reflection_instructions,
)
from ollama_deep_researcher.state import (
    SummaryState,
    SummaryStateInput,
    SummaryStateOutput,
)
from ollama_deep_researcher.utils import (
    deduplicate_and_format_sources,
    duckduckgo_search,
    format_sources,
    get_config_value,
    perplexity_search,
    searxng_search,
    strip_thinking_tokens,
    tavily_search,
)

# Constants
MAX_TOKENS_PER_SOURCE = 1000
CHARS_PER_TOKEN = 4

def generate_search_query_with_structured_output(
    configurable: Configuration,
    messages: list,
    tool_class,
    fallback_query: str,
    tool_query_field: str,
    json_query_field: str,
):
    """Generate search queries using either tool calling or JSON mode.
    
    Args:
        configurable: Configuration object
        messages: List of messages to send to LLM
        tool_class: Tool class for tool calling mode
        fallback_query: Fallback search query if extraction fails
        tool_query_field: Field name in tool args containing the query
        json_query_field: Field name in JSON response containing the query
        
    Returns:
        Dictionary with "search_query" key
    """
    if configurable.use_tool_calling:
        llm = get_llm(configurable).bind_tools([tool_class])
        result = llm.invoke(messages)

        if not result.tool_calls:
            return {"search_query": fallback_query}
        
        try:
            tool_data = result.tool_calls[0]["args"]
            search_query = tool_data.get(tool_query_field)
            return {"search_query": search_query}
        except (IndexError, KeyError):
            return {"search_query": fallback_query}
    
    else:
        # Use JSON mode
        llm = get_llm(configurable)
        result = llm.invoke(messages)
        content = result.content

        try:
            parsed_json = json.loads(content)
            search_query = parsed_json.get(json_query_field)
            if not search_query:
                return {"search_query": fallback_query}
            return {"search_query": search_query}
        except (json.JSONDecodeError, KeyError):
            if configurable.strip_thinking_tokens:
                content = strip_thinking_tokens(content)
            return {"search_query": fallback_query}

def get_llm(configurable: Configuration):
    """Initialize LLM based on configuration.

    Uses JSON mode if use_tool_calling is False, otherwise regular mode for tool calling.

    Args:
        configurable: Configuration object containing LLM settings

    Returns:
        Configured LLM instance
    """
    if configurable.llm_provider == "lmstudio":
        if configurable.use_tool_calling:
            return ChatLMStudio(
                base_url=configurable.lmstudio_base_url,
                model=configurable.local_llm,
                temperature=0,
            )
        else:
            return ChatLMStudio(
                base_url=configurable.lmstudio_base_url,
                model=configurable.local_llm,
                temperature=0,
                format="json",
            )
    else:  # Default to Ollama
        if configurable.use_tool_calling:
            return ChatOllama(
                base_url=configurable.ollama_base_url,
                model=configurable.local_llm,
                temperature=0,
            )
        else:
            return ChatOllama(
                base_url=configurable.ollama_base_url,
                model=configurable.local_llm,
                temperature=0,
                format="json",
            )

# Nodes
def generate_query(state: SummaryState, config: RunnableConfig):
    """LangGraph node that generates a search query based on the research topic.

    Uses an LLM to create an optimized search query for web research based on
    the user's research topic. Supports both LMStudio and Ollama as LLM providers.

    Args:
        state: Current graph state containing the research topic
        config: Configuration for the runnable, including LLM provider settings

    Returns:
        Dictionary with state update, including search_query key containing the generated query
    """
    # Format the prompt
    current_date = get_current_date()
    formatted_prompt = query_writer_instructions.format(
        current_date=current_date, research_topic=state.research_topic
    )

    # Generate a query
    configurable = Configuration.from_runnable_config(config)

    @tool
    class Query(BaseModel):
        """This tool is used to generate a query for web search."""

        query: str = Field(description="The actual search query string")
        rationale: str = Field(
            description="Brief explanation of why this query is relevant"
        )

    messages = [
        SystemMessage(
            content=formatted_prompt + (
                tool_calling_query_instructions if configurable.use_tool_calling 
                else json_mode_query_instructions
            )
        ),
        HumanMessage(content="Generate a query for web search:"),
    ]

    return generate_search_query_with_structured_output(
        configurable=configurable,
        messages=messages,
        tool_class=Query,
        fallback_query=f"Tell me more about {state.research_topic}",
        tool_query_field="query",
        json_query_field="query",
    )


def web_research(state: SummaryState, config: RunnableConfig):
    """LangGraph node that performs web research using the generated search query.

    Executes a web search using the configured search API (tavily, perplexity,
    duckduckgo, or searxng) and formats the results for further processing.

    Args:
        state: Current graph state containing the search query and research loop count
        config: Configuration for the runnable, including search API settings

    Returns:
        Dictionary with state update, including sources_gathered, research_loop_count, and web_research_results
    """
    print(f"--- WEB RESEARCH (Loop {state.research_loop_count + 1}) ---")
    # Configure
    configurable = Configuration.from_runnable_config(config)

    # Get the search API
    search_api = get_config_value(configurable.search_api)

    # Search the web
    if search_api == "tavily":
        search_results = tavily_search(
            state.search_query,
            fetch_full_page=configurable.fetch_full_page,
            max_results=1,
        )
        search_str = deduplicate_and_format_sources(
            search_results,
            max_tokens_per_source=MAX_TOKENS_PER_SOURCE,
            fetch_full_page=configurable.fetch_full_page,
        )
    elif search_api == "perplexity":
        search_results = perplexity_search(
            state.search_query, state.research_loop_count
        )
        search_str = deduplicate_and_format_sources(
            search_results,
            max_tokens_per_source=MAX_TOKENS_PER_SOURCE,
            fetch_full_page=configurable.fetch_full_page,
        )
    elif search_api == "duckduckgo":
        search_results = duckduckgo_search(
            state.search_query,
            max_results=3,
            fetch_full_page=configurable.fetch_full_page,
        )
        search_str = deduplicate_and_format_sources(
            search_results,
            max_tokens_per_source=MAX_TOKENS_PER_SOURCE,
            fetch_full_page=configurable.fetch_full_page,
        )
    elif search_api == "searxng":
        search_results = searxng_search(
            state.search_query,
            max_results=3,
            fetch_full_page=configurable.fetch_full_page,
        )
        search_str = deduplicate_and_format_sources(
            search_results,
            max_tokens_per_source=MAX_TOKENS_PER_SOURCE,
            fetch_full_page=configurable.fetch_full_page,
        )
    else:
        raise ValueError(f"Unsupported search API: {configurable.search_api}")

    return {
        "sources_gathered": [format_sources(search_results)],
        "research_loop_count": state.research_loop_count + 1,
        "web_research_results": [search_str],
    }


def summarize_sources(state: SummaryState, config: RunnableConfig):
    """LangGraph node that summarizes web research results using paragraph-based loop processing.

    Uses an LLM to create or update a running summary based on the newest web research
    results, integrating them with any existing summary. Can process content in chunks
    or all at once based on configuration.

    Args:
        state: Current graph state containing research topic, running summary,
              and web research results
        config: Configuration for the runnable, including LLM provider settings

    Returns:
        Dictionary with state update, including running_summary key containing the updated summary
    """
    print("--- SUMMARIZING RESEARCH FINDINGS ---")
    # Get configuration
    configurable = Configuration.from_runnable_config(config)
    
    # Existing summary
    existing_summary = state.running_summary

    # Most recent web research
    most_recent_web_research = state.web_research_results[-1]
    
    # Initialize LLM
    if configurable.llm_provider == "lmstudio":
        llm = ChatLMStudio(
            base_url=configurable.lmstudio_base_url,
            model=configurable.local_llm,
            temperature=0,
        )
    else:  # Default to Ollama
        llm = ChatOllama(
            base_url=configurable.ollama_base_url,
            model=configurable.local_llm,
            temperature=0,
        )
    
    # SIMPLIFIED: Process all content at once (faster and less repetition)
    # Build the human message
    if existing_summary:
        human_message_content = (
            f"<Existing Summary>\n{existing_summary}\n</Existing Summary>\n\n"
            f"<New Research Results>\n{most_recent_web_research}\n</New Research Results>\n\n"
            f"<Critical Instructions>\n"
            f"Topic: {state.research_topic}\n\n"
            f"IMPORTANT RULES:\n"
            f"1. ONLY add NEW information from the New Research Results\n"
            f"2. DO NOT repeat information already in the Existing Summary\n"
            f"3. If the New Research Results contain no new information, return the Existing Summary UNCHANGED\n"
            f"4. Be concise - only add what's truly new and relevant\n"
            f"5. Integrate new facts naturally into the existing structure\n"
            f"6. Keep the summary focused on: {state.research_topic}\n\n"
            f"Output the updated summary:\n"
            f"</Critical Instructions>"
        )
    else:
        human_message_content = (
            f"<Research Results>\n{most_recent_web_research}\n</Research Results>\n\n"
            f"<Instructions>\n"
            f"Create a concise summary from the research results.\n"
            f"Topic: {state.research_topic}\n\n"
            f"- Extract the most relevant information\n"
            f"- Organize it logically\n"
            f"- Be concise and clear\n"
            f"- Write in professional English\n"
            f"</Instructions>"
        )

    # Invoke LLM
    result = llm.invoke(
        [
            SystemMessage(content=summarizer_instructions),
            HumanMessage(content=human_message_content),
        ]
    )

    # Strip thinking tokens if configured
    running_summary = result.content
    if configurable.strip_thinking_tokens:
        running_summary = strip_thinking_tokens(running_summary)
    
    # Anti-repetition check: ensure new summary is different from existing
    if existing_summary:
        normalized_existing = existing_summary.strip().lower()
        normalized_new = running_summary.strip().lower()
        
        # If summaries are identical or new is shorter, keep existing
        if normalized_new == normalized_existing or len(normalized_new) < len(normalized_existing) * 0.9:
            return {"running_summary": existing_summary}
    
    return {"running_summary": running_summary}


def reflect_on_summary(state: SummaryState, config: RunnableConfig):
    """LangGraph node that identifies knowledge gaps and generates follow-up queries.

    Analyzes the current summary to identify areas for further research and generates
    a new search query to address those gaps. Uses structured output to extract
    the follow-up query in JSON format.

    Args:
        state: Current graph state containing the running summary and research topic
        config: Configuration for the runnable, including LLM provider settings

    Returns:
        Dictionary with state update, including search_query key containing the generated follow-up query
    """
    print("--- REFLECTING ON GAPS ---")
    # Generate a query
    configurable = Configuration.from_runnable_config(config)
    formatted_prompt = reflection_instructions.format(
        research_topic=state.research_topic
    )

    @tool
    class FollowUpQuery(BaseModel):
        """This tool is used to generate a follow-up query to address a knowledge gap."""

        follow_up_query: str = Field(
            description="Write a specific question to address this gap"
        )
        knowledge_gap: str = Field(
            description="Describe what information is missing or needs clarification"
        )

    messages = [
        SystemMessage(
            content=formatted_prompt + (
                tool_calling_reflection_instructions if configurable.use_tool_calling 
                else json_mode_reflection_instructions
            )
        ),
        HumanMessage(
            content=f"Reflect on our existing knowledge: \n === \n {state.running_summary}, \n === \n And now identify a knowledge gap and generate a follow-up web search query:"
        ),
    ]

    return generate_search_query_with_structured_output(
        configurable=configurable,
        messages=messages,
        tool_class=FollowUpQuery,
        fallback_query=f"Tell me more about {state.research_topic}",
        tool_query_field="follow_up_query",
        json_query_field="follow_up_query",
    )


def finalize_summary(state: SummaryState):
    """LangGraph node that finalizes the research summary.

    Prepares the final output by deduplicating and formatting sources, then
    combining them with the running summary to create a well-structured
    research report with proper citations.

    Args:
        state: Current graph state containing the running summary and sources gathered

    Returns:
        Dictionary with state update, including running_summary key containing the formatted final summary with sources
    """
    print("--- FINALIZING SUMMARY ---")
    # Deduplicate sources before joining
    seen_sources = set()
    unique_sources = []

    for source in state.sources_gathered:
        # Split the source into lines and process each individually
        for line in source.split("\n"):
            # Only process non-empty lines
            if line.strip() and line not in seen_sources:
                seen_sources.add(line)
                unique_sources.append(line)

    # Join the deduplicated sources
    all_sources = "\n".join(unique_sources)
    state.running_summary = (
        f"## Summary\n{state.running_summary}\n\n ### Sources:\n{all_sources}"
    )
    return {"running_summary": state.running_summary}


def generate_roadmap(state: SummaryState, config: RunnableConfig):
    """LangGraph node that generates a structured learning roadmap.

    Takes the research summary and transforms it into an actionable learning roadmap
    with phases, skills, tools, and milestones for the research topic.

    Args:
        state: Current graph state containing the running summary and research topic
        config: Configuration for the runnable, including LLM provider settings

    Returns:
        Dictionary with state update, including roadmap key containing the structured roadmap
    """
    print("--- GENERATING CAREER ROADMAP ---")
    # Get configuration
    configurable = Configuration.from_runnable_config(config)

    # Format the prompt
    formatted_prompt = roadmap_generator_instructions.format(
        research_topic=state.research_topic
    )

    # Initialize LLM (no structured output needed)
    if configurable.llm_provider == "lmstudio":
        llm = ChatLMStudio(
            base_url=configurable.lmstudio_base_url,
            model=configurable.local_llm,
            temperature=0.3,  # Slightly higher for creativity
        )
    else:  # Default to Ollama
        llm = ChatOllama(
            base_url=configurable.ollama_base_url,
            model=configurable.local_llm,
            temperature=0.3,
        )

    # Generate roadmap
    result = llm.invoke(
        [
            SystemMessage(content=formatted_prompt),
            HumanMessage(
                content=f"Based on this research summary, create a comprehensive learning roadmap:\n\n{state.running_summary}"
            ),
        ]
    )

    # Strip thinking tokens if configured
    roadmap = result.content
    if configurable.strip_thinking_tokens:
        roadmap = strip_thinking_tokens(roadmap)

    return {"roadmap": roadmap}


def generate_mermaid_diagram(state: SummaryState, config: RunnableConfig):
    """LangGraph node that generates a Mermaid diagram from the roadmap.

    Takes the roadmap and converts it into a visual Mermaid flowchart diagram
    with professional styling and clear structure. Automatically renders to image files.

    Args:
        state: Current graph state containing the roadmap
        config: Configuration for the runnable, including LLM provider settings

    Returns:
        Dictionary with state update, including mermaid_diagram key containing the Mermaid code
    """
    print("--- GENERATING VISUAL DIAGRAM ---")
    # Get configuration
    configurable = Configuration.from_runnable_config(config)

    # Initialize LLM
    if configurable.llm_provider == "lmstudio":
        llm = ChatLMStudio(
            base_url=configurable.lmstudio_base_url,
            model=configurable.local_llm,
            temperature=0.2,  # Low temperature for consistent diagram structure
        )
    else:  # Default to Ollama
        llm = ChatOllama(
            base_url=configurable.ollama_base_url,
            model=configurable.local_llm,
            temperature=0.2,
        )

    # Generate Mermaid diagram
    result = llm.invoke(
        [
            SystemMessage(content=mermaid_diagram_instructions),
            HumanMessage(
                content=f"Convert this roadmap into a beautiful Mermaid diagram:\n\n{state.roadmap}"
            ),
        ]
    )

    # Strip thinking tokens if configured
    mermaid_diagram = result.content
    if configurable.strip_thinking_tokens:
        mermaid_diagram = strip_thinking_tokens(mermaid_diagram)

    # Automatically render the diagram to files
    try:
        import os
        
        # Create output directory
        output_dir = "roadmap_outputs"
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate filename from research topic
        safe_filename = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in state.research_topic)
        safe_filename = safe_filename.replace(' ', '_').lower()[:50]
        
        # Save as HTML (always works, no dependencies)
        html_path = os.path.join(output_dir, f"{safe_filename}_diagram.html")
        if save_mermaid_html(mermaid_diagram, html_path):
            pass
        
        # Try to render as PNG using Mermaid.ink API (requires internet)
        png_path = os.path.join(output_dir, f"{safe_filename}_diagram.png")
        if render_mermaid_to_image(mermaid_diagram, png_path, format="png"):
            pass
        
        # Try to render as SVG using Mermaid.ink API (requires internet)
        svg_path = os.path.join(output_dir, f"{safe_filename}_diagram.svg")
        if render_mermaid_to_image(mermaid_diagram, svg_path, format="svg"):
            pass
        
        
    except Exception:
        pass

    return {"mermaid_diagram": mermaid_diagram}


def route_research(
    state: SummaryState, config: RunnableConfig
) -> Literal["finalize_summary", "web_research"]:
    """LangGraph routing function that determines the next step in the research flow.

    Controls the research loop by deciding whether to continue gathering information
    or to finalize the summary based on the configured maximum number of research loops.

    Args:
        state: Current graph state containing the research loop count
        config: Configuration for the runnable, including max_web_research_loops setting

    Returns:
        String literal indicating the next node to visit ("web_research" or "finalize_summary")
    """
    configurable = Configuration.from_runnable_config(config)
    if state.research_loop_count <= configurable.max_web_research_loops:
        return "web_research"
    else:
        return "finalize_summary"


def route_after_finalize(
    state: SummaryState, config: RunnableConfig
) -> Literal["generate_roadmap", "__end__"]:
    """Route to roadmap generation or end based on configuration."""
    configurable = Configuration.from_runnable_config(config)
    
    # Debug logging
    
    if configurable.generate_roadmap:
        return "generate_roadmap"
    else:
        return "__end__"


def route_after_roadmap(
    state: SummaryState, config: RunnableConfig
) -> Literal["generate_mermaid_diagram", "__end__"]:
    """Route to Mermaid diagram generation or end based on configuration."""
    configurable = Configuration.from_runnable_config(config)
    
    # Debug logging
    
    if configurable.generate_mermaid_diagram:
        return "generate_mermaid_diagram"
    else:
        return "__end__"


# Add nodes and edges
builder = StateGraph(
    SummaryState,
    input=SummaryStateInput,
    output=SummaryStateOutput,
    config_schema=Configuration,
)
builder.add_node("generate_query", generate_query)
builder.add_node("web_research", web_research)
builder.add_node("summarize_sources", summarize_sources)
builder.add_node("reflect_on_summary", reflect_on_summary)
builder.add_node("finalize_summary", finalize_summary)
builder.add_node("generate_roadmap", generate_roadmap)
builder.add_node("generate_mermaid_diagram", generate_mermaid_diagram)

# Add edges
builder.add_edge(START, "generate_query")
builder.add_edge("generate_query", "web_research")
builder.add_edge("web_research", "summarize_sources")
builder.add_edge("summarize_sources", "reflect_on_summary")
builder.add_conditional_edges(
    "reflect_on_summary",
    route_research,
    {
        "web_research": "web_research",
        "finalize_summary": "finalize_summary"
    }
)
builder.add_conditional_edges(
    "finalize_summary",
    route_after_finalize,
    {
        "generate_roadmap": "generate_roadmap",
        "__end__": END
    }
)
builder.add_conditional_edges(
    "generate_roadmap",
    route_after_roadmap,
    {
        "generate_mermaid_diagram": "generate_mermaid_diagram",
        "__end__": END
    }
)
builder.add_edge("generate_mermaid_diagram", END)

graph = builder.compile()
