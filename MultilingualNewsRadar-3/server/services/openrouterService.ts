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
  private readonly API_URL = "https://openrouter.ai/api/v1/chat/completions";
  private readonly MODEL = "openai/gpt-4o-mini";
  
  constructor() {
    if (!process.env.OPENROUTER_API_KEY) {
      console.warn('OPENROUTER_API_KEY not found in environment variables');
    }
  }


  async chatWithArticle(userPrompt: string, articleText?: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY not configured");
    }

    try {
      const messages: OpenRouterMessage[] = [
        {
          role: "system",
          content: "You are Varta.AI, a specialized assistant for news analysis and bias detection. You help users analyze news articles for bias, summarize content, detect political leanings, identify emotional language, and provide detailed analysis. Be thorough, objective, and provide specific examples when analyzing articles. CRITICAL INSTRUCTION: You must STRICTLY decline to answer any questions or prompts that are completely unrelated to news, journalism, the provided article, or bias detection (e.g., general programming questions, entertainment drama, or unrelated facts). If asked an off-topic question, politely explain that you are a specialized news analysis AI and cannot assist with that topic."
        }
      ];

      if (articleText && articleText.trim()) {
        messages.push({
          role: "user",
          content: `Context Article:\n${articleText}\n\n---\n\nUser query: ${userPrompt}\n\nInstructions: Please answer the User query directly using the context article if relevant. Remember your system instructions: you must decline any questions completely unrelated to the news domain.`
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
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API Error ${response.status}: ${response.statusText}\n${errorText}`);
      }

      const data = (await response.json()) as OpenRouterResponse;
      return data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const openrouterService = new OpenRouterService();
