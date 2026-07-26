"use client";

import { GenerationInput } from '@/lib/types';

export function InputForm({
  input,
  setInput,
  onGenerate,
  isLoading,
  status
}: {
  input: GenerationInput;
  setInput: (i: GenerationInput) => void;
  onGenerate: () => void;
  isLoading: boolean;
  status: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 border-r w-80 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto">
      <h2 className="font-semibold text-lg">Input Parameters</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <input
          type="text"
          value={input.topic}
          onChange={(e) => setInput({ ...input, topic: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="e.g. Next.js App Router"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Target Keyword</label>
        <input
          type="text"
          value={input.keyword}
          onChange={(e) => setInput({ ...input, keyword: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="e.g. nextjs app router tutorial"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Target Audience</label>
        <input
          type="text"
          value={input.audience}
          onChange={(e) => setInput({ ...input, audience: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="e.g. Frontend Developers"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tone</label>
        <select
          value={input.tone}
          onChange={(e) => setInput({ ...input, tone: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="Conversational">Conversational</option>
          <option value="Technical">Technical</option>
          <option value="Professional">Professional</option>
        </select>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || !input.topic || !input.keyword}
        className="w-full bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 disabled:opacity-50 mt-4"
      >
        {isLoading ? 'Generating...' : 'Generate Article'}
      </button>

      {status && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded text-sm font-medium">
          {status}
        </div>
      )}
    </div>
  );
}