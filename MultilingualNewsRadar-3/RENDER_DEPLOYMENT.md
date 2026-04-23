# 🚀 Deploying Varta.AI on Render

This guide will help you configure the necessary environment variables to get all AI features working on Render.

## 🔑 Environment Variables Configuration

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Select your **Varta.AI** web service.
3. Go to the **Environment** tab.
4. Click **Add Environment Variable** and add the following keys:

| Key | Description |
|-----|-------------|
| `OPENROUTER_API_KEY` | Required for the Chatbot functionality. |
| `GEMINI_API_KEY` | Required for AI article generation and analysis. |
| `NEWS_API_KEY` | Required for fetching real-time news articles. |
| `GOOGLE_TRANSLATE_API_KEY` | Required for multi-language support (Hindi, Marathi, etc.). |
| `DATABASE_URL` | Your Neon PostgreSQL connection string. |
| `RESEND_API_KEY` | Required for sending welcome emails. |
| `GOOGLE_CLIENT_ID` | Required for Google OAuth authentication. |
| `GOOGLE_CLIENT_SECRET` | Required for Google OAuth authentication. |

### 💡 Tips
- You can find your **OpenRouter** key at [openrouter.ai/keys](https://openrouter.ai/keys).
- You can find your **Gemini** key at [aistudio.google.com](https://aistudio.google.com/app/apikey).
- You can find your **News API** key at [newsapi.org](https://newsapi.org).

5. Click **Save Changes**. Render will automatically redeploy your service with the new settings.

## 🛠️ Verification
After redeployment, check the **Logs** tab. You should no longer see "API key not found" warnings, and the chatbot should start responding.
