import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const draftDir = path.join(process.cwd(), 'drafts');

    // Check if directory exists, if not create it and return empty array
    try {
      await fs.access(draftDir);
    } catch {
      await fs.mkdir(draftDir, { recursive: true });
      return NextResponse.json([]);
    }

    const files = await fs.readdir(draftDir);
    const drafts = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(draftDir, file), 'utf-8');
        drafts.push(JSON.parse(content));
      }
    }

    // Sort by newest first
    drafts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(drafts);
  } catch (error) {
    console.error("Failed to read drafts", error);
    return NextResponse.json({ error: 'Failed to read drafts' }, { status: 500 });
  }
}
