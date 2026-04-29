import { writeFileSync } from 'fs';

// Helper to generate unique IDs
let counter = 0;
function uid(): string { return `opt-${++counter}-${Math.random().toString(36).substr(2, 6)}`; }
function tid(): string { return `t-${Math.random().toString(36).substr(2, 9)}`; }

type QC = Record<string, unknown>;

function opt(text: string): { id: string; text: string } {
  return { id: uid(), text };
}

function q(type: string, title: string, order: number, required = false, config?: QC): QC {
  return { type, title, required, order, config: config || {} };
}

// All available types
const types = {
  short_text: (title: string, order: number, req?: boolean, cfg?: QC) => q('short_text', title, order, req, cfg),
  long_text: (title: string, order: number, req?: boolean, cfg?: QC) => q('long_text', title, order, req, cfg),
  multiple_choice: (title: string, order: number, opts: string[], req?: boolean) => q('multiple_choice', title, order, req, { options: opts.map(o => opt(o)), allowOther: true }),
  multiple_select: (title: string, order: number, opts: string[], req?: boolean) => q('multiple_select', title, order, req, { options: opts.map(o => opt(o)), allowOther: true }),
  dropdown: (title: string, order: number, opts: string[], req?: boolean) => q('dropdown', title, order, req, { options: opts.map(o => opt(o)) }),
  number: (title: string, order: number, req?: boolean) => q('number', title, order, req, { min: 0, max: 100 }),
  email: (title: string, order: number, req?: boolean) => q('email', title, order, req, { placeholder: 'example@email.com' }),
  phone: (title: string, order: number, req?: boolean) => q('phone', title, order, req, { placeholder: '۰۹۱۲۳۴۵۶۷۸۹' }),
  date: (title: string, order: number, req?: boolean) => q('date', title, order, req),
  time: (title: string, order: number, req?: boolean) => q('time', title, order, req),
  url: (title: string, order: number, req?: boolean) => q('url', title, order, req, { placeholder: 'https://' }),
  password: (title: string, order: number, req?: boolean) => q('password', title, order, req),
  color: (title: string, order: number, req?: boolean) => q('color', title, order, req),
  range: (title: string, order: number, min = 0, max = 100, unit = '') => q('range', title, order, false, { min, max, step: 1, unit }),
  address: (title: string, order: number, req?: boolean) => q('address', title, order, req),
  postal_code: (title: string, order: number, req?: boolean) => q('postal_code', title, order, req),
  national_id: (title: string, order: number, req?: boolean) => q('national_id', title, order, req),
  iban: (title: string, order: number, req?: boolean) => q('iban', title, order, req),
  website: (title: string, order: number, req?: boolean) => q('website', title, order, req),
  country: (title: string, order: number, req?: boolean) => q('country', title, order, req),
  city: (title: string, order: number, req?: boolean) => q('city', title, order, req),
  education: (title: string, order: number, req?: boolean) => q('education', title, order, req),
  gender: (title: string, order: number, req?: boolean) => q('gender', title, order, req),
  marital_status: (title: string, order: number, req?: boolean) => q('marital_status', title, order, req),
  job_title: (title: string, order: number, req?: boolean) => q('job_title', title, order, req),
  company: (title: string, order: number, req?: boolean) => q('company', title, order, req),
  scale: (title: string, order: number, min = 1, max = 5, minL = 'کم', maxL = 'زیاد') => q('scale', title, order, false, { scaleMin: min, scaleMax: max, scaleMinLabel: minL, scaleMaxLabel: maxL }),
  rating: (title: string, order: number, req?: boolean) => q('rating', title, order, req),
  yes_no: (title: string, order: number, req?: boolean) => q('yes_no', title, order, req),
  file_upload: (title: string, order: number, req?: boolean) => q('file_upload', title, order, req),
  statement: (title: string, order: number) => q('statement', title, order, false),
  section_divider: (title: string, order: number, desc?: string) => q('section_divider', title, order, false, { description: desc || '' }),
  matrix: (title: string, order: number, rows: string[], cols: string[]) => q('matrix', title, order, false, { matrixRows: rows, matrixCols: cols }),
  image_choice: (title: string, order: number) => q('image_choice', title, order, false, { imageOptions: [opt('گزینه ۱'), opt('گزینه ۲')] }),
  emoji_rating: (title: string, order: number, req?: boolean) => q('emoji_rating', title, order, req),
  nps: (title: string, order: number, req?: boolean) => q('nps', title, order, req),
  ranking: (title: string, order: number, items: string[]) => q('ranking', title, order, false, { rankItems: items }),
  thumbs_up_down: (title: string, order: number, req?: boolean) => q('thumbs_up_down', title, order, req),
  consent: (title: string, order: number, text?: string) => q('consent', title, order, true, { consentText: text || 'من شرایط و ضوابط را می‌پذیرم.' }),
  signature: (title: string, order: number) => q('signature', title, order),
  captcha: (title: string, order: number) => q('captcha', title, order, true),
  datetime: (title: string, order: number, req?: boolean) => q('datetime', title, order, req),
};

