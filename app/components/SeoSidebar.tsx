"use client";

import { SeoMetadata } from '@/lib/types';

export function SeoSidebar({ metadata }: { metadata: SeoMetadata | null }) {
  if (!metadata) {
    return (
      <div className="w-80 border-l p-4 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto hidden lg:block">
        <h2 className="font-semibold text-lg text-gray-400">SEO Scorecard</h2>
        <p className="text-sm text-gray-400 mt-2">Generate an article to view metadata.</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-l p-4 bg-gray-50 h-[calc(100vh-64px)] overflow-y-auto hidden lg:block space-y-6">
      <h2 className="font-semibold text-lg">SEO Scorecard</h2>

      <div>
        <h3 className="text-sm font-bold text-gray-700">URL Slug</h3>
        <div className="mt-1 p-2 bg-white border rounded text-xs break-all">
          {metadata.slug}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700">Meta Titles</h3>
        <ul className="mt-1 space-y-2 text-xs">
          {metadata.metaTitles.map((t, i) => (
            <li key={i} className="p-2 bg-white border rounded">{t}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700">Meta Descriptions</h3>
        <ul className="mt-1 space-y-2 text-xs">
          {metadata.metaDescriptions.map((d, i) => (
            <li key={i} className="p-2 bg-white border rounded">{d}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700">Image Prompts</h3>
        <ul className="mt-1 space-y-2 text-xs">
          {metadata.imagePrompts.map((p, i) => (
            <li key={i} className="p-2 bg-white border rounded italic">{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-700">FAQs Generated</h3>
        <div className="mt-1 text-xs text-gray-600">
          {metadata.faqs.length} FAQs created and added to content.
        </div>
      </div>
    </div>
  );
}