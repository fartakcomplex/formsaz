import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, formTitle, questions, responses } = body;

    if (!formId || !questions || !responses) {
      return NextResponse.json(
        { error: 'فیلدهای الزامی: formId, questions, responses' },
        { status: 400 }
      );
    }

    const totalResponses = responses.length;
    if (totalResponses === 0) {
      return NextResponse.json({
        summary: 'هنوز پاسخی برای این فرم ثبت نشده است. پس از دریافت پاسخ‌ها، تحلیل هوشمند فعال می‌شود.',
        patterns: [],
        recommendations: [],
      });
    }

    // Build a structured summary of the data for the AI
    const questionsSummary = questions
      .map((q: { id: string; type: string; title: string }, idx: number) => {
        const questionResponses = responses
          .map((r: { questionId: string; value: string }[]) =>
            r.find((resp) => resp.questionId === q.id)?.value
          )
          .filter(Boolean);

        return `سؤال ${idx + 1} (${q.type}): ${q.title}\nپاسخ‌ها (${questionResponses.length}): ${questionResponses.slice(0, 20).join(' | ')}`;
      })
      .join('\n\n');

    const prompt = `لطفاً پاسخ‌های فرم زیر را تحلیل کن و بینش‌های کلیدی ارائه بده.

عنوان فرم: ${formTitle || 'بدون عنوان'}
تعداد کل پاسخ‌دهندگان: ${totalResponses}

سؤالات و پاسخ‌ها:
${questionsSummary}

لطفاً تحلیل خود را دقیقاً با فرمت JSON زیر ارائه بده (فقط JSON خالص بدون هیچ متن اضافی):
{
  "summary": "خلاصه کلی یافته‌های مهم در ۲ تا ۴ جمله",
  "patterns": [
    { "question": "عنوان سؤال", "insight": "بینش کلیدی درباره الگوی پاسخ‌دهی" },
    { "question": "عنوان سؤال", "insight": "بینش کلیدی" }
  ],
  "recommendations": [
    "پیشنهاد اول برای بهبود فرم",
    "پیشنهاد دوم",
    "پیشنهاد سوم"
  ]
}`;

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'تو یک تحلیلگر داده فرم هستی. پاسخ‌های فرم را تحلیل کن و بینش‌های کلیدی به فارسی ارائه بده. همیشه پاسخ را به صورت JSON با کلیدهای summary، patterns و recommendations برگردان.',
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
        { error: 'خطا در تولید تحلیل' },
        { status: 500 }
      );
    }

    // Try to parse as JSON, fallback to wrapping the text
    let analysis;
    try {
      // Extract JSON from possible markdown code blocks
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawContent.trim();
      analysis = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, create a structured response from the text
      analysis = {
        summary: rawContent,
        patterns: [],
        recommendations: [],
      };
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: 'خطا در تحلیل هوشمند. لطفاً دوباره تلاش کنید.' },
      { status: 500 }
    );
  }
}
