import { storage } from '../storage';
import { aiService } from './aiService';
import { getArticleImage } from '../utils/imageMapping';
import type { InsertArticle } from '@shared/schema';

interface NewsAPIArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  author: string;
}

interface NewsAPIResponse {
  articles: NewsAPIArticle[];
}

class NewsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://newsapi.org/v2';
  private readonly indianNewsSourceUrls = [
    'https://www.thehindu.com',
    'https://www.ndtv.com', 
    'https://indianexpress.com',
    'https://www.business-standard.com'
  ];

  constructor() {
    this.apiKey = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || '';
    if (!this.apiKey) {
      console.warn('NEWS_API_KEY not found in environment variables');
    }
  }

  private getDistributedSourceUrl(index: number): string {
    return this.indianNewsSourceUrls[index % this.indianNewsSourceUrls.length];
  }

  async fetchLatestNews(category?: string, country = 'in'): Promise<void> {
    if (!this.apiKey) {
      throw new Error('News API key not configured');
    }

    try {
      const url = new URL(`${this.baseUrl}/top-headlines`);
      url.searchParams.set('apiKey', this.apiKey);
      url.searchParams.set('country', country);
      url.searchParams.set('pageSize', '20');
      
      if (category) {
        url.searchParams.set('category', category);
      }

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status} - ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();

      // Process each article with distributed URLs
      for (let index = 0; index < data.articles.length; index++) {
        try {
          await this.processAndStoreArticle(data.articles[index], index);
        } catch (error) {
          console.error('Error processing article:', data.articles[index].title, error);
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  private async processAndStoreArticle(newsArticle: NewsAPIArticle, index: number = 0): Promise<void> {
    // Check if article already exists
    const existingArticles = await storage.getArticles({ search: newsArticle.title, language: 'en' });
    if (existingArticles.some(a => a.url === newsArticle.url)) {
      return; // Skip duplicate
    }

    // Analyze the article with AI
    const analysis = await aiService.analyzeArticle(
      newsArticle.title,
      newsArticle.content || newsArticle.description || ''
    );

    // Create article object with distributed source URL
    const article: InsertArticle = {
      title: newsArticle.title,
      content: newsArticle.content || newsArticle.description || '',
      summary: analysis.summary,
      url: this.getDistributedSourceUrl(index),
      imageUrl: newsArticle.urlToImage || getArticleImage(analysis.category, newsArticle.title, newsArticle.content || newsArticle.description),
      source: newsArticle.source.name,
      author: newsArticle.author,
      category: analysis.category,
      publishedAt: new Date(newsArticle.publishedAt),
      politicalBias: analysis.bias,
      biasConfidence: analysis.biasConfidence,
      sentimentScore: analysis.sentimentScore,
      emotionalTone: analysis.emotionalTone,
      availableLanguages: [],
    };

    // Store in database
    await storage.createArticle(article);
  }

  async refreshAllCategories(): Promise<void> {
    const categories = ['general', 'business', 'health', 'science', 'sports', 'technology'];
    
    for (const category of categories) {
      try {
        await this.fetchLatestNews(category);
        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
      }
    }
  }

  async generateNewsArticles(count: number = 5): Promise<void> {
    const categories = ['general', 'politics', 'technology', 'health', 'finance', 'sports'];
    
    console.log(`Generating ${count} new articles using Gemini AI...`);
    
    for (let i = 0; i < count; i++) {
      try {
        const category = categories[i % categories.length];
        const generatedArticle = await aiService.generateNewsArticle(category);
        
        // Analyze the generated article
        const analysis = await aiService.analyzeArticle(
          generatedArticle.title,
          generatedArticle.content
        );

        // Create article object with distributed source URL
        const article: InsertArticle = {
          title: generatedArticle.title,
          content: generatedArticle.content,
          summary: analysis.summary,
          url: this.getDistributedSourceUrl(i),
          imageUrl: generatedArticle.urlToImage || getArticleImage(analysis.category, generatedArticle.title, generatedArticle.content),
          source: 'AI Generated News (Gemini)',
          author: 'Gemini AI',
          category: analysis.category,
          publishedAt: new Date(),
          politicalBias: analysis.bias,
          biasConfidence: analysis.biasConfidence,
          sentimentScore: analysis.sentimentScore,
          emotionalTone: analysis.emotionalTone,
          availableLanguages: [],
        };

        // Store in database
        await storage.createArticle(article);
        console.log(`Generated article: ${generatedArticle.title}`);
        
        // Add delay between generations
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating article ${i + 1}:`, error);
      }
    }
  }

  async generateAndRefresh(): Promise<void> {
    try {
      // First try to generate new articles using Gemini
      await this.generateNewsArticles(3);
    } catch (error) {
      console.error('Error generating articles with Gemini:', error);
    }
    
    // Then try to fetch from News API if available
    if (this.apiKey) {
      try {
        await this.refreshAllCategories();
      } catch (error) {
        console.error('Error fetching from News API:', error);
      }
    }
  }
}

export const newsService = new NewsService();
