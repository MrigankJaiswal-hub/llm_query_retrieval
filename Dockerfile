# FROM python:3.11-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY ./app /app/app

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]


# FROM node:20 AS frontend
# WORKDIR /app/frontend
# COPY frontend/package.json frontend/package-lock.json* ./
# RUN npm install
# COPY frontend/ ./
# RUN npm run build

# FROM python:3.11 AS backend
# WORKDIR /app
# COPY requirements.txt ./
# RUN pip install --no-cache-dir -r requirements.txt
# COPY . .
# COPY --from=frontend /app/frontend/dist ./frontend_dist
# ENV PYTHONUNBUFFERED=1
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# ==========================
# Stage 1: Build Frontend
# ==========================
FROM node:20 AS frontend
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build


# ==========================
# Stage 2: Backend + Frontend
# ==========================
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY ./app ./app

# Copy frontend build from Stage 1
COPY --from=frontend /frontend/dist ./frontend/dist

# Expose FastAPI port
EXPOSE 8000

# Run FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
