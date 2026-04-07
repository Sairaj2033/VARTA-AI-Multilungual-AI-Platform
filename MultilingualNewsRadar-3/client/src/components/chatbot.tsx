import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI news assistant. I can help you understand news articles, explain complex topics, or discuss current events. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call your AI service)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('bias') || input.includes('biased')) {
      return "News bias refers to the tendency of news outlets to present information in a way that favors particular political perspectives. Our platform analyzes articles for different types of bias including left-leaning, right-leaning, and neutral perspectives to help you get a balanced view of the news.";
    }
    
    if (input.includes('translate') || input.includes('translation')) {
      return "Our translation feature supports multiple Indian languages including Hindi, Marathi, Tamil, Kannada, Telugu, and Malayalam. You can translate any article by clicking the translate button on the article card.";
    }
    
    if (input.includes('category') || input.includes('filter')) {
      return "You can filter news by categories like Politics, Technology, Business, Sports, Entertainment, and Health. Use the filters on the left sidebar to narrow down articles to your interests.";
    }
    
    if (input.includes('source') || input.includes('where')) {
      return "Our news articles are aggregated from various trusted sources and include both real news articles and AI-generated content for demonstration purposes. Each article shows its source and category for transparency.";
    }
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm here to help you navigate the news platform and answer any questions about the articles, features, or current events. What would you like to know?";
    }
    
    // Default responses for various topics
    const responses = [
      "That's an interesting question about current events. Based on the articles in our platform, I can see several perspectives on this topic. Would you like me to help you find specific articles related to this?",
      "I'd be happy to help you understand this topic better. Our platform aggregates news from multiple sources to give you a comprehensive view. You can use the search function to find more specific information.",
      "This topic appears frequently in our news feed. I recommend checking the latest articles and using our bias detection feature to see different perspectives on this issue.",
      "Great question! Our AI-powered analysis can help break down complex topics like this. Have you tried filtering by category to see related articles?",
      "I can help you explore this further. Our platform offers translation services and bias analysis that might give you additional insights into this topic."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">AI News Assistant</h3>
            <p className="text-xs text-muted-foreground">Ask me about news, articles, or current events</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-muted'
              }`}>
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.sender === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about the news..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}