// Template generator
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  icon: string;
  gradient: string;
  questionCount: number;
  questions: QC[];
}

const icons = ['SmilePlus','TrendingUp','BarChart2','Award','DollarSign','Users','Share2','Mail','FileText','ClipboardList','MessageSquare','Star','Heart','BookOpen','GraduationCap','Stethoscope','Calendar','Briefcase','Building2','Globe','Settings','ShoppingCart','Gift','Camera','Music','Utensils','Car','Plane','Home','Shield','Zap','Brain','Palette','Code','Truck','Factory','Landmark','Pill','Baby','Dumbbell','Coffee','Pizza','Flower2','Sparkles','Target','Trophy','Flag','Megaphone','Headphones','Monitor','Smartphone','Database','Server','Cloud','Lock','Key','Map','MapPin','Clock','Timer','FileCheck','FilePlus','UserCheck','UserPlus','UsersRound','Wallet','CreditCard','Receipt','Package','Box','Archive','FolderOpen','FileSearch','Filter','SortAsc','PieChart','Activity','Thermometer','Scale'];
const gradients = ['from-rose-400 to-orange-400','from-violet-400 to-purple-500','from-fuchsia-400 to-pink-500','from-emerald-400 to-green-500','from-amber-400 to-yellow-500','from-cyan-400 to-blue-500','from-indigo-400 to-blue-600','from-teal-400 to-emerald-500','from-sky-400 to-blue-500','from-pink-400 to-rose-500','from-orange-400 to-red-500','from-lime-400 to-green-500','from-red-400 to-rose-600','from-purple-400 to-indigo-500','from-yellow-400 to-orange-500'];

function pick(arr: string[]): string { return arr[Math.floor(Math.random() * arr.length)]; }
function pickGradient(): string { return pick(gradients); }
function pickIcon(): string { return pick(icons); }

const templates: Template[] = [];

function addTemplate(name: string, desc: string, cat: string, catLabel: string, questions: QC[], icon?: string, gradient?: string) {
  templates.push({
    id: tid(),
    name,
    description: desc,
    category: cat,
    categoryLabel: catLabel,
    icon: icon || pickIcon(),
    gradient: gradient || pickGradient(),
    questionCount: questions.length,
    questions: questions.map((q, i) => ({ ...q, order: i })),
  });
}

