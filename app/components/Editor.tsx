"use client";

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Download, Copy } from 'lucide-react';

export function Editor({ content, setContent }: { content: string; setContent: (c: string) => void }) {
  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    alert('Markdown copied!');
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'article.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
      <div className="flex justify-end p-2 border-b bg-gray-50 gap-2">
        <button onClick={handleCopyMarkdown} className="flex items-center gap-1 px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
          <Copy size={16} /> Raw Markdown
        </button>
        <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-1 bg-white border rounded text-sm hover:bg-gray-50">
          <Download size={16} /> Download .md
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Raw Markdown Editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 p-6 resize-none outline-none font-mono text-sm leading-relaxed"
          placeholder="Your markdown content will appear here..."
        />

        {/* Right: Preview */}
        <div className="flex-1 border-l p-6 overflow-y-auto bg-white prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { ref, style, ...rest } = props as React.HTMLProps<HTMLElement>;
                return match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content || '*Live Preview*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}