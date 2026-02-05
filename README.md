---
title: AI Chat Assistant
emoji: 🤖
colorFrom: purple
colorTo: blue
sdk: docker
pinned: false
---

# 🤖 AI Chat Assistant

A modern, cutting-edge AI chat assistant powered by Google's Gemini API with a beautiful dark UI.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green?logo=fastapi)
![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Spaces-yellow)

## Features

✨ **Modern UI** - Dark theme with neon purple and cyan accents  
🤖 **Gemini AI** - Powered by Google's cutting-edge Gemini 2.5 Pro  
💬 **Memory** - AI remembers conversation history  
📝 **Markdown** - Rich formatting in responses  
🎨 **Responsive** - Works on desktop and tablet  
🐳 **Docker** - One-command deployment  
🚀 **Scalable** - Ready for production

## Quick Demo

Try the live demo on Hugging Face Spaces: [Your Space URL]

## Installation

### Option 1: Docker (Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd ai-chat-assistant

# Copy .env.example to .env and add your API key
cp .env.example .env
nano .env  # Add GEMINI_API_KEY from https://aistudio.google.com/app/apikey

# Start with Docker Compose
docker-compose up --build
```

### Option 2: Local Development

```bash
# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env in backend directory
echo "GEMINI_API_KEY=your_key_here" > .env

# Start backend (in one terminal)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend setup (in another terminal)
cd frontend
npm install
npm start
```

## Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## Deployment

### 🚀 Deploy to Hugging Face Spaces

See [DOCKER_AND_SPACES_GUIDE.md](./DOCKER_AND_SPACES_GUIDE.md) for detailed instructions.

Quick steps:
1. Create a Space on [huggingface.co/spaces](https://huggingface.co/spaces)
2. Set `GEMINI_API_KEY` as a secret in Space settings
3. Push your code (Space uses git)
4. Access at `https://your-username-ai-chat-assistant.hf.space`

### 🐳 Deploy with Docker

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### ☁️ Deploy to Other Clouds

- **Railway:** Use docker-compose config
- **Render:** Deploy backend, frontend separately
- **AWS:** Use ECS with docker-compose
- **GCP Cloud Run:** Push Docker images

## Project Structure

```
ai-chat-assistant/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py       # FastAPI app
│   │   ├── models/       # Pydantic models
│   │   ├── routes/       # API endpoints
│   │   └── services/     # Business logic (AI)
│   ├── config/
│   │   └── settings.py   # Configuration
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API client
│   │   └── styles/       # Styled components
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
├── docker-compose.yml    # Multi-container setup
├── start.sh              # Quick start script
├── stop.sh               # Stop script
└── DOCKER_AND_SPACES_GUIDE.md
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Gemini API Key (get from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_api_key_here

# Backend
DEBUG=false
HOST=0.0.0.0
PORT=8000

# Frontend (optional, for Hugging Face Spaces)
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### Customize AI Personality

Edit `backend/app/services/ai_service.py`:

```python
system_prompt = """You are a helpful teacher who...
- Explains concepts simply
- Uses real-world examples
- Encourages learning
"""
```

### Change Color Scheme

Edit `frontend/src/styles/GlobalStyles.js`:

```javascript
export const theme = {
    colors: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: '#06b6d4',
        // ... more colors
    }
}
```

## API Endpoints

### Chat
- **POST** `/api/v1/chat` - Send a message
  ```json
  {
    "message": "What is Python?",
    "conversation_history": []
  }
  ```

### Health Check
- **GET** `/api/v1/health` - API status

### Documentation
- **GET** `/docs` - Interactive API docs (Swagger UI)
- **GET** `/redoc` - ReDoc documentation

## Tech Stack

### Backend
- **Python 3.11** - Programming language
- **FastAPI** - Web framework
- **Pydantic** - Data validation
- **Google Generative AI** - Gemini API
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Styled Components** - CSS-in-JS
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering
- **Lucide Icons** - Icon library

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **Hugging Face Spaces** - Hosting

## Performance

- ⚡ ~200ms average response time
- 💾 Conversation history limited to 5 messages (optimizes API cost)
- 🔄 Streaming responses (optional)
- 📦 Optimized Docker images (~500MB)

## Security

- ✅ API key in environment variables only
- ✅ CORS configured
- ✅ No secrets in Git
- ✅ Input validation
- ⚠️ Consider adding rate limiting for production
- ⚠️ Consider adding authentication

## Troubleshooting

### Docker Issues

```bash
# Check if containers are running
docker ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild images
docker-compose build --no-cache

# Clean up everything
docker-compose down -v
docker system prune
```

### API Errors

- **"Failed to send message"** - Check backend logs
- **"GEMINI_API_KEY invalid"** - Verify your API key is correct
- **CORS error** - Backend might not be running

### Port Already in Use

```bash
# Find what's using the port
lsof -i :8000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change ports in docker-compose.yml
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI API
- FastAPI framework
- React community
- Hugging Face for Spaces

## Support

For issues and questions:
- 📖 Check [DOCKER_AND_SPACES_GUIDE.md](./DOCKER_AND_SPACES_GUIDE.md)
- 🐛 Report bugs in Issues
- 💬 Ask questions in Discussions
- 📚 See API docs at `/docs`

>>>>>>> 2f54dc34 (Initial commit:AI Chat Assistant (without node_modules)
---

**Made with ❤️ by Scott Gordon**

⭐ If you find this helpful, please star the repository!
# ai-chat-assistant
