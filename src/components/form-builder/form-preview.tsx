'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  Pencil,
  CheckIcon,
} from 'lucide-react';
import { useAppStore, FormQuestion, FormTheme } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

/* ========== Types ========== */

interface FormPreviewProps {
  formTitle: string;
  formDescription: string;
  formTheme: FormTheme;
  onDescriptionChange: (description: string) => void;
}

/* ========== Helpers ========== */

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

/* ========== Question Answer Preview ========== */

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

/* ========== Editable Description Component ========== */

function EditableDescription({
  description,
  onChange,
  primaryColor,
}: {
  description: string;
  onChange: (value: string) => void;
  primaryColor: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraftValue(description);
  }, [description]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(draftValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraftValue(description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="relative mt-2 w-full max-w-lg">
        <Textarea
          ref={textareaRef}
          value={draftValue}
          onChange={(e) => setDraftValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="توضیحات فرم را وارد کنید..."
          className="text-sm text-white/90 placeholder:text-white/40 bg-white/10 border-white/20 resize-none min-h-[60px]"
          dir="rtl"
        />
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <CheckIcon className="h-3 w-3" />
            ذخیره
          </button>
          <button
            onClick={handleCancel}
            className="rounded-md px-2.5 py-1 text-xs text-white/60 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            انصراف
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="group/desc flex items-start gap-2 mt-2 w-full max-w-lg text-right"
    >
      {description ? (
        <p className="text-sm text-white/70 leading-relaxed">{description}</p>
      ) : (
        <p className="text-sm text-white/40 flex items-center gap-1.5">
          <Pencil className="h-3 w-3" />
          افزودن توضیحات فرم...
        </p>
      )}
      {description && (
        <Pencil className="h-3 w-3 mt-1 text-white/40 opacity-0 group-hover/desc:opacity-100 transition-opacity shrink-0" />
      )}
    </button>
  );
}

/* ========== Question Card ========== */

function QuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onDelete,
  onAddAfter,
  primaryColor,
}: {
  question: FormQuestion;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onAddAfter: () => void;
  primaryColor: string;
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
          'relative flex-1 cursor-pointer border-2 p-5 transition-all duration-200',
          isSelected
            ? 'shadow-sm ring-1'
            : 'border-transparent bg-white hover:border-muted hover:shadow-sm dark:bg-zinc-900/50'
        )}
        style={
          isSelected
            ? {
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}08`,
                ringColor: `${primaryColor}33`,
              }
            : undefined
        }
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {!isStatement && (
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${primaryColor}1a`,
                  color: primaryColor,
                }}
              >
                {index + 1}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium" style={{ color: primaryColor }}>
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
          <div
            className="absolute top-0 right-0 h-full w-1 rounded-l"
            style={{ backgroundColor: primaryColor }}
          />
        )}
      </div>
    </div>
  );
}

/* ========== Add Separator ========== */

function AddSeparator({ onClick, primaryColor }: { onClick: () => void; primaryColor: string }) {
  return (
    <div className="group/sep flex items-center justify-center py-1">
      <div className="h-px flex-1 bg-transparent transition-colors group-hover/sep:bg-muted" />
      <button
        onClick={onClick}
        className="mx-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/20 text-muted-foreground/40 opacity-0 transition-all hover:text-foreground group-hover/sep:opacity-100"
        style={{ hoverColor: primaryColor }}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <div className="h-px flex-1 bg-transparent transition-colors group-hover/sep:bg-muted" />
    </div>
  );
}

/* ========== Main Form Preview Component ========== */

export default function FormPreview({
  formTitle,
  formDescription,
  formTheme,
  onDescriptionChange,
}: FormPreviewProps) {
  const { questions, selectedQuestionId, setSelectedQuestionId, removeQuestion } = useAppStore();
  const [showTypeMenu, setShowTypeMenu] = React.useState<number | 'end' | null>(null);

  const primaryColor = formTheme.primaryColor;
  const bgColor = formTheme.backgroundColor;
  const borderRadius = formTheme.borderRadius;

  const handleDelete = useCallback(
    (id: string) => {
      removeQuestion(id);
    },
    [removeQuestion]
  );

  const handleAddAt = useCallback((position: number | 'end') => {
    setShowTypeMenu(position);
  }, []);

  /* Gradient helpers for header banner */
  const headerGradientStyle: React.CSSProperties = {
    background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
    borderRadius: `${borderRadius}px`,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Form header preview */}
      <div
        className="border-b px-8 pt-8 pb-6"
        style={{ backgroundColor: bgColor === '#ffffff' ? 'white' : bgColor }}
      >
        <div className="p-6 text-white shadow-lg" style={headerGradientStyle}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center bg-white/20 backdrop-blur" style={{ borderRadius: `${Math.max(borderRadius - 4, 4)}px` }}>
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{formTitle || 'فرم بدون عنوان'}</h1>
            </div>
          </div>
          <EditableDescription
            description={formDescription}
            onChange={onDescriptionChange}
            primaryColor={primaryColor}
          />
        </div>
      </div>

      {/* Questions list */}
      <ScrollArea className="flex-1" style={{ backgroundColor: bgColor === '#ffffff' ? undefined : bgColor }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6">
          {questions.length === 0 ? (
            <EmptyState onAdd={() => handleAddAt('end')} primaryColor={primaryColor} />
          ) : (
            <>
              {questions.map((q, idx) => (
                <React.Fragment key={q.id}>
                  {idx > 0 && (
                    <AddSeparator onClick={() => handleAddAt(idx)} primaryColor={primaryColor} />
                  )}
                  <QuestionCard
                    question={q}
                    index={idx}
                    isSelected={selectedQuestionId === q.id}
                    onSelect={() => setSelectedQuestionId(q.id)}
                    onDelete={() => handleDelete(q.id)}
                    onAddAfter={() => handleAddAt(idx + 1)}
                    primaryColor={primaryColor}
                  />
                </React.Fragment>
              ))}
              {/* Bottom add card */}
              <div className="mt-4">
                <button
                  onClick={() => handleAddAt('end')}
                  className="group w-full flex items-center justify-center gap-2 border-2 border-dashed border-muted-foreground/20 py-6 text-muted-foreground/50 transition-all hover:text-foreground"
                  style={{ borderRadius: `${borderRadius}px` }}
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

function EmptyState({ onAdd, primaryColor }: { onAdd: () => void; primaryColor: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center mb-4"
        style={{
          backgroundColor: `${primaryColor}1a`,
          borderRadius: '16px',
        }}
      >
        <FileText className="h-8 w-8" style={{ color: primaryColor }} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">فرم خود را بسازید</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        از پنل سمت راست نوع سؤال مورد نظر خود را انتخاب و به فرم اضافه کنید
      </p>
      <Button
        onClick={onAdd}
        className="text-white gap-2"
        style={{
          backgroundColor: primaryColor,
          borderRadius: '8px',
        }}
      >
        <Plus className="h-4 w-4" />
        افزودن اولین سؤال
      </Button>
    </div>
  );
}
