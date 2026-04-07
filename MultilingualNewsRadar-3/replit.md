# Varta.AI - Multilingual News Aggregator

## Overview
A MERN-based multilingual news aggregator with AI-powered bias detection and translation capabilities. The application features a modern authentication system and provides real-time news articles with sentiment analysis, political bias detection, and multi-language translation features.

## Recent Changes

### January 30, 2025 - User Preferences Onboarding & Auto-Filter System
✓ Created comprehensive user preferences onboarding page with category, language, and tone selection
✓ Implemented automatic redirect to preferences page for new users after account creation
✓ Built auto-filter application system that applies saved preferences as default filters on home page
✓ Added language preference synchronization between preferences page and header language selector
✓ Fixed infinite API loop issues with optimized query caching and dependency management
✓ Enhanced loading states throughout authentication flow with proper spinner indicators
✓ Integrated session-based redirect tracking to prevent infinite loops during onboarding
✓ Added toast notifications to inform users when preferences are applied automatically
✓ Implemented form validation with existing preference pre-population for seamless user experience

### January 30, 2025 - MERN-based Personalized News Recommendation System
✓ Implemented content-based filtering with TF-IDF and cosine similarity
✓ Created comprehensive recommendation service using custom TF-IDF implementation
✓ Added user interaction tracking (clicks, views, shares, likes) with timestamps
✓ Built personalized user preference profiles with category and bias learning
✓ Implemented backend routes: POST /api/interact and GET /api/recommend/:userId
✓ Created full-featured recommendations frontend page with user activity tracking
✓ Added recommendation navigation to hamburger menu with TrendingUp icon
✓ Integrated time-decay factors for recent interactions (30-day half-life)
✓ Applied content diversification to avoid category clustering
✓ Built fallback trending articles system for new users
✓ Extended database schema with user_interactions and user_preferences tables
✓ Implemented real-time preference updates based on user behavior

### January 28, 2025 - Blockchain Verified Sources Implementation
✓ Integrated Polygon Mumbai Testnet for blockchain-verified news sources
✓ Created VerifiedSources smart contract with trust scoring system (1-100)
✓ Added blockchain service with Web3.js and ethers.js integration
✓ Implemented verification badges on news article cards
✓ Built comprehensive blockchain management page (/blockchain route)
✓ Added MetaMask wallet connection and network switching
✓ Created verification badge component with trust score display
✓ Integrated blockchain provider in app context for state management
✓ Added "Verified Sources" navigation to hamburger menu
✓ Designed smart contract with gas-optimized operations

### January 28, 2025 - Complete Rebrand to Varta.AI
✓ Replaced all instances of "NewsLens" with "Varta.AI" throughout the entire project
✓ Updated authentication localStorage keys from 'newsLens_user' to 'vartaAI_user'  
✓ Updated logo abbreviation from "NL" to "V.AI" in login and signup pages
✓ Added comprehensive HTML meta tags and title with Varta.AI branding
✓ Updated OpenRouter AI system prompt to identify as Varta.AI
✓ Updated all UI headers, welcome messages, and branding elements
✓ Maintained "Analyze. Summarize. Detect Bias." tagline throughout rebrand

## Recent Changes
- **January 25, 2025**: Implemented next-generation authentication system with futuristic design
  - Removed entry screen - application opens directly to login page (/login route)
  - Completely redesigned login and signup screens with dark theme and glassmorphism effects
  - Added animated background elements with floating orbs and pulsing gradients
  - Implemented backdrop blur effects, translucent forms, and purple/blue gradient color scheme
  - Enhanced typography with gradient text effects and uppercase labels with letter spacing
  - Added hover animations, transform effects, and smooth transitions throughout
  - Created custom fade-in animations and interactive button states with loading spinners
  - Updated form fields with larger sizes, rounded corners, and focus state transitions
  - Added user authentication with backend API endpoints and secure session management
  - Built responsive design optimized for modern devices and browsers

- **January 25, 2025**: Enhanced platform with blogs section and article copy functionality
  - Created comprehensive "Blogs & Insights" section (/blogs route) with clean blue/white design
  - Added blog listing page with search, category filtering, and trending sidebar
  - Implemented individual blog post pages with full content display
  - Added copy functionality to news articles - copies entire article with metadata
  - Enhanced hamburger menu with advanced chat and community features
  - Integrated full-featured AI chatbot for news analysis (/chat route)
  - Added community discussion forum with realistic discussions (/community route)
  - Improved responsive design across all sections

- **January 23, 2025**: Implemented comprehensive multilingual UI support
  - Extended language support to 7 languages: English, Hindi, Marathi, Tamil, Kannada, Telugu, Malayalam
  - Added complete translations for all UI elements in all supported languages
  - Created language context provider with localStorage persistence
  - Implemented UI language switcher in header with native script display
  - Removed previous article language filtering to separate UI language from content language
  - Updated theme system with light, dark, and creative modes
  - Enhanced all components with theme-aware styling and smooth animations

## Project Architecture
### Frontend (React + TypeScript)
- **Theme System**: Context-based theme management with light, dark, and creative modes
- **UI Components**: Enhanced shadcn/ui components with theme integration
- **Animations**: Custom CSS animations with fade-in, hover-lift, and floating effects
- **Styling**: Tailwind CSS with custom utility classes and glass morphism effects

### Backend (Express + TypeScript)
- REST API for news aggregation and processing
- AI-powered services for bias detection and article generation
- Multi-language support with translation capabilities

### Database
- Sample news data with bias analysis and sentiment detection
- Article metadata including political bias, emotional tone, and categories

## Key Features
1. **Personalized Recommendations**: ML-powered content filtering using TF-IDF and cosine similarity
2. **User Behavior Tracking**: Comprehensive interaction analytics with real-time preference learning
3. **Content-Based Filtering**: Advanced algorithm combining content similarity (70%), category preferences (20%), and bias patterns (10%)
4. **Blockchain Verification**: Smart contract-based news source verification on Polygon Mumbai
5. **Trust Scoring**: Dynamic trust scores (1-100) for verified sources with visual badges
6. **Web3 Integration**: MetaMask wallet connection and blockchain state management
7. **Multi-theme Support**: Light, dark, and creative visual modes
8. **Advanced Animations**: Smooth transitions and interactive elements
9. **News Filtering**: Category, bias type, and sentiment filtering
10. **Real-time Updates**: Live news feed with refresh capabilities
11. **Translation Support**: Multi-language article translation
12. **AI-Powered Chatbot**: Comprehensive news analysis and bias detection
13. **Community Forum**: Real-time chat-style discussions for news topics
14. **Responsive Design**: Mobile-first responsive layout with hamburger navigation

## User Preferences
- Prefers enhanced UI/UX with modern design patterns
- Values smooth animations and interactive feedback
- Appreciates creative and visually appealing interfaces
- Wants seamless theme switching capabilities

## Technical Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Wouter (routing)
- **Backend**: Express.js, TypeScript
- **UI Library**: shadcn/ui with Radix UI primitives
- **State Management**: TanStack Query for server state
- **Styling**: CSS custom properties with theme variables

## Current Status
The application is fully functional with enhanced theming system. All core features work with sample data, though external API integrations require proper API keys for full functionality.