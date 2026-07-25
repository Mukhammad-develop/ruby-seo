<div align="center">
  <img src="public/ruby-seo-logo.png" alt="Ruby SEO Logo" width="200" />
  <h1>Ruby SEO</h1>
  <p>A full-stack, production-ready, open-source AI SEO Blog Generation application.</p>
</div>

---

## 🎯 What is Ruby SEO?

Ruby SEO is a free, high-performance, self-hosted web platform designed to give creators, marketers, and developers complete control over automated long-form content generation. Unlike traditional SaaS tools, you bring your own API keys (BYO-Key) maintaining **100% data privacy and zero platform subscription fees**.

Whether you're using OpenAI, Anthropic, Google Gemini, or a local Ollama instance, Ruby SEO orchestrates a powerful multi-agent pipeline to generate fully optimized, engaging, and high-ranking SEO content.

## ✨ Features

- **BYO-Key API Management:** Securely configure your own `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, or `OLLAMA_BASE_URL`. Keys are saved locally in `localStorage`.
- **4-Agent Sequential AI Pipeline:**
  1. **Keyword & Search Intent Analyzer:** Identifies user intent, LSI keywords, and target pain points.
  2. **Outline & Structure Architect:** Crafts compelling H1/H2/H3 headers and structure.
  3. **Long-Form Content Writer:** Drafts a 1,500+ word markdown article section-by-section.
  4. **SEO Metadata & Asset Generator:** Generates Meta Titles, Meta Descriptions, FAQs, and AI image prompts (DALL-E 3/Midjourney).
- **Interactive Workspace:**
  - Real-time pipeline status updates.
  - Split-view Markdown Editor with live HTML preview and syntax highlighting.
  - Dedicated SEO Scorecard metadata sidebar.
- **Data Privacy & Local Storage:** All drafts are stored directly on your server or local machine.
- **Export Formats:** Copy Raw Markdown, Copy Formatted HTML, or download directly to a `.md` file.

## 🛠️ Tech Stack

- **Language:** TypeScript
- **Framework:** Next.js 14+ (App Router, Server Actions, API Routes)
- **Styling:** Tailwind CSS, Lucide React
- **AI Abstraction:** Vercel AI SDK
- **Markdown Rendering:** `react-markdown` with syntax highlighting

## 🚀 Quickstart Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Mukhammad-develop/ruby-seo.git
   cd ruby-seo
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

4. **Start Generating**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Configure your API keys in the Settings panel and start generating fully-optimized long-form content!

## 📄 License

This project is open-source and free to use.