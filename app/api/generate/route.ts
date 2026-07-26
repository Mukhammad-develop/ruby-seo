import { NextRequest } from 'next/server';
import { generateText } from 'ai';
import { getProvider } from '@/lib/ai-providers';
import { Settings, GenerationInput, SeoMetadata, ArticleDraft } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const { input, settings }: { input: GenerationInput; settings: Settings } = await req.json();

  if (!input.topic || !input.keyword) {
    return new Response('Missing topic or keyword', { status: 400 });
  }

  const model = getProvider(settings);

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const writeEvent = async (type: string, data: Record<string, unknown>) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify({ type, ...data })}\n\n`));
  };

  const processPipeline = async () => {
    try {
      // Step 1: Agent 1 - Keyword & Search Intent Analyzer
      await writeEvent('status', { message: 'Agent 1: Analyzing Keyword & Search Intent...' });
      const intentPrompt = `Analyze the search intent for the keyword "${input.keyword}" regarding the topic "${input.topic}".
      Target audience: ${input.audience}.
      Identify if the intent is Informational, Commercial, or Transactional.
      List 5 related sub-topics/LSI keywords and 3 key reader pain points.
      Output as plain text.`;

      const { text: intentResult } = await generateText({
        model,
        prompt: intentPrompt,
      });

      // Step 2: Agent 2 - Outline & Structure Architect
      await writeEvent('status', { message: 'Agent 2: Architecting Article Outline...' });
      const outlinePrompt = `Based on the following intent analysis:\n${intentResult}\n\n
      Create an engaging, structured article outline for the keyword "${input.keyword}".
      Include an H1 title, an intro hook, H2 headers, and H3 subheaders.
      Output ONLY the outline in markdown format.`;

      const { text: outlineResult } = await generateText({
        model,
        prompt: outlinePrompt,
      });

      // Step 3: Agent 3 - Long-Form Content Writer
      await writeEvent('status', { message: 'Agent 3: Writing Long-Form Content...' });
      const contentPrompt = `Write a comprehensive, 1,500+ word article using the following outline:\n${outlineResult}\n\n
      The tone should be ${input.tone}. Target audience is ${input.audience}. Target keyword: "${input.keyword}".
      Use clean Markdown formatting. Enforce scannable paragraphs, bold text for key terms, and natural keyword insertion.
      Output ONLY the final markdown article text.`;

      const { text: contentResult } = await generateText({
        model,
        prompt: contentPrompt,
      });

      await writeEvent('content', { chunk: contentResult });

      // Step 4: Agent 4 - SEO Metadata & Asset Generator
      await writeEvent('status', { message: 'Agent 4: Generating SEO Metadata & Assets...' });
      const metadataPrompt = `Based on the following article about "${input.keyword}":
      Generate:
      1. 3 SEO Meta Titles (under 60 chars)
      2. 2 Meta Descriptions (under 160 chars)
      3. A URL-friendly slug
      4. A 4-question FAQ section (Questions and Answers)
      5. 2 AI image prompts (DALL-E 3 / Midjourney style) representing the article.

      Respond ONLY with a valid JSON object in this format:
      {
        "metaTitles": ["title1", "title2", "title3"],
        "metaDescriptions": ["desc1", "desc2"],
        "slug": "url-slug",
        "faqs": [{"question": "q1", "answer": "a1"}, ...],
        "imagePrompts": ["prompt1", "prompt2"]
      }
      `;

      const { text: metadataResultRaw } = await generateText({
        model,
        prompt: metadataPrompt,
      });

      // Clean JSON string (in case the AI wraps it in markdown code blocks)
      const cleanedMetadataJson = metadataResultRaw.replace(/```json/g, '').replace(/```/g, '').trim();

      let metadata: SeoMetadata;
      try {
        metadata = JSON.parse(cleanedMetadataJson);
      } catch {
        console.error("Failed to parse metadata JSON", cleanedMetadataJson);
        // Fallback metadata if JSON parsing fails
        metadata = {
          metaTitles: ["Generated Title"],
          metaDescriptions: ["Generated Description"],
          slug: input.keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          faqs: [],
          imagePrompts: []
        };
      }

      await writeEvent('metadata', { metadata });

      // Append FAQs and Image Prompts placeholders to the main content
      let finalContent = contentResult;
      if (metadata.imagePrompts.length > 0) {
        finalContent += `\n\n## Visuals\n\n*Image Prompt 1: ${metadata.imagePrompts[0]}*\n\n*Image Prompt 2: ${metadata.imagePrompts[1]}*`;
      }
      if (metadata.faqs.length > 0) {
        finalContent += `\n\n## Frequently Asked Questions\n\n`;
        metadata.faqs.forEach(faq => {
          finalContent += `### ${faq.question}\n${faq.answer}\n\n`;
        });
      }

      // Re-send final content to update the UI
      await writeEvent('content', { chunk: `\n\n---\n\n*Added from SEO Agent:*\n\n` });
      // Only appending the extra stuff for simplicity, full document should be replaced in a real robust implementation

      // Save Draft
      await writeEvent('status', { message: 'Saving draft to server...' });
      try {
        const draftDir = path.join(process.cwd(), 'drafts');
        await fs.mkdir(draftDir, { recursive: true });

        const draftId = Date.now().toString();
        const draft: ArticleDraft = {
          id: draftId,
          createdAt: new Date().toISOString(),
          input,
          content: finalContent,
          metadata
        };

        await fs.writeFile(
          path.join(draftDir, `${draftId}.json`),
          JSON.stringify(draft, null, 2)
        );
      } catch (e) {
        console.error("Failed to save draft", e);
      }


      await writer.close();
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        await writeEvent('error', { message: error.message });
      } else {
        await writeEvent('error', { message: 'An unknown error occurred' });
      }
      await writer.close();
    }
  };

  processPipeline();

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}