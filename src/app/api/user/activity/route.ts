import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const CURRENT_USER_ID = 'default_user';

export async function GET() {
  try {
    // Get recent forms (created forms)
    const recentForms = await db.form.findMany({
      where: { userId: CURRENT_USER_ID },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Get recent submissions across user's forms
    const userFormIds = (await db.form.findMany({
      where: { userId: CURRENT_USER_ID },
      select: { id: true },
    })).map((f) => f.id);

    const recentSubmissions = await db.submission.findMany({
      where: { formId: { in: userFormIds } },
      include: {
        form: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Build activity timeline
    const activities: {
      id: string;
      type: string;
      formTitle: string;
      createdAt: Date;
    }[] = [];

    for (const form of recentForms) {
      // Form created
      activities.push({
        id: `form_created_${form.id}`,
        type: 'new_form',
        formTitle: form.title,
        createdAt: form.createdAt,
      });

      // If published, add publish activity
      if (form.status === 'published') {
        activities.push({
          id: `form_published_${form.id}`,
          type: 'publish_form',
          formTitle: form.title,
          createdAt: form.updatedAt,
        });
      }
    }

    for (const sub of recentSubmissions) {
      activities.push({
        id: `submission_${sub.id}`,
        type: 'new_response',
        formTitle: sub.form.title,
        createdAt: sub.createdAt,
      });
    }

    // Sort by date descending
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Limit to 30 items
    const limited = activities.slice(0, 30);

    // Group by date
    const grouped = new Map<string, typeof limited>();
    for (const activity of limited) {
      const dateKey = activity.createdAt.toISOString().split('T')[0];
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(activity);
    }

    return NextResponse.json({
      activities: limited,
      grouped: Object.fromEntries(grouped),
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت فعالیت‌ها' }, { status: 500 });
  }
}
