import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Hardcoded user ID since no auth system is in place yet
const CURRENT_USER_ID = 'default_user';

export async function GET() {
  try {
    const notifications = await db.notification.findMany({
      where: { userId: CURRENT_USER_ID },
      orderBy: { createdAt: 'desc' },
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت اعلان‌ها' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { readAll, id, read } = body;

    // Mark all notifications as read
    if (readAll) {
      await db.notification.updateMany({
        where: { userId: CURRENT_USER_ID, read: false },
        data: { read: true },
      });

      return NextResponse.json({ message: 'همه اعلان‌ها خوانده شد' });
    }

    // Mark a single notification as read
    if (id && read !== undefined) {
      const notification = await db.notification.findFirst({
        where: { id, userId: CURRENT_USER_ID },
      });

      if (!notification) {
        return NextResponse.json({ error: 'اعلان یافت نشد' }, { status: 404 });
      }

      const updated = await db.notification.update({
        where: { id },
        data: { read },
      });

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'درخواست نامعتبر' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در بروزرسانی اعلان‌ها' }, { status: 500 });
  }
}
