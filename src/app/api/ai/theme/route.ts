import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'عنوان فرم الزامی است' },
        { status: 400 }
      );
    }

    const prompt = `با توجه به اطلاعات فرم زیر، ۴ تم رنگی پیشنهادی تولید کن.

عنوان فرم: ${title}
${description ? `توضیحات: ${description}` : ''}

لطفاً پاسخ را دقیقاً به فرمت JSON زیر ارائه بده (فقط JSON خالص، بدون هیچ متن اضافی):
[
  {
    "name": "نام تم به فارسی",
    "primaryColor": "#hexcolor",
    "backgroundColor": "#hexcolor",
    "description": "توضیح کوتاه فارسی درباره مناسب بودن تم"
  }
]

نکات:
- رنگ‌ها باید هماهنگ و حرفه‌ای باشند
- رنگ‌های primary متنوع و متناسب با موضوع انتخاب شوند
- description حداکثر ۱۵ کلمه باشد
- دقیقاً ۴ تم تولید کن`;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'تو یک طراح رابط کاربری حرفه‌ای هستی. بر اساس موضوع فرم، تم‌های رنگی مناسب پیشنهاد بده. همیشه پاسخ را به صورت آرایه JSON با کلیدهای name, primaryColor, backgroundColor و description برگردان.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: 'خطا در تولید تم' },
        { status: 500 }
      );
    }

    let themes;
    try {
      // Extract JSON from possible markdown code blocks
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawContent.trim();
      themes = JSON.parse(jsonStr);

      // Validate structure
      if (!Array.isArray(themes)) {
        themes = [themes];
      }

      // Ensure each theme has required fields with fallback
      themes = themes.map((theme: Record<string, string>, index: number) => ({
        name: theme.name || `تم ${index + 1}`,
        primaryColor: theme.primaryColor || '#6366f1',
        backgroundColor: theme.backgroundColor || '#ffffff',
        description: theme.description || 'تم پیشنهادی',
      }));

      // Limit to 4 themes
      themes = themes.slice(0, 4);
    } catch {
      // Fallback themes if parsing fails
      themes = [
        {
          name: 'حرفه‌ای',
          primaryColor: '#7c3aed',
          backgroundColor: '#ffffff',
          description: 'مناسب فرم‌های سازمانی و رسمی',
        },
        {
          name: 'دوستانه',
          primaryColor: '#10b981',
          backgroundColor: '#f0fdf4',
          description: 'مناسب فرم‌های بازخورد و نظرسنجی',
        },
        {
          name: 'مدرن',
          primaryColor: '#0ea5e9',
          backgroundColor: '#f0f9ff',
          description: 'مناسب فرم‌های ثبت‌نام و تماس',
        },
        {
          name: 'گرم',
          primaryColor: '#f59e0b',
          backgroundColor: '#fffbeb',
          description: 'مناسب فرم‌های رویداد و سفارش',
        },
      ];
    }

    return NextResponse.json(themes);
  } catch (error) {
    console.error('Theme generation error:', error);
    return NextResponse.json(
      { error: 'خطا در تولید تم. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
