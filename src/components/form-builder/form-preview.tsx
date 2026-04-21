'use client';

import React, { useCallback } from 'react';
import {
  GripVertical,
  Plus,
  Trash2,
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
} from 'lucide-react';
import { useAppStore, FormQuestion } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

function getQuestionIcon(type: string) {
  const iconMap: Record<string, React.ReactNode> = {
    short_text: <Type className="h-4 w-4" />,
    long_text: <AlignRight className="h-4 w-4" />,
    multiple_choice: <CircleDot className="h-4 w-4" />,
    multiple_select: <CheckSquare className="h-4 w-4" />,
    dropdown: <ChevronDown className="h-4 w-4" />,
    number: <Hash className="h-4 w-4" />,
    email: <Mail className="h-4 w-4" />,
    phone: <Phone className="h-4 w-4" />,
    date: <Calendar className="h-4 w-4" />,
    scale: <Minus className="h-4 w-4" />,
    rating: <Star className="h-4 w-4" />,
    yes_no: <ToggleLeft className="h-4 w-4" />,
    file_upload: <Upload className="h-4 w-4" />,
    statement: <FileText className="h-4 w-4" />,
  };
  return iconMap[type] || <Type className="h-4 w-4" />;
}

function getQuestionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    short_text: 'متن کوتاه',
    long_text: 'متن بلند',
    multiple_choice: 'تک انتخابی',
    multiple_select: 'چند انتخابی',
    dropdown: 'لیست کشویی',
    number: 'عدد',
    email: 'ایمیل',
    phone: 'تلفن',
    date: 'تاریخ',
    scale: 'مقیاس',
    rating: 'امتیازدهی',
    yes_no: 'بله/خیر',
    file_upload: 'آپلود فایل',
    statement: 'عبارت توضیحی',
  };
  return labels[type] || type;
}

/* --- Render the "answer" preview for each question type --- */
function QuestionAnswerPreview({ question }: { question: FormQuestion }) {
  const { config, type } = question;

  switch (type) {
    case 'short_text':
      return (
        <div className="mt-3 border-b-2 border-dashed border-muted-foreground/30 pb-1">
          <span className="text-sm text-muted-foreground/60">
            {config.placeholder || 'پاسخ کوتاه...'}
          </span>
        </div>
      );
    case 'long_text':
      return (
        <div className="mt-3 min-h-[72px] rounded-lg border-2 border-dashed border-muted-foreground/30 p-3">
          <span className="text-sm text-muted-foreground/60">
            {config.placeholder || 'پاسخ بلند خود را وارد کنید...'}
          </span>
        </div>
      );
    case 'multiple_choice':
      return (
        <div className="mt-3 space-y-2">
          {(config.options || []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-muted-foreground/40" />
              <span className="text-sm text-foreground/80">{opt.text}</span>
            </div>
          ))}
        </div>
      );
    case 'multiple_select':
      return (
        <div className="mt-3 space-y-2">
          {(config.options || []).map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border-2 border-muted-foreground/40" />
              <span className="text-sm text-foreground/80">{opt.text}</span>
            </div>
          ))}
        </div>
      );
    case 'dropdown':
      return (
        <div className="mt-3 flex h-10 w-full items-center justify-between rounded-lg border-2 border-muted-foreground/30 px-3">
          <span className="text-sm text-muted-foreground/60">
            {(config.options && config.options[0]?.text) || 'انتخاب کنید...'}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground/50" />
        </div>
      );
    case 'number':
      return (
        <div className="mt-3 border-b-2 border-dashed border-muted-foreground/30 pb-1">
          <span className="text-sm text-muted-foreground/60">۰</span>
        </div>
      );
    case 'email':
      return (
        <div className="mt-3 border-b-2 border-dashed border-muted-foreground/30 pb-1">
          <span className="text-sm text-muted-foreground/60">
            {config.placeholder || 'example@email.com'}
          </span>
        </div>
      );
    case 'phone':
      return (
        <div className="mt-3 border-b-2 border-dashed border-muted-foreground/30 pb-1">
          <span className="text-sm text-muted-foreground/60">
            {config.placeholder || '۰۹۱۲۳۴۵۶۷۸۹'}
          </span>
        </div>
      );
    case 'date':
      return (
        <div className="mt-3 flex h-10 w-full items-center gap-2 rounded-lg border-2 border-muted-foreground/30 px-3">
          <Calendar className="h-4 w-4 text-muted-foreground/50" />
          <span className="text-sm text-muted-foreground/60">انتخاب تاریخ</span>
        </div>
      );
    case 'scale': {
      const min = config.scaleMin ?? 1;
      const max = config.scaleMax ?? 5;
      const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);
      return (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-2">
            {config.scaleMinLabel && (
              <span className="text-xs text-muted-foreground">{config.scaleMinLabel}</span>
            )}
            <div className="flex gap-1.5 flex-1 justify-center">
              {values.map((v) => (
                <div
                  key={v}
                  className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-muted-foreground/30 text-xs text-muted-foreground"
                >
                  {v}
                </div>
              ))}
            </div>
            {config.scaleMaxLabel && (
              <span className="text-xs text-muted-foreground">{config.scaleMaxLabel}</span>
            )}
          </div>
        </div>
      );
    }
    case 'rating':
      return (
        <div className="mt-3 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="h-6 w-6 text-muted-foreground/30" />
          ))}
        </div>
      );
    case 'yes_no':
      return (
        <div className="mt-3 flex gap-3">
          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-muted-foreground/30 px-4">
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
            <span className="text-sm text-foreground/80">بله</span>
          </div>
          <div className="flex h-10 items-center gap-2 rounded-lg border-2 border-muted-foreground/30 px-4">
            <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
            <span className="text-sm text-foreground/80">خیر</span>
          </div>
        </div>
      );
    case 'file_upload':
      return (
        <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 py-8">
          <Upload className="h-8 w-8 text-muted-foreground/40" />
          <span className="text-sm text-muted-foreground/60">فایل خود را اینجا رها کنید یا کلیک کنید</span>
          <span className="text-xs text-muted-foreground/40">حداکثر ۱۰ مگابایت</span>
        </div>
      );
    case 'statement':
      return null;
    default:
      return null;
  }
}

