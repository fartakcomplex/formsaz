'use client';

import React, { useState } from 'react';
import {
  Type,
  AlignRight,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Hash,
  Mail,
  Phone,
  Calendar,
  Minus,
  Star,
  ToggleLeft,
  Upload,
  FileText,
  ImageIcon,
  LayoutGrid,
  Heading,
  CircleHelp,
  ChevronLeft,
  Clock,
  Link2,
  Lock,
  Palette,
  SlidersHorizontal,
  MapPin,
  CreditCard,
  Landmark,
  Globe,
  Flag,
  Building2,
  GraduationCap,
  User,
  Heart,
  Briefcase,
  Building,
  SmilePlus,
  TrendingUp,
  ArrowUpDown,
  ThumbsUp,
  ShieldCheck,
  PenTool,
  ShieldQuestion,
  CalendarClock,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useAppStore, FormQuestion } from '@/lib/store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionTypeItem {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const categoryAccentColors: Record<string, { border: string; bg: string; text: string; dot: string; hoverBg: string; iconBg: string; iconText: string; darkBorder: string; darkHoverBg: string; darkIconBg: string; darkIconText: string }> = {
  'متن': {
    border: 'border-r-violet-400',
    bg: 'bg-violet-50/40',
    text: 'text-violet-600',
    dot: 'bg-violet-500',
    hoverBg: 'hover:bg-violet-50/80 dark:hover:bg-violet-950/30',
    iconBg: 'group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40',
    iconText: 'group-hover:text-violet-600 dark:group-hover:text-violet-400',
    darkBorder: 'dark:border-r-violet-500',
    darkHoverBg: 'dark:hover:bg-violet-950/30',
    darkIconBg: 'dark:group-hover:bg-violet-900/40',
    darkIconText: 'dark:group-hover:text-violet-400',
  },
  'انتخاب': {
    border: 'border-r-emerald-400',
    bg: 'bg-emerald-50/40',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    hoverBg: 'hover:bg-emerald-50/80 dark:hover:bg-emerald-950/30',
    iconBg: 'group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40',
    iconText: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    darkBorder: 'dark:border-r-emerald-500',
    darkHoverBg: 'dark:hover:bg-emerald-950/30',
    darkIconBg: 'dark:group-hover:bg-emerald-900/40',
    darkIconText: 'dark:group-hover:text-emerald-400',
  },
  'ورودی': {
    border: 'border-r-amber-400',
    bg: 'bg-amber-50/40',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    hoverBg: 'hover:bg-amber-50/80 dark:hover:bg-amber-950/30',
    iconBg: 'group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40',
    iconText: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    darkBorder: 'dark:border-r-amber-500',
    darkHoverBg: 'dark:hover:bg-amber-950/30',
    darkIconBg: 'dark:group-hover:bg-amber-900/40',
    darkIconText: 'dark:group-hover:text-amber-400',
  },
  'ارزیابی': {
    border: 'border-r-fuchsia-400',
    bg: 'bg-fuchsia-50/40',
    text: 'text-fuchsia-600',
    dot: 'bg-fuchsia-500',
    hoverBg: 'hover:bg-fuchsia-50/80 dark:hover:bg-fuchsia-950/30',
    iconBg: 'group-hover:bg-fuchsia-100 dark:group-hover:bg-fuchsia-900/40',
    iconText: 'group-hover:text-fuchsia-600 dark:group-hover:text-fuchsia-400',
    darkBorder: 'dark:border-r-fuchsia-500',
    darkHoverBg: 'dark:hover:bg-fuchsia-950/30',
    darkIconBg: 'dark:group-hover:bg-fuchsia-900/40',
    darkIconText: 'dark:group-hover:text-fuchsia-400',
  },
  'متفرقه': {
    border: 'border-r-slate-400',
    bg: 'bg-slate-50/40',
    text: 'text-slate-600',
    dot: 'bg-slate-500',
    hoverBg: 'hover:bg-slate-50/80 dark:hover:bg-slate-800/30',
    iconBg: 'group-hover:bg-slate-100 dark:group-hover:bg-slate-800/40',
    iconText: 'group-hover:text-slate-600 dark:group-hover:text-slate-400',
    darkBorder: 'dark:border-r-slate-500',
    darkHoverBg: 'dark:hover:bg-slate-800/30',
    darkIconBg: 'dark:group-hover:bg-slate-800/40',
    darkIconText: 'dark:group-hover:text-slate-400',
  },
};