// ===== 1. SURVEY TEMPLATES (150) =====
const surveySubjects = [
  ['رضایت مشتریان از خدمات آنلاین', 'survey', 'نظرسنجی', 'سنجش رضایت مشتریان از پلتفرم آنلاین', [
    types.rating('به طور کلی از خدمات ما راضی هستید؟', 0, true),
    types.multiple_choice('چقدر احتمال دارد خدمات ما را پیشنهاد دهید؟', 1, ['حتماً', 'احتمالاً', 'مطمئن نیستم', 'احتمالاً نه', 'به هیچ وجه']),
    types.scale('کیفیت پاسخگویی پشتیبانی', 2, 1, 5, 'خیلی کند', 'خیلی سریع'),
    types.multiple_select('کدام ویژگی‌ها را بیشتر دوست دارید؟', 3, ['رابط کاربری', 'سرعت', 'قیمت', 'تنوع خدمات', 'پشتیبانی']),
    types.long_text('چه پیشنهادی برای بهبود دارید؟', 4),
  ]],
  ['نظرسنجی شناخت برند', 'survey', 'نظرسنجی', 'اندازه‌گیری آگاهی از برند در میان مخاطبان', [
    types.multiple_choice('آیا با برند ما آشنا هستید؟', 0, ['بله بسیار', 'تا حدودی', 'فقط نام را شنیده‌ام', 'خیر'], true),
    types.multiple_select('از چه طریقی با ما آشنا شدید؟', 1, ['شبکه‌های اجتماعی', 'جستجوی اینترنت', 'تبلیغات', 'معرفی دوستان', 'مجلات']),
    types.emoji_rating('احساس شما نسبت به برند ما', 2, true),
    types.nps('چقدر احتمال دارد ما را پیشنهاد دهید؟', 3, true),
    types.short_text('اولین چیزی که با شنیدن نام ما به ذهنتان می‌رسد', 4),
  ]],
  // Generate more surveys programmatically
];

addTemplate(...surveySubjects[0]);
addTemplate(...surveySubjects[1]);

// Survey: Market Research variants
const surveyDomains = ['فناوری اطلاعات', 'خرده‌وفروشی', 'آموزش', 'سلامت و درمان', 'سرگرمی', 'ورزش', 'غذا و رستوران', 'مد و پوشاک', 'سفر و گردشگری', 'خودرو', 'املاک', 'بورس و سرمایه‌گذاری', 'بانکداری', 'بیمه', 'کشاورزی', 'صنعت', 'انرژی', 'موبایل و اپلیکیشن', 'هوش مصنوعی', 'بازی‌های دیجیتال', 'لوازم خانگی', 'آرایشی و بهداشتی', 'کتاب و انتشارات', 'موسیقی', 'فیلم و سینما', 'ورزش الکترونیک', 'حیوانات خانگی', 'باغبانی', 'آشپزی', 'عکاسی', 'طراحی گرافیک', 'برنامه‌نویسی', 'نرم‌افزار', 'سخت‌افزار', 'شبکه‌های اجتماعی', 'ایمیل مارکتینگ', 'سئو', 'تولید محتوا', 'ویدیو', 'پادکست', 'وبلاگ', 'فروشگاه آنلاین', 'دراپ‌شیپینگ', 'استارتاپ'];

for (let i = 0; i < 40; i++) {
  const domain = surveyDomains[i];
  addTemplate(`تحقیقات بازار - ${domain}`, `شناخت بازار و نیازهای مشتریان در حوزه ${domain}`, 'survey', 'نظرسنجی', [
    types.multiple_choice(`گروه سنی شما`, 0, ['زیر ۱۸', '۱۸-۲۵', '۲۶-۳۵', '۳۶-۴۵', 'بالای ۴۵'], true),
    types.gender('جنسیت', 1, true),
    types.education('تحصیلات', 2),
    types.job_title('شغل فعلی', 3),
    types.multiple_choice(`چقدر در حوزه ${domain} فعالیت دارید؟`, 4, ['حرفه‌ای', 'نیمه‌حرفه‌ای', 'مبتدی', 'فقط مصرف‌کننده']),
    types.multiple_select(`کدام پلتفرم‌های ${domain} استفاده می‌کنید؟`, 5, ['پلتفرم ۱', 'پلتفرم ۲', 'پلتفرم ۳', 'سایر']),
    types.range(`بودجه ماهانه شما برای ${domain}`, 6, 0, 50000000, 'تومان'),
    types.emoji_rating(`رضایت از خدمات ${domain}`, 7, true),
    types.rating(`کیفیت کلی خدمات ${domain}`, 8, true),
    types.yes_no(`آیا خدمات ${domain} را به دیگران پیشنهاد می‌دهید؟`, 9),
    types.long_text(`بزرگترین مشکل شما در حوزه ${domain} چیست؟`, 10),
    types.dropdown(`چقدر حاضرید برای خدمات بهتر ${domain} هزینه کنید؟`, 11, ['بسیار کم', 'متوسط', 'زیاد', 'بسیار زیاد']),
  ]);
}

