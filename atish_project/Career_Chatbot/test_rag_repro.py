
import os
import asyncio
import numpy as np
from lightrag import LightRAG, QueryParam
from lightrag.utils import EmbeddingFunc

# Mock embedding model
async def mock_embed(texts):
    return np.random.rand(len(texts), 384)

wrapped_embed = EmbeddingFunc(
    embedding_dim=384,
    max_token_size=512,
    func=mock_embed,
)

async def mock_llm(prompt, **kwargs):
    return "Mocked response"

async def test():
    import os
    if not os.path.exists("test_dir_rag"):
        os.makedirs("test_dir_rag")
    
    rag = LightRAG(
        working_dir="test_dir_rag",
        llm_model_func=mock_llm,
        embedding_func=wrapped_embed,
        kv_storage="JsonKVStorage",
        vector_storage="NanoVectorDBStorage",
        graph_storage="NetworkXStorage",
    )
    rag.initialize_storages()
    
    print(f"KV Storage class: {type(rag.kv_storage)}")
    print(f"Graph Storage class: {type(rag.graph_storage)}")
    print(f"Vector Storage class: {type(rag.vector_storage)}")
    
    try:
        print("Attempting aquery...")
        # Mode 'mix' often requires actual nodes in the graph
        resp = await rag.aquery("test query", param=QueryParam(mode="naive"))
        print(f"Response: {resp}")
    except Exception as e:
        print(f"Caught error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
