import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const submissions = await db.submission.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by day
    const dailyCounts: Record<string, number> = {};
    
    // Initialize all 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      dailyCounts[key] = 0;
    }

    // Count submissions per day
    for (const sub of submissions) {
      const key = sub.createdAt.toISOString().split('T')[0];
      if (dailyCounts[key] !== undefined) {
        dailyCounts[key]++;
      }
    }

    const chartData = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ data: chartData });
  } catch (error) {
    return NextResponse.json({ error: 'خطا در دریافت اطلاعات نمودار' }, { status: 500 });
  }
}