// Survey: Customer satisfaction variants
const satContexts = ['رستوران', 'هتل', 'فرودگاه', 'بیمارستان', 'دانشگاه', 'بانک', 'شرکت اینترنتی', 'اپلیکیشن موبایل', 'فروشگاه زنجیره‌ای', 'خدمات پستی', 'خدمات حمل و نقل', 'آژانس مسافرتی', 'باشگاه ورزشی', 'سالن زیبایی', 'آموزشگاه زبان', 'مدرسه', 'داروخانه', 'کلینیک دندانپزشکی', 'خدمات نظافت منزل', 'تعمیرات خودرو', 'خدمات حقوقی', 'مشاوره تحصیلی', 'کتابخانه', 'سینما', 'تئاتر', 'موزه'];

for (let i = 0; i < 30; i++) {
  const ctx = satContexts[i];
  addTemplate(`رضایت مشتریان - ${ctx}`, `سنجش رضایت مشتریان از خدمات ${ctx}`, 'survey', 'نظرسنجی', [
    types.rating(`رضایت کلی از ${ctx}`, 0, true),
    types.scale(`کیفیت خدمات ${ctx}`, 1, 1, 10, 'خیلی بد', 'عالی'),
    types.yes_no(`آیا ${ctx} را دوباره انتخاب می‌کنید؟`, 2, true),
    types.multiple_choice(`عامل اصلی مراجعه شما به ${ctx}`, 3, ['توصیه', 'تبلیغات', 'جستجوی اینترنت', 'تجربه قبلی', 'قیمت مناسب', 'موقعیت مکانی']),
    types.nps(`چقدر احتمال دارد ${ctx} را پیشنهاد دهید؟`, 4),
    types.multiple_select(`نقاط قوت ${ctx}`, 5, ['کیفیت', 'قیمت', 'پرسنل', 'محیط', 'سرعت', 'تنوع']),
    types.multiple_select(`نقاط ضعف ${ctx}`, 6, ['نظافت', 'هزینه', 'زمان انتظار', 'برخورد پرسنل', 'دسترسی']),
    types.thumbs_up_down(`آیا خدمات ${ctx} ارزش پول پرداختی را دارد؟`, 7),
    types.short_text('بهترین ویژگی این مجموعه', 8),
    types.long_text('پیشنهاد برای بهبود', 9),
  ]);
}

// Survey: NPS variants
const npsContexts = ['اپلیکیشن', 'وب‌سایت', 'خدمات مشتریان', 'محصول فیزیکی', 'خدمات دیجیتال', 'اشتراک ویژه', 'خدمات رایگان', 'خدمات پولی', 'پشتیبانی فنی', 'فروش', 'بازاریابی', 'محتوای آموزشی', 'پادکست', 'کانال یوتیوب', 'پیج اینستاگرام', 'گروه تلگرام'];

for (let i = 0; i < 16; i++) {
  const ctx = npsContexts[i];
  addTemplate(`شاخص NPS - ${ctx}`, `سنجش وفاداری مشتریان به ${ctx}`, 'survey', 'نظرسنجی', [
    types.nps(`چقدر احتمال دارد ${ctx} ما را پیشنهاد دهید؟`, 0, true),
    types.multiple_choice('دلیل اصلی امتیاز شما', 1, ['کیفیت بالا', 'قیمت مناسب', 'پشتیبانی عالی', 'راحتی استفاده', 'تنوع', 'سرعت']),
    types.yes_no(`آیا از ${ctx} ما در ماه گذشته استفاده کرده‌اید؟`, 2),
    types.range('مدت زمان استفاده از خدمات ما (ماه)', 3, 1, 120, 'ماه'),
    types.multiple_select('از کدام بخش بیشتر استفاده می‌کنید؟', 4, ['بخش ۱', 'بخش ۲', 'بخش ۳', 'بخش ۴']),
    types.emoji_rating('رضایت کلی', 5),
    types.long_text('بهترین پیشنهاد برای بهبود', 6),
  ]);
}

