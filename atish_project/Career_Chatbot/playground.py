import os
import re
import asyncio
import json
import base64
import uvicorn
import graphviz
import numpy as np
from phi.agent import Agent
import networkx as nx
from flask_cors import CORS
from dotenv import load_dotenv
import matplotlib.pyplot as plt
from phi.model.groq import Groq
from dotenv import load_dotenv
import google.generativeai as genai
from lightrag import LightRAG, QueryParam
from phi.tools.duckduckgo import DuckDuckGo
from phi.playground import Playground, serve_playground_app
from flask import Flask, request, jsonify, session
from sentence_transformers import SentenceTransformer

load_dotenv()
api_key = os.getenv("GENAI_API_KEY")
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

if not api_key:
    raise ValueError("API key not found in .env file. Make sure you have a .env file with GENAI_API_KEY=YOUR_API_KEY")

genai.configure(api_key=api_key)

embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

async def local_embed(texts):
    embeddings = embedding_model.encode(texts)
    return np.array(embeddings)

class EmbeddingWrapper:
    def __init__(self, func, dim):
        self.func = func
        self.embedding_dim = dim

    async def __call__(self, texts):
        return await self.func(texts)

wrapped_embed = EmbeddingWrapper(local_embed, 384)

async def gemini_complete(prompt, system_prompt=None, history_messages=[], **kwargs) -> str:
    model = genai.GenerativeModel('gemini-1.5-flash')
    try:
        # print(f"History being passed to Gemini: {history_messages}") #CHECK
        response = await asyncio.to_thread(model.generate_content, prompt)
        if response and hasattr(response, 'text'):
            return response.text
    except Exception as e:
        return f"Error calling Gemini API: {str(e)}"
    return "No response received."

if not os.path.exists("documents_loaded.txt"):
    print("Documents not loaded. Please run load_documents.py first.")
    exit()

rag = LightRAG(
    working_dir="./career_data",
    llm_model_func=gemini_complete,
    embedding_func=wrapped_embed
)

app = Flask(__name__)
app.secret_key = "super secret key"

CORS(app)  

# with open("career_path.json", "r") as json_file:
#     career_data = json.load(json_file)


def parse_duckduckgo_output(output_string):
    """Parses the output of the duckduckgo_search tool."""
    pattern = r"content='(.*?)'"
    match = re.search(pattern, output_string)
    if match:
        return match.group(1)
    else:
        return output_string

async def generate_graphviz_tree(json_response):
    dot = graphviz.Digraph(comment='Career Path Tree', format='png')
    dot.attr(rankdir="TB", nodesep="0.4", ranksep="0.6")  # Adjust spacing

    def add_nodes_edges(data, parent=None, dot=None):
        """Recursively add nodes and edges for Graphviz"""
        if isinstance(data, dict):
            for key, value in data.items():
                dot.node(key, shape="ellipse")  # Make nodes circular
                if parent:
                    dot.edge(parent, key)
                add_nodes_edges(value, key, dot)
        elif isinstance(data, list):
            for item in data:
                if isinstance(item, dict):
                    add_nodes_edges(item, parent, dot)
                else:
                    dot.node(item, shape="ellipse")
                    if parent:
                        dot.edge(parent, item)
        elif isinstance(data, str):
            dot.node(data, shape="ellipse")
            if parent:
                dot.edge(parent, data)

    add_nodes_edges(json_response.get("careerPaths", {}).get("careerOptions", {}), None, dot)

    img_bytes = dot.pipe(format='png')
    encoded_image = base64.b64encode(img_bytes).decode('utf-8')

    return encoded_image

async def get_json(response_text):
    prompt = f"""
    Convert the following response into valid JSON format, adapting the structure
    to the content of the response.

    Ensure that:
    - The output is **pure JSON** (no Markdown formatting, no backticks).
    - The JSON structure should be dynamically created based on the career options
      mentioned in the response.  Specifically:
        -  Create a "careerPaths" object.
        -  Within "careerPaths", create a "careerOptions" object.
        -  For each distinct career area mentioned (e.g., "commerce", "law",
           "finance", "management"), create a corresponding key in the
           "careerOptions" object, and assign an array of the specific career
           paths to that key.
        -  If the response includes sections like "vocationalTraining",
           "otherOptions", or "choosingTheRightPath", include those as separate
           keys within the "careerPaths" object.
        -  Do not assume any fixed career areas (like "engineering", "medicine", etc.).  Extract them from the response.
    -  If a career option has sub-options or more detail, include those in the
       corresponding array.
    -  Ensure that the JSON is complete and valid.

    Response:
    {response_text}
    """


    json_output = await gemini_complete(prompt)  # Use Gemini to generate JSON

    json_output = json_output.strip("```json").strip("```").strip()

    try:
        start_index = json_output.find('{')
        if start_index == -1:
            return {"error": "No JSON found", "raw_response": json_output}
        end_index = json_output.rfind('}') + 1
        if end_index == 0:
            return {"error": "Incomplete JSON found", "raw_response": json_output}
        json_string = json_output[start_index:end_index]
        return json.loads(json_string)
    except json.JSONDecodeError as e:
        return {"error": f"Invalid JSON: {e}", "raw_response": json_output}

