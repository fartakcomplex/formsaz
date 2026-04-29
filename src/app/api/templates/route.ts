import { NextRequest, NextResponse } from 'next/server';
import type { FormQuestion } from '@/lib/store';

// ── Question factory helpers ──────────────────────────────────────────────────

function q(type: string, title: string, required = false, order = 0, config?: Record<string, unknown>): FormQuestion {
  return {
    id: `q-${Date.now()}-${order}-${Math.random().toString(36).slice(2, 6)}`,
    type,
    title,
    required,
    order,
    config: config || {},
  };
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
    q('multiple_choice', 'سابقه بیماری خاص دارید؟', false, 10, { options: [opt('خیر', 0), opt('دیابت', 1), opt('فشار خون', 2), opt('قلبی-عروقی', 3), opt('آسم', 4), opt('آلرژی', 5)].map(o => o), allowOther: true }),
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
    q('multiple_choice', 'نوع درخواست', true, 8, { options: [opt('همکاری', 0), opt('مشاوره', 1), opt('سفارش محصول', 2), opt('پشتیبانی', 3), opt('سایر', 4)].map(o => o) }),
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
    q('multiple_choice', 'نوع رویداد', true, 4, { options: [opt('کنفرانس', 0), opt('همایش', 1), opt('کارگاه', 2), opt('جشنواره', 3), opt('مسابقه', 4), opt('جشن', 5)].map(o => o) }),
    q('section_divider', 'مرحله ۲: اطلاعات ثبت‌نام‌کننده', false, 5),
    q('short_text', 'نام و نام خانوادگی', true, 6),
    q('email', 'ایمیل', true, 7),
    q('phone', 'شماره تماس', true, 8),
    q('job_title', 'شغل / سمت', false, 9),
    q('section_divider', 'مرحله ۳: تکمیلی', false, 10),
    q('number', 'تعداد شرکت‌کنندگان', true, 11, { min: 1, max: 1000 }),
    q('multiple_choice', 'نحوه آشنایی با رویداد', false, 12, { options: [opt('اینستاگرام', 0), opt('وب‌سایت', 1), opt('دوستان', 2), opt('ایمیل', 3), opt('سایر', 4)].map(o => o) }),
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

function generateHealthQuestions(title: string): FormQuestion[] {
  return [
    q('section_divider', 'مرحله ۱: پروفایل سلامت', false, 0),
    q('short_text', 'نام و نام خانوادگی', true, 1),
    q('national_id', 'کد ملی', true, 2),
    q('date', 'تاریخ تولد', true, 3),
    q('gender', 'جنسیت', true, 4),
    q('phone', 'شماره اضطراری', true, 5),
    q('section_divider', 'مرحله ۲: سابقه پزشکی', false, 6),
    q('multiple_choice', 'آیا سابقه بیماری خاص دارید؟', true, 7, { options: [opt('خیر', 0), opt('دیابت', 1), opt('فشار خون', 2), opt('بیماری قلبی', 3), opt('سرطان', 4)].map(o => o), allowOther: true }),
    q('multiple_select', 'داروهای مصرفی فعلی', false, 8, { options: [opt('ندارم', 0), opt('فشار خون', 1), opt('دیابت', 2), opt:'چربی خون', 3), opt('آسم', 4)].map(o => o) }),
    q('yes_no', 'آیا آلرژی دارید؟', false, 9),
    q('long_text', 'شرح آلرژی‌ها', false, 10),
    q('section_divider', 'مرحله ۳: سبک زندگی', false, 11),
    q('multiple_choice', 'سطح فعالیت بدنی', false, 12, { options: [opt('کم‌تحرک', 0), opt('معتدل', 1), opt('فعال', 2), opt('ورزشکار حرفه‌ای', 3)].map(o => o) }),
    q('yes_no', 'سیگار می‌کشید؟', false, 13),
    q('rating', 'رضایت از وضعیت سلامت کلی', false, 14),
    q('consent', 'اطلاعات صحیح است.', true, 15),
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
    q('multiple_choice', 'نوع درخواست', true, 9, { options: [opt('افتتاح حساب', 0), opt('وام', 1), opt('کارت اعتباری', 2), opt('سرمایه‌گذاری', 3), opt('سایر', 4)].map(o => o) }),
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
    q('multiple_choice', 'اولویت درخواست', false, 6, { options: [opt('عادی', 0), opt 'فوری', 1), opt('فوق‌العاده فوری', 2)].map(o => o) }),
    q('rating', 'رضایت کلی', false, 7),
    q('consent', 'اطلاعات صحیح است.', true, 8),
  ];
}

// ── Category to generator mapping ──────────────────────────────────────────────

