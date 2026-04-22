import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const form = await db.form.findUnique({
      where: { id },
      include: {
        _count: { select: { submissions: true } },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    const questions = await db.question.findMany({
      where: { formId: id },
      orderBy: { order: 'asc' },
    });

    // Increment view count
    await db.form.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({
      ...form,
      questions: questions.map((q) => ({
        ...q,
        config: JSON.parse(q.config),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, theme, status, questions, expiresAt } = body;

    const form = await db.form.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(theme !== undefined && { theme: JSON.stringify(theme) }),
        ...(status !== undefined && { status }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
    });

    if (questions) {
      // Delete existing questions and recreate
      await db.question.deleteMany({ where: { formId: id } });

      if (questions.length > 0) {
        await db.question.createMany({
          data: questions.map((q: { type: string; title: string; required: boolean; order: number; config: Record<string, unknown> }) => ({
            formId: id,
            type: q.type,
            title: q.title,
            required: q.required,
            order: q.order,
            config: JSON.stringify(q.config || {}),
          })),
        });
      }
    }

    const updatedQuestions = await db.question.findMany({
      where: { formId: id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({
      ...form,
      questions: updatedQuestions.map((q) => ({
        ...q,
        config: JSON.parse(q.config),
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update form' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.form.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 });
  }
}
