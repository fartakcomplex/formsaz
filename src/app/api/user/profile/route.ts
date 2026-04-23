import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// Hardcoded user ID since no auth system is in place yet
const CURRENT_USER_ID = 'default_user';

export async function GET() {
  try {
    // Try to find the user; if not found, return a default profile
    let user = await db.user.findUnique({
      where: { id: CURRENT_USER_ID },
      include: {
        _count: {
          select: { forms: true, notifications: true },
        },
      },
    });

    if (!user) {
      // Create a default user if none exists
      user = await db.user.create({
        data: {
          id: CURRENT_USER_ID,
          name: 'کاربر پیش‌فرض',
          email: 'user@formsaz.ir',
          role: 'user',
          status: 'active',
        },
        include: {
          _count: {
            select: { forms: true, notifications: true },
          },
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      formCount: user._count.forms,
      notificationCount: user._count.notifications,
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت پروفایل' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, bio } = body;

    // Ensure user exists
    const existingUser = await db.user.findUnique({ where: { id: CURRENT_USER_ID } });
    if (!existingUser) {
      return NextResponse.json({ error: 'کاربر یافت نشد' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await db.user.update({
      where: { id: CURRENT_USER_ID },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      status: updatedUser.status,
      lastLoginAt: updatedUser.lastLoginAt,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در بروزرسانی پروفایل' }, { status: 500 });
  }
}
