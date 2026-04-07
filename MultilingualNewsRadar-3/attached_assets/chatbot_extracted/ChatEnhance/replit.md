# Replit.md

## Overview

**NewsLens** is a specialized AI-powered news article analysis application built with React and Express. The application helps users analyze news articles for bias detection, political leanings, emotional language assessment, and comprehensive summarization. It features a modern chat interface specifically designed for news analysis with article input capabilities, suggestion cards for quick analysis, and session management.

**Tagline:** "Analyze. Summarize. Detect Bias."

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (January 24, 2025)

**Major Upgrade: AI Chat Assistant → NewsLens**
✓ Rebranded application to "NewsLens" with news analysis focus
✓ Added dedicated news article input area (5000 character limit)
✓ Created 5 specialized suggestion cards for bias and content analysis
✓ Implemented chat history sidebar with session management
✓ Extended database schema with chatSessions table
✓ Enhanced AI system prompt for news analysis expertise
✓ Added responsive layout with mobile-friendly design
✓ Updated branding colors to blue/cyan gradient theme
✓ Added SEO metadata and NewsLens favicon
✓ Implemented session-based article context for accurate analysis

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **Component Structure**: Modular component architecture with separate chat components

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request/response logging for API endpoints

### Database & Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via Neon serverless)
- **Schema Management**: Extended with chat sessions table for managing analysis sessions
- **Session Storage**: Chat sessions with article text, titles, and timestamps
- **Fallback Storage**: Enhanced in-memory storage with session management capabilities

## Key Components

### NewsLens Analysis System
- **News Article Input**: Dedicated text area for pasting news articles (up to 5000 characters)
- **Bias Analysis**: AI-powered detection of political bias, emotional language, and factual content
- **Quick Analysis Cards**: 5 pre-built suggestion buttons for common analysis tasks:
  - "Is this article biased?"
  - "Summarize this news"
  - "Which political side does this support?"
  - "Any emotional language in this?"
  - "Analyze bias percentage (Left, Right, Neutral, Factual, Emotional)"
- **Session Management**: Chat history sidebar with timestamps and session titles
- **Context-Aware Responses**: Article text automatically included in analysis requests

### AI Integration
- **Provider**: OpenRouter API with GPT-3.5-turbo for news analysis
- **Specialized System Prompt**: NewsLens AI assistant optimized for bias detection and news analysis
- **Context Management**: Conversation history with article context maintained for continuity
- **Article Context**: News articles automatically included in analysis requests for accurate assessment

### UI Components
- **Theme System**: Light/dark mode toggle with persistent storage
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: ARIA-compliant components from Radix UI
- **Toast Notifications**: User feedback for actions and errors

### Authentication & Sessions
- **Session Management**: UUID-based session tracking for conversations
- **User Schema**: Basic user model with username/password (currently unused)

## Data Flow

1. **Message Sending**: User types message → Client validates → POST to `/api/messages` → Store in database → Call OpenRouter API → Store AI response → Return to client
2. **Message Loading**: Component mounts → GET `/api/messages/:sessionId` → Display conversation history
3. **Real-time Updates**: Use React Query for automatic refetching and optimistic updates

### API Endpoints
**Messages:**
- `GET /api/messages/:sessionId` - Retrieve conversation history
- `POST /api/messages` - Send new message with article context and get AI response
- `DELETE /api/messages/:sessionId` - Clear conversation history

**Chat Sessions:**
- `GET /api/sessions` - Get all chat sessions
- `GET /api/sessions/:id` - Get specific session details
- `POST /api/sessions` - Create new chat session with article text
- `PUT /api/sessions/:id` - Update session title and article text
- `DELETE /api/sessions/:id` - Delete session and associated messages

## External Dependencies

### AI Services
- **OpenRouter API**: Primary AI completion service
- **API Key**: Configured via `OPENROUTER_API_KEY` environment variable

### UI Libraries
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first styling
- **Class Variance Authority**: Component variant management

### Development Tools
- **ESBuild**: Production bundling for server
- **TSX**: TypeScript execution for development
- **Drizzle Kit**: Database schema management

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` script

### Environment Configuration
- **Development**: Uses tsx for hot reloading with Vite middleware
- **Production**: Serves static files from Express with built assets
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Apply database schema changes

The application is designed to be deployed on platforms like Replit, with specific configurations for development tooling and runtime error handling in the Replit environment.