const categoryGenerators: Record<string, (title: string) => FormQuestion[]> = {
  health: generateMedicalQuestions,
  education: generateEducationQuestions,
  event: generateEventQuestions,
  hr: generateHRQuestions,
  survey: (t) => [...generateDefaultQuestions(t).slice(0, 5), q('scale', 'میزان رضایت کلی', false, 5, { scaleMin: 1, scaleMax: 10, scaleMinLabel: 'کم', scaleMaxLabel: 'زیاد' }), q('nps', 'شاخص توصیه به دیگران', false, 6), ...generateDefaultQuestions(t).slice(7)],
  registration: (t) => [...generateDefaultQuestions(t).slice(0, 6), q('education', 'تحصیلات', false, 6, { educations: ['دیپلم', 'کاردانی', 'کارشناسی', 'کارشناسی ارشد', 'دکتری'] }), q('address', 'آدرس', false, 7), ...generateDefaultQuestions(t).slice(7)],
  feedback: (t) => [...generateDefaultQuestions(t).slice(0, 5), q('emoji_rating', 'امتیاز کلی تجربه', false, 5), q('thumbs_up_down', 'آیا این سرویس را توصیه می‌کنید؟', false, 6), q('long_text', 'پیشنهادات و انتقادات', false, 7), ...generateDefaultQuestions(t).slice(8)],
  evaluation: (t) => [...generateHRQuestions(t).slice(0, 8), q('matrix', 'ارزیابی شایستگی‌ها', false, 8, { matrixRows: ['ارتباطات', 'تیم‌وری', 'رهبری', 'نوآوری'], matrixCols: ['ضعیف', 'متوسط', 'خوب', 'عالی'] }), ...generateHRQuestions(t).slice(9)],
  order: (t) => [...generateBusinessQuestions(t).slice(0, 8), q('number', 'تعداد', true, 8, { min: 1, max: 1000 }), q('address', 'آدرس تحویل', true, 9), q('date', 'تاریخ تحویل مورد نظر', false, 10), q('consent', 'شرایط و ضوابط فروش را می‌پذیرم.', true, 11)],
  other: generateDefaultQuestions,
  finance: generateFinanceQuestions,
  automotive: (t) => [...generateDefaultQuestions(t).slice(0, 4), q('short_text', 'نوع خودرو', true, 4), q('number', 'سال ساخت', false, 5, { min: 1380, max: 1405, step: 1 }), q('range', 'کارکرد (کیلومتر)', false, 6, { min: 0, max: 500000, step: 1000, unit: 'کیلومتر' }), ...generateDefaultQuestions(t).slice(6)],
  realestate: (t) => [...generateDefaultQuestions(t).slice(0, 4), q('multiple_choice', 'نوع ملک', true, 4, { options: [opt('آپارتمان', 0), opt('ویلا', 1), opt('زمین', 2), opt('تجاری', 3), opt('اداری', 4)].map(o => o) }), q('number', 'متراژ (متر مربع)', true, 5, { min: 10, max: 10000 }), q('address', 'محل ملک', true, 6), ...generateDefaultQuestions(t).slice(7)],
  food: (t) => [...generateDefaultQuestions(t).slice(0, 4), q('multiple_choice', 'نوع غذا', true, 4, { options: [opt('ایرانی', 0), opt('فست‌فود', 1), opt('سنتی', 2), opt('کیک و شیرینی', 3)].map(o => o) }), q('number', 'تعداد سفارش', true, 5, { min: 1, max: 100 }), q('address', 'آدرس تحویل', true, 6), q('phone', 'شماره تماس', true, 7), ...generateDefaultQuestions(t).slice(8)],
  tech: (t) => [...generateDefaultQuestions(t).slice(0, 4), q('job_title', 'سمت / تخصص', false, 4), q('website', 'وب‌سایت / پورتفولیو', false, 5), q('multiple_choice', 'فناوری مورد نظر', true, 6, { options: [opt('وب', 0), opt('موبایل', 1), opt('AI/ML', 2), opt('DevOps', 3), opt('بلوچین', 4)].map(o => o) }), ...generateDefaultQuestions(t).slice(7)],
  sports: (t) => [...generateDefaultQuestions(t).slice(0, 4), q('multiple_choice', 'رشته ورزشی', true, 4, { options: [opt('فوتبال', 0), opt('والیبال', 1), opt('بسکتبال', 2), opt('بدنسازی', 3), opt('شنا', 4), opt('سایر', 5)].map(o => o) }), q('scale', 'سطح مهارت', false, 5, { scaleMin: 1, scaleMax: 5, scaleMinLabel: 'مبتدی', scaleMaxLabel: 'حرفه‌ای' }), ...generateDefaultQuestions(t).slice(6)],
  arts: (t) => [...generateDefaultQuestions(t).slice(0, 4), q('multiple_choice', 'حوزه هنری', true, 4, { options: [opt('نقاشی', 0), opt('موسیقی', 1), opt('تئاتر', 2), opt('سینما', 3), opt('عکاسی', 4), opt('طراحی گرافیک', 5)].map(o => o) }), q('website', 'نمونه کار / پورتفولیو', false, 5), q('ranking', 'رتبه‌بندی علاقه‌مندی‌ها', false, 6, { rankItems: ['هنر دیجیتال', 'هنر سنتی', 'آموزش', 'نمایشگاه'] }), ...generateDefaultQuestions(t).slice(7)],
};

// ── API handler ────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const category = searchParams.get('category');

  if (!id && !category) {
    return NextResponse.json({ error: 'Missing id or category parameter' }, { status: 400 });
  }

  // Load metadata
  const { specializedFormsMeta } = await import('@/lib/specialized-forms-meta');
  const meta = id ? specializedFormsMeta.find((f) => f.id === id) : null;

  const formCategory = meta?.category || category || 'other';
  const formTitle = meta?.name || title || 'فرم';

  const generator = categoryGenerators[formCategory] || generateDefaultQuestions;
  const questions = generator(formTitle);

  // Ensure unique IDs
  const timestamp = Date.now();
  const finalQuestions = questions.map((question, i) => ({
    ...question,
    id: `q-${timestamp}-${i}-${Math.random().toString(36).slice(2, 6)}`,
    order: i,
  }));

  return NextResponse.json({
    success: true,
    data: {
      id: meta?.id || id || 'generated',
      name: meta?.name || title || 'فرم',
      description: meta?.description || '',
      category: formCategory,
      categoryLabel: meta?.categoryLabel || '',
      icon: meta?.icon || 'FileText',
      gradient: meta?.gradient || 'from-gray-400 to-gray-500',
      questionCount: finalQuestions.length,
      questions: finalQuestions,
    },
  });
}