// Survey: Product feedback
const productTypes = ['گوشی موبایل', 'لپ‌تاپ', 'تبلت', 'هدفون', 'دوربین', 'هدفون بازی', 'کنسول بازی', 'هندزفری', 'ساعت هوشمند', 'هدفون پوشیدنی', 'اسپیکر بلوتوث', 'هدست بندی', 'شارژر', 'کیبورد', 'ماوس', 'مانیتور', 'پرینتر', 'اسکنر', 'روتر', 'هارد اکسترنال', 'فلش مموری', 'پاوربانک', 'درون', 'رباتیک'];

for (let i = 0; i < 25; i++) {
  const prod = productTypes[i];
  addTemplate(`بازخورد محصول - ${prod}`, `نظر کاربران درباره ${prod}`, 'survey', 'نظرسنجی', [
    types.rating(`رضایت از ${prod}`, 0, true),
    types.multiple_choice(`مدت زمان استفاده از ${prod}`, 1, ['کمتر از ۱ ماه', '۱-۶ ماه', '۶-۱۲ ماه', 'بیش از ۱ سال']),
    types.yes_no(`آیا ${prod} را به دوستان پیشنهاد می‌دهید؟`, 2),
    types.multiple_select(`بهترین ویژگی‌های ${prod}`, 3, ['کیفیت ساخت', 'طراحی', 'عملکرد', 'قیمت', ' batterylife', 'وزن']),
    types.multiple_select(`مشکلات ${prod}`, 4, ['کیفیت', 'عمر باتری', 'سرعت', 'ارگونومی', 'نرم‌افزار', 'قیمت']),
    types.scale('ارزش خرید نسبت به قیمت', 5, 1, 10, 'ارزان', 'ارزشمند'),
    types.thumbs_up_down(`آیا خرید مجدد ${prod} را انجام می‌دهید؟`, 6),
    types.short_text('برند جایگزین مورد نظر', 7),
    types.long_text('پیشنهاد به سازنده', 8),
  ]);
}

// Survey: Social media
const smPlatforms = ['اینستاگرام', 'تلگرام', 'تیک‌تاک', 'لینکدین', 'توییتر', 'یوتیوب', 'آپارات', 'ایتا', 'بله', 'سروش', 'ابی‌پیک', 'نماوا'];

for (let i = 0; i < 12; i++) {
  const plat = smPlatforms[i];
  addTemplate(`نظرسنجی - ${plat}`, `بررسی رفتار کاربران در ${plat}`, 'survey', 'نظرسنجی', [
    types.number('مدت زمان استفاده روزانه (ساعت)', 0, true),
    types.multiple_select('نوع محتوای تولید/مشاهده', 1, ['ویدیو', 'عکس', 'استوری', 'متن', 'پست آموزشی', 'ریلز']),
    types.multiple_choice('هدف اصلی استفاده', 2, ['سرگرمی', 'آموزش', 'تجاری', 'ارتباطات', 'خبری']),
    types.range('رضایت از الگوریتم پیشنهادات', 3, 1, 10),
    types.yes_no('آیا از طریق این پلتفرم خرید کرده‌اید؟', 4),
    types.emoji_rating('رضایت کلی', 5),
    types.long_text('بهترین ویژگی پلتفرم', 6),
  ]);
}

console.log(`Survey templates: ${templates.length}`);

