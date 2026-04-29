import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// ── Lazy-loaded form data cache ─────────────────────────────────────────────
let formsCache: Record<string, { questions: unknown[] }> | null = null;

function getFormsCache(): Record<string, { questions: unknown[] }> {
  if (!formsCache) {
    const jsonPath = join(process.cwd(), 'data', 'specialized-forms.json');
    const raw = readFileSync(jsonPath, 'utf-8');
    const allForms = JSON.parse(raw) as { id: string; questions: unknown[] }[];
    formsCache = {};
    for (const form of allForms) {
      formsCache[form.id] = form;
    }
  }
  return formsCache;
}

// ── Question factory helpers (fallback for non-specialized forms) ───────────

type FormQuestion = {
  id: string;
  type: string;
  title: string;
  required: boolean;
  order: number;
  config?: Record<string, unknown>;
};

function q(type: string, title: string, required = false, order = 0, config?: Record<string, unknown>): FormQuestion {
  return { id: `q-${order}`, type, title, required, order, config: config || {} };
}

const opt = (text: string, idx: number) => ({ id: `opt-${idx}`, text });

function generateDefaultQuestions(): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات شخصی', false, 0, { description: 'لطفاً اطلاعات خود را وارد کنید' }),
    q('short_text', 'نام و نام خانوادگی', true, 1, { placeholder: 'نام کامل خود را وارد کنید' }),
    q('phone', 'شماره موبایل', true, 2, { placeholder: '۰۹۱۲۳۴۵۶۷۸۹' }),
    q('email', 'ایمیل', false, 3, { placeholder: 'example@email.com' }),
    q('section_divider', 'مرحله ۲: اطلاعات فرم', false, 4),
    q('long_text', 'توضیحات', true, 5, { placeholder: 'لطفاً جزئیات را شرح دهید', maxLength: 2000 }),
    q('multiple_choice', 'اولویت درخواست', false, 6, { options: [opt('عادی', 0), opt('فوری', 1), opt('فوق‌العاده فوری', 2)] }),
    q('rating', 'رضایت کلی', false, 7),
    q('consent', 'اطلاعات صحیح است.', true, 8),
  ];
}

// ── Metadata cache (for fallback info) ──────────────────────────────────────
let metaCache: Array<{ id: string; name: string; description: string; category: string; categoryLabel: string; icon: string; gradient: string; questionCount: number }> | null = null;

function getMetaCache() {
  if (!metaCache) {
    const metaPath = join(process.cwd(), 'data', 'specialized-forms-meta.json');
    const raw = readFileSync(metaPath, 'utf-8');
    metaCache = JSON.parse(raw);
  }
  return metaCache;
}

// ── API handler ────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  // Try to load from specialized forms JSON cache
  try {
    const cache = getFormsCache();
    const formData = cache[id];

    if (formData && formData.questions && formData.questions.length > 0) {
      // Use actual specialized form questions
      const timestamp = Date.now();
      const finalQuestions = formData.questions.map((question: Record<string, unknown>, i: number) => ({
        ...question,
        id: `q-${timestamp}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        order: i,
      }));

      return NextResponse.json({
        success: true,
        data: {
          id,
          questions: finalQuestions,
          questionCount: finalQuestions.length,
        },
      });
    }
  } catch {
    // Fallback to metadata + generated questions
  }

  // Fallback: Load metadata from JSON (not .ts) and generate generic questions
  try {
    const meta = getMetaCache().find((f: { id: string }) => f.id === id);

    if (meta) {
      const questions = generateDefaultQuestions();
      const timestamp = Date.now();
      const finalQuestions = questions.map((question, i) => ({
        ...question,
        id: `q-${timestamp}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        order: i,
      }));

      return NextResponse.json({
        success: true,
        data: {
          id: meta.id,
          name: meta.name,
          description: meta.description,
          category: meta.category,
          categoryLabel: meta.categoryLabel,
          icon: meta.icon,
          gradient: meta.gradient,
          questionCount: finalQuestions.length,
          questions: finalQuestions,
        },
      });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ error: 'Template not found' }, { status: 404 });
}
