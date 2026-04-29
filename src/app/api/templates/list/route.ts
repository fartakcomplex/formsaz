import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const metaPath = join(process.cwd(), 'data', 'specialized-forms-meta.json');
    const raw = readFileSync(metaPath, 'utf-8');
    const meta = JSON.parse(raw);
    return NextResponse.json({
      success: true,
      data: meta,
      total: meta?.length || 0,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: String(err),
      total: 0,
    });
  }
}
