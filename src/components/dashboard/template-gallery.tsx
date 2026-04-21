'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SmilePlus,
  CalendarPlus,
  MessageSquareHeart,
  UserCheck,
  Mail,
  BarChart2,
  ShoppingCart,
  GraduationCap,
  X,
  Loader2,
  Layers,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { FormQuestion } from '@/lib/store';
import { useAppStore } from '@/lib/store';

// ── Template categories ──────────────────────────────────────────────────────

type TemplateCategory = 'survey' | 'registration' | 'feedback' | 'evaluation';

interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  categoryLabel: string;
  icon: React.ReactNode;
  gradient: string;
  questionCount: number;
  questions: Omit<FormQuestion, 'id'>[];
}

// ── Helper to create option arrays ───────────────────────────────────────────

const opt = (text: string, index: number) => ({
  id: `opt-${index}`,
  text,
});

// ── Template definitions with real Persian questions ─────────────────────────

const templates: TemplateData[] = [
  // ── a) نظرسنجی رضایت مشتری ──────────────────────────────────────────
  {
    id: 'customer-satisfaction',
    name: 'نظرسنجی رضایت مشتری',
    description: 'سنجش میزان رضایت مشتریان از محصولات و خدمات',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: <SmilePlus className="size-7 text-rose-500" />,
    gradient: 'from-rose-400 to-orange-400',
    questionCount: 5,
    questions: [
      {
        type: 'rating',
        title: 'به طور کلی، چقدر از خدمات ما راضی هستید؟',
        required: true,
        order: 0,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'کاملاً ناراضی',
          scaleMaxLabel: 'کاملاً راضی',
        },
      },
      {
        type: 'multiple_choice',
        title: 'چقدر احتمال دارد که خدمات ما را به دوستانتان پیشنهاد دهید؟',
        required: true,
        order: 1,
        config: {
          options: [
            opt('حتماً پیشنهاد می‌دهم', 0),
            opt('احتمالاً پیشنهاد می‌دهم', 1),
            opt('مطمئن نیستم', 2),
            opt('احتمالاً پیشنهاد نمی‌دهم', 3),
            opt('به هیچ وجه پیشنهاد نمی‌دهم', 4),
          ],
        },
      },
      {
        type: 'multiple_choice',
        title: 'کیفیت محصول/خدمت را چگونه ارزیابی می‌کنید؟',
        required: true,
        order: 2,
        config: {
          options: [
            opt('عالی', 0),
            opt('خوب', 1),
            opt('متوسط', 2),
            opt('ضعیف', 3),
            opt('بسیار ضعیف', 4),
          ],
        },
      },
      {
        type: 'multiple_choice',
        title: 'آیا قصد خرید مجدد دارید؟',
        required: false,
        order: 3,
        config: {
          options: [
            opt('بله، حتماً', 0),
            opt('احتمالاً بله', 1),
            opt('مطمئن نیستم', 2),
            opt('خیر', 3),
          ],
        },
      },
      {
        type: 'long_text',
        title: 'چه پیشنهادی برای بهبود خدمات ما دارید؟',
        required: false,
        order: 4,
        config: {
          placeholder: 'پیشنهاد خود را بنویسید...',
          maxLength: 500,
        },
      },
    ],
  },

  // ── b) فرم ثبت‌نام رویداد ────────────────────────────────────────────
  {
    id: 'event-registration',
    name: 'فرم ثبت‌نام رویداد',
    description: 'ثبت‌نام شرکت‌کنندگان در رویدادها و همایش‌ها',
    category: 'registration',
    categoryLabel: 'فرم ثبت‌نام',
    icon: <CalendarPlus className="size-7 text-violet-500" />,
    gradient: 'from-violet-400 to-purple-500',
    questionCount: 4,
    questions: [
      {
        type: 'short_text',
        title: 'نام و نام خانوادگی',
        required: true,
        order: 0,
        config: {
          placeholder: 'نام کامل خود را وارد کنید',
        },
      },
      {
        type: 'short_text',
        title: 'شماره تلفن همراه',
        required: true,
        order: 1,
        config: {
          placeholder: '۰۹۱۲۳۴۵۶۷۸۹',
          pattern: '^[0-9]{11}$',
        },
      },
      {
        type: 'short_text',
        title: 'ایمیل',
        required: true,
        order: 2,
        config: {
          placeholder: 'example@email.com',
        },
      },
      {
        type: 'multiple_choice',
        title: 'نحوه آشنایی شما با این رویداد',
        required: true,
        order: 3,
        config: {
          options: [
            opt('شبکه‌های اجتماعی', 0),
            opt('ایمیل اطلاع‌رسانی', 1),
            opt('معرفی دوستان', 2),
            opt('جستجوی اینترنتی', 3),
            opt('سایر', 4),
          ],
          allowOther: true,
        },
      },
    ],
  },

  // ── c) نظرسنجی بازخورد محصول ────────────────────────────────────────
  {
    id: 'product-feedback',
    name: 'نظرسنجی بازخورد محصول',
    description: 'جمع‌آوری نظرات کاربران درباره محصول یا خدمت',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: <MessageSquareHeart className="size-7 text-emerald-500" />,
    gradient: 'from-emerald-400 to-teal-500',
    questionCount: 4,
    questions: [
      {
        type: 'multiple_choice',
        title: 'چقدر از این محصول استفاده کرده‌اید؟',
        required: true,
        order: 0,
        config: {
          options: [
            opt('کمتر از یک ماه', 0),
            opt('۱ تا ۳ ماه', 1),
            opt('۳ تا ۶ ماه', 2),
            opt('بیش از ۶ ماه', 3),
          ],
        },
      },
      {
        type: 'rating',
        title: 'کاربردی بودن این محصول را چگونه ارزیابی می‌کنید؟',
        required: true,
        order: 1,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'غیر کاربردی',
          scaleMaxLabel: 'بسیار کاربردی',
        },
      },
      {
        type: 'checkbox',
        title: 'کدام ویژگی‌های محصول را بیشتر دوست دارید؟',
        required: false,
        order: 2,
        config: {
          options: [
            opt('رابط کاربری ساده', 0),
            opt('سرعت بالا', 1),
            opt('پشتیبانی خوب', 2),
            opt('قیمت مناسب', 3),
            opt('امکانات متنوع', 4),
          ],
          multiple: true,
        },
      },
      {
        type: 'long_text',
        title: 'چه ویژگی جدیدی دوست دارید به محصول اضافه شود؟',
        required: false,
        order: 3,
        config: {
          placeholder: 'ویژگی پیشنهادی خود را شرح دهید...',
          maxLength: 500,
        },
      },
    ],
  },

  // ── d) ارزیابی عملکرد کارکنان ──────────────────────────────────────
  {
    id: 'employee-evaluation',
    name: 'ارزیابی عملکرد کارکنان',
    description: 'بررسی عملکرد و شایستگی‌های کارکنان سازمان',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: <UserCheck className="size-7 text-amber-500" />,
    gradient: 'from-amber-400 to-orange-500',
    questionCount: 5,
    questions: [
      {
        type: 'short_text',
        title: 'نام و نام خانوادگی ارزیاب',
        required: true,
        order: 0,
        config: {
          placeholder: 'نام کامل ارزیاب',
        },
      },
      {
        type: 'rating',
        title: 'کیفیت کار و دقت در انجام وظایف',
        required: true,
        order: 1,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'ضعیف',
          scaleMaxLabel: 'عالی',
        },
      },
      {
        type: 'rating',
        title: 'مهارت کار تیمی و همکاری با دیگران',
        required: true,
        order: 2,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'ضعیف',
          scaleMaxLabel: 'عالی',
        },
      },
      {
        type: 'rating',
        title: 'پیشنهاد برای ارتقای شغلی',
        required: true,
        order: 3,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'مخالفم',
          scaleMaxLabel: 'موافقم',
        },
      },
      {
        type: 'long_text',
        title: 'نقاط قوت و حوزه‌های بهبود کارمند',
        required: false,
        order: 4,
        config: {
          placeholder: 'توضیحات تکمیلی خود را وارد کنید...',
          maxLength: 500,
        },
      },
    ],
  },

  // ── e) فرم تماس با ما ────────────────────────────────────────────────
  {
    id: 'contact-us',
    name: 'فرم تماس با ما',
    description: 'فرم ارتباط با مشتریان و دریافت پیام‌ها',
    category: 'feedback',
    categoryLabel: 'بازخورد',
    icon: <Mail className="size-7 text-sky-500" />,
    gradient: 'from-sky-400 to-cyan-500',
    questionCount: 4,
    questions: [
      {
        type: 'short_text',
        title: 'نام و نام خانوادگی',
        required: true,
        order: 0,
        config: {
          placeholder: 'نام کامل خود را وارد کنید',
        },
      },
      {
        type: 'short_text',
        title: 'ایمیل',
        required: true,
        order: 1,
        config: {
          placeholder: 'example@email.com',
        },
      },
      {
        type: 'multiple_choice',
        title: 'موضوع پیام',
        required: true,
        order: 2,
        config: {
          options: [
            opt('سؤال درباره محصول', 0),
            opt('پشتیبانی فنی', 1),
            opt('پیشنهاد و انتقاد', 2),
            opt('درخواست همکاری', 3),
            opt('سایر', 4),
          ],
          allowOther: true,
        },
      },
      {
        type: 'long_text',
        title: 'متن پیام',
        required: true,
        order: 3,
        config: {
          placeholder: 'پیام خود را بنویسید...',
          maxLength: 1000,
        },
      },
    ],
  },

  // ── f) پرسشنامه تحقیقات بازار ───────────────────────────────────────
  {
    id: 'market-research',
    name: 'پرسشنامه تحقیقات بازار',
    description: 'شناخت نیازها و سلیقه بازار هدف',
    category: 'survey',
    categoryLabel: 'نظرسنجی',
    icon: <BarChart2 className="size-7 text-fuchsia-500" />,
    gradient: 'from-fuchsia-400 to-pink-500',
    questionCount: 5,
    questions: [
      {
        type: 'multiple_choice',
        title: 'گروه سنی شما',
        required: true,
        order: 0,
        config: {
          options: [
            opt('زیر ۱۸ سال', 0),
            opt('۱۸ تا ۲۵ سال', 1),
            opt('۲۶ تا ۳۵ سال', 2),
            opt('۳۶ تا ۴۵ سال', 3),
            opt('بالای ۴۵ سال', 4),
          ],
        },
      },
      {
        type: 'multiple_choice',
        title: 'از چه طریقی بیشتر خرید می‌کنید؟',
        required: true,
        order: 1,
        config: {
          options: [
            opt('فروشگاه آنلاین', 0),
            opt('حضوری در فروشگاه', 1),
            opt('تلفنی', 2),
            opt('شبکه‌های اجتماعی', 3),
          ],
        },
      },
      {
        type: 'checkbox',
        title: 'کدام فاکتورها در خرید شما تأثیر بیشتری دارند؟',
        required: false,
        order: 2,
        config: {
          options: [
            opt('قیمت', 0),
            opt('کیفیت', 1),
            opt('برند', 2),
            opt('تخفیف و پیشنهاد ویژه', 3),
            opt('نظرات مشتریان', 4),
            opt('ارسال سریع', 5),
          ],
          multiple: true,
        },
      },
      {
        type: 'rating',
        title: 'چقدر حاضرید برای محصولات با کیفیت بیشتر هزینه کنید؟',
        required: true,
        order: 3,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'اصلاً نه',
          scaleMaxLabel: 'بسیار زیاد',
        },
      },
      {
        type: 'long_text',
        title: 'چه محصول یا خدماتی دوست دارید در بازار وجود داشته باشد؟',
        required: false,
        order: 4,
        config: {
          placeholder: 'ایده یا نیاز خود را بنویسید...',
          maxLength: 500,
        },
      },
    ],
  },

  // ── g) فرم سفارش آنلاین ─────────────────────────────────────────────
  {
    id: 'online-order',
    name: 'فرم سفارش آنلاین',
    description: 'ثبت سفارشات محصولات و خدمات به صورت آنلاین',
    category: 'registration',
    categoryLabel: 'فرم ثبت‌نام',
    icon: <ShoppingCart className="size-7 text-lime-600" />,
    gradient: 'from-lime-400 to-green-500',
    questionCount: 4,
    questions: [
      {
        type: 'short_text',
        title: 'نام و نام خانوادگی',
        required: true,
        order: 0,
        config: {
          placeholder: 'نام گیرنده سفارش',
        },
      },
      {
        type: 'short_text',
        title: 'شماره تلفن همراه',
        required: true,
        order: 1,
        config: {
          placeholder: '۰۹۱۲۳۴۵۶۷۸۹',
          pattern: '^[0-9]{11}$',
        },
      },
      {
        type: 'long_text',
        title: 'آدرس تحویل سفارش',
        required: true,
        order: 2,
        config: {
          placeholder: 'آدرس کامل پستی خود را وارد کنید',
          maxLength: 300,
        },
      },
      {
        type: 'long_text',
        title: 'توضیحات سفارش',
        required: false,
        order: 3,
        config: {
          placeholder: 'مشخصات محصول، تعداد و توضیحات تکمیلی...',
          maxLength: 500,
        },
      },
    ],
  },

  // ── h) ارزیابی دوره آموزشی ──────────────────────────────────────────
  {
    id: 'course-evaluation',
    name: 'ارزیابی دوره آموزشی',
    description: 'سنجش کیفیت دوره‌های آموزشی و مدرسان',
    category: 'evaluation',
    categoryLabel: 'ارزیابی',
    icon: <GraduationCap className="size-7 text-indigo-500" />,
    gradient: 'from-indigo-400 to-blue-500',
    questionCount: 5,
    questions: [
      {
        type: 'rating',
        title: 'به طور کلی، دوره آموزشی را چگونه ارزیابی می‌کنید؟',
        required: true,
        order: 0,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'ضعیف',
          scaleMaxLabel: 'عالی',
        },
      },
      {
        type: 'rating',
        title: 'آیا محتوای دوره کاربردی بود؟',
        required: true,
        order: 1,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'غیر کاربردی',
          scaleMaxLabel: 'بسیار کاربردی',
        },
      },
      {
        type: 'rating',
        title: 'عملکرد مدرس دوره را چگونه ارزیابی می‌کنید؟',
        required: true,
        order: 2,
        config: {
          scaleMin: 1,
          scaleMax: 5,
          scaleMinLabel: 'ضعیف',
          scaleMaxLabel: 'عالی',
        },
      },
      {
        type: 'multiple_choice',
        title: 'آیا این دوره را به دیگران پیشنهاد می‌دهید؟',
        required: true,
        order: 3,
        config: {
          options: [
            opt('حتماً', 0),
            opt('احتمالاً', 1),
            opt('مطمئن نیستم', 2),
            opt('خیر', 3),
          ],
        },
      },
      {
        type: 'long_text',
        title: 'پیشنهاد شما برای بهبود دوره چیست؟',
        required: false,
        order: 4,
        config: {
          placeholder: 'پیشنهادات خود را بنویسید...',
          maxLength: 500,
        },
      },
    ],
  },
];

