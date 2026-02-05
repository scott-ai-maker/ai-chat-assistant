import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Send, Bot, User, Loader } from 'lucide-react';
import { chatAPI } from '../services/api';
import ReactMarkdown from 'react-markdown';

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  height: 700px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 1.5rem;
  box-shadow: ${props => props.theme.shadows.glow}, ${props => props.theme.shadows.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(10px);
`;

const Header = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 1.5rem;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  p {
    font-size: 0.875rem;
    opacity: 0.95;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${props => props.theme.colors.surface};
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.surface};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.primarySolid};
  }
`;

const MessageBubble = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  ${props => props.role === 'user' && 'flex-direction: row-reverse;'}
`;

const MessageIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => props.role === 'user' 
    ? props.theme.colors.primary 
    : props.theme.colors.secondary};
  color: white;
  box-shadow: ${props => props.role === 'user' 
    ? '0 0 15px rgba(139, 92, 246, 0.6)' 
    : '0 0 15px rgba(6, 182, 212, 0.6)'};
`;

const MessageContent = styled.div`
  max-width: 70%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  background: ${props => props.role === 'user' 
    ? props.theme.colors.primary 
    : props.theme.colors.surfaceLight};
  color: ${props => props.role === 'user' ? 'white' : props.theme.colors.text};
  word-wrap: break-word;
  border: 1px solid ${props => props.role === 'user' 
    ? 'transparent' 
    : props.theme.colors.border};
  box-shadow: ${props => props.role === 'user' 
    ? '0 4px 15px rgba(139, 92, 246, 0.3)' 
    : '0 2px 8px rgba(0, 0, 0, 0.2)'};
  
  /* Markdown styling */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.3rem; }
  h3 { font-size: 1.1rem; }
  
  p {
    margin: 0.5rem 0;
    line-height: 1.6;
  }
  
  code {
    background: ${props => props.role === 'user' ? 'rgba(0,0,0,0.3)' : 'rgba(139, 92, 246, 0.15)'};
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    color: ${props => props.role === 'user' ? '#fff' : '#a78bfa'};
  }
  
  pre {
    background: ${props => props.role === 'user' ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.3)'};
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 0.5rem 0;
    border: 1px solid ${props => props.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(139, 92, 246, 0.2)'};
  }
  
  pre code {
    background: none;
    padding: 0;
  }
  
  ul, ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }
  
  li {
    margin: 0.25rem 0;
  }
  
  strong {
    font-weight: 600;
  }
  
  a {
    color: ${props => props.role === 'user' ? 'white' : '#a78bfa'};
    text-decoration: underline;
    &:hover {
      color: ${props => props.role === 'user' ? '#f0f0f0' : '#c4b5fd'};
    }
  }
  
  blockquote {
    border-left: 3px solid ${props => props.role === 'user' ? 'rgba(255,255,255,0.5)' : '#ccc'};
    padding-left: 1rem;
    margin: 0.5rem 0;
    font-style: italic;
  }
  
  hr {
    border: none;
    border-top: 1px solid ${props => props.role === 'user' ? 'rgba(255,255,255,0.3)' : '#ddd'};
    margin: 1rem 0;
  }
`;

const InputArea = styled.div`
  border-top: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 1.5rem;
  display: flex;
  gap: 0.75rem;
  background: ${props => props.theme.colors.surface};
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  background: ${props => props.theme.colors.surfaceLight};
  color: ${props => props.theme.colors.text};
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${props => props.theme.colors.primarySolid};
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ChatContainer = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. What would you like to learn about Python and AI?',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
    };

    // Add user message to the UI immediately
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send the current conversation history (before this message) to the API
      // This allows the AI to remember the conversation
      const response = await chatAPI.sendMessage(userMessage.content, messages);
      
      if (response.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.response,
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container>
      <Header>
        <h1>AI Chat Assistant</h1>
        <p>Powered by Python & Gemini AI - created by Scott Gordon</p>
      </Header>
      
      <MessagesArea>
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role}>
            <MessageIcon role={msg.role}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </MessageIcon>
            <MessageContent role={msg.role}>
              {msg.role === 'assistant' ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </MessageContent>
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble role="assistant">
            <MessageIcon role="assistant">
              <Bot size={20} />
            </MessageIcon>
            <MessageContent role="assistant">
              <Loader size={20} className="animate-spin" />
            </MessageContent>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesArea>

      <InputArea>
        <Input
          type="text"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <SendButton onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
          <Send size={18} />
          Send
        </SendButton>
      </InputArea>
    </Container>
  );
};

export default ChatContainer;