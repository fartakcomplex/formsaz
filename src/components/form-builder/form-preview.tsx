'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Type,
  AlignRight,
  CircleDot,
  CheckSquare,
  ChevronDown,
  ChevronUp,
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
    image_choice: 'انتخاب تصویری',
    matrix: 'ماتریس',
    section_divider: 'جداکننده بخش',
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
    case 'image_choice':
      return (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(config.imageOptions || []).map((opt) => (
            <div
              key={opt.id}
              className="flex flex-col items-center rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden"
            >
              <div className="h-16 w-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
              </div>
              <span className="text-xs text-foreground/70 py-1.5 px-2 text-center truncate w-full">
                {opt.text}
              </span>
            </div>
          ))}
        </div>
      );
    case 'matrix': {
      const rows = config.matrixRows || [];
      const cols = config.matrixCols || [];
      return (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-muted-foreground/20 bg-muted/40 p-2" />
                {cols.map((col, ci) => (
                  <th key={ci} className="border border-muted-foreground/20 bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground text-center">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  <td className="border border-muted-foreground/20 bg-muted/20 px-3 py-2 text-xs font-medium text-foreground/70 text-right whitespace-nowrap">
                    {row}
                  </td>
                  {cols.map((_, ci) => (
                    <td key={ci} className="border border-muted-foreground/20 p-1.5 text-center">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-muted-foreground/30 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'statement':
      return null;
    case 'section_divider':
      return (
        <div className="mt-3">
          <div className="h-px bg-gradient-to-l from-transparent via-muted-foreground/30 to-transparent" />
          {config.description && (
            <p className="text-xs text-muted-foreground/60 mt-2 italic">{config.description}</p>
          )}
        </div>
      );
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

/* ========== Sortable Question Card ========== */

function SortableQuestionCard({
  question,
  index,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onAddAfter,
  primaryColor,
  isFirst,
  isLast,
}: {
  question: FormQuestion;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddAfter: () => void;
  primaryColor: string;
  isFirst: boolean;
  isLast: boolean;
}) {
  const isStatement = question.type === 'statement';
  const isSectionDivider = question.type === 'section_divider';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.85 : 1,
  };

  if (isSectionDivider) {
    return (
      <div ref={setNodeRef} style={style} className="group/card relative">
        <div className={cn('flex items-center gap-2 transition-opacity cursor-grab active:cursor-grabbing', isDragging ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100 px-2')} {...attributes} {...listeners}>
          <div className={cn('rounded-md p-1 transition-colors', isDragging ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground/50 hover:text-muted-foreground')}>
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
        <div onClick={onSelect} className={cn('relative cursor-pointer py-3 px-5 transition-all duration-200', isSelected ? 'shadow-sm ring-1' : 'hover:bg-muted/50')} style={isSelected ? { borderColor: primaryColor, backgroundColor: `${primaryColor}08` } : undefined}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${primaryColor}1a` }}>
              <Minus className="h-4 w-4" style={{ color: primaryColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-foreground break-words">{question.title}</h4>
              {question.config.description && (
                <p className="text-xs text-muted-foreground mt-0.5">{question.config.description}</p>
              )}
            </div>
          </div>
          <div className="mt-3 h-px bg-gradient-to-l from-transparent via-muted-foreground/25 to-transparent" />
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover/card:opacity-100 absolute top-3 left-2">
            <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          {isSelected && <div className="absolute top-0 right-0 h-full w-1 rounded-l" style={{ backgroundColor: primaryColor }} />}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/card relative flex gap-2"
    >
      {/* Drag handle area */}
      <div
        className={cn(
          'flex flex-col items-center pt-3 transition-opacity cursor-grab active:cursor-grabbing',
          isDragging ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
        )}
        {...attributes}
        {...listeners}
      >
        <div
          className={cn(
            'rounded-md p-1 transition-colors',
            isDragging
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-muted text-muted-foreground/50 hover:text-muted-foreground'
          )}
        >
          <GripVertical className="h-5 w-5" />
        </div>
      </div>

      {/* Question card */}
      <div
        onClick={onSelect}
        className={cn(
          'relative flex-1 cursor-pointer border-2 pl-7 pr-5 transition-all duration-200',
          isDragging && 'shadow-lg ring-2 ring-primary/20',
          isSelected
            ? 'shadow-lg'
            : 'border-transparent bg-white hover:border-muted hover:shadow-sm dark:bg-zinc-900/50'
        )}
        style={
          isSelected
            ? {
                borderColor: primaryColor,
                backgroundColor: `${primaryColor}08`,
                boxShadow: `0 10px 15px -3px ${primaryColor}15, 0 4px 6px -4px ${primaryColor}10`,
              }
            : undefined
        }
      >
        {/* Question number badge */}
        {!isStatement && (
          <div
            className="absolute -left-3 top-4 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md z-10"
            style={{ backgroundColor: primaryColor }}
          >
            {index + 1}
          </div>
        )}
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {!isStatement && (
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold"
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
          <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/30 dark:hover:text-violet-400 transition-colors',
                isFirst && 'pointer-events-none opacity-30'
              )}
              disabled={isFirst}
              title="جابجایی به بالا"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/30 dark:hover:text-violet-400 transition-colors',
                isLast && 'pointer-events-none opacity-30'
              )}
              disabled={isLast}
              title="جابجایی به پایین"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="w-px h-4 bg-border mx-0.5" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-violet-950/30 dark:hover:text-violet-400 transition-colors"
              title="کپی سؤال"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
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

        {/* Selected indicator - left border accent */}
        {isSelected && (
          <div
            className="absolute top-0 left-0 h-full w-[3px] rounded-r"
            style={{ backgroundColor: primaryColor }}
          />
        )}
      </div>
    </div>
  );
}

/* ========== Drag Overlay Card ========== */

function DragOverlayCard({ question, primaryColor }: { question: FormQuestion; primaryColor: string }) {
  return (
    <div className="flex gap-2 opacity-90">
      <div className="flex flex-col items-center pt-3">
        <div className="rounded-md p-1 bg-primary/10 text-primary">
          <GripVertical className="h-5 w-5" />
        </div>
      </div>
      <div
        className="relative flex-1 border-2 pl-7 pr-5 shadow-xl ring-2 ring-primary/20"
        style={{
          borderColor: primaryColor,
          backgroundColor: `${primaryColor}08`,
        }}
      >
        {/* Question number badge */}
        <div
          className="absolute -left-3 top-4 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-md z-10"
          style={{ backgroundColor: primaryColor }}
        >
          {question.order + 1}
        </div>
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium" style={{ color: primaryColor }}>
                {getQuestionTypeLabel(question.type)}
              </span>
            </div>
            <h4 className="text-[15px] font-semibold leading-relaxed text-foreground break-words">
              {question.title}
            </h4>
          </div>
        </div>
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
        style={{ ['--hover-color' as string]: primaryColor } as React.CSSProperties}
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
  const { questions, selectedQuestionId, setSelectedQuestionId, removeQuestion, duplicateQuestion, moveQuestionUp, moveQuestionDown, setQuestions, reorderQuestions } = useAppStore();
  const [showTypeMenu, setShowTypeMenu] = React.useState<number | 'end' | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const primaryColor = formTheme.primaryColor;
  const bgColor = formTheme.backgroundColor;
  const borderRadius = formTheme.borderRadius;

  const questionIds = questions.map((q) => q.id);
  const activeQuestion = activeId ? questions.find((q) => q.id === activeId) : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: { active: { id: string | number } }) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(questions, oldIndex, newIndex).map((q, i) => ({
          ...q,
          order: i,
        }));
        reorderQuestions(reordered);
      }
    },
    [questions, reorderQuestions]
  );

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

      {/* Questions list with drag-and-drop */}
      <ScrollArea className="flex-1" style={{ backgroundColor: bgColor === '#ffffff' ? undefined : bgColor }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-6">
          {questions.length === 0 ? (
            <EmptyState onAdd={() => handleAddAt('end')} primaryColor={primaryColor} />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={questionIds} strategy={verticalListSortingStrategy}>
                {questions.map((q, idx) => (
                  <React.Fragment key={q.id}>
                    {idx > 0 && (
                      <AddSeparator onClick={() => handleAddAt(idx)} primaryColor={primaryColor} />
                    )}
                    <SortableQuestionCard
                      question={q}
                      index={idx}
                      isSelected={selectedQuestionId === q.id}
                      onSelect={() => setSelectedQuestionId(q.id)}
                      onDelete={() => handleDelete(q.id)}
                      onDuplicate={() => duplicateQuestion(q.id)}
                      onMoveUp={() => moveQuestionUp(q.id)}
                      onMoveDown={() => moveQuestionDown(q.id)}
                      onAddAfter={() => handleAddAt(idx + 1)}
                      primaryColor={primaryColor}
                      isFirst={idx === 0}
                      isLast={idx === questions.length - 1}
                    />
                  </React.Fragment>
                ))}
              </SortableContext>

              {/* Drag overlay */}
              {activeQuestion && (
                <DragOverlayCard question={activeQuestion} primaryColor={primaryColor} />
              )}
            </DndContext>
          )}

          {/* Bottom add card */}
          {questions.length > 0 && (
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
        از پنل سمت راست نوع سؤال مورد نظر خود را انتخاب و به فرم اضافه کنید.
        <br />
        <span className="text-xs text-muted-foreground/70 mt-1 inline-block">
          سؤالات را با کشیدن جابجا کنید
        </span>
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
