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

    // Fire-and-forget email notification if enabled
    try {
      const form = await db.form.findUnique({
        where: { id },
      });

      if (form?.theme) {
        let theme: Record<string, unknown>;
        try {
          theme = JSON.parse(form.theme);
        } catch {
          theme = {};
        }

        if (theme.notificationEnabled === true && theme.notificationEmail) {
          // Build notification payload with question titles
          const questions = await db.question.findMany({
            where: { formId: id },
            orderBy: { order: 'asc' },
          });

          const notificationResponses = responses.map(
            (r: { questionId: string; value: string }) => {
              const question = questions.find((q) => q.id === r.questionId);
              return {
                questionTitle: question?.title || 'سؤال نامشخص',
                value: typeof r.value === 'string' ? r.value : JSON.stringify(r.value),
              };
            }
          );

          // Fire and forget — do not await
          fetch('/api/notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formTitle: form.title,
              formId: form.id,
              respondent: {
                email: theme.notificationEmail,
              },
              responses: notificationResponses,
            }),
          }).catch((err) => {
            console.error('Notification fire-and-forget failed:', err);
          });
        }
      }
    } catch (notifError) {
      // Don't let notification failure affect form submission response
      console.error('Notification check failed:', notifError);
    }

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}
