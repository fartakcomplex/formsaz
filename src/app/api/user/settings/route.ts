import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const CURRENT_USER_ID = 'default_user';

export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { id: CURRENT_USER_ID },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    return NextResponse.json({
      hasPassword: !!user.password,
      preferences: {
        notifSubmission: true,
        notifWeekly: false,
        notifSystem: true,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت تنظیمات' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'change_password') {
      const { currentPassword, newPassword } = body;

      const user = await db.user.findUnique({ where: { id: CURRENT_USER_ID } });
      if (!user) {
        return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
      }

      // Simple password check (in a real app, you'd hash passwords)
      if (user.password && user.password !== currentPassword) {
        return NextResponse.json({ error: 'رمز عبور فعلی اشتباه است' }, { status: 400 });
      }

      await db.user.update({
        where: { id: CURRENT_USER_ID },
        data: { password: newPassword },
      });

      return NextResponse.json({ message: 'رمز عبور تغییر کرد' });
    }

    if (type === 'preferences') {
      const { preferences } = body;
      // In a real app, store preferences in the DB or a separate table
      return NextResponse.json({ message: 'تنظیمات ذخیره شد', preferences });
    }

    return NextResponse.json({ error: 'درخواست نامعتبر' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در بروزرسانی تنظیمات' }, { status: 500 });
  }
}
