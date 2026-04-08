import { GoogleGenAI } from "@google/genai";

interface ArticleAnalysis {
  summary: string;
  category: string;
  bias: 'left' | 'right' | 'neutral';
  biasConfidence: number;
  sentimentScore: number;
  emotionalTone: 'positive' | 'negative' | 'neutral';
}

class AIService {
  private gemini: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment variables');
    }
    
    this.gemini = new GoogleGenAI({ apiKey });
  }

  async analyzeArticle(title: string, content: string): Promise<ArticleAnalysis> {
    if (!process.env.GEMINI_API_KEY) {
      // Return default analysis if no API key
      return this.getDefaultAnalysis(title, content);
    }

    try {
      const systemPrompt = `You are a news analysis expert specializing in bias detection, sentiment analysis, and content categorization. 
Analyze the following news article and provide a JSON response with the following structure:
{
  "summary": "A concise 2-3 sentence summary of the key points",
  "category": "One of: general, politics, technology, health, finance, sports",
  "bias": "One of: left, right, neutral", 
  "biasConfidence": "A number between 0 and 1 indicating confidence in bias detection",
  "sentimentScore": "A number between -1 (very negative) and 1 (very positive)",
  "emotionalTone": "One of: positive, negative, neutral"
}

Title: ${title}
Content: ${content.substring(0, 2000)}
`;

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              category: { type: "string" },
              bias: { type: "string" },
              biasConfidence: { type: "number" },
              sentimentScore: { type: "number" },
              emotionalTone: { type: "string" }
            },
            required: ["summary", "category", "bias", "biasConfidence", "sentimentScore", "emotionalTone"]
          }
        },
        contents: `Analyze this news article: Title: ${title}\n\nContent: ${content.substring(0, 2000)}`
      });

      const analysisText = response.text;
      if (!analysisText) {
        throw new Error("Empty response from Gemini");
      }

      const analysis = JSON.parse(analysisText);
      
      // Validate and sanitize response
      return {
        summary: analysis.summary || this.generateFallbackSummary(content),
        category: this.validateCategory(analysis.category),
        bias: this.validateBias(analysis.bias),
        biasConfidence: Math.max(0, Math.min(1, analysis.biasConfidence || 0.5)),
        sentimentScore: Math.max(-1, Math.min(1, analysis.sentimentScore || 0)),
        emotionalTone: this.validateEmotionalTone(analysis.emotionalTone),
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return this.getDefaultAnalysis(title, content);
    }
  }

  private getDefaultAnalysis(title: string, content: string): ArticleAnalysis {
    return {
      summary: this.generateFallbackSummary(content),
      category: this.inferCategoryFromText(title + ' ' + content),
      bias: 'neutral',
      biasConfidence: 0.3,
      sentimentScore: 0,
      emotionalTone: 'neutral',
    };
  }

  private generateFallbackSummary(content: string): string {
    // Simple fallback: take first 2 sentences or first 200 chars
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ').trim() + '.';
    }
    return content.substring(0, 200).trim() + '...';
  }

  private inferCategoryFromText(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('government') || lowerText.includes('election') || lowerText.includes('parliament') || lowerText.includes('policy')) {
      return 'politics';
    }
    if (lowerText.includes('technology') || lowerText.includes('ai') || lowerText.includes('software') || lowerText.includes('startup')) {
      return 'technology';
    }
    if (lowerText.includes('health') || lowerText.includes('medical') || lowerText.includes('hospital') || lowerText.includes('disease')) {
      return 'health';
    }
    if (lowerText.includes('economy') || lowerText.includes('market') || lowerText.includes('finance') || lowerText.includes('gdp') || lowerText.includes('rupee')) {
      return 'finance';
    }
    if (lowerText.includes('cricket') || lowerText.includes('football') || lowerText.includes('sports') || lowerText.includes('match')) {
      return 'sports';
    }
    
    return 'general';
  }

  private validateCategory(category: string): string {
    const validCategories = ['politics', 'technology', 'health', 'finance', 'sports'];
    return validCategories.includes(category) ? category : 'general';
  }

  private validateBias(bias: string): 'left' | 'right' | 'neutral' {
    const validBias = ['left', 'right', 'neutral'];
    return validBias.includes(bias) ? bias as 'left' | 'right' | 'neutral' : 'neutral';
  }

  private validateEmotionalTone(tone: string): 'positive' | 'negative' | 'neutral' {
    const validTones = ['positive', 'negative', 'neutral'];
    return validTones.includes(tone) ? tone as 'positive' | 'negative' | 'neutral' : 'neutral';
  }

  async generateNewsArticle(category: string, topic?: string): Promise<{title: string, content: string, urlToImage?: string}> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const prompt = topic 
        ? `Generate a realistic news article about ${topic} in the ${category} category.`
        : `Generate a realistic news article in the ${category} category about current trending topics.`;

      const systemPrompt = `You are a professional news writer. Generate a realistic news article with the following structure:
{
  "title": "A compelling, realistic news headline",
  "content": "A full news article with multiple paragraphs, written in professional journalism style. Include quotes, facts, and proper news structure.",
  "urlToImage": "A descriptive URL for an image that would accompany this article (you can make this up but make it realistic)"
}

Requirements:
- Write in professional journalism style
- Include realistic details and quotes
- Make it newsworthy and current
- Ensure the content is factual-sounding but clearly generated
- Length should be 300-500 words`;

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              urlToImage: { type: "string" }
            },
            required: ["title", "content"]
          }
        },
        contents: prompt
      });

      const articleText = response.text;
      if (!articleText) {
        throw new Error("Empty response from Gemini");
      }

      const article = JSON.parse(articleText);
      
      return {
        title: article.title || "Generated News Article",
        content: article.content || "Content generation failed.",
        urlToImage: article.urlToImage
      };
    } catch (error) {
      console.error('News generation error:', error);
      throw new Error(`Failed to generate news article: ${error}`);
    }
  }

  async chatWithArticle(userPrompt: string, articleText?: string): Promise<string> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const systemPrompt = "You are Varta.AI, a specialized assistant for news analysis and bias detection. You help users analyze news articles for bias, summarize content, detect political leanings, identify emotional language, and provide detailed analysis. Be thorough, objective, and provide specific examples when analyzing articles.";

      let promptText = userPrompt;
      if (articleText && articleText.trim()) {
        promptText = `Please analyze this news article:\n\n${articleText}\n\n---\n\nUser question: ${userPrompt}`;
      }

      const response = await this.gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
        },
        contents: promptText
      });

      return response.text || "I apologize, but I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('Chat generation error:', error);
      throw new Error(`Failed to generate chat response: ${error}`);
    }
  }
}

export const aiService = new AIService();
