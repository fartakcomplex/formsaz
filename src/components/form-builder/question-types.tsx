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
  icon: React.ReactNode;
  category: string;
}

const questionTypes: QuestionTypeItem[] = [
  { type: 'short_text', label: 'متن کوتاه', icon: <Type className="h-4 w-4" />, category: 'متن' },
  { type: 'long_text', label: 'متن بلند', icon: <AlignRight className="h-4 w-4" />, category: 'متن' },
  { type: 'multiple_choice', label: 'تک انتخابی', icon: <CircleDot className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'multiple_select', label: 'چند انتخابی', icon: <CheckSquare className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'dropdown', label: 'لیست کشویی', icon: <ChevronDown className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'image_choice', label: 'انتخاب تصویری', icon: <ImageIcon className="h-4 w-4" />, category: 'انتخاب' },
  { type: 'matrix', label: 'ماتریس', icon: <LayoutGrid className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'number', label: 'عدد', icon: <Hash className="h-4 w-4" />, category: 'ورودی' },
  { type: 'email', label: 'ایمیل', icon: <Mail className="h-4 w-4" />, category: 'ورودی' },
  { type: 'phone', label: 'تلفن', icon: <Phone className="h-4 w-4" />, category: 'ورودی' },
  { type: 'date', label: 'تاریخ', icon: <Calendar className="h-4 w-4" />, category: 'ورودی' },
  { type: 'scale', label: 'مقیاس', icon: <Minus className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'rating', label: 'امتیازدهی', icon: <Star className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'yes_no', label: 'بله/خیر', icon: <ToggleLeft className="h-4 w-4" />, category: 'ارزیابی' },
  { type: 'file_upload', label: 'آپلود فایل', icon: <Upload className="h-4 w-4" />, category: 'متفرقه' },
  { type: 'statement', label: 'عبارت توضیحی', icon: <FileText className="h-4 w-4" />, category: 'متفرقه' },
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
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950 dark:hover:text-purple-400"
              >
                {qt.icon}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              <p className="text-sm">{qt.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  const categories = ['متن', 'انتخاب', 'ورودی', 'ارزیابی', 'متفرقه'];

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-foreground">نوع سؤال</h3>
        <p className="text-xs text-muted-foreground mt-0.5">برای افزودن کلیک کنید</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {categories.map((category, catIdx) => {
            const items = questionTypes.filter((qt) => qt.category === category);
            return (
              <div key={category}>
                {catIdx > 0 && <Separator className="my-2 mx-4" />}
                <div className="px-4 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-0.5 px-2">
                  {items.map((qt) => (
                    <button
                      key={qt.type}
                      onClick={() => handleAddQuestion(qt.type)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-right transition-all duration-150',
                        'hover:bg-purple-50 hover:text-purple-700',
                        'dark:hover:bg-purple-950/50 dark:hover:text-purple-300',
                        'active:scale-[0.98]'
                      )}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground transition-colors group-hover:bg-purple-100 group-hover:text-purple-600 dark:group-hover:bg-purple-900 dark:group-hover:text-purple-400">
                        {qt.icon}
                      </div>
                      <span className="text-sm font-medium">{qt.label}</span>
                    </button>
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
