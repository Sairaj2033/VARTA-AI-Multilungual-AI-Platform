import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, insertChatSessionSchema } from "@shared/schema";
import { z } from "zod";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.API_KEY || "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";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get messages for a session
  app.get("/api/messages/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send a message and get AI response
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage(validatedData);
      
      // Get conversation history for context
      const conversationHistory = await storage.getMessages(validatedData.sessionId);
      
      // Prepare messages for OpenRouter API
      const apiMessages = [
        { 
          role: "system", 
          content: "You are NewsLens, an AI assistant specialized in analyzing news articles. Your expertise includes detecting bias, summarizing content, identifying political leanings, analyzing emotional language, and providing factual assessments. When analyzing articles, provide clear, objective insights with specific examples from the text. Be thorough but concise in your analysis." 
        },
        ...conversationHistory.slice(-10).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }))
      ];

      // Call OpenRouter API
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
          "X-Title": "AI Chat Assistant"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: apiMessages,
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

      // Save AI response
      const aiMessage = await storage.createMessage({
        text: aiResponseText,
        sender: "ai",
        sessionId: validatedData.sessionId
      });

      // Return both messages
      res.json({
        userMessage,
        aiMessage
      });

    } catch (error) {
      console.error("Error processing message:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to process message" 
      });
    }
  });

  // Clear conversation
  app.delete("/api/messages/:sessionId", async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      await storage.clearMessages(sessionId);
      res.json({ message: "Conversation cleared successfully" });
    } catch (error) {
      console.error("Error clearing messages:", error);
      res.status(500).json({ message: "Failed to clear conversation" });
    }
  });

  // Chat session routes
  app.get("/api/sessions", async (req: Request, res: Response) => {
    try {
      const sessions = await storage.getChatSessions();
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const session = await storage.getChatSession(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error fetching session:", error);
      res.status(500).json({ message: "Failed to fetch chat session" });
    }
  });

  app.post("/api/sessions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ message: "Failed to create chat session" });
    }
  });

  app.put("/api/sessions/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const session = await storage.updateChatSession(id, updates);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error updating session:", error);
      res.status(500).json({ message: "Failed to update chat session" });
    }
  });

  app.delete("/api/sessions/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await storage.deleteChatSession(id);
      res.json({ message: "Session deleted successfully" });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete chat session" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
