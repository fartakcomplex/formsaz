import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Metadata cache ───────────────────────────────────────────────────────────
let metaCache: Array<{ id: string; name: string; description: string; category: string; categoryLabel: string; icon: string; gradient: string; questionCount: number }> | null = null;

function getMeta() {
  if (!metaCache) {
    const metaPath = join(process.cwd(), 'src', 'lib', 'specialized-forms-meta.json');
    const raw = readFileSync(metaPath, 'utf-8');
    metaCache = JSON.parse(raw);
  }
  return metaCache;
}

export async function GET() {
  const meta = getMeta();
  return NextResponse.json({
    success: true,
    data: meta,
    total: meta?.length || 0,
  });
}