/* --- Individual Question Card --- */
function QuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onDelete,
  onAddAfter,
}: {
  question: FormQuestion;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAddAfter: () => void;
}) {
  const isStatement = question.type === 'statement';

  return (
    <div className="group/card relative flex gap-2">
      {/* Drag handle area */}
      <div className="flex flex-col items-center pt-3 opacity-0 transition-opacity group-hover/card:opacity-100">
        <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground/50 hover:text-muted-foreground" />
      </div>

      {/* Question card */}
      <div
        onClick={onSelect}
        className={cn(
          'relative flex-1 cursor-pointer rounded-xl border-2 p-5 transition-all duration-200',
          isSelected
            ? 'border-purple-500 bg-purple-50/50 shadow-sm ring-1 ring-purple-500/20 dark:bg-purple-950/20 dark:ring-purple-400/20'
            : 'border-transparent bg-white hover:border-muted hover:shadow-sm dark:bg-zinc-900/50'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {!isStatement && (
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {index + 1}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                  {getQuestionTypeLabel(question.type)}
                </span>
                {question.required && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
                    الزامی
                  </span>
                )}
              </div>
              <h4 className="text-[15px] font-semibold leading-relaxed text-foreground break-words">
                {question.title}
              </h4>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddAfter();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Answer preview */}
        <QuestionAnswerPreview question={question} />

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute top-0 right-0 h-full w-1 rounded-l bg-purple-500" />
        )}
      </div>
    </div>
  );
}

/* --- Add question separator between questions --- */
function AddSeparator({ onClick }: { onClick: () => void }) {
  return (
    <div className="group/sep flex items-center justify-center py-1">
      <div className="h-px flex-1 bg-transparent transition-colors group-hover/sep:bg-muted" />
      <button
        onClick={onClick}
        className="mx-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/20 text-muted-foreground/40 opacity-0 transition-all hover:border-purple-400 hover:bg-purple-50 hover:text-purple-600 group-hover/sep:opacity-100 dark:hover:bg-purple-950 dark:hover:text-purple-400"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <div className="h-px flex-1 bg-transparent transition-colors group-hover/sep:bg-muted" />
    </div>
  );
}

/* --- Main Form Preview Component --- */
export default function FormPreview() {
  const { questions, selectedQuestionId, setSelectedQuestionId, removeQuestion } = useAppStore();
  const [showTypeMenu, setShowTypeMenu] = React.useState<number | 'end' | null>(null);

  const handleDelete = useCallback(
    (id: string) => {
      removeQuestion(id);
    },
    [removeQuestion]
  );

  const handleAddAt = useCallback(
    (position: number | 'end') => {
      setShowTypeMenu(position);
    },
    []
  );

  return (
    <div className="h-full flex flex-col">
      {/* Form header preview */}
      <div className="border-b bg-white px-8 pt-8 pb-6 dark:bg-zinc-900/50">
        <div className="rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">فرم بدون عنوان</h1>
              <p className="text-sm text-white/70 mt-0.5">عنوان و توضیحات فرم خود را ویرایش کنید</p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions list */}
      <ScrollArea className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6">
          {questions.length === 0 ? (
            <EmptyState onAdd={() => handleAddAt('end')} />
          ) : (
            <>
              {questions.map((q, idx) => (
                <React.Fragment key={q.id}>
                  {idx > 0 && (
                    <AddSeparator onClick={() => handleAddAt(idx)} />
                  )}
                  <QuestionCard
                    question={q}
                    index={idx}
                    isSelected={selectedQuestionId === q.id}
                    onSelect={() => setSelectedQuestionId(q.id)}
                    onDelete={() => handleDelete(q.id)}
                    onAddAfter={() => handleAddAt(idx + 1)}
                  />
                </React.Fragment>
              ))}
              {/* Bottom add card */}
              <div className="mt-4">
                <button
                  onClick={() => handleAddAt('end')}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/20 py-6 text-muted-foreground/50 transition-all hover:border-purple-400 hover:bg-purple-50/50 hover:text-purple-600 dark:hover:bg-purple-950/30 dark:hover:text-purple-400"
                >
                  <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                  <span className="text-sm font-medium">افزودن سؤال</span>
                </button>
              </div>
            </>
          )}
          <div className="h-12" />
        </div>
      </ScrollArea>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/30 mb-4">
        <FileText className="h-8 w-8 text-purple-500" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">فرم خود را بسازید</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        از پنل سمت راست نوع سؤال مورد نظر خود را انتخاب و به فرم اضافه کنید
      </p>
      <Button
        onClick={onAdd}
        className="bg-purple-600 hover:bg-purple-700 text-white gap-2 rounded-lg"
      >
        <Plus className="h-4 w-4" />
        افزودن اولین سؤال
      </Button>
    </div>
  );
}
