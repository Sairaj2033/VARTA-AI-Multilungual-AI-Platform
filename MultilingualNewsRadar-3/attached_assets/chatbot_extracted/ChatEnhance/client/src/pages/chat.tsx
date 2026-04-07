import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { NewsArticleInput } from "@/components/chat/news-article-input";
import { SuggestionCards } from "@/components/chat/suggestion-cards";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Message } from "@shared/schema";

// Generate a unique session ID for this chat session
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function ChatPage() {
  const [sessionId] = useState(generateSessionId);
  const [isTyping, setIsTyping] = useState(false);
  const [articleText, setArticleText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch messages for the current session
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages', sessionId],
    refetchInterval: false,
  });



  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      // Include article context if available
      const messageText = articleText 
        ? `Article to analyze:\n\n${articleText}\n\n---\n\nUser question: ${text}`
        : text;
        
      const response = await apiRequest('POST', '/api/messages', {
        text: messageText,
        sender: 'user',
        sessionId,
      });
      return response.json();
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['/api/messages', sessionId] });
      setIsTyping(false);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setIsTyping(false);
      toast({
        title: "Error sending message",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Clear conversation mutation
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('DELETE', `/api/messages/${sessionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', sessionId] });
      toast({
        title: "Conversation cleared",
        description: "Your chat history has been cleared.",
      });
    },
    onError: (error) => {
      console.error('Error clearing chat:', error);
      toast({
        title: "Error clearing conversation",
        description: "Failed to clear conversation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (text: string) => {
    sendMessageMutation.mutate(text);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearChat = () => {
    if (messages.length > 0) {
      if (confirm('Are you sure you want to clear the conversation?')) {
        clearChatMutation.mutate();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Left Panel */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-700 p-4 space-y-4 hidden lg:block bg-white dark:bg-slate-800">
        <NewsArticleInput
          value={articleText}
          onChange={setArticleText}
          onClear={() => setArticleText("")}
        />
        
        <SuggestionCards
          onSuggestionClick={handleSuggestionClick}
          hasArticleText={!!articleText}
        />
      </div>

      {/* Main Chat Content */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 shadow-xl">
        <ChatHeader
          onClearChat={handleClearChat}
          messageCount={messages.length}
          isTyping={isTyping}
        />
        
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
        />
        
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending}
        />

        {/* Mobile Article Input - shown on smaller screens */}
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <NewsArticleInput
            value={articleText}
            onChange={setArticleText}
            onClear={() => setArticleText("")}
          />
          
          <SuggestionCards
            onSuggestionClick={handleSuggestionClick}
            hasArticleText={!!articleText}
          />
        </div>
      </div>
    </div>
  );
}