const categoryGradients: Record<string, string> = {
  'متن': 'from-violet-500/8 to-purple-500/4 dark:from-violet-500/12 dark:to-purple-500/6',
  'انتخاب': 'from-emerald-500/8 to-teal-500/4 dark:from-emerald-500/12 dark:to-teal-500/6',
  'ورودی': 'from-amber-500/8 to-orange-500/4 dark:from-amber-500/12 dark:to-orange-500/6',
  'ارزیابی': 'from-fuchsia-500/8 to-pink-500/4 dark:from-fuchsia-500/12 dark:to-pink-500/6',
  'متفرقه': 'from-slate-500/8 to-gray-500/4 dark:from-slate-500/12 dark:to-gray-500/6',
};

const questionTypes: QuestionTypeItem[] = [
  { type: 'short_text', label: 'متن کوتاه', description: 'یک خط پاسخ متنی', icon: <Type className="h-4 w-4" />, category: 'متن' },
  { type: 'long_text', label: 'متن بلند', description: 'پاسخ چند خطی', icon: <AlignRight className="h-4 w-4" />, category: 'متن' },
  { type: 'multiple_choice', label: 'تک انتخابی', description: 'انتخاب یک گزینه', icon: <CircleDot className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'multiple_select', label: 'چند انتخابی', description: 'انتخاب چند گزینه', icon: <CheckSquare className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'dropdown', label: 'لیست کشویی', description: 'لیست انتخابی کشویی', icon: <ChevronDown className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'image_choice', label: 'انتخاب تصویری', description: 'انتخاب با تصویر', icon: <ImageIcon className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'matrix', label: 'ماتریس', description: 'جدول ارزیابی', icon: <LayoutGrid className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'number', label: 'عدد', description: 'ورودی عددی', icon: <Hash className="h-4 w-4" />, category: 'ورودی' },
  { type: 'email', label: 'ایمیل', description: 'آدرس ایمیل', icon: <Mail className="h-4 w-4" />, category: 'ورودی' },
  { type: 'phone', label: 'تلفن', description: 'شماره تلفن', icon: <Phone className="h-4 w-4" />, category: 'ورودی' },
  { type: 'date', label: 'تاریخ', description: 'انتخاب تاریخ', icon: <Calendar className="h-4 w-4" />, category: 'ورودی' },
  { type: 'scale', label: 'مقیاس', description: 'مقیاس عددی', icon: <Minus className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'rating', label: 'امتیازدهی', description: 'امتیاز ستاره‌ای', icon: <Star className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'yes_no', label: 'بله/خیر', description: 'سؤال بله یا خیر', icon: <ToggleLeft className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'file_upload', label: 'آپلود فایل', description: 'بارگذاری فایل', icon: <Upload className="h-4 w-4" />, category: 'متفرقه' },
  { type: 'statement', label: 'عبارت توضیحی', description: 'متن توضیحی', icon: <FileText className="h-4 w-4" />, category: 'متفرقه' },
  { type: 'section_divider', label: 'جداکننده بخش', description: 'تفکیک بخش‌ها', icon: <Heading className="h-4 w-4" />, category: 'متفرقه' },
  // New Input types
  { type: 'time', label: 'ساعت', description: 'انتخاب ساعت', icon: <Clock className="h-4 w-4" />, category: 'ورودی' },
  { type: 'url', label: 'آدرس وب', description: 'ورودی URL', icon: <Link2 className="h-4 w-4" />, category: 'ورودی' },
  { type: 'password', label: 'رمز عبور', description: 'فیلد رمز عبور', icon: <Lock className="h-4 w-4" />, category: 'ورودی' },
  { type: 'color', label: 'انتخاب رنگ', description: 'انتخابگر رنگ', icon: <Palette className="h-4 w-4" />, category: 'ورودی' },
  { type: 'range', label: 'نوار لغزان', description: 'اسلایدر عددی', icon: <SlidersHorizontal className="h-4 w-4" />, category: 'ورودی' },
  { type: 'address', label: 'آدرس', description: 'فیلد آدرس', icon: <MapPin className="h-4 w-4" />, category: 'ورودی' },
  { type: 'postal_code', label: 'کد پستی', description: 'کد پستی ۱۰ رقمی', icon: <MapPin className="h-4 w-4" />, category: 'ورودی' },
  { type: 'national_id', label: 'کد ملی', description: 'کد ملی ۱۰ رقمی', icon: <CreditCard className="h-4 w-4" />, category: 'ورودی' },
  { type: 'iban', label: 'شماره شبا', description: 'شماره شبا (IR)', icon: <Landmark className="h-4 w-4" />, category: 'ورودی' },
  { type: 'website', label: 'وب‌سایت', description: 'آدرس وب‌سایت', icon: <Globe className="h-4 w-4" />, category: 'ورودی' },
  // New Selection types
  { type: 'country', label: 'کشور', description: 'انتخاب استان', icon: <Flag className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'city', label: 'شهر/استان', description: 'انتخاب شهر', icon: <Building2 className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'education', label: 'تحصیلات', description: 'سطح تحصیلات', icon: <GraduationCap className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'gender', label: 'جنسیت', description: 'انتخاب جنسیت', icon: <User className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'marital_status', label: 'وضعیت تاهل', description: 'وضعیت تأهل', icon: <Heart className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'job_title', label: 'عنوان شغلی', description: 'شغل کاربر', icon: <Briefcase className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'company', label: 'نام شرکت', description: 'نام سازمان', icon: <Building className="h-4 w-4" />, category: 'انتخاب' },
  // New Rating types
  { type: 'emoji_rating', label: 'امتیاز ایموجی', description: 'امتیاز با ایموجی', icon: <SmilePlus className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'nps', label: 'شاخص NPS', description: 'امتیاز ۰ تا ۱۰', icon: <TrendingUp className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'ranking', label: 'رتبه‌بندی', description: 'رتبه‌بندی آیتم‌ها', icon: <ArrowUpDown className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'thumbs_up_down', label: 'انگشت بالا/پایین', description: 'موافق/مخالف', icon: <ThumbsUp className="h-4 w-4" />, category: 'ارزیابی' },
  // New Misc types
  { type: 'consent', label: 'تاییدیه', description: 'تایید و موافقت', icon: <ShieldCheck className="h-4 w-4" />, category: 'متفرقه' },
  { type: 'signature', label: 'امضا', description: 'پد امضا', icon: <PenTool className="h-4 w-4" />, category: 'متفرقه' },
  { type: 'captcha', label: 'کد امنیتی', description: 'کپچای ریاضی', icon: <ShieldQuestion className="h-4 w-4" />, category: 'متفرقه' },
  { type: 'datetime', label: 'تاریخ و ساعت', description: 'تاریخ و ساعت با هم', icon: <CalendarClock className="h-4 w-4" />, category: 'متفرقه' },
];

