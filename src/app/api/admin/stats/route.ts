import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [users, forms, submissions] = await Promise.all([
      db.user.count(),
      db.form.count(),
      db.submission.count(),
    ]);

    const publishedForms = await db.form.count({ where: { status: 'published' } });
    const totalViews = await db.form.aggregate({ _sum: { viewCount: true } });

    return NextResponse.json({
      users,
      forms,
      submissions,
      publishedForms,
      totalViews: totalViews._sum.viewCount || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت آمار' }, { status: 500 });
  }
}
