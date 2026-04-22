'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
} from 'lucide-react';
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
import { useAppStore, type FormQuestion, type QuestionConfig } from '@/lib/store';

const QUESTIONS_PER_PAGE = 1;

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

function QuestionTitle({ question, index, themeColor }: { question: FormQuestion; index: number; themeColor: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <span
          className="flex items-center justify-center size-7 rounded-full text-sm font-bold shrink-0 mt-0.5"
          style={{
            backgroundColor: `${themeColor}1a`,
            color: themeColor,
          }}
        >
          {index + 1}
        </span>
        <Label className="text-base font-semibold text-gray-900 dark:text-white leading-relaxed">
          {question.title}
          {question.required && <span className="text-red-500 mr-1">*</span>}
        </Label>
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

function SuccessScreen({ customMessage }: { customMessage?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-200 dark:shadow-emerald-900/40 mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        >
          <svg className="size-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <motion.path
              d="M5 13l4 4L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
      >
        پاسخ شما با موفقیت ثبت شد!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 dark:text-zinc-400 max-w-md"
      >
        {customMessage || 'از وقتی که برای پاسخگویی گذاشتید، سپاسگزاریم. پاسخ شما ثبت و ذخیره شد.'}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-zinc-500">
          <FileText className="size-4" />
          <span>فرم‌ساز</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function FormFill() {
  const { fillForm, setCurrentView, setFillForm, previousView } = useAppStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    () => questions.filter((q) => q.type !== 'statement'),
    [questions]
  );

  const visibleInputQuestions = useMemo(
    () => inputQuestions.filter((q) => isQuestionVisible(q, answers)),
    [inputQuestions, answers]
  );

  const totalPages = visibleInputQuestions.length;

  const progressPercent = totalPages > 0
    ? Math.round(((currentPage + 1) / totalPages) * 100)
    : 0;

  const currentQuestion = visibleInputQuestions[currentPage];

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
  }, []);

  const validateCurrentPage = (): boolean => {
    if (!currentQuestion) return true;

    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      if (currentPage < totalPages - 1) {
        setCurrentPage((p) => p + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentPage()) return;

    // Validate all visible questions
    const allErrors: Record<string, string> = {};
    visibleInputQuestions.forEach((q) => {
      if (q.required) {
        const value = answers[q.id];
        if (!value || value.trim() === '') {
          allErrors[q.id] = 'این فیلد الزامی است';
        }
      }
    });

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Navigate to first error
      const firstErrorId = Object.keys(allErrors)[0];
      const errorIdx = visibleInputQuestions.findIndex((q) => q.id === firstErrorId);
      if (errorIdx >= 0) {
        setCurrentPage(errorIdx);
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

  if (!fillForm) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-gray-400 dark:text-zinc-500">فرمی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  // Check if form is expired
  const isExpired = fillForm.expiresAt && new Date(fillForm.expiresAt) < new Date();

  if (isExpired) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 flex items-center justify-center px-4">
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
      <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-xl px-4">
          <SuccessScreen customMessage={customThankYouMessage} />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-zinc-950">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
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

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Custom Welcome Message */}
          {customWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 p-4"
            >
              <p className="text-sm leading-relaxed text-violet-700 dark:text-violet-300 whitespace-pre-wrap">{customWelcomeMessage}</p>
            </motion.div>
          )}
          <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{fillForm.title}</h1>
            {fillForm.description && (
              <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed">{fillForm.description}</p>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        {totalPages > 0 && progressStyle !== 'hidden' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                سؤال {currentPage + 1} از {totalPages}
              </span>
              {progressStyle === 'bar' && (
                <span className="text-xs font-bold" style={{ color: themeColor }}>{progressPercent}%</span>
              )}
            </div>
            {progressStyle === 'bar' ? (
              <Progress
                value={progressPercent}
                className="h-2 [&>div]:bg-gradient-to-l [&>div]:to-purple-500"
                style={
                  { '--progress-color': themeColor } as React.CSSProperties
                }
              />
            ) : null}
            <style>{progressStyle === 'bar' ? `
              .progress-bar-fill { background: linear-gradient(to left, ${themeColor}, ${themeColor}bb) !important; }
              [role="progressbar"] > div { background: linear-gradient(to left, ${themeColor}, ${themeColor}bb) !important; }
            ` : ''}</style>
          </motion.div>
        )}

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-sm">
                <QuestionTitle question={currentQuestion} index={currentPage} themeColor={themeColor} />

                <QuestionRenderer
                  question={currentQuestion}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
                  themeColor={themeColor}
                />

                {errors[currentQuestion.id] && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mt-3 text-sm text-red-500"
                  >
                    <AlertCircle className="size-4" />
                    {errors[currentQuestion.id]}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 gap-3">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="rounded-xl px-6 disabled:opacity-40 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            <ArrowRight className="size-4 ml-2" />
            قبلی
          </Button>

          {currentPage < totalPages - 1 ? (
            <Button
              onClick={handleNext}
              className="text-white shadow-md rounded-xl px-6 hover:opacity-90 transition-opacity"
              style={{
                background: `linear-gradient(to left, ${themeColor}, ${themeColor}dd)`,
                boxShadow: `0 4px 6px -1px ${themeColor}33`,
              }}
            >
              بعدی
              <ArrowLeft className="size-4 mr-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40 rounded-xl px-8 font-medium"
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
          )}
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {visibleInputQuestions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentPage(idx)}
                className={`rounded-full transition-all duration-200 ${
                  idx === currentPage
                    ? 'size-3'
                    : answers[q.id]
                    ? 'size-2.5'
                    : 'size-2.5 bg-gray-300 dark:bg-zinc-600'
                }`}
                style={
                  idx === currentPage
                    ? { backgroundColor: themeColor }
                    : answers[q.id]
                    ? { backgroundColor: `${themeColor}66` }
                    : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
