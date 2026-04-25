'use client';

import React, { useCallback, useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  GripVertical,
  Star,
  Copy,
  Settings,
  Type,
  Hash,
  Calendar,
  GitBranch,
  ChevronDown,
  ChevronLeft,
  Eye,
  Upload,
  ShieldCheck,
  SlidersHorizontal,
  FileQuestion,
  Layers,
  Pencil,
  CheckIcon,
  Undo2,
  Redo2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAppStore, FormQuestion, QuestionConfig, QuestionOption, ImageOption, QuestionLogic, ConditionRule, FormSection } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';

/* ========== Helpers ========== */

function toPersianDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

/* ======================== */
/* Options Editor Component  */
/* ======================== */
function OptionsEditor({
  options = [],
  onChange,
  allowOther = false,
  onAllowOtherChange,
}: {
  options: QuestionOption[];
  onChange: (options: QuestionOption[]) => void;
  allowOther?: boolean;
  onAllowOtherChange?: (val: boolean) => void;
}) {
  const addOption = () => {
    const newOpt: QuestionOption = {
      id: crypto.randomUUID(),
      text: `گزینه ${options.length + 1}`,
    };
    onChange([...options, newOpt]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 1) return;
    onChange(options.filter((o) => o.id !== id));
  };

  const updateOptionText = (id: string, text: string) => {
    onChange(options.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          گزینه‌ها
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={addOption}
              className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
            >
              <Plus className="h-3.5 w-3.5" />
              افزودن
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">افزودن گزینه جدید</TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-1.5">
        {options.map((opt, idx) => (
          <div
            key={opt.id}
            className="group/opt flex items-center gap-1.5 rounded-lg border bg-muted/30 px-2 py-1.5 transition-all duration-200 hover:bg-violet-50/60 hover:border-violet-200 dark:hover:bg-violet-950/20 dark:hover:border-violet-800/50 hover:shadow-sm hover:shadow-violet-100/50 dark:hover:shadow-violet-950/20"
          >
            <GripVertical className="h-3.5 w-3.5 shrink-0 cursor-grab text-muted-foreground/40" />
            <span className="shrink-0 text-[10px] font-bold text-muted-foreground w-4 text-center">
              {idx + 1}
            </span>
            <Input
              value={opt.text}
              onChange={(e) => updateOptionText(opt.id, e.target.value)}
              className="h-8 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm px-1 focus-visible:ring-0"
              placeholder="متن گزینه..."
            />
            <button
              onClick={() => removeOption(opt.id)}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all duration-200 hover:bg-red-100 hover:text-red-500 group-hover/opt:opacity-100 hover:scale-110"
              disabled={options.length <= 1}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      {onAllowOtherChange && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2.5">
          <Label className="text-sm cursor-pointer" htmlFor="allow-other">
            فعال‌سازی &quot;سایر&quot;
          </Label>
          <Switch
            id="allow-other"
            checked={allowOther}
            onCheckedChange={onAllowOtherChange}
          />
        </div>
      )}
    </div>
  );
}

/* ======================== */
/* Image Options Editor Component */
/* ======================== */
function ImageOptionsEditor({
  imageOptions = [],
  onChange,
}: {
  imageOptions: ImageOption[];
  onChange: (options: ImageOption[]) => void;
}) {
  const addImageOption = () => {
    const newOpt: ImageOption = {
      id: crypto.randomUUID(),
      text: `گزینه ${imageOptions.length + 1}`,
      imageUrl: '',
    };
    onChange([...imageOptions, newOpt]);
  };

  const removeImageOption = (id: string) => {
    if (imageOptions.length <= 1) return;
    onChange(imageOptions.filter((o) => o.id !== id));
  };

  const updateImageOption = (id: string, updates: Partial<ImageOption>) => {
    onChange(imageOptions.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          گزینه‌های تصویری
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={addImageOption}
              className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
            >
              <Plus className="h-3.5 w-3.5" />
              افزودن
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">افزودن گزینه تصویری جدید</TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-2">
        {imageOptions.map((opt, idx) => (
          <div
            key={opt.id}
            className="group/imgopt rounded-lg border bg-muted/30 p-3 transition-all duration-200 hover:bg-violet-50/60 hover:border-violet-200 dark:hover:bg-violet-950/20 dark:hover:border-violet-800/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground">
                گزینه {idx + 1}
              </span>
              <button
                onClick={() => removeImageOption(opt.id)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all duration-200 hover:bg-red-100 hover:text-red-500 group-hover/imgopt:opacity-100"
                disabled={imageOptions.length <= 1}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-2">
              <Input
                value={opt.text}
                onChange={(e) => updateImageOption(opt.id, { text: e.target.value })}
                className="h-8 text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
                placeholder="متن گزینه..."
                dir="rtl"
              />
              <Input
                value={opt.imageUrl}
                onChange={(e) => updateImageOption(opt.id, { imageUrl: e.target.value })}
                className="h-8 text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
                placeholder="آدرس تصویر (URL)..."
                dir="ltr"
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
        آدرس تصویر را وارد کنید. در صورت خالی بودن، یک نگهدارنده نمایش داده می‌شود.
      </p>
    </div>
  );
}

/* ============================= */
/* Type-specific Config Sections  */
/* ============================= */
function TextConfigSection({
  config,
  onUpdate,
  isLong,
  titleLength = 0,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
  isLong?: boolean;
  titleLength?: number;
}) {
  const maxLength = config.maxLength;
  const overLimit = maxLength && titleLength > maxLength;

  return (
    <div className="space-y-4 transition-all duration-200">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">متن راهنما</Label>
        <Input
          value={config.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder={isLong ? 'پاسخ بلند خود را وارد کنید...' : 'پاسخ کوتاه...'}
          className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">حداکثر کاراکتر</Label>
        <Input
          type="number"
          value={config.maxLength || ''}
          onChange={(e) => onUpdate({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder={isLong ? '۵۰۰۰' : '۲۵۵'}
          min={1}
          className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
        />
        {maxLength && titleLength > 0 && (
          <p className={cn(
            'text-[11px] font-medium transition-colors',
            overLimit
              ? 'text-red-500 dark:text-red-400'
              : 'text-emerald-600 dark:text-emerald-400'
          )}>
            {toPersianDigits(String(titleLength))} / {toPersianDigits(String(maxLength))} کاراکتر
          </p>
        )}
        {maxLength && titleLength === 0 && (
          <p className="text-[11px] text-muted-foreground">
            حداکثر {toPersianDigits(String(maxLength))} کاراکتر
          </p>
        )}
      </div>
    </div>
  );
}

function NumberConfigSection({
  config,
  onUpdate,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
}) {
  return (
    <div className="space-y-4 transition-all duration-200">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">حداقل</Label>
          <Input
            type="number"
            value={config.min ?? ''}
            onChange={(e) => onUpdate({ min: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="۰"
            className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">حداکثر</Label>
          <Input
            type="number"
            value={config.max ?? ''}
            onChange={(e) => onUpdate({ max: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="۱۰۰"
            className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">گام افزایش</Label>
        <Input
          type="number"
          value={config.step ?? ''}
          onChange={(e) => onUpdate({ step: e.target.value ? parseInt(e.target.value) : undefined })}
          placeholder="۱"
          min={1}
          className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
        />
      </div>
    </div>
  );
}

function ContactConfigSection({
  config,
  onUpdate,
  label,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
  label: string;
}) {
  return (
    <div className="space-y-4 transition-all duration-200">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">متن راهنما</Label>
        <Input
          value={config.placeholder || ''}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          placeholder={label === 'ایمیل' ? 'example@email.com' : '۰۹۱۲۳۴۵۶۷۸۹'}
          className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
        />
      </div>
    </div>
  );
}

function ScaleConfigSection({
  config,
  onUpdate,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
}) {
  const scalePresets = [
    { label: '۱ تا ۵', min: 1, max: 5 },
    { label: '۱ تا ۷', min: 1, max: 7 },
    { label: '۱ تا ۱۰', min: 1, max: 10 },
  ];

  const currentScale = `${config.scaleMin ?? 1}-${config.scaleMax ?? 5}`;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">محدوده مقیاس</Label>
        <div className="flex gap-2 flex-wrap">
          {scalePresets.map((preset) => {
            const isActive = `${preset.min}-${preset.max}` === currentScale;
            return (
              <button
                key={preset.label}
                onClick={() =>
                  onUpdate({ scaleMin: preset.min, scaleMax: preset.max })
                }
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                  isActive
                    ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                    : 'border-muted hover:border-purple-300 hover:bg-purple-50/50 text-muted-foreground dark:hover:bg-purple-950/30'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">برچسب کم</Label>
          <Input
            value={config.scaleMinLabel || ''}
            onChange={(e) => onUpdate({ scaleMinLabel: e.target.value })}
            placeholder="کم"
            className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">برچسب زیاد</Label>
          <Input
            value={config.scaleMaxLabel || ''}
            onChange={(e) => onUpdate({ scaleMaxLabel: e.target.value })}
            placeholder="زیاد"
            className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
          />
        </div>
      </div>
    </div>
  );
}

function RatingConfigSection({
  config,
  onUpdate,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground">تعداد ستاره‌ها</Label>
        <div className="flex gap-2 flex-wrap">
          {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <button
              key={n}
              onClick={() => onUpdate({ scaleMax: n })}
              className={cn(
                'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all',
                (config.scaleMax || 5) === n
                  ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                  : 'border-muted hover:border-purple-300 hover:bg-purple-50/50 text-muted-foreground dark:hover:bg-purple-950/30'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
      {/* Preview */}
      <div className="flex gap-0.5 justify-center py-2">
        {Array.from({ length: config.scaleMax || 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-6 w-6 fill-purple-500 text-purple-500"
          />
        ))}
      </div>
    </div>
  );
}

function DateConfigSection({
  config,
  onUpdate,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">حداقل تاریخ</Label>
          <Input
            type="date"
            value={config.min as string | undefined || ''}
            onChange={(e) => onUpdate({ min: e.target.value || undefined })}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground">حداکثر تاریخ</Label>
          <Input
            type="date"
            value={config.max as string | undefined || ''}
            onChange={(e) => onUpdate({ max: e.target.value || undefined })}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}

function MatrixConfigSection({
  config,
  onUpdate,
}: {
  config: QuestionConfig;
  onUpdate: (updates: Partial<QuestionConfig>) => void;
}) {
  const rows = config.matrixRows || [];
  const cols = config.matrixCols || [];

  const updateRow = (index: number, text: string) => {
    const newRows = [...rows];
    newRows[index] = text;
    onUpdate({ matrixRows: newRows });
  };

  const addRow = () => {
    onUpdate({ matrixRows: [...rows, `آیتم ${rows.length + 1}`] });
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) return;
    onUpdate({ matrixRows: rows.filter((_, i) => i !== index) });
  };

  const updateCol = (index: number, text: string) => {
    const newCols = [...cols];
    newCols[index] = text;
    onUpdate({ matrixCols: newCols });
  };

  const addCol = () => {
    onUpdate({ matrixCols: [...cols, `ستون ${cols.length + 1}`] });
  };

  const removeCol = (index: number) => {
    if (cols.length <= 1) return;
    onUpdate({ matrixCols: cols.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* Rows */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            سطرها (آیتم‌ها)
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addRow}
            className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          >
            <Plus className="h-3.5 w-3.5" />
            افزودن سطر
          </Button>
        </div>
        <div className="space-y-1.5">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="group/matrixrow flex items-center gap-1.5 rounded-lg border bg-muted/30 px-2 py-1.5 transition-all duration-200 hover:bg-violet-50/60 hover:border-violet-200 dark:hover:bg-violet-950/20 dark:hover:border-violet-800/50 hover:shadow-sm"
            >
              <span className="shrink-0 text-[10px] font-bold text-muted-foreground w-4 text-center">
                {idx + 1}
              </span>
              <Input
                value={row}
                onChange={(e) => updateRow(idx, e.target.value)}
                className="h-8 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm px-1"
                placeholder="متن سطر..."
                dir="rtl"
              />
              <button
                onClick={() => removeRow(idx)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all duration-200 hover:bg-red-100 hover:text-red-500 group-hover/matrixrow:opacity-100"
                disabled={rows.length <= 1}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            ستون‌ها (گزینه‌ها)
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={addCol}
            className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          >
            <Plus className="h-3.5 w-3.5" />
            افزودن ستون
          </Button>
        </div>
        <div className="space-y-1.5">
          {cols.map((col, idx) => (
            <div
              key={idx}
              className="group/matrixcol flex items-center gap-1.5 rounded-lg border bg-muted/30 px-2 py-1.5 transition-all duration-200 hover:bg-violet-50/60 hover:border-violet-200 dark:hover:bg-violet-950/20 dark:hover:border-violet-800/50 hover:shadow-sm"
            >
              <span className="shrink-0 text-[10px] font-bold text-muted-foreground w-4 text-center">
                {idx + 1}
              </span>
              <Input
                value={col}
                onChange={(e) => updateCol(idx, e.target.value)}
                className="h-8 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-sm px-1"
                placeholder="متن ستون..."
                dir="rtl"
              />
              <button
                onClick={() => removeCol(idx)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/40 opacity-0 transition-all duration-200 hover:bg-red-100 hover:text-red-500 group-hover/matrixcol:opacity-100"
                disabled={cols.length <= 1}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview hint */}
      <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
        سطرها آیتم‌های ارزیابی و ستون‌ها گزینه‌های پاسخ هستند.
      </p>
    </div>
  );
}

/* =============================== */
/* Type-specific renderer           */
/* =============================== */
function TypeConfigSection({ question }: { question: FormQuestion }) {
  const { updateQuestion } = useAppStore();

  const handleConfigUpdate = useCallback(
    (updates: Partial<QuestionConfig>) => {
      updateQuestion(question.id, {
        config: { ...question.config, ...updates },
      });
    },
    [question.id, question.config, updateQuestion]
  );

  const handleOptionsChange = useCallback(
    (options: QuestionOption[]) => {
      handleConfigUpdate({ options });
    },
    [handleConfigUpdate]
  );

  const handleImageOptionsChange = useCallback(
    (imageOptions: ImageOption[]) => {
      handleConfigUpdate({ imageOptions });
    },
    [handleConfigUpdate]
  );

  const handleAllowOtherChange = useCallback( 
    (val: boolean) => {
      handleConfigUpdate({ allowOther: val });
    },
    [handleConfigUpdate]
  );

  switch (question.type) {
    case 'short_text':
      return <TextConfigSection config={question.config} onUpdate={handleConfigUpdate} titleLength={question.title.length} />;
    case 'long_text':
      return <TextConfigSection config={question.config} onUpdate={handleConfigUpdate} isLong titleLength={question.title.length} />;
    case 'multiple_choice':
    case 'multiple_select':
    case 'dropdown':
      return (
        <OptionsEditor
          options={question.config.options}
          onChange={handleOptionsChange}
          allowOther={question.config.allowOther}
          onAllowOtherChange={handleAllowOtherChange}
        />
      );
    case 'number':
      return <NumberConfigSection config={question.config} onUpdate={handleConfigUpdate} />;
    case 'email':
      return <ContactConfigSection config={question.config} onUpdate={handleConfigUpdate} label="ایمیل" />;
    case 'phone':
      return <ContactConfigSection config={question.config} onUpdate={handleConfigUpdate} label="تلفن" />;
    case 'date':
      return <DateConfigSection config={question.config} onUpdate={handleConfigUpdate} />;
    case 'scale':
      return <ScaleConfigSection config={question.config} onUpdate={handleConfigUpdate} />;
    case 'rating':
      return <RatingConfigSection config={question.config} onUpdate={handleConfigUpdate} />;
    case 'yes_no':
      return (
        <div className="text-sm text-muted-foreground text-center py-4">
          تنظیمات خاصی برای این نوع سؤال وجود ندارد.
        </div>
      );
    case 'file_upload':
      return (
        <div className="text-sm text-muted-foreground text-center py-4">
          تنظیمات خاصی برای این نوع سؤال وجود ندارد.
        </div>
      );
    case 'image_choice':
      return (
        <ImageOptionsEditor
          imageOptions={question.config.imageOptions || []}
          onChange={handleImageOptionsChange}
        />
      );
    case 'matrix':
      return <MatrixConfigSection config={question.config} onUpdate={handleConfigUpdate} />;
    case 'statement':
      return (
        <div className="text-sm text-muted-foreground text-center py-4">
          تنظیمات خاصی برای این نوع سؤال وجود ندارد.
        </div>
      );
    case 'section_divider':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">توضیحات بخش</Label>
            <Textarea
              value={question.config.description || ''}
              onChange={(e) => handleConfigUpdate({ description: e.target.value })}
              placeholder="توضیحات اختیاری برای این بخش..."
              className="text-sm min-h-[80px] resize-none"
              dir="rtl"
            />
            <p className="text-xs text-muted-foreground">
              این توضیحات در زیر عنوان بخش نمایش داده می‌شود.
            </p>
          </div>
        </div>
      );
    default:
      return null;
  }
}

/* =============================== */
/* Conditional Logic Builder        */
/* =============================== */
function ConditionalLogicSection({ question, otherQuestions }: { question: FormQuestion; otherQuestions: FormQuestion[] }) {
  const { updateQuestion } = useAppStore();
  const [logicOpen, setLogicOpen] = useState(false);

  const logic: QuestionLogic = question.logic || {
    enabled: false,
    action: 'show',
    conditions: [],
  };

  const updateLogic = (newLogic: QuestionLogic) => {
    updateQuestion(question.id, { logic: newLogic });
  };

  const handleToggleEnabled = () => {
    const newEnabled = !logic.enabled;
    const newLogic: QuestionLogic = {
      ...logic,
      enabled: newEnabled,
      conditions: newEnabled && logic.conditions.length === 0
        ? [{ questionId: '', operator: 'equals', value: '' }]
        : logic.conditions,
    };
    updateLogic(newLogic);
    if (newEnabled && !logicOpen) setLogicOpen(true);
  };

  const handleActionChange = (action: 'show' | 'hide') => {
    updateLogic({ ...logic, action });
  };

  const addCondition = () => {
    updateLogic({
      ...logic,
      conditions: [...logic.conditions, { questionId: '', operator: 'equals', value: '' }],
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = logic.conditions.filter((_, i) => i !== index);
    updateLogic({ ...logic, conditions: newConditions });
  };

  const updateCondition = (index: number, updates: Partial<ConditionRule>) => {
    const newConditions = logic.conditions.map((c, i) =>
      i === index ? { ...c, ...updates } : c
    );
    updateLogic({ ...logic, conditions: newConditions });
  };

  const operatorLabels: Record<string, string> = {
    equals: 'برابر با',
    not_equals: 'نامساوی با',
    contains: 'شامل',
    not_contains: 'شامل نشود',
    is_answered: 'پاسخ داده شده',
    is_not_answered: 'پاسخ داده نشده',
  };

  const needsValue = (op: string) => op !== 'is_answered' && op !== 'is_not_answered';

  return (
    <div className="space-y-3">
      {!logic.enabled ? (
        <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm cursor-pointer" htmlFor="logic-toggle">
              منطق شرطی
            </Label>
          </div>
          <Switch id="logic-toggle" checked={false} onCheckedChange={handleToggleEnabled} />
        </div>
      ) : (
        <Collapsible open={logicOpen} onOpenChange={setLogicOpen}>
          <div className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-3">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-purple-600" />
              <Label className="text-sm cursor-pointer">منطق شرطی</Label>
              {logic.conditions.length > 0 && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
                  {logic.conditions.length} شرط
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={logic.enabled} onCheckedChange={handleToggleEnabled} />
              <CollapsibleTrigger asChild>
                <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", logicOpen && "rotate-180")} />
                </button>
              </CollapsibleTrigger>
            </div>
          </div>
          <CollapsibleContent>
            <div className="mt-3 space-y-4 rounded-lg border bg-muted/10 p-4">
              {/* Action selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground">
                  عملکرد
                </Label>
                <Select value={logic.action} onValueChange={(v) => handleActionChange(v as 'show' | 'hide')}>
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="show">نمایش سؤال</SelectItem>
                    <SelectItem value="hide">مخفی کردن سؤال</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Conditions builder */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground">
                  شرایط
                </Label>

                {logic.conditions.length === 0 ? (
                  <div className="text-center py-3 text-xs text-muted-foreground">
                    هیچ شرطی تعریف نشده است
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logic.conditions.map((condition, idx) => (
                      <div key={idx} className="group/cond space-y-2 rounded-lg border border-purple-200 dark:border-purple-800/50 bg-background p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-muted-foreground">
                            شرط {idx + 1}
                          </span>
                          <button
                            onClick={() => removeCondition(idx)}
                            className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground/40 hover:bg-red-100 hover:text-red-500 transition-all"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          <span className="text-xs text-muted-foreground">اگر سؤال</span>
                          <Select
                            value={condition.questionId}
                            onValueChange={(v) => updateCondition(idx, { questionId: v })}
                          >
                            <SelectTrigger className="w-full text-sm">
                              <SelectValue placeholder="انتخاب سؤال..." />
                            </SelectTrigger>
                            <SelectContent>
                              {otherQuestions.map((q) => (
                                <SelectItem key={q.id} value={q.id}>
                                  {q.title.length > 35 ? q.title.slice(0, 35) + '...' : q.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-xs text-muted-foreground">عملگر</span>
                          <Select
                            value={condition.operator}
                            onValueChange={(v) => {
                              const op = v as ConditionRule['operator'];
                              updateCondition(idx, {
                                operator: op,
                                ...(needsValue(op) ? {} : { value: undefined }),
                              });
                            }}
                          >
                            <SelectTrigger className="w-full text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(operatorLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {needsValue(condition.operator) && (
                            <>
                              <span className="text-xs text-muted-foreground">مقدار</span>
                              <Input
                                value={condition.value || ''}
                                onChange={(e) => updateCondition(idx, { value: e.target.value })}
                                placeholder="مقدار مقایسه..."
                                className="text-sm"
                                dir="rtl"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-dashed border-purple-300 dark:hover:bg-purple-950/30 dark:border-purple-700"
                  onClick={addCondition}
                >
                  <Plus className="h-3.5 w-3.5" />
                  افزودن شرط
                </Button>

                {/* Helper text */}
                <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
                  سؤال فقط زمانی نمایش داده می‌شود که تمام شرایط برقرار باشند
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

/* =============================== */
/* Question type selector           */
/* =============================== */
function QuestionTypeSelector({ question }: { question: FormQuestion }) {
  const { updateQuestion } = useAppStore();

  const typeLabels: Record<string, string> = {
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
    section_divider: 'جداکننده بخش',
    image_choice: 'انتخاب تصویری',
    matrix: 'ماتریس',
  };

  return (
    <Select
      value={question.type}
      onValueChange={(value) => updateQuestion(question.id, { type: value })}
    >
      <SelectTrigger className="w-full text-sm">
        <SelectValue placeholder="نوع سؤال" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(typeLabels).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* =============================== */
/* Question Mini Preview Component   */
/* =============================== */
function QuestionMiniPreview({ question }: { question: FormQuestion }) {
  const { config, type, title, required } = question;

  const typeLabels: Record<string, string> = {
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

  const renderInputPreview = () => {
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
          </div>
        );
      case 'scale': {
        const min = config.scaleMin ?? 1;
        const max = config.scaleMax ?? 5;
        const values = Array.from({ length: max - min + 1 }, (_, i) => i + min);
        return (
          <div className="mt-3 flex gap-1.5 justify-center">
            {values.map((v) => (
              <div
                key={v}
                className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-muted-foreground/30 text-xs text-muted-foreground"
              >
                {v}
              </div>
            ))}
          </div>
        );
      }
      default:
        return (
          <div className="mt-3 border-b-2 border-dashed border-muted-foreground/30 pb-1">
            <span className="text-sm text-muted-foreground/60">پاسخ...</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border bg-muted/20 p-5"
      dir="rtl"
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
            {typeLabels[type] || type}
          </span>
          {required && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">
              الزامی
            </span>
          )}
        </div>
        <h4 className="text-[15px] font-semibold text-foreground">
          {title || 'عنوان سؤال'}
          {required && (
            <span className="mr-1 text-red-500">*</span>
          )}
        </h4>
      </div>
      {renderInputPreview()}
    </motion.div>
  );
}

/* =============================== */
/* Sections Editor Component        */
/* =============================== */
function SectionsEditor() {
  const { sections, questions, addSection, updateSection, removeSection, moveQuestionToSection } = useAppStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const handleAddSection = () => {
    const title = `بخش ${toPersianDigits(String(sections.length + 1))}`;
    addSection(title);
  };

  const startEdit = (section: FormSection) => {
    setEditingId(section.id);
    setEditTitle(section.title);
    setEditDesc(section.description || '');
  };

  const saveEdit = () => {
    if (editingId) {
      updateSection(editingId, { title: editTitle, description: editDesc });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const getQuestionCount = (section: FormSection) => {
    return section.questionIds.filter((qid) => questions.some((q) => q.id === qid)).length;
  };

  const unassignedQuestions = questions.filter(
    (q) => !sections.some((s) => s.questionIds.includes(q.id))
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          بخش‌بندی سؤالات
        </Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddSection}
              className="h-7 gap-1 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
            >
              <Plus className="h-3.5 w-3.5" />
              افزودن بخش جدید
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">افزودن بخش جدید</TooltipContent>
        </Tooltip>
      </div>

      {sections.length === 0 ? (
        <div className="text-center py-4 px-3 rounded-lg border border-dashed border-muted-foreground/20 bg-muted/10">
          <Layers className="h-5 w-5 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">هنوز بخشی ایجاد نشده است</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">سؤالات خود را با بخش‌بندی دسته‌بندی کنید</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group/sec rounded-lg border bg-muted/20 p-3 transition-all duration-200 hover:bg-violet-50/40 hover:border-violet-200 dark:hover:bg-violet-950/15 dark:hover:border-violet-800/40"
            >
              {editingId === section.id ? (
                <div className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-8 text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
                    placeholder="عنوان بخش..."
                    dir="rtl"
                    autoFocus
                  />
                  <Textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="text-xs min-h-[50px] resize-none focus-visible:ring-violet-500/40 focus-visible:border-violet-400"
                    placeholder="توضیحات بخش (اختیاری)..."
                    dir="rtl"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={saveEdit}
                      className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors"
                    >
                      <CheckIcon className="h-3 w-3" />
                      ذخیره
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="rounded-md px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 text-[10px] font-bold mt-0.5">
                        {toPersianDigits(String(idx + 1))}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground truncate">{section.title}</h4>
                        {section.description && (
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{section.description}</p>
                        )}
                        <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                          {toPersianDigits(String(getQuestionCount(section)))} سؤال
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover/sec:opacity-100">
                      <button
                        onClick={() => startEdit(section)}
                        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="ویرایش بخش"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeSection(section.id)}
                        className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-red-100 hover:text-red-500 transition-colors"
                        title="حذف بخش"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {unassignedQuestions.length > 0 && sections.length > 0 && (
        <div className="text-[10px] text-muted-foreground/60 text-center pt-1">
          {toPersianDigits(String(unassignedQuestions.length))} سؤال بدون بخش
        </div>
      )}
    </div>
  );
}

/* =============================== */
/* Main Properties Panel            */
/* =============================== */
export default function PropertiesPanel() {
  const { questions, selectedQuestionId, updateQuestion, removeQuestion, setSelectedQuestionId, canUndo, canRedo, undo, redo, duplicateQuestion, moveQuestionUp, moveQuestionDown } =
    useAppStore();

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);
  const selectedQuestionIndex = questions.findIndex((q) => q.id === selectedQuestionId);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    type: true,
    title: true,
    required: false,
    config: true,
    logic: false,
    actions: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!selectedQuestion) {
    return (
      <motion.div
        key="empty-panel"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex h-full flex-col items-center justify-center px-6 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mb-4">
          <Settings className="h-7 w-7 text-violet-400" />
        </div>
        <h3 className="text-sm font-bold bg-gradient-to-l from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent mb-1.5">
          تنظیمات سؤال
        </h3>
        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          یک سؤال را از فرم انتخاب کنید تا تنظیمات آن نمایش داده شود
        </p>
      </motion.div>
    );
  }

  const handleTitleChange = (title: string) => {
    updateQuestion(selectedQuestion.id, { title });
  };

  const handleRequiredChange = (required: boolean) => {
    updateQuestion(selectedQuestion.id, { required });
  };

  const handleDelete = () => {
    removeQuestion(selectedQuestion.id);
  };

  const handleDuplicate = () => {
    const newQuestion: FormQuestion = {
      ...structuredClone(selectedQuestion),
      id: crypto.randomUUID(),
      title: selectedQuestion.title + ' (کپی)',
      order: questions.length,
      config: {
        ...selectedQuestion.config,
        options: selectedQuestion.config.options?.map((o) => ({
          ...o,
          id: crypto.randomUUID(),
        })),
      },
    };
    useAppStore.getState().addQuestion(newQuestion);
  };

  return (
    <motion.div
      key={selectedQuestion.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex h-full flex-col"
    >
      {/* ===== Enhanced Panel Header ===== */}
      <div className="border-b border-gray-200/60 dark:border-gray-800/60 px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-sm font-bold bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
              تنظیمات سؤال
            </h3>
            <Badge
              variant="secondary"
              className="shrink-0 bg-violet-100/80 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 text-[10px] px-1.5 py-0 gap-0.5 font-semibold tabular-nums"
            >
              #{toPersianDigits(String(selectedQuestionIndex + 1))}
            </Badge>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedQuestionId(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="left">بستن</TooltipContent>
          </Tooltip>
        </div>

        {/* ===== Quick Actions Toolbar (Glassmorphism) ===== */}
        <div className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-l from-white/80 to-white/40 dark:from-zinc-800/80 dark:to-zinc-900/40 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/40 px-2 py-1.5 shadow-sm">
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={undo}
                disabled={!canUndo}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200',
                  canUndo
                    ? 'text-muted-foreground hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40 dark:hover:text-violet-400'
                    : 'text-muted-foreground/25 cursor-not-allowed'
                )}
              >
                <Undo2 className="h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">برگشت</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={redo}
                disabled={!canRedo}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200',
                  canRedo
                    ? 'text-muted-foreground hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40 dark:hover:text-violet-400'
                    : 'text-muted-foreground/25 cursor-not-allowed'
                )}
              >
                <Redo2 className="h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">دوباره</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-gray-200/60 dark:bg-gray-700/40 mx-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => moveQuestionUp(selectedQuestion.id)}
                disabled={selectedQuestionIndex <= 0}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200',
                  selectedQuestionIndex > 0
                    ? 'text-muted-foreground hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400'
                    : 'text-muted-foreground/25 cursor-not-allowed'
                )}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">جابجایی به بالا</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => moveQuestionDown(selectedQuestion.id)}
                disabled={selectedQuestionIndex >= questions.length - 1}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-200',
                  selectedQuestionIndex < questions.length - 1
                    ? 'text-muted-foreground hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400'
                    : 'text-muted-foreground/25 cursor-not-allowed'
                )}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">جابجایی به پایین</TooltipContent>
          </Tooltip>

          <div className="w-px h-4 bg-gray-200/60 dark:bg-gray-700/40 mx-0.5" />

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => duplicateQuestion(selectedQuestion.id)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/40 dark:hover:text-amber-400 transition-all duration-200"
              >
                <Copy className="h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">کپی سؤال</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleDelete}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950/40 dark:hover:text-red-400 transition-all duration-200"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent side="bottom">حذف سؤال</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Gradient divider */}
      <div className="h-px bg-gradient-to-l from-transparent via-violet-300/40 dark:via-violet-700/30 to-transparent" />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          {/* ===== Section: Question Type ===== */}
          <Collapsible open={openSections.type} onOpenChange={() => toggleSection('type')}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                'group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-right transition-all duration-200 hover:bg-muted/60',
                openSections.type && 'bg-violet-50/60 dark:bg-violet-950/20'
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-[3px] h-4 rounded-full transition-colors duration-200',
                    openSections.type ? 'bg-violet-500' : 'bg-transparent group-hover:bg-violet-300 dark:group-hover:bg-violet-700'
                  )} />
                  <FileQuestion className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    نوع سؤال
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground/60 transition-transform duration-300',
                  openSections.type && 'rotate-180'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 px-1">
                  <QuestionTypeSelector question={selectedQuestion} />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Gradient section divider */}
          <div className="my-1 h-px bg-gradient-to-l from-transparent via-gray-200/60 dark:via-gray-700/30 to-transparent" />

          {/* ===== Section: Question Title ===== */}
          <Collapsible open={openSections.title} onOpenChange={() => toggleSection('title')}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                'group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-right transition-all duration-200 hover:bg-muted/60',
                openSections.title && 'bg-violet-50/60 dark:bg-violet-950/20'
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-[3px] h-4 rounded-full transition-colors duration-200',
                    openSections.title ? 'bg-violet-500' : 'bg-transparent group-hover:bg-violet-300 dark:group-hover:bg-violet-700'
                  )} />
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    متن سؤال
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground/60 transition-transform duration-300',
                  openSections.title && 'rotate-180'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 px-1">
                  <Textarea
                    value={selectedQuestion.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="متن سؤال را وارد کنید..."
                    className="text-sm min-h-[80px] resize-none focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
                    dir="rtl"
                  />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Gradient section divider */}
          <div className="my-1 h-px bg-gradient-to-l from-transparent via-gray-200/60 dark:via-gray-700/30 to-transparent" />

          {/* ===== Section: Required Toggle ===== */}
          <div className="rounded-lg px-1 py-1">
            <div className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-3 transition-all duration-200',
              selectedQuestion.required
                ? 'border-violet-200 bg-violet-50/50 dark:border-violet-800/50 dark:bg-violet-950/20'
                : 'border-transparent bg-muted/20 hover:border-violet-200/60 dark:hover:border-violet-800/40'
            )}>
              <div className="flex items-center gap-2">
                <ShieldCheck className={cn(
                  'h-4 w-4 transition-colors duration-200',
                  selectedQuestion.required ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'
                )} />
                <Label className="text-sm cursor-pointer" htmlFor="required-toggle">
                  پاسخدهی اجباری
                </Label>
                {selectedQuestion.required && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">
                    الزامی
                  </Badge>
                )}
              </div>
              <Switch
                id="required-toggle"
                checked={selectedQuestion.required}
                onCheckedChange={handleRequiredChange}
              />
            </div>
          </div>

          {/* Gradient section divider */}
          <div className="my-1 h-px bg-gradient-to-l from-transparent via-gray-200/60 dark:via-gray-700/30 to-transparent" />

          {/* ===== Section: Type-specific Configuration ===== */}
          <Collapsible open={openSections.config} onOpenChange={() => toggleSection('config')}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                'group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-right transition-all duration-200 hover:bg-muted/60',
                openSections.config && 'bg-violet-50/60 dark:bg-violet-950/20'
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-[3px] h-4 rounded-full transition-colors duration-200',
                    openSections.config ? 'bg-violet-500' : 'bg-transparent group-hover:bg-violet-300 dark:group-hover:bg-violet-700'
                  )} />
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    تنظیمات
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground/60 transition-transform duration-300',
                  openSections.config && 'rotate-180'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 px-1">
                  <TypeConfigSection question={selectedQuestion} />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Gradient section divider */}
          <div className="my-1 h-px bg-gradient-to-l from-transparent via-gray-200/60 dark:via-gray-700/30 to-transparent" />

          {/* ===== Section: Conditional Logic ===== */}
          <Collapsible open={openSections.logic} onOpenChange={() => toggleSection('logic')}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                'group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-right transition-all duration-200 hover:bg-muted/60',
                openSections.logic && 'bg-violet-50/60 dark:bg-violet-950/20'
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-[3px] h-4 rounded-full transition-colors duration-200',
                    openSections.logic ? 'bg-violet-500' : 'bg-transparent group-hover:bg-violet-300 dark:group-hover:bg-violet-700'
                  )} />
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    منطق شرطی
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground/60 transition-transform duration-300',
                  openSections.logic && 'rotate-180'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-1 px-1">
                  <ConditionalLogicSection
                    question={selectedQuestion}
                    otherQuestions={questions.filter((q) => q.id !== selectedQuestion.id)}
                  />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Gradient section divider */}
          <div className="my-1 h-px bg-gradient-to-l from-transparent via-gray-200/60 dark:via-gray-700/30 to-transparent" />

          {/* ===== Section: Actions ===== */}
          <Collapsible open={openSections.actions} onOpenChange={() => toggleSection('actions')}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                'group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-right transition-all duration-200 hover:bg-muted/60',
                openSections.actions && 'bg-violet-50/60 dark:bg-violet-950/20'
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-[3px] h-4 rounded-full transition-colors duration-200',
                    openSections.actions ? 'bg-violet-500' : 'bg-transparent group-hover:bg-violet-300 dark:group-hover:bg-violet-700'
                  )} />
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    عملیات
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground/60 transition-transform duration-300',
                  openSections.actions && 'rotate-180'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-4 px-1 flex flex-col gap-2">
                  {/* Preview Question Button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 justify-start text-sm transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
                      >
                        <Eye className="h-4 w-4" />
                        پیش‌نمایش سؤال
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-right text-sm">پیش‌نمایش سؤال</DialogTitle>
                      </DialogHeader>
                      <QuestionMiniPreview question={selectedQuestion} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 justify-start text-sm transition-all duration-200 hover:border-violet-300 hover:bg-violet-50 dark:hover:border-violet-700 dark:hover:bg-violet-950/30"
                    onClick={handleDuplicate}
                  >
                    <Copy className="h-4 w-4" />
                    کپی سؤال
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:hover:bg-red-950/30 dark:border-red-800"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف سؤال
                  </Button>
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>

          {/* Gradient section divider */}
          <div className="my-1 h-px bg-gradient-to-l from-transparent via-gray-200/60 dark:via-gray-700/30 to-transparent" />

          {/* ===== Section: Sections (بخش‌بندی) ===== */}
          <Collapsible open={openSections.sections ?? false} onOpenChange={() => toggleSection('sections')}>
            <CollapsibleTrigger asChild>
              <button className={cn(
                'group flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-right transition-all duration-200 hover:bg-muted/60',
                (openSections.sections ?? false) && 'bg-violet-50/60 dark:bg-violet-950/20'
              )}>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    'w-[3px] h-4 rounded-full transition-colors duration-200',
                    (openSections.sections ?? false) ? 'bg-violet-500' : 'bg-transparent group-hover:bg-violet-300 dark:group-hover:bg-violet-700'
                  )} />
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    بخش‌بندی
                  </span>
                </div>
                <ChevronDown className={cn(
                  'h-4 w-4 text-muted-foreground/60 transition-transform duration-300',
                  (openSections.sections ?? false) && 'rotate-180'
                )} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-2 pb-4 px-1">
                  <SectionsEditor />
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </motion.div>
  );
}
