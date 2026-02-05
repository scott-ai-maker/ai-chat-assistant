import google.generativeai as genai
from config.settings import settings
from app.models.chat import ChatMessage
from typing import List
import logging
from datetime import datetime


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.5-pro')

    def generate_response(self, user_message: str, conversation_history: List[ChatMessage] = []) -> str:
        try:
            context = self.build_context(conversation_history)
            full_prompt = f"{context}\nUser: {user_message}\nAssistant:"

            logger.info(f"Generating AI response for: {user_message[:50]}...")
            response = self.model.generate_content(full_prompt)

            if response and response.text:
                return response.text.strip()
            else:
                return "I apologize, but I couldn't generate a response at the moment."

        except Exception as e:
            logger.error(f"Error generating AI response: {str(e)}")
            return f"I'm experiencing technical difficulties: {str(e)}"

    def build_context(self, conversation_history: List[ChatMessage]) -> str:
        # Define the AI's personality and behavior
        system_prompt = """You are an enthusiastic and patient teacher who loves helping students learn. 
Your teaching style:
- Break down complex topics into simple, easy-to-understand steps
- Use real-world examples and analogies to explain concepts
- Encourage questions and curiosity
- Provide code examples when teaching programming
- Celebrate progress and learning milestones
- Use a friendly, encouraging tone
- Ask follow-up questions to check understanding
Remember: Your goal is to make learning enjoyable and accessible!"""

        if not conversation_history:
            return system_prompt

        context = system_prompt + "\n\nHere's our conversation so far:\n"
        # Keep last 5 messages for context
        for message in conversation_history[-5:]:
            context += f"{message.role.title()}: {message.content}\n"

        return context


ai_service = AIService()