// ── Category color mapping ───────────────────────────────────────────────────

const categoryColorMap: Record<TemplateCategory, string> = {
  survey: 'bg-rose-100 text-rose-700',
  registration: 'bg-violet-100 text-violet-700',
  feedback: 'bg-emerald-100 text-emerald-700',
  evaluation: 'bg-amber-100 text-amber-700',
};

// ── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// ── TemplateCard ─────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onUse,
  isUsing,
}: {
  template: TemplateData;
  onUse: () => void;
  isUsing: boolean;
}) {
  return (
    <motion.div
      variants={cardVariants}
      layout
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative"
    >
      {/* Gradient border effect on hover */}
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-40"
        style={{
          backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
        }}
      />
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(168,85,247,0.5), rgba(236,72,153,0.5), rgba(249,115,22,0.5))`,
        }}
      />

      <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
        {/* Icon / illustration area */}
        <div
          className={`bg-gradient-to-br ${template.gradient} flex items-center justify-center h-32 relative overflow-hidden`}
        >
          {/* Decorative circles */}
          <div className="absolute -top-6 -left-6 size-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full bg-white/15" />

          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm shadow-md">
            {template.icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 leading-relaxed">
              {template.name}
            </h3>
            <Badge
              variant="secondary"
              className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border-0 font-medium ${categoryColorMap[template.category]}`}
            >
              {template.categoryLabel}
            </Badge>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {template.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-auto">
            <Layers className="size-3.5" />
            <span>{template.questionCount} سؤال</span>
          </div>

          <Button
            onClick={onUse}
            disabled={isUsing}
            className="w-full rounded-xl bg-gradient-to-l from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white shadow-sm text-sm font-medium h-10 mt-1 transition-all"
          >
            {isUsing ? (
              <>
                <Loader2 className="size-4 ml-2 animate-spin" />
                در حال ساخت...
              </>
            ) : (
              'استفاده'
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ── TemplateGallery ──────────────────────────────────────────────────────────

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);
  const { setCurrentForm, setCurrentView, setForms, forms } = useAppStore();

  const filteredTemplates =
    activeTab === 'all'
      ? templates
      : templates.filter((t) => t.category === activeTab);

  const handleUseTemplate = async (template: TemplateData) => {
    try {
      setUsingTemplateId(template.id);

      const questionsPayload = template.questions.map((q, i) => ({
        ...q,
        id: `q-${Date.now()}-${i}`,
        order: i,
      }));

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.name,
          description: template.description,
          questions: questionsPayload,
        }),
      });

      if (res.ok) {
        const newForm = await res.json();
        setForms([newForm, ...forms]);
        setCurrentForm(newForm);
        setCurrentView('builder');
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Failed to create form from template:', err);
    } finally {
      setUsingTemplateId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl border-gray-200 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-gray-50 to-white border-b border-gray-100 px-6 py-5 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                گالری الگوها
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 mt-1">
                از الگوهای آماده استفاده کنید
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full hover:bg-gray-100 size-9"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <Tabs
            dir="rtl"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full justify-start bg-gray-100/80 rounded-xl h-10 p-1 overflow-x-auto">
              <TabsTrigger
                value="all"
                className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4"
              >
                همه
              </TabsTrigger>
              <TabsTrigger
                value="survey"
                className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4"
              >
                نظرسنجی
              </TabsTrigger>
              <TabsTrigger
                value="registration"
                className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4"
              >
                ثبت‌نام
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4"
              >
                بازخورد
              </TabsTrigger>
              <TabsTrigger
                value="evaluation"
                className="rounded-lg text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4"
              >
                ارزیابی
              </TabsTrigger>
            </TabsList>

            {/* Single content area for all tabs - we filter manually */}
            <TabsContent value={activeTab} className="mt-4">
              <div className="overflow-y-auto max-h-[60vh] pb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="grid grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onUse={() => handleUseTemplate(template)}
                        isUsing={usingTemplateId === template.id}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredTemplates.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <Layers className="size-12 text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400">الگویی در این دسته‌بندی یافت نشد</p>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
