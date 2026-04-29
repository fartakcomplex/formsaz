'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  Star,
  Upload,
  X,
  AlertCircle,
  FileText,
  ImageIcon,
  Check,
  Loader2,
  Trash2,
  Type,
  AlignLeft,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Hash,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  ToggleLeft,
  Grid3X3,
  MessageSquare,
  Minus,
  LayoutDashboard,
  BookOpen,
  Link2,
  Clock,
  Share2,
  RotateCcw,
  Eye,
  EyeOff,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore, type FormQuestion, type QuestionConfig } from '@/lib/store';

const QUESTIONS_PER_PAGE = 1;

/* ========== Question Type Icon Helper ========== */

function getQuestionTypeIcon(type: string) {
  const icons: Record<string, LucideIcon> = {
    short_text: Type,
    long_text: AlignLeft,
    multiple_choice: CircleDot,
    multiple_select: CheckSquare,
    dropdown: ChevronDown,
    number: Hash,
    email: Mail,
    phone: Phone,
    date: Calendar,
    scale: BarChart3,
    rating: Star,
    yes_no: ToggleLeft,
    file_upload: Upload,
    image_choice: ImageIcon,
    matrix: Grid3X3,
    statement: MessageSquare,
    section_divider: Minus,
  };
  return icons[type] || MessageSquare;
}

/* ========== Theme Color Helper ========== */

function useFormTheme(fillForm: ReturnType<typeof useAppStore>['fillForm']) {
  return useMemo(() => {
    if (!fillForm?.theme) return { primaryColor: '#7c3aed', welcomeMessage: '', submitButtonText: 'ارسال پاسخ', thankYouMessage: '', progressStyle: 'bar' as const };
    try {
      const parsed = JSON.parse(fillForm.theme);
      return {
        primaryColor: parsed.primaryColor || '#7c3aed',
        welcomeMessage: parsed.welcomeMessage || '',
        submitButtonText: parsed.submitButtonText || 'ارسال پاسخ',
        thankYouMessage: parsed.thankYouMessage || '',
        progressStyle: parsed.progressStyle || 'bar',
      };
    } catch {
      return { primaryColor: '#7c3aed', welcomeMessage: '', submitButtonText: 'ارسال پاسخ', thankYouMessage: '', progressStyle: 'bar' as const };
    }
  }, [fillForm?.theme]);
}

function QuestionTypeIconDisplay({ type, color }: { type: string; color: string }) {
  const iconProps = { className: 'size-4 shrink-0', style: { color } };
  switch (type) {
    case 'short_text': return <Type {...iconProps} />;
    case 'long_text': return <AlignLeft {...iconProps} />;
    case 'multiple_choice': return <CircleDot {...iconProps} />;
    case 'multiple_select': return <CheckSquare {...iconProps} />;
    case 'dropdown': return <ChevronDown {...iconProps} />;
    case 'number': return <Hash {...iconProps} />;
    case 'email': return <Mail {...iconProps} />;
    case 'phone': return <Phone {...iconProps} />;
    case 'date': return <Calendar {...iconProps} />;
    case 'scale': return <BarChart3 {...iconProps} />;
    case 'rating': return <Star {...iconProps} />;
    case 'yes_no': return <ToggleLeft {...iconProps} />;
    case 'file_upload': return <Upload {...iconProps} />;
    case 'image_choice': return <ImageIcon {...iconProps} />;
    case 'matrix': return <Grid3X3 {...iconProps} />;
    case 'statement': return <MessageSquare {...iconProps} />;
    case 'section_divider': return <Minus {...iconProps} />;
    default: return <MessageSquare {...iconProps} />;
  }
}

function QuestionTitle({ question, index, themeColor, totalQuestions }: { question: FormQuestion; index: number; themeColor: string; totalQuestions?: number }) {
  const hasConditionalLogic = question.logic?.enabled && question.logic?.conditions?.length > 0;
  const isShowAction = question.logic?.action === 'show';

  const showBadge = question.type !== 'section_divider' && totalQuestions !== undefined && totalQuestions > 0;
  return (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.05 }}
          className="flex items-center justify-center size-9 rounded-full text-sm font-bold shrink-0 mt-0.5 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
            color: '#ffffff',
            boxShadow: `0 2px 8px ${themeColor}40`,
          }}
        >
          {toPersianDigit(index + 1)}
        </motion.span>
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <QuestionTypeIconDisplay type={question.type} color={themeColor} />
            <Label className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
              {question.title}
              {question.required && (
                <span className="inline-flex items-center justify-center size-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 text-xs font-bold mr-1 -mt-0.5">*</span>
              )}
            </Label>
            {showBadge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
              >
                سؤال {toPersianDigit(index + 1)} از {toPersianDigit(totalQuestions)}
              </motion.span>
            )}
            {hasConditionalLogic && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                  isShowAction
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                }`}
              >
                <GitBranch className="size-3" />
                {isShowAction ? 'نمایش شرطی' : 'مخفی‌سازی شرطی'}
              </motion.span>
            )}
          </motion.div>
          {question.config.description && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.18 }}
              className="text-sm text-gray-500 dark:text-zinc-400 mt-1"
            >
              {question.config.description}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}

function ShortTextQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Input
        placeholder={question.config.placeholder || 'پاسخ خود را وارد کنید...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={question.config.maxLength}
        className="h-12 rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-right text-base text-gray-900 dark:text-white focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900"
        dir="rtl"
      />
    </div>
  );
}

function LongTextQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-3">
      <Textarea
        placeholder={question.config.placeholder || 'پاسخ خود را وارد کنید...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={question.config.maxLength}
        rows={5}
        className="rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-right text-base text-gray-900 dark:text-white resize-none focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900"
        dir="rtl"
      />
    </div>
  );
}

function MultipleChoiceQuestion({
  question,
  value,
  onChange,
  themeColor,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
  themeColor: string;
}) {
  const options = question.config.options || [];
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {options.map((option) => (
        <motion.label
          key={option.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          htmlFor={`radio-${option.id}`}
          className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
            value === option.id
              ? 'border-violet-300 bg-violet-50 dark:bg-violet-950/40 dark:border-violet-700 shadow-sm'
              : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
          style={value === option.id ? { borderColor: themeColor, backgroundColor: `${themeColor}0d` } : undefined}
        >
          <RadioGroupItem value={option.id} id={`radio-${option.id}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{option.text}</span>
        </motion.label>
      ))}
    </RadioGroup>
  );
}

