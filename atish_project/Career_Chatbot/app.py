"""
Career Guidance Chatbot Backend
Uses LightRAG (knowledge graph) + Ollama (llama3.2:1b) + sentence-transformers.
No external API keys required — everything runs locally.
"""

import os
import asyncio
import json
import requests
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from lightrag import LightRAG, QueryParam
from lightrag.utils import EmbeddingFunc
from sentence_transformers import SentenceTransformer

# ─── Configuration ────────────────────────────────────────────────────────────
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:1b"
WORKING_DIR = os.path.join(os.path.dirname(__file__), "career_data")

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# ─── Embedding model (local, no API key) ─────────────────────────────────────
print("📦 Loading embedding model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("✅ Embedding model loaded")


async def local_embed(texts):
    """Local embedding function for LightRAG."""
    embeddings = embedding_model.encode(texts)
    return np.array(embeddings)


wrapped_embed = EmbeddingFunc(
    embedding_dim=384,
    max_token_size=512,
    func=local_embed,
)


# ─── Ollama LLM function (replaces Gemini) ───────────────────────────────────
async def ollama_complete(prompt, system_prompt=None, history_messages=[], **kwargs) -> str:
    """
    LLM function for LightRAG — calls local Ollama instead of Gemini.
    Same signature as the original gemini_complete.
    """
    full_prompt = ""
    if system_prompt:
        full_prompt += f"{system_prompt}\n\n"
    full_prompt += prompt

    try:
        resp = await asyncio.to_thread(
            requests.post,
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": full_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 1024,
                },
            },
            timeout=120,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "No response received.")
    except Exception as e:
        return f"Error calling Ollama: {str(e)}"


# ─── Check documents are loaded ──────────────────────────────────────────────
doc_flag = os.path.join(os.path.dirname(__file__), "documents_loaded.txt")
if not os.path.exists(doc_flag):
    print("⚠️  documents_loaded.txt not found. Creating it since career_data exists...")
    if os.path.exists(WORKING_DIR):
        with open(doc_flag, "w") as f:
            f.write("loaded")
    else:
        print("❌ career_data directory not found. Please run load_documents.py first.")
        exit()

# ─── Initialize LightRAG with Ollama ─────────────────────────────────────────
print("🔧 Initializing LightRAG with Ollama backend...")
rag = LightRAG(
    working_dir=WORKING_DIR,
    llm_model_func=ollama_complete,
    embedding_func=wrapped_embed,
    kv_storage="JsonKVStorage",
    vector_storage="NanoVectorDBStorage",
    graph_storage="NetworkXStorage",
)
print("✅ LightRAG configuration loaded")

# ─── Flask app ────────────────────────────────────────────────────────────────
app = Flask(__name__)
app.secret_key = "career-chatbot-secret"
CORS(app, supports_credentials=True)

# ─── In-memory conversation stores ───────────────────────────────────────────
conversations: dict[str, list[dict]] = {}

CAREER_SYSTEM_PROMPT = """You are CareerCompass, a friendly and knowledgeable career guidance chatbot designed to help young people in India explore potential career paths.

Your goals:
1. Ask clarifying questions about the user's interests, skills, and preferences when needed.
2. Provide clear and accurate information about different careers — what the job involves, education/training needed, and potential salary ranges.
3. Suggest careers that match the user's profile based on the conversation.
4. Be encouraging and supportive to help users feel confident.
5. Use simple, easy-to-understand language. Avoid jargon.
6. Focus on future-ready skills and growing career fields.
7. When a user mentions a specific interest, ask follow-up questions to narrow it down.
8. Format your responses with bullet points and clear sections for readability.
9. Keep responses concise but informative.

Remember: you are here to guide and inspire, not to dictate. Let users explore and discover their own path."""


async def search_knowledge_base(query, conversation_history):
    """Query LightRAG's knowledge graph for relevant career info."""
    # Ensure storages are initialized (LightRAG 1.4.x+)
    if not hasattr(rag, "initialized") or not rag.initialized:
        try:
            # Check if initialize_storages is async and await it
            await rag.initialize_storages()
            rag.initialized = True
        except Exception as e:
            print(f"⚠️ Initialization warning: {e}")

    query_param = QueryParam(
        mode="mix",
        conversation_history=conversation_history,
        history_turns=6,
    )

    response = await rag.aquery(
        query,
        param=query_param,
        system_prompt=CAREER_SYSTEM_PROMPT,
    )
    return response


