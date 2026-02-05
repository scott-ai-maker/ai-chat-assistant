# AI Chat Assistant - Docker & Hugging Face Spaces Guide

A cutting-edge AI chat assistant with FastAPI backend, React frontend, and Gemini AI integration.

## Features

✨ **Modern UI** - Dark theme with neon purple and cyan accents
🤖 **AI-Powered** - Powered by Google's Gemini 2.5 Pro
💬 **Conversation Memory** - AI remembers previous messages
📝 **Markdown Support** - Rich text formatting in responses
🐳 **Docker Ready** - Easy deployment with Docker & Docker Compose

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Local Deployment

1. **Clone the repository:**
```bash
git clone https://github.com/scott-ai-maker/ai-chat-assistant
cd ai-chat-assistant
```

2. **Create `.env` file:**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
nano .env
```

3. **Start with Docker Compose:**
```bash
docker-compose up --build
```

4. **Access the app:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

### Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose up --build
```

---

## Deploying to Hugging Face Spaces

Hugging Face Spaces allows you to host your app for free! Here's how:

### Step 1: Create Hugging Face Account
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up or log in
3. Create an API token at [Settings > Access Tokens](https://huggingface.co/settings/tokens)

### Step 2: Create a New Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **Create new Space**
3. Fill in details:
   - **Space name:** `ai-chat-assistant`
   - **Space type:** `Docker`
   - **Private/Public:** Choose your preference
4. Click **Create Space**

### Step 3: Connect to Git

Hugging Face Spaces uses Git for deployment. You have two options:

#### Option A: Use Hugging Face's Git (Recommended)

1. Clone the Space repository (Hugging Face will create one for you)
2. Copy your project files into it
3. Push to Hugging Face

```bash
# After creating the space, you'll get a repo URL like:
# https://huggingface.co/spaces/your-username/ai-chat-assistant

git clone https://huggingface.co/spaces/your-username/ai-chat-assistant
cd ai-chat-assistant

# Copy your project files here
cp -r ../ai-chat-assistant-local/* .

# Push to Hugging Face
git add .
git commit -m "Initial commit: AI Chat Assistant"
git push
```

#### Option B: GitHub Integration

1. Push your repo to GitHub
2. Link your GitHub repo to Hugging Face Spaces
3. Hugging Face will auto-deploy on every push

### Step 4: Configure Secrets

Hugging Face Spaces needs your API key securely:

1. Go to your Space settings
2. Add a **Secret** (not visible in logs):
   - **Name:** `GEMINI_API_KEY`
   - **Value:** Your actual Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 5: Docker Configuration for Spaces

Create a `Dockerfile` in your Space root (if not present):

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
EXPOSE 7860
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

**Note:** Hugging Face Spaces typically uses port **7860**, not 8000.

### Step 6: For Full Stack App

If deploying both frontend and backend to Spaces, you have two options:

#### Option A: Backend Only (Recommended)
Deploy just the backend to Spaces and use the frontend as a static site (Vercel, Netlify).

Update frontend API URL in environment:
```
REACT_APP_API_URL=https://your-username-ai-chat-assistant.hf.space/api/v1
```

#### Option B: Single Docker Container
Create a combined Dockerfile that serves both:

```dockerfile
FROM node:18-alpine as frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci && npm run build

FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
COPY --from=frontend-builder /frontend/build ./static
EXPOSE 7860
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

Then serve static files from FastAPI:
```python
from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="static", html=True))
```

### Step 7: Monitor Deployment

1. Go to your Space page
2. Check the **Build** and **Runtime** logs
3. Wait for "Successfully built" message
4. Your app will be live at: `https://your-username-ai-chat-assistant.hf.space`

---

## Environment Variables

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key
DEBUG=false
HOST=0.0.0.0
PORT=8000  # Use 7860 for Hugging Face Spaces
```

### Frontend (.env.local)
```
REACT_APP_API_URL=http://localhost:8000/api/v1
# For Hugging Face Spaces:
# REACT_APP_API_URL=https://your-username-ai-chat-assistant.hf.space/api/v1
```

---

## Project Structure

```
ai-chat-assistant/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── config/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   ├── Dockerfile
│   ├── package.json
│   └── .dockerignore
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Building Docker Images Manually

### Backend
```bash
cd backend
docker build -t ai-chat-backend:latest .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key ai-chat-backend:latest
```

### Frontend
```bash
cd frontend
docker build -t ai-chat-frontend:latest .
docker run -p 3000:3000 ai-chat-frontend:latest
```

---

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
docker-compose logs backend  # Check backend logs
docker-compose logs frontend # Check frontend logs
```

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Or stop conflicting containers
docker ps
docker stop <container_id>
```

### Hugging Face Spaces Issues

**Build fails:**
- Check the logs in Space settings
- Ensure all dependencies are in requirements.txt
- Verify GEMINI_API_KEY secret is set

**API calls failing:**
- Check CORS settings in backend
- Verify API URL is correct in frontend env
- Check Hugging Face Space URL format

**Port issues:**
- Hugging Face Spaces uses port **7860**
- Update your Dockerfile CMD to use 7860

---

## Customization

### Change AI Personality

Edit `backend/app/services/ai_service.py`:

```python
def build_context(self, conversation_history):
    system_prompt = """Your custom personality here"""
    # ...
```

### Modify Color Scheme

Edit `frontend/src/styles/GlobalStyles.js`:

```javascript
export const theme = {
    colors: {
        primary: 'your_color',
        // ...
    }
}
```

### Add New Features

- Add chat features in `frontend/src/components/ChatContainer.js`
- Add API endpoints in `backend/app/routes/chat.py`
- Update models in `backend/app/models/chat.py`

---

## Performance Tips

1. **Use Redis for conversation caching** (optional)
2. **Implement rate limiting** in FastAPI
3. **Cache AI responses** for common queries
4. **Optimize images** in frontend
5. **Use CDN** for static assets

---

## Security

- ✅ API key stored in environment variables
- ✅ CORS properly configured
- ✅ No secrets in code or Docker images
- ⚠️ Add rate limiting before production
- ⚠️ Add authentication for user features

---

## License

MIT

## Support

For issues or questions:
1. Check Hugging Face Spaces documentation
2. Review Docker documentation
3. See FastAPI docs at `http://localhost:8000/docs`

Happy building! 🚀
