import phi
import os
import phi.api
from phi.agent import Agent
from dotenv import load_dotenv
from phi.model.groq import Groq
import google.generativeai as genai
from phi.tools.duckduckgo import DuckDuckGo
from phi.playground import Playground, serve_playground_app

phi.api = os.getenv("PHI_API_KEY")

conv_agent = Agent(
    name="Conversational Agent",
    role="You are a friendly conversational agent for a career guidance chatbot. Your job is to handle general conversational queries (e.g., small talk, jokes, greetings). If the user asks anything related to career advice, jobs, education, or skill development, you should not answer and instead return the word 'false'."
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo()],
    instructions=[
        "If the user's message is conversational (e.g., greeting, personal question, humor, casual talk), respond appropriately.",
        "If the user's message is about careers, jobs, resumes, education, or learning paths, do not answer. Just return the word 'false' (as a string).",
        "Do not try to interpret or handle career-related questions — always return 'false' if you're unsure or if it's even slightly related to career guidance."
    ]
    show_tool_calls=True,
    markdown=True,
)

edusearch_agent = Agent(
    name="Education agent",
    role="Search the web for the information related to Indian education. Focus on finding relevant and accurate data to answer questions about career options, college websites, cutoffs, and exam results.",
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo()],
    instructions=["Always inlcude sources along with the link embedded in the text"],
    show_tool_calls=True,
    markdown=True,
)

movie_agent = Agent(
    name="Movie agent",
    role="Based on the given information find the movies",
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo()],
    instructions=[""],
    show_tool_calls=True,
    markdown=True,
)

summarizer_agent = Agent(
    name="Summarizer Agent",
    model=Groq(id="llama-3.1-8b-instant"),
    role="You are a career guidance chatbot and summarizer. Given the response from lightrag and search agent summarize it and provide proper response",
    markdown=True,
    instructions=["Include the sources provided in the search agent response"],
    show_tool_calls=True,
)


jsonFormatter_agent = Agent(
    name="JSON Formatter Agent",
    model=Groq(id="llama-3.1-8b-instant"),
    role="You will be given a text and you need to format it into json format",
    markdown=True,
    instructions=["Follow the format if given any"],
    show_tool_calls=True,
)

markdown_agent = Agent(
    name="Markdown Agent",
    model=Groq(id="llama-3.1-8b-instant"),
    role="Given text response you should make it compatible to mark i down using react-markdown",
    markdown=True,
    show_tool_calls=True,
    instructions=["Add proper markdowns in accordance with one given in input but should be compatible with react-markdown"]
)


graph_generator_agent = Agent(
    name="Graph generator agent",
    model=Groq(id="llama-3.1-8b-instant"),
    role="Given text or json you need to generate a tree image for that using graphviz",
    markdown=True,
    show_tool_calls=True,
    instructions=["Try and generate colour image if possible"]
)


app = Playground(agents=[summarizer_agent, edusearch_agent, conv_agent, graph_generator_agent, jsonFormatter_agent, movie_agent, markdown_agent]).get_app()

if __name__=="__main__":
    serve_playground_app("agentsPlayground:app", reload=True)