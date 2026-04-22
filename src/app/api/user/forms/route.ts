import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const CURRENT_USER_ID = 'default_user';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const where: Record<string, unknown> = { userId: CURRENT_USER_ID };

    if (search) {
      where.title = { contains: search };
    }
    if (status && status !== 'all') {
      where.status = status;
    }

    const forms = await db.form.findMany({
      where,
      include: {
        _count: {
          select: {
            submissions: true,
            questions: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const totalForms = await db.form.count({ where: { userId: CURRENT_USER_ID } });
    const publishedCount = await db.form.count({ where: { userId: CURRENT_USER_ID, status: 'published' } });
    const draftCount = await db.form.count({ where: { userId: CURRENT_USER_ID, status: 'draft' } });
    const closedCount = await db.form.count({ where: { userId: CURRENT_USER_ID, status: 'closed' } });

    // Get total submissions count
    const allForms = await db.form.findMany({
      where: { userId: CURRENT_USER_ID },
      include: { _count: { select: { submissions: true } } },
    });
    const totalSubmissions = allForms.reduce((sum, f) => sum + f._count.submissions, 0);

    return NextResponse.json({
      forms,
      stats: {
        totalForms,
        publishedCount,
        draftCount,
        closedCount,
        totalSubmissions,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت فرم‌ها' }, { status: 500 });
  }
}
