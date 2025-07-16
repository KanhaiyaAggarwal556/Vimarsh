// ChatBot.jsx - Enhanced chatbot with AI API integration including Gemini
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2 } from 'lucide-react';
import './ChatBot.css';

const ChatBot = ({ isOpen, onToggle, position = 'bottom-right' }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant powered by advanced AI models. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentAPI, setCurrentAPI] = useState('gemini'); // Set Gemini as default
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // API Configuration - Using import.meta.env for Vite
  const API_CONFIG = {
    openai: {
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY || ''}`
      }
    },
    huggingface: {
      url: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY || ''}`,
        'Content-Type': 'application/json'
      }
    },
    cohere: {
      url: 'https://api.cohere.ai/v1/generate',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_COHERE_API_KEY || ''}`,
        'Content-Type': 'application/json'
      }
    },
    gemini: {
      url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  // OpenAI API call
  const callOpenAI = async (message) => {
    try {
      const response = await fetch(API_CONFIG.openai.url, {
        method: 'POST',
        headers: API_CONFIG.openai.headers,
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for a website. Be concise and friendly.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  };

  // Hugging Face API call (Free tier available)
  const callHuggingFace = async (message) => {
    try {
      const response = await fetch(API_CONFIG.huggingface.url, {
        method: 'POST',
        headers: API_CONFIG.huggingface.headers,
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      return data[0]?.generated_text || "I'm not sure how to respond to that.";
    } catch (error) {
      console.error('Hugging Face API Error:', error);
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  };

  // Cohere API call (Free tier available)
  const callCohere = async (message) => {
    try {
      const response = await fetch(API_CONFIG.cohere.url, {
        method: 'POST',
        headers: API_CONFIG.cohere.headers,
        body: JSON.stringify({
          model: 'command-light',
          prompt: `Human: ${message}\nAI:`,
          max_tokens: 100,
          temperature: 0.7,
          stop_sequences: ['\nHuman:']
        })
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.status}`);
      }

      const data = await response.json();
      return data.generations[0].text.trim();
    } catch (error) {
      console.error('Cohere API Error:', error);
      return "I'm having trouble connecting to the AI service. Please try again later.";
    }
  };

  // Gemini API call
  const callGemini = async (message) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyA938qM6CH57oOQ6Or6K_KcR5x3yDSF088';
      const url = `${API_CONFIG.gemini.url}?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: API_CONFIG.gemini.headers,
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 200,
            stopSequences: []
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error Details:', errorData);
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text;
        }
      }
      
      return "I'm not sure how to respond to that.";
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I'm having trouble connecting to the Gemini AI service. Please try again later.";
    }
  };

  // Free alternative - Enhanced fallback system
  const callFreeAI = async (message) => {
    // For now, we'll use our smart fallback system
    // You can integrate with free APIs later
    return getSmartFallbackResponse(message);
  };

  // Smart fallback response when APIs fail
  const getSmartFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Pattern matching for common queries
    if (lowerMessage.includes('weather')) {
      return "I'd love to help with weather information! You can check weather.com or your local weather app for the most accurate forecast.";
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('date')) {
      return `The current time is ${new Date().toLocaleTimeString()} and today is ${new Date().toLocaleDateString()}.`;
    }
    
    if (lowerMessage.includes('calculate') || lowerMessage.includes('math')) {
      // Simple math evaluation
      try {
        const mathResult = evaluateSimpleMath(message);
        if (mathResult !== null) {
          return `The answer is: ${mathResult}`;
        }
      } catch (error) {
        // Fall through to general response
      }
      return "I can help with basic calculations! Try asking me something like '2 + 2' or 'what is 10% of 50?'";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to help! You can ask me questions about various topics, request information, or just have a conversation. What would you like to know?";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Nice to meet you. I'm your AI assistant. How can I help you today?";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm happy to help. Is there anything else you'd like to know?";
    }
    
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return "Goodbye! It was nice chatting with you. Feel free to come back anytime you need help!";
    }
    
    // Enhanced responses for common topics
    if (lowerMessage.includes('programming') || lowerMessage.includes('coding')) {
      return "I can help with programming questions! While I'm running in offline mode, I can provide guidance on common programming concepts, debugging tips, and best practices.";
    }
    
    if (lowerMessage.includes('recipe') || lowerMessage.includes('cooking')) {
      return "I'd be happy to help with cooking questions! While I can't access real-time recipes, I can provide general cooking tips and techniques.";
    }
    
    return `That's an interesting question about "${message}". I'm currently running in offline mode, but I'm here to help with information, calculations, programming questions, and general conversation. Could you try rephrasing your question or asking about something specific?`;
  };

  // Simple math evaluation function
  const evaluateSimpleMath = (message) => {
    // Extract numbers and basic operations
    const mathPattern = /(\d+(?:\.\d+)?)\s*([\+\-\*\/])\s*(\d+(?:\.\d+)?)/;
    const match = message.match(mathPattern);
    
    if (match) {
      const [, num1, operator, num2] = match;
      const a = parseFloat(num1);
      const b = parseFloat(num2);
      
      switch (operator) {
        case '+':
          return a + b;
        case '-':
          return a - b;
        case '*':
          return a * b;
        case '/':
          return b !== 0 ? a / b : 'Cannot divide by zero';
        default:
          return null;
      }
    }
    
    return null;
  };

  // Main AI response function
  const getAIResponse = async (message) => {
    switch (currentAPI) {
      case 'openai':
        return await callOpenAI(message);
      case 'huggingface':
        return await callHuggingFace(message);
      case 'cohere':
        return await callCohere(message);
      case 'gemini':
        return await callGemini(message);
      case 'free':
      default:
        return await callFreeAI(message);
    }
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(currentInput);
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  // Toggle minimize
  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'chatbot-bottom-left';
      case 'bottom-right':
      default:
        return 'chatbot-bottom-right';
    }
  };

  // API Selector (for development/testing)
  const APISelector = () => (
    <div className="api-selector" style={{ padding: '8px',}}>
      <select 
        value={currentAPI} 
        onChange={(e) => setCurrentAPI(e.target.value)}
        style={{ fontSize: '12px', padding: '4px' }}
      >
        <option value="gemini">Gemini</option>
        <option value="openai">OpenAI</option>
        <option value="huggingface">Hugging Face</option>
        <option value="cohere">Cohere</option>
        <option value="free">Free AI</option>
      </select>
    </div>
  );

  return (
    <div className={`chatbot-container ${getPositionClasses()}`}>
      {/* Chat Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
        onClick={onToggle}
        aria-label="Toggle chatbot"
        type="button"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <div className="chatbot-notification-dot" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`chatbot-window ${isMinimized ? 'minimized' : ''}`}>
          {/* Chat Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Bot size={20} />
              </div>
              <div className="chatbot-title">
                <h4>AI Assistant</h4>
                <span className="chatbot-status">Online • {currentAPI.toUpperCase()}</span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button
                className="chatbot-minimize"
                onClick={handleMinimize}
                aria-label="Minimize chat"
                type="button"
              >
                <Minimize2 size={16} />
              </button>
              <button
                className="chatbot-close"
                onClick={onToggle}
                aria-label="Close chat"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* API Selector (remove in production) */}
          {!isMinimized && import.meta.env.DEV && <APISelector />}

          {/* Chat Messages */}
          {!isMinimized && (
            <>
              <div className="chatbot-messages">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`chatbot-message ${message.sender}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'bot' ? (
                        <Bot size={16} />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        {message.text}
                      </div>
                      <div className="message-time">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="chatbot-message bot">
                    <div className="message-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble typing">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                <div className="chatbot-input-wrapper">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="chatbot-input"
                    disabled={isTyping}
                  />
                  <button
                    type="submit"
                    className="chatbot-send"
                    disabled={!inputMessage.trim() || isTyping}
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;