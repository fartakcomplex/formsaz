<div align="center" dir="rtl">

# 🇮🇷 فرمساز (FormSaz)

**ابزار حرفه‌ای ساخت فرم آنلاین فارسی با رابط کاربری RTL**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

## ✨ ویژگی‌ها

### 🏗️ فرم‌ساز پیشرفته
- **۱۷ نوع سؤال**: متن کوتاه، متن بلند، چندگزینه‌ای، چک‌باکس، دراپ‌داون، عدد، ایمیل، تلفن، تاریخ، مقیاس، امتیازدهی، بله/خیر، فایل، انتخاب تصویری، متن اطلاعاتی، ماتریسی
- **بخش‌بندی فرم‌ها**: دسته‌بندی سؤالات در بخش‌های مجزا
- **منطق شرطی**: نمایش/مخفی سؤالات بر اساس پاسخ‌ها
- **درگ‌اند‌دراپ**: مرتب‌سازی سؤالات با کشیدن و رها کردن
- **تاریخ انقضا**: تنظیم تاریخ انقضا برای فرم‌ها

### 📊 داشبورد تحلیلی
- آمار کلی فرم‌ها، پاسخ‌ها و بازدیدها با نمودارهای تعاملی
- نمودار فعالیت هفتگی
- فید فعالیت‌ها
- بینش فرم‌ها (Form Insights) با تحلیل ترکیب سؤالات
- جستجو، فیلتر و مرتب‌سازی فرم‌ها

### 🎨 طراحی و ظاهر
- **کاملاً RTL و فارسی**
- **Glassmorphism** در تمام بخش‌ها
- **حالت تاریک/روشن** با پشتیبانی کامل
- انیمیشن‌های **Framer Motion**
- ریسپانسیو برای موبایل و دسکتاپ

### 🔗 اشتراک‌گذاری
- اشتراک لینک مستقیم
- **QR Code** تولید خودکار
- اشتراک از طریق تلگرام، واتساپ و ایمیل

### 📋 مدیریت کاربران
- پنل کاربری با پروفایل، فرم‌ها، فعالیت‌ها، اعلان‌ها و تنظیمات
- پنل مدیریت با آمار، کاربران، فرم‌ها و تنظیمات

### 📥 خروجی
- خروجی JSON فرم‌ها
- وارد کردن فرم از JSON
- نمودارهای تحلیلی نتایج
- جدول داده پاسخ‌ها

---

## 🛠️ تکنولوژی‌ها

| تکنولوژی | نسخه | نقش |
|---|---|---|
| Next.js | 16 | فریمورک React |
| TypeScript | 5 | زبان برنامه‌نویسی |
| Tailwind CSS | 4 | استایل‌دهی |
| shadcn/ui | - | کامپوننت‌ها |
| Framer Motion | 12 | انیمیشن |
| Zustand | 5 | مدیریت State |
| Prisma | 6 | ORM دیتابیس |
| Recharts | 2 | نمودارها |
| Lucide Icons | - | آیکون‌ها |

---

## 🚀 شروع به کار

### پیش‌نیازها
- Node.js 18+
- Bun یا npm

### نصب و اجرا

```bash
# کلون کردن مخزن
git clone https://github.com/fartakcomplex/formsaz.git
cd formsaz

# نصب وابستگی‌ها
bun install

# تنظیم دیتابیس
bun run db:push

# اجرای سرور توسعه
bun run dev
```

سایت در `http://localhost:3000` در دسترس خواهد بود.

### بیلد پروDUCTION

```bash
bun run build
bun run start
```

---

## 📁 ساختار پروژه

```
formsaz/
├── prisma/               # طرح دیتابیس
│   └── schema.prisma
├── src/
│   ├── app/              # مسیرهای Next.js App Router
│   │   ├── page.tsx      # صفحه اصلی
│   │   ├── layout.tsx    # لایه اصلی
│   │   └── globals.css   # استایل‌های سراسری
│   ├── components/
│   │   ├── landing/      # صفحه فرود
│   │   ├── dashboard/    # داشبورد، فرم‌ساز، نمایش فرم، نتایج
│   │   ├── form-builder/ # ادیتور فرم
│   │   ├── admin/        # پنل مدیریت
│   │   ├── user-panel/   # پنل کاربری
│   │   └── ui/           # کامپوننت‌های shadcn/ui
│   ├── lib/
│   │   ├── store.ts      # Zustand store
│   │   └── db.ts         # Prisma client
│   └── middleware.ts     # Middleware
├── public/               # فایل‌های استاتیک
└── package.json
```

---

## 📄 لایسنس

این پروژه تحت لایسنس **MIT** منتشر شده است.

<div align="center">
ساخته شده با ❤️ توسط [فرتاک کمپلکس](https://github.com/fartakcomplex)
</div>
