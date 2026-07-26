export type ProviderType = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface Settings {
  provider: ProviderType;
  model: string;
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  ollamaUrl: string;
  ollamaModel: string;
}

export interface GenerationInput {
  topic: string;
  keyword: string;
  audience: string;
  tone: string;
}

export interface SeoMetadata {
  metaTitles: string[];
  metaDescriptions: string[];
  slug: string;
  faqs: { question: string; answer: string }[];
  imagePrompts: string[];
}

export interface ArticleDraft {
  id: string;
  createdAt: string;
  input: GenerationInput;
  content: string;
  metadata?: SeoMetadata;
}