def flatten_history(history):
    flat = []
    for message in history:
        role = message.get("role")
        text = message.get("content", [{}])[0].get("text", "")
        if role in ["user", "model"]:
            flat.append({
                "role": "user" if role == "user" else "assistant",
                "content": text
            })
    return flat


async def format_response_for_markdown(response_text: str) -> str:
    """
    Formats the given text response into Markdown.

    Args:
        response_text: The raw text response from the LLM.

    Returns:
        A string formatted in Markdown.
    """
    prompt = f"""
    Format the following text response into Markdown to preserve structure,
    bullet points, and emphasis.  Specifically:
    - Use '*' for unordered lists (bullet points).
    - Use numbered lists (e.g., '1.  ...', '2.  ...') for ordered lists.
    - Use '**' for bold text and '_' for italics.
    - Preserve newlines and spacing for readability.
    - If there are sub-points under a bullet, indent them by four spaces.

    Text:
    {response_text}
    """
    markdown_output = await gemini_complete(prompt)
    return markdown_output


async def searchKnowledgeBase(query, history):
    # Create QueryParam with history
    query_param = QueryParam(mode="mix", conversation_history=history, history_turns=6) # Pass the history here

    custom_prompt = """
    You are CareerCompass, a friendly and knowledgeable career guidance chatbot designed to help young people in India to explore potential career paths. You have access to a knowledge base with information about various careers.

    **Here's what we've talked about so far (use this to remember what the user has said):**
    {conversation_history}

    **Use the information from your knowledge base (career_info.txt) to answer questions and provide career guidance.**

    **Now, based on our conversation and the information in your knowledge base, your goal is to:**

    1.  **Ask Questions:** If needed, ask more questions about the user's interests, skills, and what they enjoy doing.
    2.  **Provide Information:** Offer clear and accurate information about different careers, including what those jobs involve, the education or training needed, and potential salary ranges. **Use the information from your knowledge base whenever possible.**
    3.  **Offer Suggestions:** Based on the user's answers, the history of our conversation, and the knowledge base, suggest careers that might be a good fit for them.
    4.  **Be Encouraging:** Offer positive and supportive feedback to help the user feel confident in their career exploration.
    5.  **Keep it Simple:** Use easy-to-understand language and avoid complicated jargon.
    6.  **Focus on the Future:** Help users think about the skills and knowledge they'll need for careers that are growing and changing.
    7. **Ask about specific interests:** If a user mentions a specific interest, ask follow up questions about it. For example, if they like computers, ask if they like hardware, software, or design.
    8. **Provide resources:** If you mention a career, provide links to websites or other resources where the user can learn more. **If the knowledge base has relevant links, share them.**

    Remember, you are here to guide and inspire, not to tell the user what they *must* do. Let them explore and discover their own path.
    """

    response = await rag.aquery(query, param=query_param, system_prompt=custom_prompt)
    formatted_response = await format_response_for_markdown(response)

    return formatted_response



edusearch_agent = Agent(
    name="Education agent",
    role="Search the web for the information related to Indian education. Focus on finding relevant and accurate data to answer questions about career options, college websites, cutoffs, and exam results.",
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo()],
    instructions=["Always inlcude sources along with the link embedded in the text"],
    show_tool_calls=True,
    markdown=True,
)

summarizer_agent = Agent(
    name="Summarizer Agent",
    model=Groq(id="llama-3.1-8b-instant"),
    role="You are a career guidance chatbot and summarizer. Given the response from lightrag and search agent summarize it and provide proper response",
    markdown=True,
    instructions=["Include the sources provided in the search agent response", "Don't include the names of the agents just summarize the final response as if only one agent was doing all the task"],
    show_tool_calls=True,
)


