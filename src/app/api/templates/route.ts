import { NextRequest, NextResponse } from 'next/server';

// Lazy-load the large specialized forms data (only when requested)
let _allForms: Record<string, unknown> | null = null;

async function getAllForms(): Promise<Record<string, unknown>> {
  if (_allForms) return _allForms;
  const { specializedFormsData } = await import('@/lib/specialized-forms');
  _allForms = {};
  for (const form of specializedFormsData) {
    _allForms[(form as Record<string, unknown>).id as string] = form;
  }
  return _allForms;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    const forms = await getAllForms();
    const form = forms[id];
    if (!form) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: form });
  }

  return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
}
