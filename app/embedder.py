from langchain.text_splitter import RecursiveCharacterTextSplitter
from pinecone import Pinecone
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

from pinecone import ServerlessSpec

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

text_splitter = RecursiveCharacterTextSplitter(chunk_size=35000, chunk_overlap=3500)

def chunk_text(text: str):
    return text_splitter.split_text(text)

def upsert_chunks(chunks: list[str], namespace: str):
    vectors = []
    for chunk in chunks:
        response = genai.embed_content(
            model="models/embedding-001",
            content=chunk,
            task_type="retrieval_document"
        )
        embedding = response['embedding']

        # Print embedding vector dimension
        print("Embedding vector dimension:", len(embedding))

        vectors.append(embedding)

    upserts = [(str(i), vec, {"text": chunk}) for i, (vec, chunk) in enumerate(zip(vectors, chunks))]
    index.upsert(vectors=upserts, namespace=namespace)

def chunk_and_embed(text: str, namespace: str = "default") -> list[str]:
    chunks = chunk_text(text)
    upsert_chunks(chunks, namespace)
    return chunks