conv_agent = Agent(
    name="Conversational Agent",
    role="You are a friendly conversational agent for a career guidance chatbot. Your job is to handle general conversational queries (e.g., small talk, jokes, greetings). If the user asks anything related to career advice, jobs, education, or skill development, you should not answer and instead return the word 'false'.",
    model=Groq(id="llama-3.1-8b-instant"),
    tools=[DuckDuckGo()],
    instructions=[
        "If the user's message is conversational (e.g., greeting, personal question, humor, casual talk), respond appropriately.",
        "If the user's message is about careers, jobs, resumes, education, or learning paths, do not answer. Just return the word 'false' (as a string).",
        "Do not try to interpret or handle career-related questions — always return 'false' if you're unsure or if it's even slightly related to career guidance."
    ],
    show_tool_calls=True,
    markdown=True,
)


def merge_response(search_response, local_respone):
    output = f"The response from the search agent is {search_response} and the response from the lightrag is {local_respone}"
    return output


@app.route('/ask', methods=['POST'])
async def ask():
    data = request.get_json()
    query = data.get('query')
    if not query:
        return jsonify({'error': 'Query is required'}), 400
    

    # Initialize or retrieve conversation history from session
    if 'conversation_history' not in session:
        session['conversation_history'] = []
    history = session['conversation_history']

    # print(f"Current session history: {history}") #CHECK

    conversation_history = []
    for message in history:
        role = message.get("role")
        text = message.get("content", [{}])[0].get("text", "")
        if role in ["user", "model"]:
            conversation_history.append({
                "role": "user" if role == "user" else "assistant",
                "content": text
            })

    history_string = "\n".join([f"{msg['role']}: {msg['content'][0]['text']}" for msg in history])


    handle_flag =  await asyncio.to_thread(conv_agent.run, f"{query}")

    print("-"*100)
    print("Handle flag response is : ", handle_flag)

    if handle_flag.content != "false":
        return jsonify({
            'response': str(handle_flag.content),
        })

    response = await searchKnowledgeBase(query, conversation_history)

    json_response = await get_json(response)

    with open('career_response.json', 'w', encoding='utf-8') as f:
        json.dump(json_response, f, ensure_ascii=False, indent=4)

    print("-"*150)
    edusearch_response = await asyncio.to_thread(edusearch_agent.run, f"{query}. Here's the conversation so far: {history_string}")
    print("The type of Search agent repsonse is : ", type(edusearch_response))
    print("The type of the content is " ,type(edusearch_response.content)) 
    # print("\n[INFO] ---- EduSearch Agent Response is ----")
    # print(edusearch_response)
    print("\n[INFO] ---- EduSearch Agent Response content is ----")
    print(edusearch_response.content)
    print("[INFO] -----------------------------------\n")
    # parsed_edusearch_response = parse_duckduckgo_output(edusearch_response)
    print("-"*150)

    merged_response = merge_response(edusearch_response.content, response)
    print("\n[INFO] ---- Merged Response is ----")
    print("Merged Response:", merged_response)
    print("[INFO] -----------------------------------\n")
    final_response = await asyncio.to_thread(summarizer_agent.run, f"{merged_response}")
    # print("Final response is : ", final_response)

    history.append({"role": "user", "content": [{"text": query}]})
    history.append({"role": "assistant", "content": [{"text": str(final_response.content)}]})
    session['conversation_history'] = history[:]


    with open("outputLog.txt", "w", encoding="utf-8") as f:
        f.write("===== RESPONSE FROM LIGHT-RAG (searchKnowledgeBase) =====\n\n")
        f.write(response + "\n\n")

        f.write("===== RESPONSE FROM EDUSEARCH AGENT =====\n\n")
        f.write(str(edusearch_response.content) + "\n\n")

        f.write("===== FINAL SUMMARIZED RESPONSE =====\n\n")
        f.write(str(final_response.content) + "\n")


    keywords = ["career path", "career options", "future jobs"]
    if any(keyword in query.lower() for keyword in keywords):
        encoded_image = await generate_graphviz_tree(json_response)

        return jsonify({
            'response': str(final_response.content),
            'json_response': json_response,
            'tree_image': encoded_image
        })
    
    else:
        return jsonify({
            'response': str(final_response.content),
            'json_response': json_response,
        })

playground_app = Playground(app)

if __name__ == '__main__':
    app.run(debug=True)