// ===== 2. REGISTRATION TEMPLATES (150) =====
const regContexts = [
  ['ثبت‌نام رویداد', 'ثبت‌نام در رویداد با اطلاعات کامل', 'registration', 'ثبت‌نام', [
    types.short_text('نام و نام خانوادگی', 0, true),
    types.email('ایمیل', 1, true),
    types.phone('شماره تماس', 2, true),
    types.national_id('کد ملی', 3),
    types.gender('جنسیت', 4, true),
    types.education('تحصیلات', 5),
    types.job_title('شغل', 6),
    types.company('سازمان', 7),
    types.address('آدرس', 8),
    types.date('تاریخ تولد', 9),
    types.dropdown('نوع ثبت‌نام', 10, ['حضوری', 'آنلاین', 'هر دو'], true),
    types.long_text('توضیحات تکمیلی', 11),
    types.consent('تایید شرایط شرکت در رویداد', 12),
  ]],
  ['ثبت‌نام دوره آموزشی', 'فرم ثبت‌نام در دوره‌های آموزشی', 'registration', 'ثبت‌نام', [
    types.section_divider('اطلاعات شخصی', 0, 'اطلاعات فردی شما'),
    types.short_text('نام و نام خانوادگی', 1, true),
    types.email('ایمیل', 2, true),
    types.phone('شماره تماس', 3, true),
    types.national_id('کد ملی', 4),
    types.date('تاریخ تولد', 5),
    types.gender('جنسیت', 6),
    types.education('آخرین مدرک تحصیلی', 7, true),
    types.section_divider('اطلاعات دوره', 8, 'انتخاب دوره و نحوه شرکت'),
    types.dropdown('نوع دوره', 9, ['حضوری', 'آنلاین', 'مختلط'], true),
    types.dropdown('سطح دوره', 10, ['مبتدی', 'متوسط', 'پیشرفته']),
    types.multiple_select('زبان‌های آشنایی', 11, ['فارسی', 'انگلیسی', 'عربی', 'فرانسوی', 'آلمانی']),
    types.range('بودجه آموزشی (میلیون تومان)', 12, 0, 100, 'میلیون تومان'),
    types.yes_no('آیا قبلاً دوره مشابه گذرانده‌اید؟', 13),
    types.long_text('اهداف آموزشی', 14),
    types.consent('تایید قوانین آموزشگاه', 15),
  ]],
];

addTemplate(...regContexts[0]);
addTemplate(...regContexts[1]);

