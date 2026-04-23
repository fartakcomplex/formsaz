import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Fetch recent forms (created events)
    const recentForms = await db.form.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Fetch recent submissions
    const recentSubmissions = await db.submission.findMany({
      select: {
        id: true,
        createdAt: true,
        respondent: true,
        form: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Merge and sort by time
    const activities = [
      ...recentForms.map((f) => ({
        type: 'form_created' as const,
        title: `فرم «${f.title}» ایجاد شد`,
        userName: f.user?.name || 'ناشناس',
        time: f.createdAt.toISOString(),
      })),
      ...recentSubmissions.map((s) => ({
        type: 'submission_received' as const,
        title: `پاسخ جدید برای فرم «${s.form.title}»`,
        userName: s.respondent || 'ناشناس',
        time: s.createdAt.toISOString(),
      })),
    ];

    // Sort by time descending, take top 10
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const top10 = activities.slice(0, 10);

    return NextResponse.json(top10);
  } catch (error) {
    console.error('Error fetching admin activity:', error);
    return NextResponse.json([], { status: 500 });
  }
}
