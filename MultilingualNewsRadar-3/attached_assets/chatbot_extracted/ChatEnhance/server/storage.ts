import { users, messages, chatSessions, type User, type InsertUser, type Message, type InsertMessage, type ChatSession, type InsertChatSession } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  getMessages(sessionId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  clearMessages(sessionId: string): Promise<void>;
  
  // Chat session operations
  getChatSessions(): Promise<ChatSession[]>;
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined>;
  deleteChatSession(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private chatSessions: Map<string, ChatSession>;
  private currentUserId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.chatSessions = new Map();
    this.currentUserId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id,
      timestamp: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async clearMessages(sessionId: string): Promise<void> {
    const messagesToDelete = Array.from(this.messages.entries())
      .filter(([_, message]) => message.sessionId === sessionId)
      .map(([id]) => id);
    
    messagesToDelete.forEach(id => this.messages.delete(id));
  }

  async getChatSessions(): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const session: ChatSession = {
      ...insertSession,
      articleText: insertSession.articleText || null,
      timestamp: new Date()
    };
    this.chatSessions.set(session.id, session);
    return session;
  }

  async updateChatSession(id: string, updates: Partial<InsertChatSession>): Promise<ChatSession | undefined> {
    const existingSession = this.chatSessions.get(id);
    if (!existingSession) return undefined;
    
    const updatedSession: ChatSession = {
      ...existingSession,
      ...updates
    };
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async deleteChatSession(id: string): Promise<void> {
    this.chatSessions.delete(id);
    // Also clear messages for this session
    await this.clearMessages(id);
  }
}

export const storage = new MemStorage();
