import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch the form with viewCount
    const form = await db.form.findUnique({
      where: { id },
      select: {
        id: true,
        viewCount: true,
        createdAt: true,
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Fetch all submissions for the form
    const submissions = await db.submission.findMany({
      where: { formId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        responses: true,
      },
    });

    const submissionCount = submissions.length;

    // Daily submission counts for the last 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyCounts: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dateStr = day.toISOString().split('T')[0];
      dailyCounts.push({ date: dateStr, count: 0 });
    }

    submissions.forEach((sub) => {
      const subDate = new Date(sub.createdAt);
      const subDateStr = subDate.toISOString().split('T')[0];
      const dayEntry = dailyCounts.find((d) => d.date === subDateStr);
      if (dayEntry) {
        dayEntry.count++;
      }
    });

    // Average response time (time between form creation and first submission)
    let avgResponseTime = null;
    if (submissionCount > 0) {
      const firstSubmission = submissions[0];
      const formCreated = new Date(form.createdAt).getTime();
      const firstResponse = new Date(firstSubmission.createdAt).getTime();
      const diffMs = firstResponse - formCreated;
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      avgResponseTime = diffHours;
    }

    // Total views
    const totalViews = form.viewCount;

    // Completion rate (submissions / views as percentage)
    const completionRate =
      totalViews > 0 ? Math.round((submissionCount / totalViews) * 100) : 0;

    // Average responses per day
    const formAgeDays = Math.max(
      1,
      Math.ceil(
        (now.getTime() - new Date(form.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    );
    const avgPerDay = parseFloat((submissionCount / formAgeDays).toFixed(1));

    return NextResponse.json({
      submissionCount,
      dailyCounts,
      avgResponseTime,
      totalViews,
      completionRate,
      avgPerDay,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
