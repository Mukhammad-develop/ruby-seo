import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Settings } from './types';
import { LanguageModel } from 'ai';

export function getProvider(settings: Settings): LanguageModel {
  if (settings.provider === 'openai') {
    const openai = createOpenAI({ apiKey: settings.openaiKey || 'missing' });
    return openai(settings.model);
  }

  if (settings.provider === 'anthropic') {
    const anthropic = createAnthropic({ apiKey: settings.anthropicKey || 'missing' });
    return anthropic(settings.model);
  }

  if (settings.provider === 'gemini') {
    const google = createGoogleGenerativeAI({ apiKey: settings.geminiKey || 'missing' });
    return google(settings.model);
  }

  if (settings.provider === 'ollama') {
    // Vercel AI SDK has experimental Ollama support, but we can use the OpenAI compatible endpoint
    const ollama = createOpenAI({
      baseURL: `${settings.ollamaUrl}/v1`,
      apiKey: 'ollama' // Ollama doesn't need an API key
    });
    return ollama(settings.ollamaModel || 'llama3');
  }

  throw new Error('Unsupported provider');
}
