// ChatBot.tsx - Enhanced local chatbot with comprehensive responses
import React, { useState, useRef, useEffect, FormEvent, KeyboardEvent, ChangeEvent } from 'react';
import { MessageCircle, Send, X, Bot, User, Minimize2 } from 'lucide-react';
import './styles/ChatBot.css';

// Type definitions
interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
  position?: 'bottom-left' | 'bottom-right';
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onToggle, position = 'bottom-right' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your AI assistant. I can help you with various topics including programming, cooking, math, general knowledge, and more. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (): void => {
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

  // Enhanced response system with comprehensive knowledge base
  const getSmartResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase().trim();
    
    // Greetings
    if (lowerMessage.match(/^(hello|hi|hey|good morning|good afternoon|good evening|greetings)/)) {
      const greetings = [
        "Hello! Nice to meet you. I'm your AI assistant. How can I help you today?",
        "Hi there! I'm here to help with any questions you might have. What's on your mind?",
        "Hey! Welcome! I can assist you with programming, math, cooking, general knowledge, and much more. What would you like to know?",
        "Good to see you! I'm your personal AI assistant. Feel free to ask me anything!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // Farewells
    if (lowerMessage.match(/^(bye|goodbye|see you|farewell|take care)/)) {
      const farewells = [
        "Goodbye! It was great chatting with you. Feel free to come back anytime!",
        "Take care! I'm always here when you need help. Have a wonderful day!",
        "See you later! Don't hesitate to return if you have more questions.",
        "Farewell! Thanks for the conversation. I'll be here whenever you need assistance!"
      ];
      return farewells[Math.floor(Math.random() * farewells.length)];
    }

    // Thanks
    if (lowerMessage.includes('thank')) {
      const thanks = [
        "You're very welcome! I'm happy to help. Is there anything else you'd like to know?",
        "My pleasure! That's what I'm here for. Feel free to ask more questions!",
        "Glad I could help! Don't hesitate to reach out if you need anything else.",
        "You're welcome! I enjoy helping out. What else can I assist you with?"
      ];
      return thanks[Math.floor(Math.random() * thanks.length)];
    }

    // Programming & Technology
    if (lowerMessage.match(/(programming|coding|code|javascript|python|react|html|css|web development|software|algorithm|debug|function|variable|array|object)/)) {
      const programmingTopics: Record<string, string> = {
        javascript: "JavaScript is a versatile programming language used for web development. It's great for both frontend (with frameworks like React, Vue) and backend (with Node.js). Key concepts include variables, functions, objects, arrays, and event handling.",
        python: "Python is an excellent programming language for beginners and experts alike. It's used for web development, data science, AI/ML, automation, and more. Known for its readable syntax and extensive libraries like NumPy, Pandas, and Django.",
        react: "React is a popular JavaScript library for building user interfaces. Key concepts include components, props, state, hooks (useState, useEffect), and JSX. It uses a virtual DOM for efficient updates.",
        html: "HTML (HyperText Markup Language) is the foundation of web pages. It uses tags to structure content like headings (<h1>), paragraphs (<p>), links (<a>), images (<img>), and forms.",
        css: "CSS (Cascading Style Sheets) styles HTML elements. Key concepts include selectors, properties, flexbox, grid, animations, and responsive design with media queries.",
        debug: "Debugging tips: 1) Use console.log() to track variables, 2) Use browser developer tools, 3) Read error messages carefully, 4) Check syntax and spelling, 5) Test small pieces of code separately.",
        algorithm: "Algorithms are step-by-step procedures for solving problems. Common types include sorting (bubble sort, quick sort), searching (binary search), and data structure operations. Focus on understanding the logic first, then optimize."
      };

      for (const [key, value] of Object.entries(programmingTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "I can help with programming questions! I know about JavaScript, Python, React, HTML, CSS, debugging techniques, algorithms, and web development best practices. What specific programming topic interests you?";
    }

    // Mathematics
    if (lowerMessage.match(/(math|calculate|equation|algebra|geometry|statistics|percentage|formula)/)) {
      // Simple math evaluation
      const mathResult = evaluateSimpleMath(message);
      if (mathResult !== null) {
        return `The answer is: ${mathResult}`;
      }

      const mathTopics: Record<string, string> = {
        algebra: "Algebra deals with mathematical symbols and rules for manipulating them. Key concepts include variables, equations, functions, and solving for unknowns. Remember: what you do to one side of an equation, do to the other!",
        geometry: "Geometry studies shapes, sizes, and properties of space. Important formulas: Circle area = πr², Triangle area = ½×base×height, Rectangle area = length×width, Pythagorean theorem: a²+b²=c²",
        statistics: "Statistics analyzes data to find patterns. Key concepts: mean (average), median (middle value), mode (most frequent), standard deviation (spread), and correlation (relationship between variables).",
        percentage: "To calculate percentage: (part/whole) × 100. For percentage increase: ((new-old)/old) × 100. For percentage decrease: ((old-new)/old) × 100."
      };

      for (const [key, value] of Object.entries(mathTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "I can help with math! Try asking me calculations like '15 × 8', '50% of 200', or ask about algebra, geometry, statistics, or any mathematical concepts you'd like to learn about.";
    }

    // Science
    if (lowerMessage.match(/(science|physics|chemistry|biology|astronomy|climate|environment|DNA|evolution|gravity|photosynthesis)/)) {
      const scienceTopics: Record<string, string> = {
        physics: "Physics studies matter, energy, and their interactions. Key concepts: Newton's laws of motion, energy conservation, wave properties, electricity & magnetism, and Einstein's relativity theories.",
        chemistry: "Chemistry studies atoms, molecules, and chemical reactions. Important concepts: periodic table, chemical bonds (ionic, covalent), pH scale, organic vs inorganic compounds, and stoichiometry.",
        biology: "Biology studies living organisms. Key areas: cell structure, genetics (DNA, RNA), evolution, ecology, anatomy, physiology, and biodiversity. All life shares common characteristics like reproduction and metabolism.",
        astronomy: "Astronomy studies celestial objects and space. Our solar system has 8 planets, the universe is expanding, stars form from gas clouds, and galaxies contain billions of stars. The nearest star is 4.3 light-years away!",
        dna: "DNA (Deoxyribonucleic Acid) carries genetic information in all living things. It's made of four bases: A, T, G, C. DNA forms a double helix structure and contains instructions for making proteins.",
        photosynthesis: "Photosynthesis is how plants make food using sunlight, water, and carbon dioxide. The equation: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. It's crucial for life on Earth!"
      };

      for (const [key, value] of Object.entries(scienceTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "I love science questions! I can explain concepts in physics, chemistry, biology, astronomy, and environmental science. What scientific topic interests you?";
    }

    // Cooking & Food
    if (lowerMessage.match(/(cook|recipe|food|bake|kitchen|ingredient|meal|dish|cuisine|nutrition)/)) {
      const cookingTopics: Record<string, string> = {
        baking: "Baking tips: 1) Measure ingredients precisely, 2) Preheat oven properly, 3) Don't overmix batter, 4) Use room temperature ingredients for better mixing, 5) Test doneness with toothpick or thermometer.",
        pasta: "Perfect pasta: Use lots of salted boiling water, don't add oil, stir occasionally, cook al dente (firm to bite), save pasta water for sauce, and mix with sauce immediately after draining.",
        chicken: "Cooking chicken safely: Internal temperature should reach 165°F (74°C). Popular methods: grilling, baking at 375°F, pan-frying, or slow cooking. Season well and let rest after cooking.",
        vegetables: "Cooking vegetables: Steam to retain nutrients, roast for caramelization, sauté quickly for crispness, or grill for smoky flavor. Don't overcook to maintain color, texture, and vitamins.",
        nutrition: "Balanced nutrition includes: proteins (meat, beans, nuts), carbohydrates (grains, fruits), healthy fats (olive oil, avocado), vitamins/minerals (fruits, vegetables), and plenty of water."
      };

      for (const [key, value] of Object.entries(cookingTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "I can help with cooking! I know about baking techniques, cooking methods, food safety, nutrition tips, and cuisine from around the world. What cooking topic interests you?";
    }

    // Health & Fitness
    if (lowerMessage.match(/(health|fitness|exercise|workout|diet|nutrition|weight|muscle|cardio|yoga)/)) {
      const healthTopics: Record<string, string> = {
        exercise: "Regular exercise benefits: stronger heart, better mood, weight management, stronger bones, better sleep, and increased energy. Aim for 150 minutes moderate exercise weekly.",
        diet: "Healthy eating principles: eat plenty of fruits & vegetables, choose whole grains, include lean proteins, limit processed foods, stay hydrated, and practice portion control.",
        cardio: "Cardiovascular exercise strengthens your heart and lungs. Good options: walking, running, cycling, swimming, dancing. Start slowly and gradually increase intensity and duration.",
        strength: "Strength training builds muscle, increases bone density, and boosts metabolism. Use bodyweight exercises (push-ups, squats), weights, or resistance bands. Allow rest days for muscle recovery.",
        yoga: "Yoga combines physical postures, breathing techniques, and meditation. Benefits include flexibility, strength, balance, stress reduction, and mental clarity. Great for beginners!"
      };

      for (const [key, value] of Object.entries(healthTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "I can share general health and fitness information! Topics include exercise routines, nutrition basics, wellness tips, and healthy lifestyle habits. Remember to consult healthcare professionals for personalized medical advice.";
    }

    // History
    if (lowerMessage.match(/(history|ancient|medieval|war|civilization|empire|revolution|historical)/)) {
      const historyTopics: Record<string, string> = {
        ancient: "Ancient civilizations include Egypt (pyramids, pharaohs), Greece (democracy, philosophy), Rome (republic, empire), China (Great Wall, inventions), and Mesopotamia (first cities, writing).",
        medieval: "Medieval period (5th-15th centuries) featured feudalism, knights, castles, the Black Death, Crusades, and the rise of universities. It bridged ancient and modern times.",
        revolution: "Major revolutions: American (1776, independence from Britain), French (1789, democracy and rights), Industrial (machines and factories), and Russian (1917, communist state).",
        empire: "Great empires in history: Roman Empire (vast territory, law systems), British Empire (global reach), Ottoman Empire (bridge between Europe and Asia), and Mongol Empire (largest contiguous empire)."
      };

      for (const [key, value] of Object.entries(historyTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "History is fascinating! I can discuss ancient civilizations, medieval times, major wars, revolutions, empires, and historical figures. What historical period interests you?";
    }

    // Geography
    if (lowerMessage.match(/(geography|country|continent|ocean|mountain|river|capital|climate|population)/)) {
      const geoTopics: Record<string, string> = {
        continents: "Seven continents: Asia (largest by area and population), Africa, North America, South America, Antarctica, Europe, and Australia/Oceania. Each has unique cultures, climates, and geography.",
        oceans: "Five oceans: Pacific (largest), Atlantic, Indian, Southern (Antarctic), and Arctic (smallest). Oceans cover about 71% of Earth's surface and contain 97% of Earth's water.",
        mountains: "Major mountain ranges: Himalayas (highest, includes Mt. Everest), Andes (longest), Rocky Mountains, Alps, and Appalachians. Mountains affect climate, weather, and biodiversity.",
        climate: "Climate types: tropical (hot, humid), desert (dry), temperate (moderate), continental (cold winters, warm summers), and polar (very cold). Climate affects ecosystems and human activities."
      };

      for (const [key, value] of Object.entries(geoTopics)) {
        if (lowerMessage.includes(key)) {
          return value;
        }
      }

      return "Geography covers our amazing planet! I can discuss countries, continents, oceans, mountains, climate patterns, and how geography influences human civilization. What geographic topic interests you?";
    }

    // Time and Date
    if (lowerMessage.match(/(time|date|today|tomorrow|yesterday|clock|calendar)/)) {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      const dateString = now.toLocaleDateString();
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
      
      return `Today is ${dayName}, ${dateString} and the current time is ${timeString}. Time zones vary globally - it's different times around the world right now!`;
    }

    // Weather (general info)
    if (lowerMessage.includes('weather')) {
      return "I can't check current weather conditions, but I can share that weather is influenced by temperature, humidity, air pressure, and wind patterns. For accurate forecasts, I recommend checking weather.com, local weather apps, or meteorological services in your area!";
    }

    // Help and Support
    if (lowerMessage.match(/(help|support|what can you do|capabilities|features)/)) {
      return `I'm here to help with many topics including:
      
🧮 **Mathematics** - Calculations, algebra, geometry, statistics
💻 **Programming** - JavaScript, Python, React, HTML, CSS, debugging
🔬 **Science** - Physics, chemistry, biology, astronomy
🍳 **Cooking** - Recipes, techniques, nutrition, food safety
💪 **Health & Fitness** - Exercise, nutrition, wellness tips
📚 **History** - Ancient civilizations, wars, revolutions, empires
🌍 **Geography** - Countries, continents, climate, natural features
⏰ **Time & Date** - Current time, calendar information
💬 **General Conversation** - I'm here to chat about almost anything!

What would you like to explore today?`;
    }

    // Default response for unmatched queries
    const defaultResponses = [
      `That's an interesting question about "${message}". While I may not have specific information about that topic, I can help with math, programming, science, cooking, health, history, geography, and general conversation. Could you try rephrasing or asking about a different topic?`,
      `I'd love to help you with "${message}"! I'm knowledgeable about many subjects including technology, science, mathematics, cooking, health, and more. Is there a specific aspect you'd like to explore?`,
      `Thanks for asking about "${message}". I specialize in programming, math, science, cooking, health, history, and general knowledge. Could you provide more context or ask about one of my specialty areas?`,
      `That's a thoughtful question! While I might not have detailed information about "${message}", I'm great at helping with calculations, programming questions, scientific concepts, cooking tips, and educational topics. What else can I help you with?`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  // Enhanced math evaluation function
  const evaluateSimpleMath = (message: string): number | string | null => {
    // Handle percentage calculations
    if (message.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/)) {
      const match = message.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/);
      if (match) {
        const percentage = parseFloat(match[1]);
        const number = parseFloat(match[2]);
        return (percentage / 100) * number;
      }
    }

    // Handle basic operations with multiple formats
    const patterns = [
      /(\d+(?:\.\d+)?)\s*([\+\-\*\/×÷])\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*plus\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*minus\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*times\s*(\d+(?:\.\d+)?)/,
      /(\d+(?:\.\d+)?)\s*divided\s*by\s*(\d+(?:\.\d+)?)/
    ];

    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) {
        let operator: string;
        let num1: number, num2: number;

        if (match.length === 4) {
          // Standard format: number operator number
          [, num1, operator, num2] = [match[0], parseFloat(match[1]), match[2], parseFloat(match[3])];
        } else {
          // Word format: number word number
          [, num1, num2] = [match[0], parseFloat(match[1]), parseFloat(match[2])];
          if (message.includes('plus')) operator = '+';
          else if (message.includes('minus')) operator = '-';
          else if (message.includes('times')) operator = '*';
          else if (message.includes('divided')) operator = '/';
          else continue;
        }

        switch (operator) {
          case '+':
          case 'plus':
            return num1 + num2;
          case '-':
          case 'minus':
            return num1 - num2;
          case '*':
          case '×':
          case 'times':
            return num1 * num2;
          case '/':
          case '÷':
          case 'divided':
            return num2 !== 0 ? num1 / num2 : 'Cannot divide by zero';
          default:
            continue;
        }
      }
    }
    
    return null;
  };

  // Handle sending message
  const handleSendMessage = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay for more natural feel
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getSmartResponse(currentInput),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  // Format timestamp
  const formatTime = (timestamp: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  // Toggle minimize
  const handleMinimize = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  // Get position classes
  const getPositionClasses = (): string => {
    switch (position) {
      case 'bottom-left':
        return 'chatbot-bottom-left';
      case 'bottom-right':
      default:
        return 'chatbot-bottom-right';
    }
  };

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
                <span className="chatbot-status">Online • Local AI</span>
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
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