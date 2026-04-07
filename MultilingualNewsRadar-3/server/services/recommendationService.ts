import { Matrix } from 'ml-matrix';
import { Article, UserInteraction, UserPreferences } from '@shared/schema';

interface UserProfile {
  categories: Record<string, number>;
  biasTypes: Record<string, number>;
  tfIdfVector: number[];
  totalInteractions: number;
}

interface ArticleFeatures {
  id: number;
  tfIdfVector: number[];
  category: string;
  politicalBias: string;
  sentimentScore: number;
}

export class RecommendationService {
  private vocabulary: string[];
  private documentTermMatrix: Map<number, Map<string, number>>;
  private articleFeatures: Map<number, ArticleFeatures>;
  private userProfiles: Map<number, UserProfile>;

  constructor() {
    this.vocabulary = [];
    this.documentTermMatrix = new Map();
    this.articleFeatures = new Map();
    this.userProfiles = new Map();
  }

  /**
   * Preprocess text by tokenizing and removing stopwords
   */
  private preprocessText(text: string): string[] {
    // Simple tokenization
    const tokens = text.toLowerCase()
      .replace(/[^\w\s\u0900-\u097F]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
    
    // Remove stopwords for English and other languages
    const englishStopwords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'it', 'they', 'them', 'their', 'there', 'where', 'when', 'what', 'who', 'how', 'why', 'can', 'may', 'might', 'must', 'shall', 'should', 'from', 'up', 'out', 'down', 'off', 'over', 'under', 'again', 'further', 'then', 'once']);
    
    const cleaned = tokens.filter(token => 
      !englishStopwords.has(token) && 
      token.length > 2 && 
      /^[a-zA-Z\u0900-\u097F]+$/.test(token)
    );
    
