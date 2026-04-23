import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }
    if (role) where.role = role;
    if (status) where.status = status;

    const users = await db.user.findMany({
      where,
      include: {
        _count: {
          select: { forms: true, notifications: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت کاربران' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'نام و ایمیل الزامی است' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'این ایمیل قبلاً ثبت شده است' },
        { status: 409 }
      );
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: password || null,
        role: role || 'user',
        status: 'active',
      },
      include: {
        _count: {
          select: { forms: true, notifications: true },
        },
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در ایجاد کاربر' }, { status: 500 });
  }
}
