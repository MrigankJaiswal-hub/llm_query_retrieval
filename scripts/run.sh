#!/bin/bash
# Load environment variables
export $(cat .env | xargs)

# Start FastAPI locally
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000