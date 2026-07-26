"use client";

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';
import { Settings, ProviderType } from '@/lib/types';

export function Header({ settings, setSettings }: { settings: Settings; setSettings: (s: Settings) => void }) {
  const [showSettings, setShowSettings] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('ruby_seo_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch { }
    }
  }, [setSettings]);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ruby_seo_settings', JSON.stringify(settings));
  }, [settings]);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-red-600">Ruby SEO</span>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={`${settings.provider}:${settings.model}`}
          onChange={(e) => {
            const [provider, model] = e.target.value.split(':');
            setSettings({ ...settings, provider: provider as ProviderType, model });
          }}
          className="border rounded p-1"
        >
          <optgroup label="OpenAI">
            <option value="openai:gpt-4o">gpt-4o</option>
            <option value="openai:gpt-4-turbo">gpt-4-turbo</option>
          </optgroup>
          <optgroup label="Anthropic">
            <option value="anthropic:claude-3-5-sonnet-20240620">claude-3-5-sonnet</option>
            <option value="anthropic:claude-3-opus-20240229">claude-3-opus</option>
          </optgroup>
          <optgroup label="Google">
            <option value="gemini:gemini-1.5-pro-latest">gemini-1.5-pro</option>
            <option value="gemini:gemini-1.5-flash-latest">gemini-1.5-flash</option>
          </optgroup>
          <optgroup label="Local">
            <option value="ollama:custom">ollama</option>
          </optgroup>
        </select>
        <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-100 rounded">
          <SettingsIcon size={20} />
        </button>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">OpenAI API Key</label>
                <input
                  type="password"
                  value={settings.openaiKey}
                  onChange={(e) => setSettings({ ...settings, openaiKey: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Anthropic API Key</label>
                <input
                  type="password"
                  value={settings.anthropicKey}
                  onChange={(e) => setSettings({ ...settings, anthropicKey: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gemini API Key</label>
                <input
                  type="password"
                  value={settings.geminiKey}
                  onChange={(e) => setSettings({ ...settings, geminiKey: e.target.value })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ollama Base URL</label>
                <input
                  type="text"
                  value={settings.ollamaUrl}
                  onChange={(e) => setSettings({ ...settings, ollamaUrl: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="http://localhost:11434"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ollama Model Name</label>
                <input
                  type="text"
                  value={settings.ollamaModel}
                  onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
                  className="w-full border p-2 rounded"
                  placeholder="llama3"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}