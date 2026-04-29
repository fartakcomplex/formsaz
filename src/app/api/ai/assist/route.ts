import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

type AIAction = 'suggest_questions' | 'analyze_responses' | 'generate_theme' | 'improve_form' | 'smart_summary';

interface AIRequest {
  action: AIAction;
  context: Record<string, unknown>;
}

// Reusable ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { action, context } = body;

    if (!action || !context) {
      return NextResponse.json(
        { error: 'action و context الزامی هستند' },
        { status: 400 }
      );
    }

    const validActions: AIAction[] = ['suggest_questions', 'analyze_responses', 'generate_theme', 'improve_form', 'smart_summary'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `action نامعتبر. مقادیر مجاز: ${validActions.join(', ')}` },
        { status: 400 }
      );
    }

    const zai = await getZAI();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'suggest_questions': {
        const { title, description, existingQuestionCount } = context as {
          title: string;
          description?: string;
          existingQuestionCount?: number;
        };

        if (!title) {
          return NextResponse.json({ error: 'title الزامی است' }, { status: 400 });
        }

        systemPrompt =
          'تو یک دستیار هوشمند فرمساز هستی. بر اساس عنوان و توضیحات فرم، سؤالات مرتبط پیشنهاد بده. تمام پاسخ‌ها باید به زبان فارسی باشند.';

        userPrompt = `برای فرمی با عنوان "${title}"${
          description ? ` و توضیحات "${description}"` : ''
        }${
          existingQuestionCount
            ? ` که در حال حاضر ${existingQuestionCount} سؤال دارد`
            : ''
        }، ۵ سؤال مرتبط پیشنهاد بده.

هر سؤال را در قالب JSON با ساختار زیر برگردان:
{
  "questions": [
    {
      "type": "short_text|long_text|multiple_choice|multiple_select|number|email|phone|date|rating|scale|yes_no|dropdown",
      "title": "عنوان سؤال",
      "required": true|false,
      "options": ["گزینه ۱", "گزینه ۲"] یا null (فقط برای سؤالات انتخابی)
    }
  ]
}

نکات مهم:
- از انواع سؤال استاندارد استفاده کن (مثلاً برای مقیاس رضایت از rating، برای نام از short_text)
- گزینه‌ها باید کامل و مرتبط باشند
- فقط JSON خالص برگردان، بدون متن اضافی`;

        break;
      }

      case 'improve_form': {
        const { title, questions } = context as {
          title: string;
          questions: { type: string; title: string; required: boolean }[];
        };

        if (!title || !questions || !Array.isArray(questions)) {
          return NextResponse.json(
            { error: 'title و questions الزامی هستند' },
            { status: 400 }
          );
        }

        systemPrompt =
          'تو یک متخصص طراحی فرم و بهینه‌سازی تجربه کاربری هستی. فرم‌ها را بررسی و پیشنهادات بهبود ارائه بده. تمام پاسخ‌ها به فارسی باشند.';

        const questionList = questions
          .map((q, i) => `${i + 1}. [${q.type}] ${q.title} ${q.required ? '(الزامی)' : '(اختیاری)'}`)
          .join('\n');

        userPrompt = `فرم "${title}" با سؤالات زیر بررسی کن و پیشنهادات بهبود ارائه بده:

${questionList}

پیشنهادات شامل:
۱. فیلدهای کمبود (مثلاً فیلد نام، ایمیل، شماره تماس)
۲. نوع بهتر سؤالات (مثلاً آیا باید از scale به rating تغییر کند)
۳. ترتیب منطقی سؤالات
۴. پیشنهاد حذف سؤالات اضافی
۵. پیشنهاد سؤالات تکمیلی

پاسخ را ساختاریافته و خوانا بنویس.`;

        break;
      }

      case 'smart_summary': {
        const { formTitle, totalResponses, questions, recentResponses } = context as {
          formTitle: string;
          totalResponses: number;
          questions: { title: string; type: string }[];
          recentResponses: { questionId: string; value: string }[];
        };

        if (!formTitle || !questions) {
          return NextResponse.json(
            { error: 'formTitle و questions الزامی هستند' },
            { status: 400 }
          );
        }

        systemPrompt =
          'تو یک تحلیلگر داده هوشمند هستی. پاسخ‌های فرم را تحلیل و بینش‌های کلیدی ارائه بده. تمام پاسخ‌ها به فارسی باشند.';

        const questionList = questions.map((q, i) => `${i + 1}. [${q.type}] ${q.title}`).join('\n');

        const responseSample = recentResponses?.length
          ? `\n\nنمونه پاسخ‌های اخیر:\n${recentResponses
              .slice(0, 20)
              .map((r) => `  - ${r.value}`)
              .join('\n')}`
          : '';

        userPrompt = `تحلیل هوشمند فرم "${formTitle}":
- تعداد کل سؤالات: ${questions.length}
- تعداد کل پاسخ‌ها: ${totalResponses || 0}

سؤالات فرم:
${questionList}
${responseSample}

تحلیل شامل موارد زیر باشد:
۱. بینش‌های کلیدی (الگوها و روندها)
۲. نکات قابل توجه
۳. پیشنهاد اقدامات بعدی

پاسخ را ساختاریافته و کاربردی بنویس.`;

        break;
      }

      case 'generate_theme': {
        const { title, description } = context as {
          title: string;
          description?: string;
        };

        if (!title) {
          return NextResponse.json({ error: 'title الزامی است' }, { status: 400 });
        }

        systemPrompt =
          'تو یک طراح رابط کاربری حرفه‌ای هستی. تم رنگی مناسب برای فرم‌ها پیشنهاد بده. تمام پاسخ‌ها به فارسی باشند.';

        userPrompt = `برای فرمی با عنوان "${title}"${
          description ? ` و توضیحات "${description}"` : ''
        }، ۳ تم رنگی مناسب پیشنهاد بده.

هر تم را در قالب JSON با ساختار زیر برگردان:
{
  "themes": [
    {
      "name": "نام تم",
      "primaryColor": "#hex",
      "backgroundColor": "#hex",
      "description": "توضیح کوتاه فارسی"
    }
  ]
}

نکات مهم:
- رنگ‌ها باید هماهنگ و چشم‌نواز باشند
- رنگ پس‌زمینه روشن باشد
- فقط JSON خالص برگردان، بدون متن اضافی`;

        break;
      }

      case 'analyze_responses': {
        const { formTitle, questions, responses } = context as {
          formTitle: string;
          questions: { id: string; title: string; type: string }[];
          responses: { questionId: string; value: string }[];
        };

        if (!formTitle || !questions) {
          return NextResponse.json(
            { error: 'formTitle و questions الزامی هستند' },
            { status: 400 }
          );
        }

        systemPrompt =
          'تو یک تحلیلگر داده حرفه‌ای هستی. پاسخ‌های فرم را تحلیل عمیق ارائه بده. تمام پاسخ‌ها به فارسی باشند.';

        const questionList = questions.map((q) => `- [${q.type}] ${q.title}`).join('\n');
        const responseData = responses
          ? responses.slice(0, 50).map((r) => `  سؤال: ${r.questionId} → ${r.value}`).join('\n')
          : 'پاسخی موجود نیست';

        userPrompt = `تحلیل عمیق پاسخ‌های فرم "${formTitle}":

سؤالات:
${questionList}

پاسخ‌ها:
${responseData}

تحلیل شامل:
۱. خلاصه آماری
۲. الگوهای مشخص
۳. نقاط قوت و ضعف
۴. پیشنهاد بهبود فرم`;

        break;
      }
    }

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      thinking: { type: 'disabled' },
    });

    const rawContent = completion.choices[0]?.message?.content;

    if (!rawContent) {
      return NextResponse.json(
        { error: 'پاسخی از هوش مصنوعی دریافت نشد. لطفاً دوباره تلاش کنید.' },
        { status: 500 }
      );
    }

    // Try to parse JSON from the response for structured actions
    if (action === 'suggest_questions' || action === 'generate_theme') {
      try {
        // Extract JSON from markdown code blocks or raw text
        const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, rawContent];
        const jsonStr = (jsonMatch[1] || rawContent).trim();
        const parsed = JSON.parse(jsonStr);
        return NextResponse.json({ success: true, data: parsed });
      } catch {
        // If JSON parsing fails, return raw text
        return NextResponse.json({ success: true, data: { text: rawContent } });
      }
    }

    return NextResponse.json({ success: true, data: { text: rawContent } });
  } catch (error) {
    console.error('AI Assist Error:', error);
    return NextResponse.json(
      {
        error:
          'خطا در پردازش درخواست هوش مصنوعی. لطفاً稍后 دوباره تلاش کنید.',
        fallback: getFallbackMessage(''),
      },
      { status: 500 }
    );
  }
}

function getFallbackMessage(_action: string): string {
  return 'متأسفانه در حال حاضر امکان پردازش درخواست وجود ندارد. لطفاً بعداً دوباره تلاش کنید.';
}
