import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  sender: text("sender").notNull(), // 'user' or 'ai'
  sessionId: text("session_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  articleText: text("article_text"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  text: true,
  sender: true,
  sessionId: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  id: true,
  title: true,
  articleText: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