def query_ollama_chat(messages: list[dict]) -> str:
    """Send a chat request to Ollama (used for final response generation)."""
    try:
        resp = requests.post(
            "http://localhost:11434/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 1024,
                },
            },
            timeout=120,
        )
        resp.raise_for_status()
        data = resp.json()
        return data.get("message", {}).get("content", "Sorry, I couldn't generate a response.")
    except requests.exceptions.ConnectionError:
        return "⚠️ Cannot connect to Ollama. Please make sure Ollama is running."
    except requests.exceptions.Timeout:
        return "⚠️ The model took too long to respond. Please try a shorter question."
    except Exception as e:
        return f"⚠️ Error: {str(e)}"


def extract_follow_ups(response_text: str) -> list[str]:
    """Extract potential follow-up questions from the response."""
    follow_ups = []
    lines = response_text.split("\n")
    for line in lines:
        stripped = line.strip().lstrip("- •*0123456789.)").strip()
        if stripped.endswith("?") and 10 < len(stripped) < 120:
            follow_ups.append(stripped)
    return follow_ups[:4]


# ─── API Routes ───────────────────────────────────────────────────────────────

@app.route("/ask", methods=["POST"])
async def ask():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    query = data.get("query", "").strip()
    if not query:
        return jsonify({"error": "Query is required"}), 400

    session_id = request.headers.get("X-Session-Id", "default")

    # Get or create conversation history
    if session_id not in conversations:
        conversations[session_id] = []
    history = conversations[session_id]

    # Build conversation history for LightRAG
    conversation_history = [
        {"role": msg["role"], "content": msg["content"]}
        for msg in history[-12:]
    ]
    history_string = "\n".join(
        f"{msg['role']}: {msg['content']}" for msg in conversation_history
    )

    # Step 1: Search knowledge base via LightRAG
    try:
        rag_response = await search_knowledge_base(query, conversation_history)
    except Exception as e:
        print(f"⚠️ LightRAG error: {e}")
        rag_response = ""

    # Step 2: Generate final response using Ollama with RAG context
    messages = [{"role": "system", "content": CAREER_SYSTEM_PROMPT}]

    # Add conversation history
    for msg in history[-10:]:
        messages.append(msg)

    # Add user query enriched with RAG context
    enriched_query = query
    if rag_response:
        enriched_query = (
            f"User question: {query}\n\n"
            f"Relevant information from knowledge base:\n{rag_response}\n\n"
            f"Please use the above knowledge base information to provide an accurate, "
            f"helpful response to the user's question."
        )

    messages.append({"role": "user", "content": enriched_query})

    # Get final response from Ollama
    response_text = query_ollama_chat(messages)

    # Update conversation history
    history.append({"role": "user", "content": query})
    history.append({"role": "assistant", "content": response_text})
    conversations[session_id] = history

    # Extract follow-up questions
    follow_ups = extract_follow_ups(response_text)

    result = {
        "response": response_text,
        "json_response": {"followUpQuestions": follow_ups} if follow_ups else {},
    }

    return jsonify(result)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    try:
        resp = requests.get("http://localhost:11434/api/tags", timeout=5)
        ollama_ok = resp.status_code == 200
    except Exception:
        ollama_ok = False

    return jsonify({
        "status": "ok",
        "ollama": "connected" if ollama_ok else "disconnected",
        "model": OLLAMA_MODEL,
        "lightrag": "initialized",
    })


@app.route("/reset", methods=["POST"])
def reset():
    """Reset conversation history for a session."""
    session_id = request.headers.get("X-Session-Id", "default")
    conversations.pop(session_id, None)
    return jsonify({"status": "reset", "session_id": session_id})


if __name__ == "__main__":
    print("=" * 60)
    print("  🎓 CareerCompass Chatbot Backend")
    print(f"  📦 Model: {OLLAMA_MODEL} (via Ollama)")
    print("  📚 RAG: LightRAG + sentence-transformers")
    print("  🌐 Server: http://127.0.0.1:5000")
    print("=" * 60)
    app.run(debug=True, host="0.0.0.0", port=5000)