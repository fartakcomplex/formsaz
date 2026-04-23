'use client';

import React from 'react';
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
  Minus as SectionMinus,
  Heading,
  Info,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore, FormQuestion } from '@/lib/store';
import { cn } from '@/lib/utils';

interface QuestionTypeItem {
  type: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

const categoryColors: Record<string, { gradient: string; dotColor: string; darkGradient: string }> = {
  'متن': { gradient: 'from-violet-500/10 to-purple-500/10', dotColor: 'bg-violet-500', darkGradient: 'from-violet-500/15 to-purple-500/15' },
  'انتخاب': { gradient: 'from-emerald-500/10 to-teal-500/10', dotColor: 'bg-emerald-500', darkGradient: 'from-emerald-500/15 to-teal-500/15' },
  'ورودی': { gradient: 'from-amber-500/10 to-orange-500/10', dotColor: 'bg-amber-500', darkGradient: 'from-amber-500/15 to-orange-500/15' },
  'ارزیابی': { gradient: 'from-fuchsia-500/10 to-pink-500/10', dotColor: 'bg-fuchsia-500', darkGradient: 'from-fuchsia-500/15 to-pink-500/15' },
  'متفرقه': { gradient: 'from-gray-500/10 to-slate-500/10', dotColor: 'bg-gray-500', darkGradient: 'from-gray-500/15 to-slate-500/15' },
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
  };
  return titles[type] || 'سؤال جدید';
}

interface QuestionTypesProps {
  collapsed?: boolean;
}

export default function QuestionTypes({ collapsed = false }: QuestionTypesProps) {
  const { questions, addQuestion } = useAppStore();

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
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-foreground">نوع سؤال</h3>
        <p className="text-xs text-muted-foreground mt-0.5">برای افزودن کلیک کنید</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="sidebar-scroll-fade py-2">
          {categories.map((category, catIdx) => {
            const items = questionTypes.filter((qt) => qt.category === category);
            const colors = categoryColors[category] || categoryColors['متفرقه'];
            return (
              <div key={category}>
                {catIdx > 0 && <Separator className="my-2 mx-4" />}
                {/* Category header with gradient background */}
                <div className={cn(
                  'mx-2 rounded-lg px-3 py-1.5',
                  'bg-gradient-to-l from-violet-500/[0.07] to-purple-500/[0.04] dark:from-violet-500/[0.10] dark:to-purple-500/[0.06]',
                  'border border-transparent'
                )}>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 flex items-center gap-2">
                    <span className={cn(
                      'w-2 h-2 rounded-full shrink-0',
                      colors.dotColor
                    )} />
                    {category}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-0.5 px-2">
                  {items.map((qt) => (
                    <Tooltip key={qt.type}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleAddQuestion(qt.type)}
                          className={cn(
                            'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-right transition-all duration-200 ease-out',
                            'hover:scale-[1.02] hover:shadow-md hover:border-violet-200 dark:hover:border-violet-800',
                            'dark:hover:border-violet-800/60',
                            'active:scale-[0.98]',
                            'border border-transparent hover:border-violet-200 dark:hover:border-violet-800/60'
                          )}
                        >
                          <div className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                            'bg-muted/60 text-muted-foreground transition-all duration-200',
                            'group-hover:bg-violet-100 group-hover:text-violet-600',
                            'dark:group-hover:bg-violet-900 dark:group-hover:text-violet-400',
                            'group-hover:shadow-sm'
                          )}>
                            {qt.icon}
                          </div>
                          {/* Colored category dot indicator */}
                          <span className={cn(
                            'w-1.5 h-1.5 rounded-full shrink-0 transition-transform duration-200',
                            colors.dotColor,
                            'opacity-60 group-hover:opacity-100'
                          )} />
                          <span className="text-sm font-medium">{qt.label}</span>
                          {/* Info icon */}
                          <Info className="size-3 ml-auto text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="left" sideOffset={8} className="max-w-[200px]">
                        <p className="text-sm font-medium">{qt.label}</p>
                        <p className="text-xs text-muted-foreground">{qt.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
