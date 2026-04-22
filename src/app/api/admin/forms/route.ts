import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { user: { name: { contains: search } } },
      ];
    }
    if (status) where.status = status;

    const [forms, total] = await Promise.all([
      db.form.findMany({
        where,
        include: {
          user: {
            select: { name: true, email: true },
          },
          _count: {
            select: { submissions: true, questions: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.form.count({ where }),
    ]);

    const formattedForms = forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      status: form.status,
      viewCount: form.viewCount,
      creator: form.user?.name || 'بدون نام',
      creatorEmail: form.user?.email || '',
      submissions: form._count.submissions,
      questions: form._count.questions,
      createdAt: form.createdAt,
      updatedAt: form.updatedAt,
      expiresAt: form.expiresAt,
    }));

    return NextResponse.json({ forms: formattedForms, total });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت فرم‌ها' }, { status: 500 });
  }
}