    return cleaned;
  }

  /**
   * Build TF-IDF model from all articles
   */
  async buildTfIdfModel(articles: Article[]): Promise<void> {
    // Clear existing model
    this.documentTermMatrix.clear();
    this.articleFeatures.clear();

    // Build document-term matrix
    const allTerms = new Set<string>();
    
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const text = `${article.title} ${article.content} ${article.summary || ''}`;
      const processedTokens = this.preprocessText(text);
      
      const termFreq = new Map<string, number>();
      processedTokens.forEach(token => {
        termFreq.set(token, (termFreq.get(token) || 0) + 1);
        allTerms.add(token);
      });
      
      this.documentTermMatrix.set(i, termFreq);
    }

    // Build vocabulary
    this.vocabulary = Array.from(allTerms).sort();

    // Create feature vectors for each article
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const vector = this.createTfIdfVector(i, articles.length);
      
      this.articleFeatures.set(article.id, {
        id: article.id,
        tfIdfVector: vector,
        category: article.category,
        politicalBias: article.politicalBias,
        sentimentScore: article.sentimentScore
      });
    }
  }

  /**
   * Create TF-IDF vector for a document
   */
  private createTfIdfVector(docIndex: number, totalDocs: number): number[] {
    const vector = new Array(this.vocabulary.length).fill(0);
    const docTerms = this.documentTermMatrix.get(docIndex);
    
    if (!docTerms) return vector;
    
    const docLength = Array.from(docTerms.values()).reduce((sum, freq) => sum + freq, 0);
    
    for (let i = 0; i < this.vocabulary.length; i++) {
      const term = this.vocabulary[i];
      const termFreq = docTerms.get(term) || 0;
      
      if (termFreq > 0) {
        // Calculate TF (term frequency)
        const tf = termFreq / docLength;
        
        // Calculate IDF (inverse document frequency)
        let docsWithTerm = 0;
        for (let j = 0; j < totalDocs; j++) {
          const otherDocTerms = this.documentTermMatrix.get(j);
          if (otherDocTerms && otherDocTerms.has(term)) {
            docsWithTerm++;
          }
        }
        
        const idf = Math.log(totalDocs / (docsWithTerm + 1));
        vector[i] = tf * idf;
      }
    }
    
    return vector;
  }

  /**
   * Build user profile from interactions
   */
  async buildUserProfile(userId: number, interactions: UserInteraction[]): Promise<UserProfile> {
    const profile: UserProfile = {
      categories: {},
      biasTypes: {},
      tfIdfVector: new Array(this.vocabulary.length).fill(0),
      totalInteractions: 0
    };

    // Weight different interaction types
    const interactionWeights: Record<string, number> = {
      'click': 1.0,
      'view': 2.0,
      'share': 3.0,
      'like': 2.5
    };

    let totalWeight = 0;

    for (const interaction of interactions) {
      const weight = interactionWeights[interaction.interactionType] || 1.0;
      
      // Apply time decay (more recent interactions have higher weight)
      const daysSinceInteraction = Math.max(1, 
        (Date.now() - new Date(interaction.timestamp).getTime()) / (1000 * 60 * 60 * 24)
      );
      const timeDecayFactor = Math.exp(-daysSinceInteraction / 30); // 30-day half-life
      const finalWeight = weight * timeDecayFactor;

      // Update category preferences
      profile.categories[interaction.category] = 
        (profile.categories[interaction.category] || 0) + finalWeight;

      // Update bias preferences
      profile.biasTypes[interaction.politicalBias] = 
        (profile.biasTypes[interaction.politicalBias] || 0) + finalWeight;

      // Update TF-IDF profile
      const articleFeatures = this.articleFeatures.get(interaction.articleId);
      if (articleFeatures) {
        for (let i = 0; i < profile.tfIdfVector.length; i++) {
          profile.tfIdfVector[i] += articleFeatures.tfIdfVector[i] * finalWeight;
        }
      }

      totalWeight += finalWeight;
      profile.totalInteractions++;
    }

    // Normalize TF-IDF vector
    if (totalWeight > 0) {
      for (let i = 0; i < profile.tfIdfVector.length; i++) {
        profile.tfIdfVector[i] /= totalWeight;
      }
    }

    // Normalize category and bias preferences
    const totalCategoryWeight = Object.values(profile.categories).reduce((sum, val) => sum + val, 0);
    const totalBiasWeight = Object.values(profile.biasTypes).reduce((sum, val) => sum + val, 0);

    if (totalCategoryWeight > 0) {
      Object.keys(profile.categories).forEach(key => {
        profile.categories[key] /= totalCategoryWeight;
      });
    }

    if (totalBiasWeight > 0) {
      Object.keys(profile.biasTypes).forEach(key => {
        profile.biasTypes[key] /= totalBiasWeight;
      });
    }

    this.userProfiles.set(userId, profile);
    return profile;
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
  }

  /**
   * Calculate content-based similarity score
   */
  private calculateContentSimilarity(userProfile: UserProfile, articleFeatures: ArticleFeatures): number {
    // TF-IDF cosine similarity (70% weight)
    const contentSimilarity = this.cosineSimilarity(userProfile.tfIdfVector, articleFeatures.tfIdfVector);
    
    // Category preference (20% weight)
    const categoryScore = userProfile.categories[articleFeatures.category] || 0;
    
    // Bias preference (10% weight)
    const biasScore = userProfile.biasTypes[articleFeatures.politicalBias] || 0;
    
    return (contentSimilarity * 0.7) + (categoryScore * 0.2) + (biasScore * 0.1);
  }

  /**
   * Get personalized recommendations for a user
   */
  async getRecommendations(
    userId: number, 
    interactions: UserInteraction[], 
    articles: Article[], 
    excludeArticleIds: number[] = [],
    limit: number = 10
  ): Promise<Array<{article: Article, score: number, reason: string}>> {
    
    // Build user profile if not exists or if interactions are new
    if (!this.userProfiles.has(userId) || interactions.length > 0) {
      await this.buildUserProfile(userId, interactions);
    }

    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      // Return trending articles for new users
      return this.getTrendingArticles(articles, limit);
    }

    const recommendations: Array<{article: Article, score: number, reason: string}> = [];

    for (const article of articles) {
      // Skip already interacted articles
      if (excludeArticleIds.includes(article.id)) continue;

      const articleFeatures = this.articleFeatures.get(article.id);
      if (!articleFeatures) continue;

      const score = this.calculateContentSimilarity(userProfile, articleFeatures);
      
      // Generate reason for recommendation
      let reason = "Based on your reading preferences";
      const topCategory = Object.keys(userProfile.categories)
        .reduce((a, b) => userProfile.categories[a] > userProfile.categories[b] ? a : b, '');
      
      if (articleFeatures.category === topCategory) {
        reason = `You frequently read ${topCategory} articles`;
      } else if (score > 0.7) {
        reason = "Highly relevant to your interests";
      } else if (score > 0.5) {
        reason = "Similar to articles you've enjoyed";
      }

      recommendations.push({
        article,
        score,
        reason
      });
    }

    // Sort by score and apply diversity
    recommendations.sort((a, b) => b.score - a.score);
    
    // Apply diversity to avoid too many articles from same category
    const diversifiedRecommendations = this.applyDiversification(recommendations, limit);
    
    return diversifiedRecommendations.slice(0, limit);
  }

  /**
   * Apply diversification to recommendations
   */
  private applyDiversification(
    recommendations: Array<{article: Article, score: number, reason: string}>, 
    limit: number
  ): Array<{article: Article, score: number, reason: string}> {
    const result: Array<{article: Article, score: number, reason: string}> = [];
    const categoryCount: Record<string, number> = {};
    const maxPerCategory = Math.max(2, Math.floor(limit / 3));

    for (const rec of recommendations) {
      const category = rec.article.category;
      const currentCount = categoryCount[category] || 0;

      if (currentCount < maxPerCategory || result.length < limit * 0.7) {
        result.push(rec);
        categoryCount[category] = currentCount + 1;
      }

      if (result.length >= limit) break;
    }

    return result;
  }

  /**
   * Get trending articles for new users
   */
  private getTrendingArticles(articles: Article[], limit: number): Array<{article: Article, score: number, reason: string}> {
    // Sort by recency and sentiment for trending
    const trending = articles
      .map(article => ({
        article,
        score: Math.abs(article.sentimentScore) + 
               (1 - Math.min(7, Math.max(0, 
                 (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
               )) / 7), // Recency bonus
        reason: "Trending article"
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return trending;
  }

  /**
   * Update user preferences in storage format
   */
  async generateUserPreferencesData(userId: number, interactions: UserInteraction[]): Promise<{
    preferredCategories: string[];
    preferredBiasTypes: string[];
    tfIdfProfile: string;
  }> {
    const profile = await this.buildUserProfile(userId, interactions);
    
    const sortedCategories = Object.entries(profile.categories)
      .sort(([,a], [,b]) => b - a)
      .map(([category]) => category)
      .slice(0, 5);

    const sortedBiasTypes = Object.entries(profile.biasTypes)
      .sort(([,a], [,b]) => b - a)
      .map(([bias]) => bias)
      .slice(0, 3);

    return {
      preferredCategories: sortedCategories,
      preferredBiasTypes: sortedBiasTypes,
      tfIdfProfile: JSON.stringify({
        vector: profile.tfIdfVector,
        vocabulary: this.vocabulary,
        totalInteractions: profile.totalInteractions
      })
    };
  }
}

export const recommendationService = new RecommendationService();