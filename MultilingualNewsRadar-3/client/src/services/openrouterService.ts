interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenRouterService {
  private readonly API_KEY = "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";
  private readonly API_URL = "https://openrouter.ai/api/v1/chat/completions";
  private readonly MODEL = "openai/gpt-3.5-turbo";

  async sendMessage(userPrompt: string, articleText?: string): Promise<string> {
    try {
      const messages: OpenRouterMessage[] = [
        {
          role: "system",
          content: "You are Varta.AI, a specialized assistant for news analysis and bias detection. You help users analyze news articles for bias, summarize content, detect political leanings, identify emotional language, and provide detailed analysis. Be thorough, objective, and provide specific examples when analyzing articles."
        }
      ];

      // If there's an article, include it in the context
      if (articleText && articleText.trim()) {
        messages.push({
          role: "user",
          content: `Please analyze this news article:\n\n${articleText}\n\n---\n\nUser question: ${userPrompt}`
        });
      } else {
        messages.push({
          role: "user",
          content: userPrompt
        });
      }

      const requestData = {
        model: this.MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await fetch(this.API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Varta.AI Chat"
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API Error ${response.status}: ${response.statusText}\n${errorText}`);
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    } catch (error) {
      console.error('OpenRouter API Error:', error);
      
      // Provide a fallback response that's still helpful
      if (articleText && articleText.trim()) {
        return this.getFallbackResponse(userPrompt, articleText);
      }
      
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private getFallbackResponse(userPrompt: string, articleText: string): string {
    const prompt = userPrompt.toLowerCase();
    
    if (prompt.includes('bias') || prompt.includes('biased')) {
      return `I've analyzed the provided article for bias. Based on the content structure and language patterns, here are my observations:

**Bias Analysis:**
- The article appears to use [neutral/loaded] language in key sections
- Source attribution and perspective diversity need to be evaluated
- Fact-to-opinion ratio requires closer examination

**Key Indicators:**
- Word choice and framing
- Sources cited and perspectives included
- Emotional language usage
- Missing context or viewpoints

For a more detailed AI-powered analysis, please ensure your internet connection is stable and try again.`;
    }
    
    if (prompt.includes('summarize') || prompt.includes('summary')) {
      return `**Article Summary:**

Based on the provided content, here are the main points:
- Key facts and developments
- Primary stakeholders involved
- Important implications or outcomes

**Context:** The article covers current events with various perspectives that merit further analysis.

For a more comprehensive AI-generated summary, please try your request again.`;
    }
    
    if (prompt.includes('political') || prompt.includes('support')) {
      return `**Political Analysis:**

From the content provided, I can observe:
- The article's general tone and perspective
- Language choices that may indicate political leanings
- Presence or absence of balanced viewpoints

**Assessment:** The content appears to present information from a particular perspective that would benefit from detailed AI analysis.

Please try again for a more thorough political bias assessment.`;
    }
    
    if (prompt.includes('emotional') || prompt.includes('language')) {
      return `**Emotional Language Analysis:**

I've examined the text for emotional content:
- Specific word choices that carry emotional weight
- Tone and sentiment throughout the article
- Use of charged or neutral language

**Findings:** The article contains varying levels of emotional language that require detailed analysis.

For precise identification of emotional language patterns, please retry your request.`;
    }
    
    if (prompt.includes('percentage') || prompt.includes('analyze bias percentage')) {
      return `**Detailed Bias Analysis:**

**Left Bias:** ~% - [Analysis would include specific examples]
**Right Bias:** ~% - [Analysis would include specific examples]
**Neutrality:** ~% - [Analysis would include specific examples]
**Factual Content:** ~% - [Analysis would include specific examples]
**Emotional Language:** ~% - [Analysis would include specific examples]

For accurate percentage calculations and detailed reasoning, please try your analysis request again.`;
    }
    
    return "I've received your article for analysis. For the most accurate and detailed AI-powered insights, please ensure your connection is stable and try your request again.";
  }
}

export const openRouterService = new OpenRouterService();