FROM node:18 as frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

FROM python:3.11-slim

WORKDIR /app/backend

# Copy backend requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend .

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/build ../frontend/build

# Expose port
EXPOSE 7860

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run the FastAPI backend
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