function getDefaultConfig(type: string): FormQuestion['config'] {
  switch (type) {
    case 'short_text':
      return { placeholder: '', maxLength: 255 };
    case 'long_text':
      return { placeholder: '', maxLength: 5000 };
    case 'multiple_choice':
      return {
        options: [
          { id: crypto.randomUUID(), text: 'گزینه ۱' },
          { id: crypto.randomUUID(), text: 'گزینه ۲' },
          { id: crypto.randomUUID(), text: 'گزینه ۳' },
        ],
        allowOther: false,
      };
    case 'multiple_select':
      return {
        options: [
          { id: crypto.randomUUID(), text: 'گزینه ۱' },
          { id: crypto.randomUUID(), text: 'گزینه ۲' },
          { id: crypto.randomUUID(), text: 'گزینه ۳' },
        ],
        allowOther: false,
      };
    case 'dropdown':
      return {
        options: [
          { id: crypto.randomUUID(), text: 'گزینه ۱' },
          { id: crypto.randomUUID(), text: 'گزینه ۲' },
          { id: crypto.randomUUID(), text: 'گزینه ۳' },
        ],
        allowOther: false,
      };
    case 'number':
      return { min: 0, max: 100, step: 1 };
    case 'email':
      return { placeholder: 'example@email.com' };
    case 'phone':
      return { placeholder: '۰۹۱۲۳۴۵۶۷۸۹' };
    case 'date':
      return {};
    case 'scale':
      return { scaleMin: 1, scaleMax: 5, scaleMinLabel: 'کم', scaleMaxLabel: 'زیاد' };
    case 'rating':
      return {};
    case 'yes_no':
      return {};
    case 'file_upload':
      return {};
    case 'image_choice':
      return {
        imageOptions: [
          { id: crypto.randomUUID(), text: 'گزینه ۱', imageUrl: '' },
          { id: crypto.randomUUID(), text: 'گزینه ۲', imageUrl: '' },
        ],
      };
    case 'matrix':
      return {
        matrixRows: ['آیتم ۱', 'آیتم ۲', 'آیتم ۳'],
        matrixCols: ['ضعیف', 'متوسط', 'خوب', 'عالی'],
      };
    case 'statement':
      return {};
    case 'section_divider':
      return { description: '' };
    case 'time':
      return { placeholder: '' };
    case 'url':
      return { placeholder: 'https://' };
    case 'password':
      return { placeholder: '', minLength: 6 };
    case 'color':
      return {};
    case 'range':
      return { min: 0, max: 100, step: 1, unit: '' };
    case 'address':
      return { placeholder: '' };
    case 'postal_code':
      return { placeholder: '', pattern: '^\\d{10}$', patternMessage: 'کد پستی باید ۱۰ رقم باشد' };
    case 'national_id':
      return { placeholder: '', pattern: '^\\d{10}$', patternMessage: 'کد ملی باید ۱۰ رقم باشد' };
    case 'iban':
      return { placeholder: 'IR' };
    case 'website':
      return { placeholder: 'https://example.com' };
    case 'country':
      return {
        provinces: ['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'آذربایجان شرقی', 'مازندران', 'گیلان', 'کرمان', 'خوزستان', 'سیستان و بلوچستان', 'البرز', 'آذربایجان غربی', 'Markazi', 'هرمزگان', 'گلستان', 'لرستان', 'کردستان', 'همدان', 'چهارمحال و بختیاری', 'بوشهر', 'زنجان', 'سمنان', 'یزد', 'قزوین', 'اردبیل', 'قوم', 'کهگیلویه و بویراحمد', 'خراسان شمالی', 'خراسان جنوبی', 'مرکزی', 'ایلام', 'کرمانشاه', 'سند'],
      };
    case 'city':
      return {};
    case 'education':
      return {
        educations: ['دیپلم', 'کاردانی', 'کارشناسی', 'کارشناسی ارشد', 'دکتری', 'فوق دکتری'],
      };
    case 'gender':
      return {
        genders: ['مرد', 'زن', 'سایر'],
      };
    case 'marital_status':
      return {
        maritalStatuses: ['مجرد', 'متأهل', 'مطلقه', 'همسر فوت‌شده'],
      };
    case 'job_title':
      return { placeholder: '' };
    case 'company':
      return { placeholder: '' };
    case 'emoji_rating':
      return {};
    case 'nps':
      return {};
    case 'ranking':
      return {
        rankItems: ['آیتم ۱', 'آیتم ۲', 'آیتم ۳', 'آیتم ۴'],
      };
    case 'thumbs_up_down':
      return {};
    case 'consent':
      return {
        consentText: 'من شرایط و ضوابط را می‌پذیرم.',
      };
    case 'signature':
      return {};
    case 'captcha':
      return {};
    case 'datetime':
      return {};
    default:
      return {};
  }
}

function getDefaultTitle(type: string): string {
  const titles: Record<string, string> = {
    short_text: 'سؤال متنی کوتاه',
    long_text: 'سؤال متنی بلند',
    multiple_choice: 'سؤال تک انتخابی',
    multiple_select: 'سؤال چند انتخابی',
    dropdown: 'لیست کشویی',
    number: 'سؤال عددی',
    email: 'آدرس ایمیل',
    phone: 'شماره تلفن',
    date: 'تاریخ',
    scale: 'سؤال مقیاسی',
    rating: 'امتیازدهی',
    yes_no: 'سؤال بله/خیر',
    file_upload: 'آپلود فایل',
    statement: 'عنوان بخش',
    section_divider: 'بخش جدید',
    image_choice: 'سؤال انتخاب تصویری',
    matrix: 'سؤال ماتریسی',
    time: 'انتخاب ساعت',
    url: 'آدرس وب',
    password: 'رمز عبور',
    color: 'انتخاب رنگ',
    range: 'نوار لغزان',
    address: 'آدرس',
    postal_code: 'کد پستی',
    national_id: 'کد ملی',
    iban: 'شماره شبا',
    website: 'وب‌سایت',
    country: 'استان',
    city: 'شهر/استان',
    education: 'تحصیلات',
    gender: 'جنسیت',
    marital_status: 'وضعیت تاهل',
    job_title: 'عنوان شغلی',
    company: 'نام شرکت',
    emoji_rating: 'امتیاز ایموجی',
    nps: 'شاخص NPS',
    ranking: 'رتبه‌بندی',
    thumbs_up_down: 'انگشت بالا/پایین',
    consent: 'تاییدیه',
    signature: 'امضا',
    captcha: 'کد امنیتی',
    datetime: 'تاریخ و ساعت',
  };
  return titles[type] || 'سؤال جدید';
}

function toPersianDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

interface QuestionTypesProps {
  collapsed?: boolean;
}

export default function QuestionTypes({ collapsed = false }: QuestionTypesProps) {
  const { questions, addQuestion } = useAppStore();
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const handleAddQuestion = (type: string) => {
    const newQuestion: FormQuestion = {
      id: crypto.randomUUID(),
      type,
      title: getDefaultTitle(type),
      required: false,
      order: questions.length,
      config: getDefaultConfig(type),
    };
    addQuestion(newQuestion);
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        {questionTypes.map((qt) => (
          <Tooltip key={qt.type}>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleAddQuestion(qt.type)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-400 hover:scale-105"
              >
                {qt.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              <p className="text-sm font-medium">{qt.label}</p>
              <p className="text-xs text-muted-foreground">{qt.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  const categories = ['متن', 'انتخاب', 'ورودی', 'ارزیابی', 'متفرقه'];

  return (
    <div className="h-full flex flex-col">
      {/* ===== Enhanced Sidebar Header ===== */}
      <div className="px-4 py-4 border-b border-gray-200/60 dark:border-gray-800/60">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
            نوع سؤال
          </h3>
          <Badge
            variant="secondary"
            className="shrink-0 bg-violet-100/80 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 text-[10px] px-1.5 py-0 gap-0.5 font-semibold"
          >
            <CircleHelp className="h-2.5 w-2.5" />
            {toPersianDigits(String(questions.length))}
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground/70 mt-1 leading-relaxed">
          یک نوع سؤال انتخاب کنید
        </p>
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-violet-300/40 dark:via-violet-700/30 to-transparent" />

      <ScrollArea className="flex-1">
        <div className="sidebar-scroll-fade py-3">
          {categories.map((category, catIdx) => {
            const items = questionTypes.filter((qt) => qt.category === category);
            const colors = categoryAccentColors[category] || categoryAccentColors['متفرقه'];
            const isCollapsed = collapsedCategories[category] ?? false;

            return (
              <div key={category}>
                {catIdx > 0 && (
                  <div className="my-2 mx-4 h-px bg-gradient-to-l from-transparent via-gray-200/80 dark:via-gray-700/40 to-transparent" />
                )}

                {/* ===== Collapsible Category Header ===== */}
                <button
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    'group/cat mx-2 flex w-[calc(100%-1rem)] items-center justify-between rounded-xl px-3 py-2 mb-1',
                    'bg-gradient-to-l transition-all duration-200',
                    categoryGradients[category],
                    'hover:shadow-sm hover:shadow-violet-100/30 dark:hover:shadow-violet-950/20'
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={cn(
                      'w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover/cat:scale-125',
                      colors.dot
                    )} />
                    <span className={cn(
                      'text-[10px] font-bold uppercase tracking-wider',
                      colors.text
                    )}>
                      {category}
                    </span>
                    <span className="text-[9px] text-muted-foreground/50 font-medium">
                      {toPersianDigits(String(items.length))}
                    </span>
                  </span>
                  <motion.div
                    animate={{ rotate: isCollapsed ? 0 : 180 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/40" />
                  </motion.div>
                </button>

                {/* ===== Question Type Buttons ===== */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-0.5 px-2 pb-1">
                        {items.map((qt, idx) => (
                          <motion.div
                            key={qt.type}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15, delay: idx * 0.03 }}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <motion.button
                                  whileHover={{ x: -4 }}
                                  whileTap={{ scale: 0.97 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                  onClick={() => handleAddQuestion(qt.type)}
                                  className={cn(
                                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-right transition-all duration-200 ease-out',
                                    'border border-transparent',
                                    'bg-white/80 dark:bg-zinc-900/50',
                                    colors.hoverBg,
                                    'hover:shadow-md hover:shadow-black/[0.03] dark:hover:shadow-black/20',
                                    'active:scale-[0.98]',
                                    // Colored right border on hover
                                    colors.border, 'dark:' + colors.darkBorder,
                                    'border-r-[3px] border-r-transparent',
                                    'hover:border-r-current',
                                    'hover:border-muted/30 dark:hover:border-muted/30'
                                  )}
                                >
                                  {/* Icon container */}
                                  <div className={cn(
                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                    'bg-muted/50 text-muted-foreground transition-all duration-200',
                                    colors.iconBg, colors.iconText,
                                    'group-hover:shadow-sm'
                                  )}>
                                    {qt.icon}
                                  </div>

                                  {/* Label */}
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-medium block truncate group-hover:text-foreground transition-colors">
                                      {qt.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/60 block truncate">
                                      {qt.description}
                                    </span>
                                  </div>

                                  {/* Plus indicator */}
                                  <motion.div
                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted/40 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                    whileHover={{ scale: 1.15 }}
                                  >
                                    <PlusIcon className="h-3 w-3" />
                                  </motion.div>
                                </motion.button>
                              </TooltipTrigger>
                              <TooltipContent side="left" sideOffset={8} className="max-w-[220px]">
                                <p className="text-sm font-medium">{qt.label}</p>
                                <p className="text-xs text-muted-foreground">{qt.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

/* Plus icon inline */
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
