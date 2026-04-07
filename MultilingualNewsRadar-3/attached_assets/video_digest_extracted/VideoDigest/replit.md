# DrishtiSar - News Video Summarizer

## Overview

A modern, single-file HTML demo application specifically designed for news video analysis. DrishtiSar features a beautiful UI/UX with glassmorphism effects that simulates news video processing and AI-powered summarization. The application provides realistic processing animations and generates news-focused summaries for demonstration purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology**: Pure HTML/CSS with plans for JavaScript integration
- **Design Pattern**: Single-page application with modern CSS styling
- **UI Framework**: Custom CSS with gradient backgrounds and responsive design
- **Styling Approach**: Modern CSS with flexbox/grid layouts, custom properties, and responsive design principles

### Backend Architecture
- **Status**: Demo simulation only - no real API integration
- **Simulation**: Fake processing with realistic timing and animations
- **Pattern**: Client-side JavaScript with simulated async operations and sample data

### Data Storage Solutions
- **Current**: No database implementation
- **Future Needs**: Storage for processed videos, transcripts, and summaries

## Key Components

### User Interface Components
1. **Header Section**: Branded header with gradient background and application title
2. **Main Content Area**: Container for video upload and processing interface
3. **Responsive Container**: Centered layout with modern card-based design

### Planned Components
1. **Video Upload Interface**: File upload functionality for video content
2. **Speech-to-Text Processor**: Integration with speech recognition APIs
3. **Text Summarization**: AI-powered text summarization capabilities
4. **Results Display**: Interface for showing transcripts and summaries

## Data Flow

### Current Implementation
- Static HTML page with CSS styling only

### Planned Data Flow
1. User uploads video file
2. Frontend sends video to backend processing service
3. Backend extracts audio from video
4. Speech-to-text API processes audio to generate transcript
5. Text summarization service creates summary from transcript
6. Results returned to frontend for display

## External Dependencies

### Current Dependencies
- None (pure HTML/CSS)

### Planned Dependencies
- **Speech-to-Text Services**: Google Speech-to-Text, Azure Speech Services, or similar
- **Video Processing**: FFmpeg or similar for audio extraction
- **Text Summarization**: OpenAI GPT, Google Cloud Natural Language, or similar AI services
- **File Storage**: Cloud storage for temporary video/audio files

## Deployment Strategy

### Current Setup
- Static HTML file deployment ready
- Can be hosted on any static hosting service

### Planned Deployment
- **Frontend**: Static hosting (Netlify, Vercel, or similar)
- **Backend**: Serverless functions or containerized API services
- **Storage**: Cloud storage integration for file handling
- **CDN**: Content delivery network for optimal performance

### Development Considerations
- The application will need significant backend development for core functionality
- Integration with multiple third-party APIs for speech processing
- File handling and temporary storage management
- Error handling for failed video processing
- Progress indicators for long-running operations