function MultipleSelectQuestion({
  question,
  value,
  onChange,
  themeColor,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
  themeColor: string;
}) {
  const options = question.config.options || [];
  const selected: string[] = value ? value.split(',').filter(Boolean) : [];

  const toggleOption = (optionId: string) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId];
    onChange(newSelected.join(','));
  };

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <motion.label
          key={option.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          htmlFor={`checkbox-${option.id}`}
          className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
            selected.includes(option.id)
              ? 'border-violet-300 bg-violet-50 dark:bg-violet-950/40 dark:border-violet-700 shadow-sm'
              : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
          }`}
          style={selected.includes(option.id) ? { borderColor: themeColor, backgroundColor: `${themeColor}0d` } : undefined}
        >
          <Checkbox
            id={`checkbox-${option.id}`}
            checked={selected.includes(option.id)}
            onCheckedChange={() => toggleOption(option.id)}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{option.text}</span>
        </motion.label>
      ))}
    </div>
  );
}

function DropdownQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  const options = question.config.options || [];
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-right text-gray-900 dark:text-white">
        <SelectValue placeholder={question.config.placeholder || 'یک گزینه انتخاب کنید...'} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function NumberQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Input
      type="number"
      placeholder={question.config.placeholder || 'عدد را وارد کنید...'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={question.config.min}
      max={question.config.max}
      step={question.config.step || 1}
      className="h-12 rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-right text-lg text-gray-900 dark:text-white focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900"
      dir="ltr"
      style={{ textAlign: 'right' }}
    />
  );
}

function EmailQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Input
      type="email"
      placeholder={question.config.placeholder || 'example@email.com'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir="ltr"
      className="h-12 rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-left text-base text-gray-900 dark:text-white focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900"
    />
  );
}

function PhoneQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Input
      type="tel"
      placeholder={question.config.placeholder || '۰۹۱۲۱۲۳۴۵۶۷'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      dir="ltr"
      className="h-12 rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-left text-base text-gray-900 dark:text-white focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900"
    />
  );
}

function DateQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 rounded-xl border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-right text-base text-gray-900 dark:text-white focus:border-violet-400 focus:ring-violet-100 dark:focus:ring-violet-900"
      dir="ltr"
    />
  );
}

function ScaleQuestion({
  question,
  value,
  onChange,
  themeColor,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
  themeColor: string;
}) {
  const min = question.config.scaleMin ?? 1;
  const max = question.config.scaleMax ?? 10;
  const minLabel = question.config.scaleMinLabel || '';
  const maxLabel = question.config.scaleMaxLabel || '';
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const selectedValue = value ? parseInt(value, 10) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 sm:gap-2 justify-center flex-wrap">
        {range.map((num) => (
          <motion.button
            key={num}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(String(num))}
            className={`flex size-10 sm:size-12 items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 ${
              selectedValue === num
                ? 'text-white shadow-lg scale-110'
                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
            }`}
            style={selectedValue === num ? { backgroundColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}33` } : undefined}
          >
            {num}
          </motion.button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-gray-400 dark:text-zinc-500 px-1">
          <span>{maxLabel}</span>
          <span>{minLabel}</span>
        </div>
      )}
    </div>
  );
}

function RatingQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  const ratingValue = value ? parseInt(value, 10) : 0;
  const maxRating = question.config.max ?? 5;

  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: maxRating }, (_, i) => {
        const starNum = i + 1;
        return (
          <motion.button
            key={starNum}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(String(starNum))}
            type="button"
            className="p-1"
          >
            <Star
              className={`size-9 sm:size-10 transition-colors duration-200 ${
                starNum <= ratingValue
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300 dark:text-zinc-600'
              }`}
            />
          </motion.button>
        );
      })}
      {ratingValue > 0 && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="mr-3 text-sm font-medium text-gray-500 dark:text-zinc-400"
        >
          {ratingValue} از {maxRating}
        </motion.span>
      )}
    </div>
  );
}

function YesNoQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('yes')}
        type="button"
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-5 text-base font-bold transition-all duration-200 ${
          value === 'yes'
            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 shadow-md shadow-emerald-100 dark:shadow-emerald-900/30'
            : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
        }`}
      >
        <CheckCircle2 className="size-5" />
        بله
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onChange('no')}
        type="button"
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 p-5 text-base font-bold transition-all duration-200 ${
          value === 'no'
            ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 shadow-md shadow-red-100 dark:shadow-red-900/30'
            : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800'
        }`}
      >
        <X className="size-5" />
        خیر
      </motion.button>
    </div>
  );
}

function FileUploadQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedInfo, setUploadedInfo] = useState<{ filename: string; size: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Parse stored value to recover upload info
  const parseStoredValue = useCallback((storedValue: string) => {
    try {
      const parsed = JSON.parse(storedValue);
      if (parsed && typeof parsed === 'object' && parsed.url && parsed.filename) {
        setUploadedInfo({ filename: parsed.filename, size: parsed.size || '' });
        return true;
      }
    } catch {
      // Legacy value was just a filename
    }
    return false;
  }, []);

  // Sync uploadedInfo from stored value on mount
  useEffect(() => {
    if (value && !uploadedInfo) {
      parseStoredValue(value);
    }
  }, [value, uploadedInfo, parseStoredValue]);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();

      if (!res.ok || !data.success) {
        setUploadError(data.error || 'خطا در آپلود فایل');
        setIsUploading(false);
        return;
      }

      // Store JSON with url, filename, and size
      const storedValue = JSON.stringify({
        url: data.url,
        filename: data.filename,
        size: data.size,
      });
      onChange(storedValue);
      setUploadedInfo({ filename: data.filename, size: data.size });
    } catch {
      clearInterval(progressInterval);
      setUploadError('خطا در آپلود فایل. لطفاً اتصال اینترنت خود را بررسی کنید.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [uploadFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
    // Reset input so same file can be re-selected
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, [uploadFile]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setUploadedInfo(null);
    setUploadError(null);
  }, [onChange]);

  const hasFile = value && uploadedInfo;

  return (
    <div>
      <motion.div
        whileHover={!hasFile && !isUploading ? { scale: 1.01 } : undefined}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 ${
          isDragOver
            ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/30'
            : hasFile
            ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700'
            : uploadError
            ? 'border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-700'
            : 'border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-950/20'
        } ${!isUploading && !hasFile ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (!isUploading && !hasFile) {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          id={`file-${question.id}`}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip"
        />

        {/* Uploading State */}
        {isUploading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative">
              <Loader2 className="size-10 text-violet-500 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
                در حال آپلود فایل...
              </p>
              <p className="text-xs text-violet-500 dark:text-violet-400 mt-1">
                لطفاً صبر کنید
              </p>
            </div>
            {/* Progress bar */}
            <div className="w-full max-w-[200px] h-1.5 bg-violet-100 dark:bg-violet-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-l from-violet-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {!isUploading && hasFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 w-full"
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <CheckCircle2 className="size-6 text-emerald-500" />
            </div>
            <div className="text-center flex-1 min-w-0">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400 truncate max-w-full px-4">
                {uploadedInfo!.filename}
              </p>
              {uploadedInfo!.size && (
                <p className="text-xs text-emerald-500 dark:text-emerald-400/70 mt-1">
                  {uploadedInfo!.size}
                </p>
              )}
            </div>
            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              type="button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors"
            >
              <Trash2 className="size-3.5" />
              حذف فایل
            </motion.button>
          </motion.div>
        )}

        {/* Error State */}
        {!isUploading && uploadError && !hasFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
              <AlertCircle className="size-5 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                آپلود ناموفق
              </p>
              <p className="text-xs text-red-500 dark:text-red-400/70 mt-1 max-w-[250px]">
                {uploadError}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                setUploadError(null);
                inputRef.current?.click();
              }}
              type="button"
              className="rounded-lg px-4 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              تلاش مجدد
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {!isUploading && !hasFile && !uploadError && (
          <div className="flex flex-col items-center">
            <Upload
              className={`size-10 mb-3 transition-colors ${
                isDragOver ? 'text-violet-500' : 'text-gray-400 dark:text-zinc-500'
              }`}
            />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                فایل خود را اینجا بکشید و رها کنید
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                یا کلیک کنید تا فایل انتخاب شود
              </p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2">
                حداکثر ۱۰ مگابایت - فرمت‌های مجاز: JPG, PNG, GIF, PDF, DOC, XLS, TXT, ZIP
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function ImageChoiceQuestion({
  question,
  value,
  onChange,
  themeColor,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
  themeColor: string;
}) {
  const imageOptions = question.config.imageOptions || [];

  return (
    <div className="grid grid-cols-2 gap-3">
      {imageOptions.map((opt) => {
        const isSelected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(opt.id)}
            type="button"
            className={`relative flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all duration-200 ${
              isSelected
                ? 'shadow-lg'
                : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-300 dark:hover:border-zinc-600'
            }`}
            style={isSelected ? { borderColor: themeColor, boxShadow: `0 10px 15px -3px ${themeColor}33` } : undefined}
          >
            {/* Image or placeholder */}
            <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
              {opt.imageUrl ? (
                <img
                  src={opt.imageUrl}
                  alt={opt.text}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 ${opt.imageUrl ? 'hidden' : ''}`}>
                <ImageIcon className="size-10 text-violet-300 dark:text-violet-700" />
              </div>
            </div>
            {/* Label */}
            <div className="w-full py-2.5 px-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
              <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 text-center block truncate">
                {opt.text}
              </span>
            </div>
            {/* Selected overlay */}
            {isSelected && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 left-2 flex items-center justify-center size-7 rounded-full"
                style={{ backgroundColor: themeColor }}
              >
                <Check className="size-4 text-white" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function StatementQuestion({ question }: { question: FormQuestion }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-zinc-700 bg-gradient-to-l from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-5">
      <p className="text-sm leading-relaxed text-gray-700 dark:text-zinc-300 whitespace-pre-wrap">{question.title}</p>
    </div>
  );
}

function MatrixQuestion({
  question,
  value,
  onChange,
  themeColor,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
  themeColor: string;
}) {
  const rows = question.config.matrixRows || [];
  const cols = question.config.matrixCols || [];

  // Parse value: "rowIndex-colIndex"
  const selectedCell = useMemo(() => {
    if (!value) return null;
    const parts = value.split('-');
    if (parts.length !== 2) return null;
    return { row: parseInt(parts[0], 10), col: parseInt(parts[1], 10) };
  }, [value]);

  const handleSelect = (rowIdx: number, colIdx: number) => {
    const cellKey = `${rowIdx}-${colIdx}`;
    onChange(cellKey);
  };

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-w-[400px]"
      >
        <table className="w-full border-collapse rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700">
          <thead>
            <tr>
              <th className="bg-gray-50 dark:bg-zinc-800 p-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 text-right border-b border-gray-200 dark:border-zinc-700 min-w-[120px]">
                {/* Row header placeholder */}
              </th>
              {cols.map((col, ci) => (
                <th
                  key={ci}
                  className="bg-gray-50 dark:bg-zinc-800 p-3 text-xs font-semibold text-gray-600 dark:text-zinc-400 text-center border-b border-gray-200 dark:border-zinc-700 min-w-[80px]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                <td className="bg-gray-50/50 dark:bg-zinc-800/50 p-3 text-sm font-medium text-gray-700 dark:text-zinc-300 text-right border-b border-gray-100 dark:border-zinc-800 whitespace-nowrap">
                  {row}
                </td>
                {cols.map((_, ci) => {
                  const isSelected = selectedCell?.row === ri && selectedCell?.col === ci;
                  return (
                    <td
                      key={ci}
                      className="p-2 text-center border-b border-gray-100 dark:border-zinc-800"
                    >
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSelect(ri, ci)}
                        type="button"
                        className="flex items-center justify-center mx-auto"
                      >
                        <motion.div
                          animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className="relative"
                        >
                          <div
                            className={`h-5 w-5 rounded-full border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-transparent'
                                : 'border-gray-300 dark:border-zinc-600 hover:border-violet-400 dark:hover:border-violet-500'
                            }`}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: themeColor,
                                    boxShadow: `0 2px 8px ${themeColor}40`,
                                  }
                                : undefined
                            }
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div className="h-2 w-2 rounded-full bg-white" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

function QuestionRenderer({
  question,
  value,
  onChange,
  themeColor,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
  themeColor: string;
}) {
  switch (question.type) {
    case 'short_text':
      return <ShortTextQuestion question={question} value={value} onChange={onChange} />;
    case 'long_text':
      return <LongTextQuestion question={question} value={value} onChange={onChange} />;
    case 'multiple_choice':
      return <MultipleChoiceQuestion question={question} value={value} onChange={onChange} themeColor={themeColor} />;
    case 'multiple_select':
      return <MultipleSelectQuestion question={question} value={value} onChange={onChange} themeColor={themeColor} />;
    case 'dropdown':
      return <DropdownQuestion question={question} value={value} onChange={onChange} />;
    case 'number':
      return <NumberQuestion question={question} value={value} onChange={onChange} />;
    case 'email':
      return <EmailQuestion question={question} value={value} onChange={onChange} />;
    case 'phone':
      return <PhoneQuestion question={question} value={value} onChange={onChange} />;
    case 'date':
      return <DateQuestion question={question} value={value} onChange={onChange} />;
    case 'scale':
      return <ScaleQuestion question={question} value={value} onChange={onChange} themeColor={themeColor} />;
    case 'rating':
      return <RatingQuestion question={question} value={value} onChange={onChange} />;
    case 'yes_no':
      return <YesNoQuestion question={question} value={value} onChange={onChange} />;
    case 'file_upload':
      return <FileUploadQuestion question={question} value={value} onChange={onChange} />;
    case 'image_choice':
      return <ImageChoiceQuestion question={question} value={value} onChange={onChange} themeColor={themeColor} />;
    case 'matrix':
      return <MatrixQuestion question={question} value={value} onChange={onChange} themeColor={themeColor} />;
    case 'statement':
      return <StatementQuestion question={question} />;
    case 'section_divider':
      return (
        <div className="py-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-8 w-1 rounded-full"
              style={{ backgroundColor: themeColor }}
            />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{question.title}</h3>
          </div>
          {question.config.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 pr-4">{question.config.description}</p>
          )}
          <div className="mt-4 h-px bg-gradient-to-l from-transparent via-muted-foreground/20 to-transparent" />
        </div>
      );
    default:
      return (
        <div className="text-sm text-gray-400 dark:text-zinc-500">نوع سؤال پشتیبانی نمی‌شود</div>
      );
  }
}

function evaluateCondition(
  condition: { questionId: string; operator: string; value?: string },
  answers: Record<string, string>
): boolean {
  const answerValue = answers[condition.questionId];

  switch (condition.operator) {
    case 'equals':
      return answerValue === condition.value;
    case 'not_equals':
      return answerValue !== condition.value;
    case 'contains':
      return answerValue?.includes(condition.value || '') ?? false;
    case 'not_contains':
      return !(answerValue?.includes(condition.value || ''));
    case 'is_answered':
      return !!answerValue && answerValue.trim() !== '';
    case 'is_not_answered':
      return !answerValue || answerValue.trim() === '';
    default:
      return true;
  }
}

/* ========== Section Splitting Helper ========== */

interface FormSection {
  id: string;
  title: string;
  description: string;
  questions: FormQuestion[];
}

function splitIntoSections(questions: FormQuestion[]): FormSection[] {
  const sections: FormSection[] = [];
  let currentSection: FormSection | null = null;
  let sectionIndex = 0;

  for (const q of questions) {
    if (q.type === 'section_divider') {
      // Start a new section
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        id: q.id,
        title: q.title,
        description: q.config.description || '',
        questions: [],
      };
      sectionIndex++;
    } else {
      if (!currentSection) {
        // First section (before any divider)
        currentSection = {
          id: `__default_section_${sectionIndex}`,
          title: '',
          description: '',
          questions: [],
        };
      }
      currentSection.questions.push(q);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
}

/* ========== Persian Number Converter ========== */

function toPersianDigit(n: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

function isQuestionVisible(
  question: FormQuestion,
  answers: Record<string, string>
): boolean {
  if (!question.logic || !question.logic.enabled) return true;
  if (!question.logic.conditions || question.logic.conditions.length === 0) return true;

  const allConditionsMatch = question.logic.conditions.every((condition) =>
    evaluateCondition(condition, answers)
  );

  if (question.logic.action === 'show') {
    return allConditionsMatch;
  } else {
    // action === 'hide': hide when all conditions match
    return !allConditionsMatch;
  }
}

function SuccessScreen({ customMessage, formId, formTitle, onReturn, onResubmit }: { customMessage?: string; formId?: string; formTitle?: string; onReturn: () => void; onResubmit?: () => void }) {
  const [copied, setCopied] = useState(false);
  const confettiColors = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];
  const confettiParticles = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      color: confettiColors[i % confettiColors.length],
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 4 + Math.random() * 10,
      rotation: Math.random() * 360,
    }));
  }, []);

  const handleCopyLink = async () => {
    if (!formId) return;
    const link = `formsaz.ir/f/${formId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const floatingShapes = React.useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      size: 20 + Math.random() * 40,
      left: 5 + Math.random() * 90,
      top: 5 + Math.random() * 90,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      color: confettiColors[i % confettiColors.length],
      shape: i % 3, // 0=circle, 1=square, 2=diamond
    }));
  }, []);

  const [showMessage, setShowMessage] = useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    if (!formId) return;
    const link = `formsaz.ir/f/${formId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: formTitle || 'فرم', url: link });
      } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch { /* fallback */ }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center justify-center py-8 px-4">
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingShapes.map((shape) => (
          <motion.div
            key={`shape-${shape.id}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.12, 0.12, 0],
              scale: [0.5, 1, 1, 0.5],
              y: [0, -15, -15, -30],
              rotate: [0, 90, 180, 270],
            }}
            transition={{
              duration: shape.duration,
              delay: 0.5 + shape.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute"
            style={{
              left: `${shape.left}%`,
              top: `${shape.top}%`,
              width: shape.size,
              height: shape.size,
              backgroundColor: shape.color,
              borderRadius: shape.shape === 0 ? '50%' : shape.shape === 1 ? '8px' : '4px',
              transform: shape.shape === 2 ? 'rotate(45deg)' : undefined,
            }}
          />
        ))}
      </div>

      {/* CSS Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((p) => (
          <div
            key={p.id}
            className="confetti-particle"
            style={{
              backgroundColor: p.color,
              left: `${p.left}%`,
              top: '-10px',
              width: p.size,
              height: p.size,
              borderRadius: Math.random() > 0.5 ? '2px' : '50%',
              animationDuration: `${p.duration}s`,
              animationDelay: `${0.2 + p.delay}s`,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Framer-motion burst particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => {
          const color = confettiColors[i % confettiColors.length];
          const left = Math.random() * 100;
          const delay = Math.random() * 1.5;
          const duration = 2 + Math.random() * 2;
          return (
            <motion.div
              key={`burst-${i}`}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: [0, -80 - Math.random() * 80, -180 - Math.random() * 60],
                x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 120, (Math.random() - 0.5) * 100],
                scale: [0, 1.4, 0.4],
              }}
              transition={{
                duration,
                delay: 0.3 + delay,
                ease: 'easeOut',
              }}
              className="absolute rounded-full"
              style={{
                backgroundColor: color,
                left: `${left}%`,
                bottom: '35%',
                width: 5 + Math.random() * 6,
                height: 5 + Math.random() * 6,
              }}
            />
          );
        })}
      </div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative rounded-3xl border border-white/30 dark:border-gray-700/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl shadow-violet-200/50 dark:shadow-violet-900/30 p-8 sm:p-10">
          {/* Animated top gradient accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl overflow-hidden">
            <motion.div
              className="h-full w-full"
              style={{
                background: 'linear-gradient(90deg, #7c3aed, #8b5cf6, #a78bfa, #d946ef, #a78bfa, #6d28d9)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Pulsing glow behind checkmark */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.08, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute -top-4 left-1/2 -translate-x-1/2 size-40 rounded-full bg-emerald-400/20 blur-3xl"
          />

          {/* Content */}
          <div className="relative flex flex-col items-center text-center">
            {/* Animated Checkmark with bounce */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.15, 1] }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
              className="relative flex size-24 sm:size-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-200/60 dark:shadow-emerald-900/40 mb-6"
            >
              {/* Rotating ring */}
              <motion.div
                initial={{ rotate: -90 }}
                animate={{ rotate: 270 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.4 }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-300/40 dark:border-emerald-500/30"
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.45, type: 'spring', stiffness: 350, damping: 15 }}
              >
                <svg className="size-12 sm:size-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl sm:text-3xl font-extrabold mb-2 bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent"
            >
              با تشکر از پاسخ شما!
            </motion.h2>

            {/* Form title subtitle */}
            {formTitle && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-3 max-w-xs truncate"
              >
                {formTitle}
              </motion.p>
            )}

            {/* Animated success message */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={showMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="mb-2"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 px-4 py-1.5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={showMessage ? { scale: 1 } : { scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2 className="size-4 text-emerald-500" />
                </motion.div>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  پاسخ شما با موفقیت ثبت شد
                </span>
              </div>
            </motion.div>

            {/* Custom or default message */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-gray-500 dark:text-zinc-400 max-w-sm text-sm leading-relaxed"
            >
              {customMessage || 'از وقتی که برای پاسخگویی گذاشتید، سپاسگزاریم.'}
            </motion.p>

            {/* Subtle hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-xs text-gray-400 dark:text-zinc-500 mt-1 mb-6"
            >
              در صورت نیاز، می‌توانید فرم را دوباره پر کنید
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full flex flex-col gap-2.5"
            >
              {/* Primary: Back to Dashboard */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onReturn}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all w-full"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
              >
                <LayoutDashboard className="size-4" />
                بازگشت به داشبورد
              </motion.button>

              {/* Outline: Fill Again */}
              {onResubmit && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.82 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onResubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all w-full"
                >
                  <RotateCcw className="size-4" />
                  پر کردن فرم مجدد
                </motion.button>
              )}

              {/* Outline: Share Form */}
              <motion.button
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 dark:text-zinc-300 bg-white/80 dark:bg-zinc-800/80 border border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:border-violet-200 dark:hover:border-violet-800 transition-all w-full"
              >
                <Share2 className="size-4" />
                {copied ? 'لینک کپی شد!' : 'اشتراک‌گذاری فرم'}
              </motion.button>
            </motion.div>

            {/* Branding */}
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500 mt-6">
              <FileText className="size-3.5" />
              <span>فرم‌ساز</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function FormFill() {
  const { fillForm, setCurrentView, setFillForm, previousView } = useAppStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [navDirection, setNavDirection] = useState<'forward' | 'backward'>('forward');
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const validationErrorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const prevVisibleIdsRef = useRef<Set<string>>(new Set());
  const toastShownRef = useRef<Set<string>>(new Set());
  const [appearedFromLogic, setAppearedFromLogic] = useState(false);
  const prevCurrentQuestionIdRef = useRef<string | null>(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      if (validationErrorTimerRef.current) clearTimeout(validationErrorTimerRef.current);
    };
  }, []);

  // Toast notification when questions become hidden by conditional logic
  useEffect(() => {
    const currentVisibleIds = new Set(visibleInputQuestions.map((q) => q.id));
    const prevVisibleIds = prevVisibleIdsRef.current;

    if (prevVisibleIds.size > 0) {
      // Check for questions that were visible before but are now hidden
      for (const id of prevVisibleIds) {
        if (!currentVisibleIds.has(id) && !toastShownRef.current.has(id)) {
          const hiddenQuestion = inputQuestions.find((q) => q.id === id);
          if (hiddenQuestion && hiddenQuestion.title) {
            toast(
              <span className="flex items-center gap-2 text-sm">
                <EyeOff className="size-4 text-sky-500" />
                <span>سؤال «{hiddenQuestion.title}» مخفی شد</span>
              </span>,
              {
                duration: 3000,
                className: 'direction-rtl',
              }
            );
            toastShownRef.current.add(id);
          }
        }
      }

      // Clear toast tracking for questions that become visible again
      for (const id of currentVisibleIds) {
        if (!prevVisibleIds.has(id)) {
          toastShownRef.current.delete(id);
        }
      }
    }

    prevVisibleIdsRef.current = currentVisibleIds;

    // Detect if current question appeared due to conditional logic
    const currentQId = currentQuestion?.id || null;
    const prevQId = prevCurrentQuestionIdRef.current;
    if (currentQId && prevQId && currentQId !== prevQId) {
      // Check if the new question was not in the previous visible set but is now
      if (!prevVisibleIds.has(currentQId) || currentVisibleIds.has(currentQId)) {
        // If the question changed not because of navigation (navDirection stays same)
        // We can detect it by checking if the new question is at a different index
        const prevIdx = visibleInputQuestions.findIndex((q) => q.id === prevQId);
        const newIdx = visibleInputQuestions.findIndex((q) => q.id === currentQId);
        if (Math.abs(newIdx - prevIdx) !== 1) {
          setAppearedFromLogic(true);
          setTimeout(() => setAppearedFromLogic(false), 500);
        }
      }
    }
    prevCurrentQuestionIdRef.current = currentQId;
  }, [visibleInputQuestions, inputQuestions, currentQuestion]);

  const formThemeData = useFormTheme(fillForm);
  const themeColor = formThemeData.primaryColor;
  const customWelcomeMessage = formThemeData.welcomeMessage;
  const customSubmitText = formThemeData.submitButtonText;
  const customThankYouMessage = formThemeData.thankYouMessage;
  const progressStyle = formThemeData.progressStyle;

  const questions = useMemo(() => {
    if (!fillForm?.questions) return [];
    return [...fillForm.questions].sort((a, b) => a.order - b.order);
  }, [fillForm]);

  const inputQuestions = useMemo(
    () => questions.filter((q) => q.type !== 'statement' && q.type !== 'section_divider'),
    [questions]
  );

  const visibleInputQuestions = useMemo(
    () => inputQuestions.filter((q) => isQuestionVisible(q, answers)),
    [inputQuestions, answers]
  );

  // Check if form has section dividers
  const hasSections = useMemo(
    () => questions.some((q) => q.type === 'section_divider'),
    [questions]
  );

  // Split visible questions into sections
  const sections = useMemo(() => {
    const visible = visibleInputQuestions;
    if (!hasSections) return [];
    // We need to also include section_divider questions for splitting context
    // But visibleInputQuestions already excludes them.
    // Re-derive from visibleInputQuestions using section_dividers as boundaries.
    // We need the section dividers from the full visible question list.
    const allVisible = questions.filter((q) => isQuestionVisible(q, answers));
    return splitIntoSections(allVisible);
  }, [visibleInputQuestions, hasSections, questions, answers]);

  const totalSections = sections.length;
  const isMultiPageMode = hasSections && totalSections > 0;

  // Cumulative question count offsets per section for global question numbering
  const sectionOffsets = useMemo(() => {
    if (!isMultiPageMode) return [];
    const offsets: number[] = [];
    let cum = 0;
    for (const sec of sections) {
      offsets.push(cum);
      cum += sec.questions.length;
    }
    return offsets;
  }, [isMultiPageMode, sections]);

  const totalPages = isMultiPageMode
    ? totalSections
    : visibleInputQuestions.length;

  // Calculate progress based on answered questions
  const answeredCount = useMemo(
    () => visibleInputQuestions.filter((q) => {
      const val = answers[q.id];
      return val && val.trim() !== '';
    }).length,
    [visibleInputQuestions, answers]
  );

  const progressPercent = visibleInputQuestions.length > 0
    ? Math.round((answeredCount / visibleInputQuestions.length) * 100)
    : 0;

  const currentQuestion = !isMultiPageMode ? visibleInputQuestions[currentPage] : null;
  const currentSection = isMultiPageMode ? sections[currentPage] : null;
  const currentSectionQuestions = currentSection?.questions || [];

  // Find which section the current single question belongs to (single-question mode)
  const currentQuestionSection = useMemo(() => {
    if (isMultiPageMode || !currentQuestion) return null;
    const allVisible = questions.filter((q) => isQuestionVisible(q, answers));
    const allSections = splitIntoSections(allVisible);
    for (const sec of allSections) {
      if (sec.questions.some((q) => q.id === currentQuestion.id)) {
        return sec;
      }
    }
    return null;
  }, [isMultiPageMode, currentQuestion, questions, answers]);

  // Keep currentPage in sync when visible questions change
  useEffect(() => {
    if (totalPages === 0) {
      setCurrentPage(0);
    } else if (currentPage >= totalPages) {
      setCurrentPage(totalPages - 1);
    }
  }, [totalPages, currentPage]);

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    // Show auto-save indicator
    setShowAutoSave(true);
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      setShowAutoSave(false);
    }, 2000);
  }, []);

  const validateCurrentPage = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isMultiPageMode) {
      // Validate all questions in current section
      currentSectionQuestions.forEach((q) => {
        if (q.required) {
          const value = answers[q.id];
          if (!value || value.trim() === '') {
            newErrors[q.id] = 'این فیلد الزامی است';
          }
        }
        if (q.type === 'email' && answers[q.id]) {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(answers[q.id])) {
            newErrors[q.id] = 'لطفاً یک ایمیل معتبر وارد کنید';
          }
        }
      });
    } else if (currentQuestion) {
      // Validate single question
      if (currentQuestion.required && currentQuestion.type !== 'statement') {
        const value = answers[currentQuestion.id];
        if (!value || value.trim() === '') {
          newErrors[currentQuestion.id] = 'این فیلد الزامی است';
        }
      }
      if (currentQuestion.type === 'email' && answers[currentQuestion.id]) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(answers[currentQuestion.id])) {
          newErrors[currentQuestion.id] = 'لطفاً یک ایمیل معتبر وارد کنید';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      if (currentPage < totalPages - 1) {
        setNavDirection('forward');
        setCurrentPage((p) => p + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setNavDirection('backward');
      setCurrentPage((p) => p - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentPage()) {
      // Scroll to first invalid question
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        const el = document.getElementById(`question-card-${firstErrorId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    // Validate all visible questions
    const allErrors: Record<string, string> = {};
    visibleInputQuestions.forEach((q) => {
      if (q.required) {
        const value = answers[q.id];
        if (!value || value.trim() === '') {
          allErrors[q.id] = 'این سؤال الزامی است';
        }
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Show validation error banner
      setShowValidationError(true);
      if (validationErrorTimerRef.current) clearTimeout(validationErrorTimerRef.current);
      validationErrorTimerRef.current = setTimeout(() => {
        setShowValidationError(false);
      }, 5000);
      // Navigate to first error
      const firstErrorId = Object.keys(allErrors)[0];
      const errorIdx = visibleInputQuestions.findIndex((q) => q.id === firstErrorId);
      if (errorIdx >= 0) {
        if (isMultiPageMode) {
          // Find which section contains this question
          let cumulative = 0;
          for (let i = 0; i < sections.length; i++) {
            cumulative += sections[i].questions.length;
            if (errorIdx < cumulative) {
              setNavDirection(i < currentPage ? 'backward' : 'forward');
              setCurrentPage(i);
              break;
            }
          }
        } else {
          setNavDirection(errorIdx < currentPage ? 'backward' : 'forward');
          setCurrentPage(errorIdx);
        }
        // Scroll to first error after navigation
        setTimeout(() => {
          const el = document.getElementById(`question-card-${firstErrorId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      // Only send responses for visible questions
      const visibleIds = new Set(visibleInputQuestions.map((q) => q.id));
      const responses = Object.entries(answers)
        .filter(([questionId]) => visibleIds.has(questionId))
        .map(([questionId, value]) => ({
          questionId,
          value,
        }));

      const res = await fetch(`/api/forms/${fillForm?.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responses }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = useCallback(() => {
    setIsSubmitted(false);
    setAnswers({});
    setErrors({});
    setCurrentPage(0);
  }, []);

  if (!fillForm) {
    return (
      <div dir="rtl" className="min-h-screen form-fill-bg bg-gray-50/50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-gray-400 dark:text-zinc-500">فرمی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  // Check if form is expired
  const isExpired = fillForm.expiresAt && new Date(fillForm.expiresAt) < new Date();

  if (isExpired) {
    return (
      <div dir="rtl" className="min-h-screen form-fill-bg bg-gray-50/50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="flex size-20 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertCircle className="size-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">این فرم منقضی شده است</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
            مهلت پاسخگویی به این فرم به پایان رسیده است و دیگر قابل پر کردن نیست.
          </p>
          <Button
            variant="outline"
            onClick={() => { setFillForm(null); setCurrentView(previousView || 'dashboard'); }}
            className="rounded-xl"
          >
            بازگشت به داشبورد
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div dir="rtl" className="min-h-screen form-fill-bg bg-gray-50/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-xl px-4">
          <SuccessScreen
            customMessage={customThankYouMessage}
            formId={fillForm?.id}
            formTitle={fillForm?.title}
            onReturn={() => { setFillForm(null); setCurrentView('dashboard'); }}
            onResubmit={handleResubmit}
          />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen form-fill-bg bg-gray-50/50 dark:bg-zinc-950">
      <TooltipProvider delayDuration={400}>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 relative">
        {/* Validation Error Banner */}
        <AnimatePresence>
          {showValidationError && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="mb-4 flex items-center gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3"
            >
              <AlertCircle className="size-5 text-red-500 dark:text-red-400 shrink-0" />
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                لطفاً تمام سؤالات الزامی را پاسخ دهید
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auto-save indicator */}
        <AnimatePresence>
          {showAutoSave && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-lg px-4 py-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="size-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center"
              >
                <Check className="size-3 text-emerald-500" />
              </motion.div>
              <span className="text-xs font-medium text-gray-600 dark:text-zinc-300">ذخیره خودکار</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setFillForm(null); setCurrentView(previousView || 'dashboard'); }}
            className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white gap-1.5 rounded-lg"
          >
            <ArrowRight className="size-4" />
            بازگشت
          </Button>
        </motion.div>

        {/* Form Header / Welcome Screen */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Animated gradient background area */}
          <div className="relative overflow-hidden rounded-3xl">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 opacity-95" />

            {/* Dot grid pattern overlay */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Floating decorative gradient orbs */}
            <motion.div
              animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 size-24 rounded-full bg-fuchsia-400/30 blur-2xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, 10, 0], x: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-2 -left-6 size-20 rounded-full bg-violet-300/25 blur-2xl pointer-events-none"
            />
            <motion.div
              animate={{ y: [0, -8, 0], x: [0, 5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute top-1/3 right-1/4 size-16 rounded-full bg-purple-400/20 blur-xl pointer-events-none"
            />

            {/* Glassmorphism welcome card */}
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl p-6 sm:p-8 shadow-lg">
              {/* Animated gradient line at top of card */}
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl overflow-hidden">
                <motion.div
                  className="h-full w-full"
                  style={{
                    background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #d946ef, #a78bfa, #7c3aed)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Custom Welcome Message */}
              {customWelcomeMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-4"
                >
                  <p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{customWelcomeMessage}</p>
                </motion.div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{fillForm.title}</h1>
                  {fillForm.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{fillForm.description}</p>
                  )}
                </div>
                {/* Progress Ring */}
                {visibleInputQuestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative shrink-0"
                  >
                    <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="28" cy="28" r="24"
                        fill="none"
                        className="stroke-white/30 dark:stroke-gray-600/30"
                        strokeWidth="4"
                      />
                      {/* Progress circle */}
                      <motion.circle
                        cx="28" cy="28" r="24"
                        fill="none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 24}
                        initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - progressPercent / 100) }}
                        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                        style={{ stroke: '#ffffff' }}
                      />
                    </svg>
                    {/* Percentage text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        key={progressPercent}
                        initial={{ scale: 1.3, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="text-xs font-bold text-white"
                      >
                        {toPersianDigit(progressPercent)}٪
                      </motion.span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Enhanced Start / شروع button */}
              {visibleInputQuestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 flex justify-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (currentPage === 0) {
                        document.getElementById(`question-card-${visibleInputQuestions[0]?.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className="relative inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-bold text-white shadow-xl transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #6d28d9, #a855f7)',
                      boxShadow: '0 8px 30px -4px rgba(124, 58, 237, 0.5)',
                    }}
                  >
                    {/* Pulse ring animation */}
                    <motion.span
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
                      animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="relative flex items-center gap-2">
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowLeft className="size-4" />
                      </motion.span>
                      شروع
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Section Breadcrumbs (multi-page mode) */}
        {isMultiPageMode && totalSections > 1 && progressStyle !== 'hidden' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="mb-4 flex items-center justify-center gap-1 flex-wrap"
          >
            {sections.map((sec, idx) => {
              const isActive = idx === currentPage;
              const isPast = idx < currentPage;
              return (
                <React.Fragment key={sec.id}>
                  {idx > 0 && (
                    <div className="w-6 h-px bg-gray-200 dark:bg-zinc-700 mx-1" />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (idx < currentPage) {
                        setNavDirection('backward');
                      } else if (idx > currentPage) {
                        if (validateCurrentPage()) {
                          setNavDirection('forward');
                          setCurrentPage(idx);
                        }
                        return;
                      }
                      setCurrentPage(idx);
                    }}
                    className="group flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-200"
                  >
                    <div
                      className="size-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200"
                      style={
                        isActive
                          ? { backgroundColor: themeColor, color: '#fff', boxShadow: `0 2px 8px ${themeColor}33` }
                          : isPast
                          ? { backgroundColor: `${themeColor}1a`, color: themeColor }
                          : { backgroundColor: '#f3f4f6', color: '#9ca3af' }
                      }
                    >
                      {isPast ? (
                        <Check className="size-3" />
                      ) : (
                        <span>{toPersianDigit(idx + 1)}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium transition-colors duration-200 hidden sm:inline ${
                        isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'
                      }`}
                    >
                      {sec.title || `بخش ${toPersianDigit(idx + 1)}`}
                    </span>
                  </button>
                </React.Fragment>
              );
            })}
          </motion.div>
        )}

        {/* Progress Bar */}
        {totalPages > 0 && progressStyle !== 'hidden' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            {/* Glassmorphism progress container */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  {isMultiPageMode
                    ? `بخش ${toPersianDigit(currentPage + 1)} از ${toPersianDigit(totalSections)}`
                    : currentQuestionSection && currentQuestionSection.title
                      ? `بخش «${currentQuestionSection.title}» — سؤال ${toPersianDigit(currentPage + 1)} از ${toPersianDigit(totalPages)}`
                      : `سؤال ${toPersianDigit(currentPage + 1)} از ${toPersianDigit(totalPages)}`}
                </span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-zinc-500">
                    <Clock className="size-3" />
                    زمان تقریبی تکمیل: {toPersianDigit(Math.max(1, Math.ceil(visibleInputQuestions.length / 5)))} دقیقه
                  </span>
                  {/* Gradient percentage text */}
                  <span className="text-xs font-bold bg-gradient-to-l from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {toPersianDigit(progressPercent)}٪ تکمیل شده
                  </span>
                </div>
              </div>
              {progressStyle === 'bar' ? (
                <div className="relative overflow-hidden rounded-full h-2.5 bg-gray-100 dark:bg-zinc-800">
                  {/* Step indicator dots along the progress bar */}
                  {!isMultiPageMode && visibleInputQuestions.length > 1 && visibleInputQuestions.length <= 20 && (
                    <div className="absolute inset-0 flex items-center">
                      {visibleInputQuestions.map((q, idx) => {
                        const position = (idx / (visibleInputQuestions.length - 1)) * 100;
                        const isAnswered = answers[q.id] && answers[q.id].trim() !== '';
                        const isCurrent = idx === currentPage;
                        return (
                          <motion.div
                            key={q.id}
                            className="absolute top-1/2 -translate-y-1/2 z-10"
                            style={{ left: `${position}%` }}
                            animate={isCurrent ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <div
                              className="size-2.5 rounded-full border-2 transition-all duration-300"
                              style={{
                                backgroundColor: isCurrent ? themeColor : isAnswered ? themeColor : '#f3f4f6',
                                borderColor: isCurrent ? themeColor : isAnswered ? themeColor : '#e5e7eb',
                                boxShadow: isCurrent ? `0 0 0 3px ${themeColor}30` : undefined,
                              }}
                            >
                              {/* Pulse ring for current step */}
                              {isCurrent && (
                                <motion.div
                                  className="absolute inset-0 rounded-full"
                                  style={{ backgroundColor: themeColor }}
                                  animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                                />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                  <motion.div
                    className="absolute inset-y-0 right-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                    style={{
                      background: `linear-gradient(to left, ${themeColor}, ${themeColor}aa)`,
                    }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                      }}
                      animate={{ x: ['100%', '-100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
                    />
                  </motion.div>
                </div>
              ) : null}
              {/* Visible questions count */}
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Eye className="size-3.5 text-gray-400 dark:text-zinc-500" />
                <span className="text-xs text-gray-400 dark:text-zinc-500">
                  {toPersianDigit(answeredCount)} از {toPersianDigit(visibleInputQuestions.length)} سؤال
                </span>
                {inputQuestions.length !== visibleInputQuestions.length && (
                  <span className="text-[10px] text-gray-300 dark:text-zinc-600 mr-1">
                    ({toPersianDigit(inputQuestions.length - visibleInputQuestions.length)} مخفی)
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Required fields note */}
        {inputQuestions.some((q) => q.required) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-xs text-zinc-500 dark:text-zinc-400"
          >
            فیلدهای الزامی با * مشخص شده‌اند
          </motion.div>
        )}

        {/* Section Header (multi-page mode) */}
        {isMultiPageMode && currentSection && currentSection.title && (
          <motion.div
            key={`section-header-${currentSection.id}`}
            initial={{ opacity: 0, y: navDirection === 'forward' ? 20 : -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="mb-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className="h-8 w-1 rounded-full"
                style={{ backgroundColor: themeColor }}
              />
              <div className="flex items-center gap-2">
                <BookOpen className="size-5" style={{ color: themeColor }} />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{currentSection.title}</h2>
              </div>
            </div>
            {currentSection.description && (
              <p className="text-sm text-gray-500 dark:text-zinc-400 pr-7 leading-relaxed">{currentSection.description}</p>
            )}
          </motion.div>
        )}

        {/* Question Card(s) */}
        <AnimatePresence mode="wait">
          {isMultiPageMode ? (
            /* Multi-page mode: show all questions in current section */
            <motion.div
              key={currentSection?.id || 'empty'}
              initial={{ opacity: 0, y: navDirection === 'forward' ? 30 : -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: navDirection === 'forward' ? -30 : 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="space-y-6"
            >
              {currentSectionQuestions.map((q, idx) => {
                const globalIdx = (sectionOffsets[currentPage] || 0) + idx;
                const questionHasLogic = q.logic?.enabled && q.logic?.conditions?.length > 0;
                return (
                <motion.div
                  key={q.id}
                  id={`question-card-${q.id}`}
                  initial={{ opacity: 0, height: questionHasLogic ? 0 : 'auto' }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  style={{ overflow: 'hidden' }}
                  className={`rounded-2xl border bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm transition-all duration-300 ${
                    errors[q.id]
                      ? 'border-red-400 dark:border-red-600 shadow-red-200 dark:shadow-red-900/30 ring-2 ring-red-400/30 dark:ring-red-600/30 shake'
                      : 'border-gray-200 dark:border-zinc-800'
                  }`}
                >
                  <QuestionTitle question={q} index={globalIdx} themeColor={themeColor} totalQuestions={visibleInputQuestions.length} />
                  <QuestionRenderer
                    question={q}
                    value={answers[q.id] || ''}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    themeColor={themeColor}
                  />
                  {errors[q.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`error-${q.id}-${errors[q.id]}`}
                      className="flex items-center gap-2 mt-3 text-sm text-red-500 shake"
                    >
                      <AlertCircle className="size-4" />
                      {errors[q.id]}
                    </motion.div>
                  )}
                </motion.div>
                );
              })}
              {currentSectionQuestions.length === 0 && (
                <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm text-center">
                  <p className="text-gray-400 dark:text-zinc-500 text-sm">این بخش خالی است</p>
                </div>
              )}
            </motion.div>
          ) : (
            /* Single-page mode: one question at a time (original behavior) */
            currentQuestion && (
              <motion.div
                key={currentQuestion.id}
                initial={appearedFromLogic ? { opacity: 0, height: 0 } : { opacity: 0, x: navDirection === 'forward' ? 40 : -40 }}
                animate={appearedFromLogic ? { opacity: 1, height: 'auto' } : { opacity: 1, x: 0 }}
                exit={appearedFromLogic ? { opacity: 0, height: 0 } : { opacity: 0, x: navDirection === 'forward' ? -40 : 40 }}
                transition={appearedFromLogic ? { duration: 0.4, ease: 'easeOut' } : { type: 'spring', stiffness: 300, damping: 28 }}
                style={appearedFromLogic ? { overflow: 'hidden' } : undefined}
              >
                <div
                  id={`question-card-${currentQuestion.id}`}
                  className={`rounded-2xl border bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm transition-all duration-300 ${
                    errors[currentQuestion.id]
                      ? 'border-red-400 dark:border-red-600 shadow-red-200 dark:shadow-red-900/30 ring-2 ring-red-400/30 dark:ring-red-600/30 shake'
                      : 'border-gray-200 dark:border-zinc-800'
                  }`}
                >
                  <QuestionTitle question={currentQuestion} index={currentPage} themeColor={themeColor} totalQuestions={visibleInputQuestions.length} />
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.2 }}
                  >
                    <QuestionRenderer
                      question={currentQuestion}
                      value={answers[currentQuestion.id] || ''}
                      onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
                      themeColor={themeColor}
                    />
                  </motion.div>
                  {errors[currentQuestion.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`error-${currentQuestion.id}-${errors[currentQuestion.id]}`}
                      className="flex items-center gap-2 mt-3 text-sm text-red-500 shake"
                    >
                      <AlertCircle className="size-4" />
                      {errors[currentQuestion.id]}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="rounded-full px-6 h-11 disabled:opacity-40 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 shadow-sm hover:shadow-md transition-all"
            >
              <motion.span
                animate={{ rotate: currentPage > 0 ? 0 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <ArrowRight className="size-4" />
                قبلی
              </motion.span>
            </Button>
          </motion.div>

          {currentPage < totalPages - 1 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleNext}
                    className="text-white rounded-full px-6 h-11 shadow-md hover:shadow-lg transition-all hover:brightness-110"
                    style={{
                      background: `linear-gradient(to left, ${themeColor}, ${themeColor}dd)`,
                      boxShadow: `0 4px 14px -3px ${themeColor}44`,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      بعدی
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <ArrowLeft className="size-4" />
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-700 text-[10px] font-mono ml-1">Enter</kbd>
                {' '}یا{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-700 text-[10px] font-mono mr-1">Ctrl+Enter</kbd>
              </TooltipContent>
            </Tooltip>
          ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full px-8 h-11 font-medium shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40 hover:shadow-xl hover:brightness-110 transition-all"
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="size-4 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <Send className="size-4 ml-2" />
                    {customSubmitText}
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-6">
            {isMultiPageMode ? (
              /* Section mode: one dot per section */
              sections.map((sec, idx) => (
                <React.Fragment key={sec.id}>
                  <motion.button
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setNavDirection(idx > currentPage ? 'forward' : 'backward');
                      setCurrentPage(idx);
                    }}
                    className="rounded-full transition-all duration-200 relative"
                    style={{
                      width: idx === currentPage ? 28 : 10,
                      height: idx === currentPage ? 10 : 10,
                      backgroundColor: idx === currentPage ? themeColor : idx < currentPage ? `${themeColor}55` : undefined,
                    }}
                    animate={idx === currentPage ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {idx === currentPage && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: themeColor }}
                        animate={{ scale: [1, 1.8, 2.5], opacity: [0.3, 0.1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </motion.button>
                  {idx < sections.length - 1 && (
                    <div
                      className="w-3 sm:w-6 h-0.5 mx-0.5"
                      style={{
                        backgroundColor: idx < currentPage ? themeColor : '#e5e7eb',
                      }}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              /* Single-question mode: one dot per question (original behavior) */
              visibleInputQuestions.map((q, idx) => (
                <React.Fragment key={q.id}>
                  <motion.button
                    whileHover={{ scale: 1.4 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setNavDirection(idx > currentPage ? 'forward' : 'backward');
                      setCurrentPage(idx);
                    }}
                    className="rounded-full transition-all duration-200 relative"
                    style={{
                      width: idx === currentPage ? 28 : 10,
                      height: idx === currentPage ? 10 : 10,
                      backgroundColor: idx === currentPage ? themeColor : answers[q.id] ? `${themeColor}55` : undefined,
                    }}
                    animate={idx === currentPage ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {idx === currentPage && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: themeColor }}
                        animate={{ scale: [1, 1.8, 2.5], opacity: [0.3, 0.1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </motion.button>
                  {idx < visibleInputQuestions.length - 1 && (
                    <div
                      className="w-3 sm:w-6 h-0.5 mx-0.5"
                      style={{
                        backgroundColor: idx < currentPage ? themeColor : '#e5e7eb',
                      }}
                    />
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        )}
      </div>
      </TooltipProvider>
    </div>
  );
}
