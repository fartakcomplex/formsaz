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

function QuestionTitle({ question, index }: { question: FormQuestion; index: number }) {
  return (
    <div className="mb-4">
      <div className="flex items-start gap-2">
        <span className="flex items-center justify-center size-7 rounded-full bg-indigo-100 text-indigo-600 text-sm font-bold shrink-0 mt-0.5">
          {index + 1}
        </span>
        <Label className="text-base font-semibold text-gray-900 leading-relaxed">
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
        className="h-12 rounded-xl border-gray-200 bg-white text-right text-base focus:border-indigo-400 focus:ring-indigo-100"
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
        className="rounded-xl border-gray-200 bg-white text-right text-base resize-none focus:border-indigo-400 focus:ring-indigo-100"
        dir="rtl"
      />
    </div>
  );
}

function MultipleChoiceQuestion({
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
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {options.map((option) => (
        <motion.label
          key={option.id}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          htmlFor={`radio-${option.id}`}
          className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
            value === option.id
              ? 'border-indigo-300 bg-indigo-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <RadioGroupItem value={option.id} id={`radio-${option.id}`} />
          <span className="text-sm font-medium text-gray-700">{option.text}</span>
        </motion.label>
      ))}
    </RadioGroup>
  );
}

function MultipleSelectQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
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
              ? 'border-indigo-300 bg-indigo-50 shadow-sm'
              : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Checkbox
            id={`checkbox-${option.id}`}
            checked={selected.includes(option.id)}
            onCheckedChange={() => toggleOption(option.id)}
          />
          <span className="text-sm font-medium text-gray-700">{option.text}</span>
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
      <SelectTrigger className="w-full h-12 rounded-xl border-gray-200 bg-white text-right">
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
      className="h-12 rounded-xl border-gray-200 bg-white text-right text-lg focus:border-indigo-400 focus:ring-indigo-100"
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
      className="h-12 rounded-xl border-gray-200 bg-white text-left text-base focus:border-indigo-400 focus:ring-indigo-100"
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
      className="h-12 rounded-xl border-gray-200 bg-white text-left text-base focus:border-indigo-400 focus:ring-indigo-100"
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
      className="h-12 rounded-xl border-gray-200 bg-white text-right text-base focus:border-indigo-400 focus:ring-indigo-100"
      dir="ltr"
    />
  );
}

function ScaleQuestion({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
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
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200 scale-110'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {num}
          </motion.button>
        ))}
      </div>
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-gray-400 px-1">
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
                  : 'text-gray-300'
              }`}
            />
          </motion.button>
        );
      })}
      {ratingValue > 0 && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="mr-3 text-sm font-medium text-gray-500"
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
            ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
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
            ? 'border-red-400 bg-red-50 text-red-700 shadow-md shadow-red-100'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onChange(files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onChange(files[0].name);
    }
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.01 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer ${
          isDragOver
            ? 'border-indigo-400 bg-indigo-50'
            : value
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-gray-300 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50'
        }`}
        onClick={() => document.getElementById(`file-${question.id}`)?.click()}
      >
        <input
          id={`file-${question.id}`}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Upload
          className={`size-10 mb-3 ${
            value ? 'text-emerald-500' : isDragOver ? 'text-indigo-500' : 'text-gray-400'
          }`}
        />
        {value ? (
          <div className="text-center">
            <p className="text-sm font-medium text-emerald-700">{value}</p>
            <p className="text-xs text-emerald-500 mt-1">فایل انتخاب شد</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              فایل خود را اینجا بکشید و رها کنید
            </p>
            <p className="text-xs text-gray-400 mt-1">یا کلیک کنید تا فایل انتخاب شود</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatementQuestion({ question }: { question: FormQuestion }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-l from-gray-50 to-white p-5">
      <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{question.title}</p>
    </div>
  );
}

function QuestionRenderer({
  question,
  value,
  onChange,
}: {
  question: FormQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  switch (question.type) {
    case 'short_text':
      return <ShortTextQuestion question={question} value={value} onChange={onChange} />;
    case 'long_text':
      return <LongTextQuestion question={question} value={value} onChange={onChange} />;
    case 'multiple_choice':
      return <MultipleChoiceQuestion question={question} value={value} onChange={onChange} />;
    case 'multiple_select':
      return <MultipleSelectQuestion question={question} value={value} onChange={onChange} />;
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
      return <ScaleQuestion question={question} value={value} onChange={onChange} />;
    case 'rating':
      return <RatingQuestion question={question} value={value} onChange={onChange} />;
    case 'yes_no':
      return <YesNoQuestion question={question} value={value} onChange={onChange} />;
    case 'file_upload':
      return <FileUploadQuestion question={question} value={value} onChange={onChange} />;
    case 'statement':
      return <StatementQuestion question={question} />;
    default:
      return (
        <div className="text-sm text-gray-400">نوع سؤال پشتیبانی نمی‌شود</div>
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

function SuccessScreen() {
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
        className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-200 mb-8"
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
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        پاسخ شما با موفقیت ثبت شد!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-gray-500 max-w-md"
      >
        از وقتی که برای پاسخگویی گذاشتید، سپاسگزاریم. پاسخ شما ثبت و ذخیره شد.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8"
      >
        <div className="flex items-center gap-2 text-xs text-gray-400">
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
      <div dir="rtl" className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <p className="text-gray-400">فرمی برای نمایش وجود ندارد</p>
      </div>
    );
  }

  // Check if form is expired
  const isExpired = fillForm.expiresAt && new Date(fillForm.expiresAt) < new Date();

  if (isExpired) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50/50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center max-w-md"
        >
          <div className="flex size-20 items-center justify-center rounded-3xl bg-red-100 dark:bg-red-900/30 mb-6">
            <AlertCircle className="size-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">این فرم منقضی شده است</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
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
      <div dir="rtl" className="min-h-screen bg-gray-50/50">
        <div className="mx-auto max-w-xl px-4">
          <SuccessScreen />
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50">
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
            className="text-gray-500 hover:text-gray-900 gap-1.5 rounded-lg"
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
          <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{fillForm.title}</h1>
            {fillForm.description && (
              <p className="text-gray-500 text-sm leading-relaxed">{fillForm.description}</p>
            )}
          </div>
        </motion.div>

        {/* Progress Bar */}
        {totalPages > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">
                سؤال {currentPage + 1} از {totalPages}
              </span>
              <span className="text-xs font-bold text-indigo-600">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2 [&>div]:bg-gradient-to-l [&>div]:from-indigo-500 [&>div]:to-purple-500" />
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
              <div className="rounded-2xl border bg-white p-6 sm:p-8 shadow-sm">
                <QuestionTitle question={currentQuestion} index={currentPage} />

                <QuestionRenderer
                  question={currentQuestion}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(val) => handleAnswerChange(currentQuestion.id, val)}
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
            className="rounded-xl px-6 disabled:opacity-40"
          >
            <ArrowRight className="size-4 ml-2" />
            قبلی
          </Button>

          {currentPage < totalPages - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200 rounded-xl px-6"
            >
              بعدی
              <ArrowLeft className="size-4 mr-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-l from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-200 rounded-xl px-8 font-medium"
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
                  ارسال پاسخ
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
                    ? 'size-3 bg-indigo-500'
                    : answers[q.id]
                    ? 'size-2.5 bg-indigo-300'
                    : 'size-2.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