const regTypes = [
  ['باشگاه ورزشی', ['فوتبال', 'بسکتبال', 'والیبال', 'شنا', 'تکواندو', 'یوگا', 'بدنسازی', 'آیروبیک', 'کاراته', 'تنیس', 'بدمینتون', 'اسکیت', ' دوچرخه‌سواری', 'روپزی']],
  ['کتابخانه', ['عضو عادی', 'عضو ویژه', 'عضو دانشجویی', 'عضو کودک']],
  ['موزه', ['بزرگسال', 'کودک', 'گروه دانش‌آموزی', 'گروه گردشگری']],
  ['گالری هنری', ['بازدید عادی', 'بازدید VIP', 'خرید اثر هنری', 'شرکت در ورکشاپ']],
  ['سالن زیبایی', ['خدمات مو', 'ناخن', 'پوست', 'میکاپ', 'مانیکور', 'لیزر', 'ماساژ']],
  ['آموزشگاه رانندگی', ['رسمی', 'شبانه', 'ویژه', 'رفع اشکال']],
  ['مهدکودک', ['نوزادی', '۱-۲ ساله', '۲-۳ ساله', '۳-۵ ساله', 'آموزش پیش از مدرسه']],
  ['آموزشگاه زبان', ['انگلیسی', 'فرانسوی', 'آلمانی', 'عربی', 'اسپانیایی', 'ترکی', 'چینی', 'ژاپنی', 'کره‌ای', 'ایتالیایی']],
  ['آموزشگاه موسیقی', ['پیانو', 'گیتار', 'ویولن', 'سه‌تار', 'دف', 'آواز', 'درامز']],
  ['آموزشگاه کامپیوتر', ['برنامه‌نویسی', 'طراحی گرافیک', 'شبکه', 'هوش مصنوعی', 'روبوتیک']],
  ['کلینیک ورزشی', ['فیزیوتراپی', 'طب ورزشی', 'تغذیه', 'کایروپراکتیک']],
  ['آژانس مسافرتی', ['تور داخلی', 'تور خارجی', 'زیارتی', 'تفریحی', 'ورزشی']],
  ['هتل', ['اتاق', 'سوئیت', 'ویلا', 'آپارتمان']],
  ['باشگاه اردویی', ['کمپ تابستانی', 'کمپ زمستانی', 'کمپ بهاره', 'کمپ ویژه']],
  ['آکادمی فوتبال', ['زیر ۷ سال', '۷-۱۰ سال', '۱۰-۱۴ سال', '۱۴-۱۸ سال', 'بزرگسال']],
  ['آموزشگاه آشپزی', ['آشپزی ایرانی', 'آشپزی فرانسوی', 'آشپزی ایتالیایی', 'شیرینی‌پزی', 'نانوایی']],
  ['مدرسه شبانه', ['دبیرستان', 'کنکور', 'آرایش', 'کامپیوتر', 'زبان']],
  ['مرکز مشاوره', ['تحصیلی', 'شغلی', 'روانشناسی', 'حقوقی', 'طبی']],
  ['باشگاه کارآفرینی', ['استارتاپ', 'اشتغال‌آفرینی', 'مدیریت', 'بازاریابی']],
  ['آموزشگاه عکاسی', ['موبایل', 'حرفه‌ای', 'پرتره', 'طبیعت', 'محصول']],
  ['استودیو ضبط', ['موسیقی', 'پادکست', 'ویدیو', 'صداگذاری']],
  ['مجموعه ورزشی', ['باشگاه بدنسازی', 'استخر', 'سالن ورزشی', 'مجموعه آبی']],
  ['خدمات نظافت', ['نظافت منزل', 'نظارت اداری', 'شستشوی فرش', 'خدمات باغبانی']],
  ['شرکت سرویس خودرو', ['تعویض روغن', 'باطری‌سازی', 'برق خودرو', 'لنت گیری', 'شیشه‌گیری']],
  ['مطب خانواده', ['ویزیت در منزل', 'نوبت‌دهی آنلاین', 'مشاوره تلفنی']],
  ['پزشکلی دامپزشکی', ['معاینه', 'واکسیناسیون', 'جراحی', 'ارتودنسی', 'دامپزشکی زیبایی']],
];

for (const [context, subtypes] of regTypes) {
  for (const subtype of subtypes) {
    addTemplate(`ثبت‌نام ${context} - ${subtype}`, `فرم ثبت‌نام ${subtype} در ${context}`, 'registration', 'ثبت‌نام', [
      types.section_divider('اطلاعات شخصی', 0, 'لطفاً اطلاعات خود را وارد کنید'),
      types.short_text('نام و نام خانوادگی', 1, true),
      types.email('ایمیل', 2, true),
      types.phone('شماره تماس', 3, true),
      types.national_id('کد ملی', 4),
      types.date('تاریخ تولد', 5),
      types.gender('جنسیت', 6),
      types.address('آدرس کامل', 7),
      types.postal_code('کد پستی', 8),
      types.section_divider('اطلاعات تکمیلی', 9, 'سایر اطلاعات مورد نیاز'),
      types.job_title('شغل', 10),
      types.company('محل کار', 11),
      types.education('تحصیلات', 12),
      types.multiple_choice(`نوع خدمات ${subtype}`, 13, subtypes.slice(0, 4), true),
      types.yes_no('آیا تجربه قبلی دارید؟', 14),
      types.range('بودجه مورد نظر (میلیون تومان)', 15, 0, 500, 'میلیون'),
      types.short_text('کد تخفیف (در صورت وجود)', 16),
      types.long_text('توضیحات یا سؤال', 17),
      types.consent('تایید شرایط و ضوابط', 18),
    ]);
  }
}

console.log(`Total templates so far: ${templates.length}`);

