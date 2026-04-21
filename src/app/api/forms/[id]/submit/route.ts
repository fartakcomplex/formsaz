import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { responses } = body;

    const submission = await db.submission.create({
      data: {
        formId: id,
      },
    });

    if (responses && responses.length > 0) {
      await db.response.createMany({
        data: responses.map((r: { questionId: string; value: string }) => ({
          submissionId: submission.id,
          questionId: r.questionId,
          value: typeof r.value === 'string' ? r.value : JSON.stringify(r.value),
        })),
      });
    }

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
