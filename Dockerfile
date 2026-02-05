FROM python:3.11-slim

WORKDIR /app

# Install Node.js for frontend
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend ./backend

# Copy frontend and install dependencies
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Expose ports
EXPOSE 3000 8000

# Start both frontend and backend
WORKDIR /app
CMD ["sh", "-c", "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 & cd frontend && npm start"]
