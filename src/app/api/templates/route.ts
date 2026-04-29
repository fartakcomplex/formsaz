import { NextRequest, NextResponse } from 'next/server';
import type { FormQuestion } from '@/lib/store';

// ── Question factory helpers ──────────────────────────────────────────────────

function q(type: string, title: string, required = false, order = 0, config?: Record<string, unknown>): FormQuestion {
  return { id: `q-${order}`, type, title, required, order, config: config || {} };
}

const opt = (text: string, idx: number) => ({ id: `opt-${idx}`, text });

// ── Category-specific question generators ─────────────────────────────────────

function generateMedicalQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات شخصی', false, 0, { description: 'لطفاً اطلاعات خود را وارد کنید' }),
    q('short_text', 'نام و نام خانوادگی', true, 1, { placeholder: 'نام کامل خود را وارد کنید' }),
    q('national_id', 'کد ملی', true, 2, { placeholder: '۱۰ رقم کد ملی' }),
    q('phone', 'شماره موبایل', true, 3, { placeholder: '۰۹۱۲۳۴۵۶۷۸۹' }),
    q('date', 'تاریخ تولد', false, 4),
    q('gender', 'جنسیت', true, 5, { genders: ['مرد', 'زن'] }),
    q('section_divider', 'مرحله ۲: اطلاعات پزشکی', false, 6, { description: 'سوابق و اطلاعات پزشکی' }),
    q('short_text', 'علت مراجعه', true, 7, { placeholder: 'توضیح کوتاه علت مراجعه' }),
    q('long_text', 'شرح وضعیت', true, 8, { placeholder: 'لطفاً علائم و شرح حال خود را بنویسید', maxLength: 3000 }),
    q('date', 'تاریخ شروع علائم', false, 9),
    q('multiple_choice', 'سابقه بیماری خاص دارید؟', false, 10, { options: [opt('خیر', 0), opt('دیابت', 1), opt('فشار خون', 2), opt('قلبی-عروقی', 3), opt('آسم', 4), opt('آلرژی', 5)], allowOther: true }),
    q('file_upload', 'نسخه قبلی / نتایج آزمایش', false, 11),
    q('section_divider', 'مرحله ۳: نوبت‌دهی', false, 12, { description: 'انتخاب زمان و تکمیل فرم' }),
    q('date', 'تاریخ مراجعه مورد نظر', true, 13),
    q('time', 'ساعت ترجیحی', false, 14),
    q('consent', 'تاییدیه: اطلاعات وارد شده صحیح است و رضایت به درمان را دارم.', true, 15, { consentText: 'اطلاعات وارد شده صحیح است و رضایت به درمان را دارم.' }),
  ];
}

function generateEducationQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات شخصی', false, 0, { description: 'اطلاعات دانشجو/داوطلب' }),
    q('short_text', 'نام و نام خانوادگی', true, 1),
    q('national_id', 'کد ملی', true, 2),
    q('email', 'ایمیل', false, 3, { placeholder: 'example@email.com' }),
    q('phone', 'شماره موبایل', true, 4),
    q('section_divider', 'مرحله ۲: اطلاعات تحصیلی', false, 5),
    q('education', 'آخرین مدرک تحصیلی', true, 6, { educations: ['دیپلم', 'کاردانی', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'] }),
    q('short_text', 'رشته تحصیلی', true, 7),
    q('short_text', 'دانشگاه / موسسه', true, 8),
    q('number', 'معدل آخرین مدرک', false, 9, { min: 0, max: 20, step: 0.01 }),
    q('section_divider', 'مرحله ۳: اطلاعات تکمیلی', false, 10),
    q('address', 'آدرس محل سکونت', false, 11),
    q('postal_code', 'کد پستی', false, 12),
    q('consent', 'اطلاعات وارد شده صحیح است.', true, 13, { consentText: 'اطلاعات وارد شده صحیح و راستگوایانه است.' }),
  ];
}

function generateBusinessQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات شرکت', false, 0, { description: 'اطلاعات سازمان/شرکت' }),
    q('short_text', 'نام شرکت / سازمان', true, 1),
    q('company', 'نام رسمی شرکت', true, 2),
    q('national_id', 'شماره ثبت / کد ملی شرکت', true, 3),
    q('phone', 'تلفن تماس', true, 4),
    q('email', 'ایمیل سازمانی', false, 5),
    q('website', 'وب‌سایت', false, 6),
    q('section_divider', 'مرحله ۲: اطلاعات درخواست', false, 7),
    q('multiple_choice', 'نوع درخواست', true, 8, { options: [opt('همکاری', 0), opt('مشاوره', 1), opt('سفارش محصول', 2), opt('پشتیبانی', 3), opt('سایر', 4)] }),
    q('long_text', 'توضیحات درخواست', true, 9, { placeholder: 'لطفاً جزئیات درخواست خود را شرح دهید' }),
    q('range', 'بودجه تقریبی (میلیون تومان)', false, 10, { min: 0, max: 1000, step: 10, unit: 'میلیون تومان' }),
    q('section_divider', 'مرحله ۳: اطلاعات تماس', false, 11),
    q('short_text', 'نام و نام خانوادگی مسئول پیگیری', true, 12),
    q('job_title', 'سمت سازمانی', false, 13),
    q('address', 'آدرس دفتر', false, 14),
    q('consent', 'تاییدیه اطلاعات', true, 15, { consentText: 'تمامی اطلاعات وارد شده صحیح می‌باشد.' }),
  ];
}

function generateEventQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات رویداد', false, 0),
    q('short_text', 'نام رویداد', true, 1),
    q('date', 'تاریخ برگزاری', true, 2),
    q('time', 'ساعت شروع', true, 3),
    q('multiple_choice', 'نوع رویداد', true, 4, { options: [opt('کنفرانس', 0), opt('همایش', 1), opt('کارگاه', 2), opt('جشنواره', 3), opt('مسابقه', 4), opt('جشن', 5)] }),
    q('section_divider', 'مرحله ۲: اطلاعات ثبت‌نام‌کننده', false, 5),
    q('short_text', 'نام و نام خانوادگی', true, 6),
    q('email', 'ایمیل', true, 7),
    q('phone', 'شماره تماس', true, 8),
    q('job_title', 'شغل / سمت', false, 9),
    q('section_divider', 'مرحله ۳: تکمیلی', false, 10),
    q('number', 'تعداد شرکت‌کنندگان', true, 11, { min: 1, max: 1000 }),
    q('multiple_choice', 'نحوه آشنایی با رویداد', false, 12, { options: [opt('اینستاگرام', 0), opt('وب‌سایت', 1), opt('دوستان', 2), opt('ایمیل', 3), opt('سایر', 4)] }),
    q('consent', 'قوانین رویداد را می‌پذیرم.', true, 13, { consentText: 'قوانین و مقررات رویداد را مطالعه کرده و می‌پذیرم.' }),
  ];
}

function generateHRQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات شخصی', false, 0),
    q('short_text', 'نام و نام خانوادگی', true, 1),
    q('national_id', 'کد ملی', true, 2),
    q('date', 'تاریخ تولد', true, 3),
    q('gender', 'جنسیت', true, 4),
    q('marital_status', 'وضعیت تاهل', true, 5),
    q('phone', 'شماره موبایل', true, 6),
    q('section_divider', 'مرحله ۲: سوابق شغلی', false, 7),
    q('job_title', 'عنوان شغل فعلی', true, 8),
    q('company', 'شرکت فعلی', true, 9),
    q('date', 'تاریخ شروع به کار', false, 10),
    q('long_text', 'شرح وظایف', false, 11, { placeholder: 'شرح مختصری از وظایف' }),
    q('range', 'رضایت شغلی (از ۱ تا ۱۰)', false, 12, { min: 1, max: 10, step: 1, unit: 'از ۱۰' }),
    q('section_divider', 'مرحله ۳: ارزیابی عملکرد', false, 13),
    q('scale', 'عملکرد کلی', true, 14, { scaleMin: 1, scaleMax: 5, scaleMinLabel: 'ضعیف', scaleMaxLabel: 'عالی' }),
    q('long_text', 'نقاط قوت و قابل بهبود', false, 15),
    q('nps', 'احتمال پیشنهاد شرکت به دیگران', false, 16),
    q('consent', 'اطلاعات صحیح است.', true, 17),
  ];
}

function generateFinanceQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات هویتی', false, 0),
    q('short_text', 'نام و نام خانوادگی', true, 1),
    q('national_id', 'کد ملی', true, 2),
    q('phone', 'شماره موبایل', true, 3),
    q('email', 'ایمیل', false, 4),
    q('section_divider', 'مرحله ۲: اطلاعات مالی', false, 5),
    q('job_title', 'شغل', true, 6),
    q('company', 'نام محل کار', true, 7),
    q('number', 'درآمد ماهانه (میلیون تومان)', true, 8, { min: 0, max: 500, step: 1 }),
    q('multiple_choice', 'نوع درخواست', true, 9, { options: [opt('افتتاح حساب', 0), opt('وام', 1), opt('کارت اعتباری', 2), opt('سرمایه‌گذاری', 3), opt('سایر', 4)] }),
    q('iban', 'شماره شبا', false, 10),
    q('section_divider', 'مرحله ۳: تکمیلی', false, 11),
    q('address', 'آدرس محل سکونت', true, 12),
    q('postal_code', 'کد پستی', true, 13),
    q('consent', 'قوانین و مقررات را می‌پذیرم.', true, 14, { consentText: 'قوانین بانکی و مقررات حریم خصوصی را مطالعه و می‌پذیرم.' }),
  ];
}

function generateDefaultQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات شخصی', false, 0),
    q('short_text', 'نام و نام خانوادگی', true, 1),
    q('phone', 'شماره تماس', true, 2),
    q('email', 'ایمیل', false, 3),
    q('section_divider', 'مرحله ۲: اطلاعات فرم', false, 4),
    q('long_text', 'توضیحات', true, 5, { placeholder: 'لطفاً جزئیات را شرح دهید' }),
    q('multiple_choice', 'اولویت درخواست', false, 6, { options: [opt('عادی', 0), opt('فوری', 1), opt('فوق‌العاده فوری', 2)] }),
    q('rating', 'رضایت کلی', false, 7),
    q('consent', 'اطلاعات صحیح است.', true, 8),
  ];
}

function generateSurveyQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات عمومی', false, 0),
    q('short_text', 'نام (اختیاری)', false, 1),
    q('multiple_choice', 'گروه سنی', true, 2, { options: [opt('زیر ۱۸ سال', 0), opt('۱۸-۲۵', 1), opt('۲۶-۳۵', 2), opt('۳۶-۴۵', 3), opt('بالای ۴۵', 4)] }),
    q('gender', 'جنسیت', false, 3, { genders: ['مرد', 'زن', 'ترجیح می‌دهم نگویم'] }),
    q('section_divider', 'مرحله ۲: نظرسنجی', false, 4),
    q('scale', 'میزان رضایت کلی', true, 5, { scaleMin: 1, scaleMax: 10, scaleMinLabel: 'کم', scaleMaxLabel: 'زیاد' }),
    q('nps', 'احتمال توصیه به دیگران', true, 6),
    q('long_text', 'نظرات و پیشنهادات', false, 7),
    q('section_divider', 'مرحله ۳: نهایی', false, 8),
    q('emoji_rating', 'امتیاز کلی تجربه', false, 9),
    q('consent', 'اطلاعات صحیح است.', true, 10),
  ];
}

function generateOrderQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: اطلاعات سفارش', false, 0),
    q('multiple_choice', 'نوع محصول/خدمت', true, 1, { options: [opt('محصول فیزیکی', 0), opt('خدمات دیجیتال', 1), opt('مشاوره', 2), opt('آموزش', 3)] }),
    q('long_text', 'شرح سفارش', true, 2, { placeholder: 'جزئیات سفارش خود را وارد کنید' }),
    q('number', 'تعداد', true, 3, { min: 1, max: 100 }),
    q('section_divider', 'مرحله ۲: اطلاعات ارسال', false, 4),
    q('short_text', 'نام و نام خانوادگی', true, 5),
    q('phone', 'شماره تماس', true, 6),
    q('address', 'آدرس تحویل', true, 7),
    q('postal_code', 'کد پستی', true, 8),
    q('section_divider', 'مرحله ۳: پرداخت', false, 9),
    q('multiple_choice', 'روش پرداخت', true, 10, { options: [opt('آنلاین', 0), opt('کارت به کارت', 1), opt('پرداخت در محل', 2)] }),
    q('consent', 'شرایط و ضوابط فروش را می‌پذیرم.', true, 11),
  ];
}

// ── Category to generator mapping ──────────────────────────────────────────────

const categoryGenerators: Record<string, (title: string) => FormQuestion[]> = {
  health: generateMedicalQuestions,
  education: generateEducationQuestions,
  event: generateEventQuestions,
  hr: generateHRQuestions,
  survey: generateSurveyQuestions,
  registration: generateEducationQuestions,
  feedback: generateSurveyQuestions,
  evaluation: generateHRQuestions,
  order: generateOrderQuestions,
  other: generateDefaultQuestions,
  finance: generateFinanceQuestions,
};

// ── API handler ────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  // Load metadata to find category and name
  const { specializedFormsMeta } = await import('@/lib/specialized-forms-meta');
  const meta = specializedFormsMeta.find((f) => f.id === id);

  if (!meta) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const generator = categoryGenerators[meta.category] || generateDefaultQuestions;
  const questions = generator(meta.name);

  // Ensure unique IDs with timestamp
  const timestamp = Date.now();
  const finalQuestions = questions.map((question, i) => ({
    ...question,
    id: `q-${timestamp}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    order: i,
  }));

  return NextResponse.json({
    success: true,
    data: {
      id: meta.id,
      name: meta.name,
      description: meta.description,
      category: meta.category,
      categoryLabel: meta.categoryLabel,
      icon: meta.icon,
      gradient: meta.gradient,
      questionCount: finalQuestions.length,
      questions: finalQuestions,
    },
  });
}
