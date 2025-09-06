from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional, List
from app.parser import parse_file
from app.embedder import chunk_and_embed
from app.retriever import semantic_search
from app.answerer import generate_answer
import shutil, os, requests, re
import urllib.parse
from pydantic import BaseModel

app = FastAPI()

# ✅ Allow frontend to talk to backend (only needed if deploying frontend separately)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Serve React frontend build (from Docker multi-stage build)
frontend_dist = os.path.join(os.getcwd(), "frontend", "dist")
if os.path.isdir(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")

class Payload(BaseModel):
    query: str
    document_url: str | None = None


@app.post("/api/v1/upload")
async def upload_file_or_url(
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    questions: List[str] = Form(...)
):
    print("🚀 Started processing upload")

    if not file and not url:
        return JSONResponse(status_code=400, content={"error": "Provide either a file or a URL."})

    # Ensure upload directory exists
    upload_dir = os.path.join(os.getcwd(), "app", "uploaded_docs")
    os.makedirs(upload_dir, exist_ok=True)

    if file:
        # Sanitize filename
        filename = re.sub(r'[<>:"/\\|?*]', "_", file.filename)
        file_location = os.path.join(upload_dir, filename)

        print(f"📥 Saving uploaded file: {filename}")
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    else:
        # ✅ Handle file from URL
        parsed_url = urllib.parse.urlparse(url)
        raw_filename = os.path.basename(parsed_url.path)

        # Decode %20 → space
        decoded_filename = urllib.parse.unquote(raw_filename)

        # Sanitize for Windows-safe filename
        filename = re.sub(r'[<>:"/\\|?*]', "_", decoded_filename) or "remote_file.pdf"
        file_location = os.path.join(upload_dir, filename)

        print(f"📥 Downloading file from URL: {url}")
        response = requests.get(url, timeout=30)
        if response.status_code != 200:
            return JSONResponse(status_code=400, content={"error": "Failed to download file from URL."})

        with open(file_location, "wb") as f:
            f.write(response.content)

    print(f"📄 File saved at: {file_location}, now parsing...")

    try:
        text = parse_file(file_location)
        print("✅ Parsing done")

        chunks = chunk_and_embed(text)
        print("✅ Embedding done")

        answers = []
        for question in questions:
            print(f"❓ Processing question: {question}")
            top_chunks = semantic_search(question, chunks)
            answer = generate_answer(question, top_chunks)
            answers.append(answer)
            print(f"✅ Answered: {question}")

        print("🎉 All questions answered")
        return {"answers": answers, "filename": filename}
    
    except Exception as e:
        print("❌ Error occurred during processing:", str(e))
        return JSONResponse(status_code=500, content={"error": "Internal server error", "details": str(e)})


@app.get("/api/health")
def healthcheck():
    return {"status": "ok"}


@app.post("/api/v1/hackrx/run")
async def hackrx_webhook(payload: Payload):
    return {
        "status": "success",
        "message": "Received",
        "data": payload
    }

