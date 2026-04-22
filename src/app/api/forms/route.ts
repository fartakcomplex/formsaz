import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const forms = await db.form.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { submissions: true, questions: true } },
      },
    });

    const formsWithQuestions = await Promise.all(
      forms.map(async (form) => {
        const questions = await db.question.findMany({
          where: { formId: form.id },
          orderBy: { order: 'asc' },
        });
        return {
          ...form,
          questions: questions.map((q) => ({
            ...q,
            config: JSON.parse(q.config),
          })),
        };
      })
    );

    return NextResponse.json(formsWithQuestions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, theme, questions } = body;

    const form = await db.form.create({
      data: {
        title: title || 'فرم بدون عنوان',
        description: description || '',
        theme: theme ? JSON.stringify(theme) : undefined,
      },
    });

    if (questions && questions.length > 0) {
      await db.question.createMany({
        data: questions.map((q: { type: string; title: string; required: boolean; order: number; config: Record<string, unknown> }, i: number) => ({
          formId: form.id,
          type: q.type,
          title: q.title,
          required: q.required,
          order: q.order ?? i,
          config: JSON.stringify(q.config || {}),
        })),
      });
    }

    const createdQuestions = await db.question.findMany({
      where: { formId: form.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      ...form,
      questions: createdQuestions.map((q) => ({
        ...q,
        config: JSON.parse(q.config),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create form' }, { status: 500 });
  }
}
