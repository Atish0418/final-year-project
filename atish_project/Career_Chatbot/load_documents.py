import os
import asyncio
import numpy as np
import requests
from lightrag import LightRAG
from lightrag.utils import EmbeddingFunc
from sentence_transformers import SentenceTransformer

# ─── Configuration ────────────────────────────────────────────────────────────
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:1b"
WORKING_DIR = os.path.join(os.path.dirname(__file__), "career_data")

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

# ─── Embedding model (local) ──────────────────────────────────────────────────
print("📦 Loading embedding model (all-MiniLM-L6-v2)...")
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

async def local_embed(texts):
    embeddings = embedding_model.encode(texts)
    return np.array(embeddings)

wrapped_embed = EmbeddingFunc(
    embedding_dim=384,
    max_token_size=512,
    func=local_embed,
)

# ─── Ollama LLM function ──────────────────────────────────────────────────────
async def ollama_complete(prompt, system_prompt=None, history_messages=[], **kwargs) -> str:
    full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
    try:
        resp = await asyncio.to_thread(
            requests.post,
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": full_prompt,
                "stream": False,
            },
            timeout=120,
        )
        resp.raise_for_status()
        return resp.json().get("response", "No response received.")
    except Exception as e:
        return f"Error calling Ollama: {str(e)}"

# ─── Initialize and Load ──────────────────────────────────────────────────────
async def main():
    print("🔧 Initializing LightRAG...")
    rag = LightRAG(
        working_dir=WORKING_DIR,
        llm_model_func=ollama_complete,
        embedding_func=wrapped_embed,
        kv_storage="JsonKVStorage",
        vector_storage="NanoVectorDBStorage",
        graph_storage="NetworkXStorage",
    )
    
    # Ensure storages are initialized (async)
    await rag.initialize_storages()
    
    print("📄 Reading career_info.txt...")
    career_info_path = os.path.join(os.path.dirname(__file__), "career_info.txt")
    with open(career_info_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    print("🚀 Inserting documents into knowledge graph (this may take a while)...")
    await rag.ainsert(content)
    
    # Create a flag file
    flag_path = os.path.join(os.path.dirname(__file__), "documents_loaded.txt")
    with open(flag_path, "w") as f:
        f.write("loaded")
    
    print("✅ Documents loaded and Knowledge Graph initialized successfully!")

if __name__ == "__main__":
    asyncio.run(main())