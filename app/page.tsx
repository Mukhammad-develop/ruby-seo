"use client";

import { useState } from 'react';
import { Header } from '@/app/components/Header';
import { InputForm } from '@/app/components/InputForm';
import { Editor } from '@/app/components/Editor';
import { SeoSidebar } from '@/app/components/SeoSidebar';
import { Settings, GenerationInput, SeoMetadata } from '@/lib/types';

export default function Home() {
  const [settings, setSettings] = useState<Settings>({
    provider: 'openai',
    model: 'gpt-4o',
    openaiKey: '',
    anthropicKey: '',
    geminiKey: '',
    ollamaUrl: 'http://localhost:11434',
    ollamaModel: 'llama3'
  });

  const [input, setInput] = useState<GenerationInput>({
    topic: '',
    keyword: '',
    audience: 'General Audience',
    tone: 'Conversational'
  });

  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState<SeoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleGenerate = async () => {
    setIsLoading(true);
    setContent('');
    setMetadata(null);
    setStatus('Initializing pipeline...');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, settings }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (reader && !done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'status') {
                  setStatus(data.message);
                } else if (data.type === 'content') {
                  setContent(prev => prev + data.chunk);
                } else if (data.type === 'metadata') {
                  setMetadata(data.metadata);
                }
              } catch {
                // Ignore parse errors from incomplete chunks
              }
            }
          }
        }
      }
      setStatus('Generation complete!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      }
      setStatus('Generation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header settings={settings} setSettings={setSettings} />
      <div className="flex flex-1 overflow-hidden">
        <InputForm
          input={input}
          setInput={setInput}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          status={status}
        />
        <Editor content={content} setContent={setContent} />
        <SeoSidebar metadata={metadata} />
      </div>
    </div>
  );
}