# # from openai import OpenAIEmbeddings
# from langchain.embeddings import OpenAIEmbeddings
# from langchain_openai import OpenAIEmbeddings

# from pinecone import Pinecone, ServerlessSpec
# import os
# from dotenv import load_dotenv
# load_dotenv()

# pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

# index_name = "llama-text-embed-v2-index"

# # Only create the index if it doesn't exist
# if index_name not in pc.list_indexes().names():
#     pc.create_index(
#         name=index_name,
#         dimension=1536,  # or whatever your embedding dimension is
#         metric="cosine",  # or "dotproduct" / "euclidean"
#         spec=ServerlessSpec(cloud="aws", region="us-east-1")
#     )

# # Now connect to the index
# index = pc.Index(index_name)


# def search_similar(query: str, namespace: str, k: int = 5) -> list[str]:
#     embedder = OpenAIEmbeddings()
#     embedding = embedder.embed_query(query)
#     results = index.query(vector=embedding, top_k=k, namespace=namespace, include_metadata=True)
#     return [match['metadata']['text'] for match in results['matches']]

# def semantic_search(query: str, chunks: list[str], namespace: str = "default", top_k: int = 5) -> list[str]:
#     return search_similar(query, namespace, k=top_k)

# def get_query_embedding(text: str) -> list[float]:
#     endpoint = aiplatform.models.TextEmbeddingModel.from_pretrained(EMBEDDING_MODEL)
#     embedding = endpoint.get_embeddings([text])[0].values
#     return embedding

# def search_similar(query: str, namespace: str, k: int = 5) -> list[str]:
#     embedding = get_query_embedding(query)
#     results = index.query(vector=embedding, top_k=k, namespace=namespace, include_metadata=True)
#     return [match['metadata']['text'] for match in results['matches']]

# from openai import OpenAIEmbeddings

from pinecone import Pinecone, ServerlessSpec

import os

from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

index_name = "llama-text-embed-v2-index-768"

# Only create the index if it doesn't exist

if index_name not in pc.list_indexes().names():

    pc.create_index(

        name=index_name,

        dimension=768,  # Updated for Gemini embeddings

        metric="cosine",  # or "dotproduct" / "euclidean"

        spec=ServerlessSpec(cloud="aws", region="us-east-1")

    )

# Now connect to the index

index = pc.Index(index_name)

def search_similar(query: str, namespace: str, k: int = 5) -> list[str]:

    response = genai.embed_content(

        model="models/embedding-001",

        content=query,

        task_type="retrieval_query"

    )

    embedding = response['embedding']

    results = index.query(vector=embedding, top_k=k, namespace=namespace, include_metadata=True)

    return [match['metadata']['text'] for match in results['matches']]

def semantic_search(query: str, chunks: list[str], namespace: str = "default", top_k: int = 5) -> list[str]:

    return search_similar(query, namespace, k=top_k)