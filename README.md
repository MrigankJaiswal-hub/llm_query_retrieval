📖 LLM-Powered Query Retrieval System

An intelligent query–retrieval system that processes large documents (PDF, DOCX, Emails, or Links) and allows users to ask natural language questions with contextual, clause-based answers.

Built with:

⚡ FastAPI – Backend API

⚛️ React + Vite – Frontend UI

🔍 Pinecone / FAISS – Vector DB for semantic search

🧠 Gemini / OpenAI / Mixtral – LLM for answer generation

✨ Features

✅ Upload files or provide document URLs
✅ Extracts text, chunks, and embeddings
✅ Semantic search over large documents
✅ LLM generates precise JSON-structured answers with rationale
✅ Frontend with loading states & file preview

🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/your-username/llm-query-retrieval.git
cd llm-query-retrieval

2️⃣ Backend Setup (FastAPI)

Create and activate a virtual environment:

cd backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows


Install dependencies:

pip install -r requirements.txt


Run the server:

uvicorn app.main:app --reload


Backend runs at 👉 http://localhost:8000

3️⃣ Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev


Frontend runs at 👉 http://localhost:5173

⚙️ Environment Variables

Create a .env file in the backend with:

OPENAI_API_KEY=your_key_here
PINECONE_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here


(Never commit .env to Git – use .gitignore)

☁️ Deployment
Railway

Push repo to GitHub

Go to Railway
 → Deploy from GitHub

Add environment variables in Railway dashboard

Set start command:

uvicorn app.main:app --host 0.0.0.0 --port 8000


Your API will be live at:

https://your-app.up.railway.app

Vercel (Optional for Frontend)

Frontend can be deployed separately on Vercel
.

🧪 Testing

To run backend tests:

pytest

📊 Demo

👉 Watch the demo video on LinkedIn (add link once posted).
👉 Example Question: “What is the policy coverage period?”
👉 Example Output:

{
  "answer": "Coverage period is from Jan 2024 to Dec 2024.",
  "clause_reference": "Section 3.2",
  "rationale": "Extracted from Coverage Terms section."
}
