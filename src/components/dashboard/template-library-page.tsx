'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Loader2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  X,
  Star,
  Filter,
  FileText,
  Check,
  ToggleLeft,
  Calendar,
  Hash,
  Mail,
  Phone,
  Type,
  AlignRight,
  CircleDot,
  CheckSquare,
  ChevronDown,
  Minus,
  Upload,
  GraduationCap,
  Briefcase,
  HeartPulse,
  CalendarDays,
  Users,
  BarChart3,
  MessageSquareHeart,
  ShoppingBag,
  ClipboardList,
  HelpCircle,
  ArrowUpDown,
  Heart,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  templatesData,
  type TemplateData,
  type TemplateCategory,
} from '@/lib/templates-data';
import { useAppStore, type FormQuestion } from '@/lib/store';
import { cn } from '@/lib/utils';

/* ─── Unified template type ────────────────────────────────────────────── */

export interface FormMeta {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  icon: string;
  gradient: string;
  questionCount: number;
}

export type AnyTemplate = TemplateData | FormMeta;

export function isBaseTemplate(t: AnyTemplate): t is TemplateData {
  return 'questions' in t && Array.isArray((t as TemplateData).questions) && (t as TemplateData).questions.length > 0;
}

/* ─── Favorites storage ─────────────────────────────────────────────────── */

const FAVORITES_KEY = 'formbuilder-favorite-templates';

function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

/* ─── Templates-used storage ─────────────────────────────────────────────── */

const USED_TEMPLATES_KEY = 'formbuilder-used-templates-count';

function getUsedTemplatesCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(USED_TEMPLATES_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

function incrementUsedTemplatesCount() {
  const current = getUsedTemplatesCount();
  localStorage.setItem(USED_TEMPLATES_KEY, String(current + 1));
}

/* ─── Category config ───────────────────────────────────────────────────── */

const categoryTabs: { value: string; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'همه', icon: <Layers className="size-4" /> },
  { value: 'favorites', label: 'برگزیده‌ها', icon: <Heart className="size-4 text-rose-500" /> },
  { value: 'survey', label: 'نظرسنجی', icon: <ClipboardList className="size-4" /> },
  { value: 'registration', label: 'ثبت‌نام', icon: <FileText className="size-4" /> },
  { value: 'feedback', label: 'بازخورد', icon: <MessageSquareHeart className="size-4" /> },
  { value: 'evaluation', label: 'ارزیابی', icon: <BarChart3 className="size-4" /> },
  { value: 'order', label: 'سفارش', icon: <ShoppingBag className="size-4" /> },
  { value: 'education', label: 'آموزش', icon: <GraduationCap className="size-4" /> },
  { value: 'health', label: 'سلامت', icon: <HeartPulse className="size-4" /> },
  { value: 'event', label: 'رویداد', icon: <CalendarDays className="size-4" /> },
  { value: 'hr', label: 'منابع انسانی', icon: <Users className="size-4" /> },
  { value: 'other', label: 'سایر', icon: <HelpCircle className="size-4" /> },
];

const categoryColorMap: Record<string, { bg: string; text: string; border: string; darkBg: string; darkText: string }> = {
  survey: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', darkBg: 'dark:bg-rose-900/30', darkText: 'dark:text-rose-400' },
  registration: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', darkBg: 'dark:bg-violet-900/30', darkText: 'dark:text-violet-400' },
  feedback: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' },
  evaluation: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' },
  order: { bg: 'bg-sky-100', text: 'text-sky-700', border: 'border-sky-200', darkBg: 'dark:bg-sky-900/30', darkText: 'dark:text-sky-400' },
  education: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', darkBg: 'dark:bg-indigo-900/30', darkText: 'dark:text-indigo-400' },
  health: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200', darkBg: 'dark:bg-teal-900/30', darkText: 'dark:text-teal-400' },
  event: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', darkBg: 'dark:bg-orange-900/30', darkText: 'dark:text-orange-400' },
  hr: { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', darkBg: 'dark:bg-pink-900/30', darkText: 'dark:text-pink-400' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', darkBg: 'dark:bg-gray-800', darkText: 'dark:text-gray-400' },
};

const ITEMS_PER_PAGE = 12;

/* ─── Animation variants ─────────────────────────────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const dialogVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0, scale: 0.95, y: 10,
    transition: { duration: 0.2 },
  },
};

/* ─── Icon resolver ──────────────────────────────────────────────────────── */

function TemplateIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name] || LucideIcons.FileText;
  return <IconComponent className={className} />;
}

/* ─── Difficulty helper ──────────────────────────────────────────────────── */

function getDifficulty(count: number): { label: string; bg: string; text: string; darkBg: string; darkText: string } {
  if (count <= 3) return { label: 'ساده', bg: 'bg-emerald-100', text: 'text-emerald-700', darkBg: 'dark:bg-emerald-900/30', darkText: 'dark:text-emerald-400' };
  if (count <= 6) return { label: 'متوسط', bg: 'bg-amber-100', text: 'text-amber-700', darkBg: 'dark:bg-amber-900/30', darkText: 'dark:text-amber-400' };
  return { label: 'پیشرفته', bg: 'bg-rose-100', text: 'text-rose-700', darkBg: 'dark:bg-rose-900/30', darkText: 'dark:text-rose-400' };
}

/* ─── Question type helpers ──────────────────────────────────────────────── */

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

function getQuestionTypeIcon(type: string) {
  const icons: Record<string, React.ReactNode> = {
    short_text: <Type className="size-3.5" />,
    long_text: <AlignRight className="size-3.5" />,
    multiple_choice: <CircleDot className="size-3.5" />,
    multiple_select: <CheckSquare className="size-3.5" />,
    dropdown: <ChevronDown className="size-3.5" />,
    number: <Hash className="size-3.5" />,
    email: <Mail className="size-3.5" />,
    phone: <Phone className="size-3.5" />,
    date: <Calendar className="size-3.5" />,
    scale: <Minus className="size-3.5" />,
    rating: <Star className="size-3.5" />,
    yes_no: <ToggleLeft className="size-3.5" />,
    file_upload: <Upload className="size-3.5" />,
    statement: <FileText className="size-3.5" />,
  };
  return icons[type] || <Type className="size-3.5" />;
}

/* ─── Question Preview in Dialog ─────────────────────────────────────────── */

function QuestionPreviewRow({ question, index }: { question: Omit<FormQuestion, 'id'>; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800/50 transition-colors"
    >
      <div className="flex items-center justify-center size-8 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shrink-0 mt-0.5 shadow-sm">
        <span className="text-violet-600 dark:text-violet-400">
          {getQuestionTypeIcon(question.type)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-1.5 py-0.5 rounded">
            {getQuestionTypeLabel(question.type)}
          </span>
          {question.required && (
            <span className="text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">
              الزامی
            </span>
          )}
        </div>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
          <span className="text-gray-400 ml-1 font-normal">{index + 1}.</span>
          {question.title}
        </p>
        {question.config?.options && question.config.options.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {question.config.options.slice(0, 5).map((opt) => (
              <span
                key={opt.id}
                className="text-[11px] text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2 py-0.5 rounded-md"
              >
                {opt.text}
              </span>
            ))}
            {question.config.options.length > 5 && (
              <span className="text-[11px] text-gray-400 px-1.5 py-0.5">+{question.config.options.length - 5}</span>
            )}
          </div>
        )}
        {question.config?.scaleMinLabel && question.config?.scaleMaxLabel && (
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
            <span>{question.config.scaleMinLabel}</span>
            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full max-w-[100px]" />
            <span>{question.config.scaleMaxLabel}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Template Preview Overlay (inline, no portal) ──────────────────────── */

function TemplatePreviewOverlay({
  template,
  onClose,
  onUse,
  onToggleFavorite,
  isUsing,
  isFavorite,
}: {
  template: AnyTemplate;
  onClose: () => void;
  onUse: () => void;
  onToggleFavorite: () => void;
  isUsing: boolean;
  isFavorite: boolean;
}) {
  const colors = categoryColorMap[template.category] || categoryColorMap['other'];
  const [loadedQuestions, setLoadedQuestions] = useState<Omit<FormQuestion, 'id'>[] | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(!isBaseTemplate(template));

  // Lazy-load questions for specialized forms
  useEffect(() => {
    if (isBaseTemplate(template)) return;
    let cancelled = false;
    fetch(`/api/templates?id=${template.id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (cancelled || !data?.data?.questions) return;
        setLoadedQuestions(data.data.questions);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingQuestions(false); });
    return () => { cancelled = true; };
  }, [template.id]);

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <motion.div
        variants={dialogVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header gradient bar */}
        <div className={cn('h-1.5 w-full bg-gradient-to-l', template.gradient)} />

        {/* Header */}
        <div className="relative px-6 pt-5 pb-4">
          <div className={cn('absolute inset-0 bg-gradient-to-br opacity-[0.04]', template.gradient)} />
          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={cn('flex size-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg text-white shrink-0', template.gradient)}>
                  <TemplateIcon name={template.icon} className="size-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {template.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleFavorite}
                  className={cn(
                    'rounded-full h-9 w-9 transition-all',
                    isFavorite
                      ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                      : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                  )}
                  aria-label={isFavorite ? 'حذف از برگزیده‌ها' : 'افزودن به برگزیده‌ها'}
                >
                  <motion.div
                    animate={isFavorite ? { scale: [1, 1.3, 1], rotate: [0, -15, 15, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <Star className="size-4.5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </motion.div>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 size-9"
                  aria-label="بستن"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* Meta badges */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge
                variant="outline"
                className={cn('text-[11px] font-medium border-0', colors.bg, colors.text, colors.darkBg, colors.darkText)}
              >
                {template.categoryLabel}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Layers className="size-3.5" />
                <span>{template.questionCount} سؤال</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Zap className="size-3.5" />
                <span>رایگان</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Questions list */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
            <FileText className="size-3.5" />
            سؤالات این الگو:
          </p>
          <ScrollArea className="max-h-[45vh]">
            {isBaseTemplate(template) ? (
              <div className="space-y-2 pr-1">
                {template.questions.map((q, idx) => (
                  <QuestionPreviewRow key={idx} question={q} index={idx} />
                ))}
              </div>
            ) : loadingQuestions ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-violet-500 mb-3" />
                <p className="text-sm text-gray-400">در حال بارگذاری سؤالات...</p>
              </div>
            ) : loadedQuestions && loadedQuestions.length > 0 ? (
              <div className="space-y-2 pr-1">
                {loadedQuestions.map((q, idx) => (
                  <QuestionPreviewRow key={idx} question={q} index={idx} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <Layers className="size-8 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-sm text-gray-400">سؤالات این الگو هنگام انتخاب بارگذاری می‌شود</p>
                <p className="text-xs text-gray-400 mt-1">این الگو شامل {template.questionCount} سؤال تخصصی است</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl px-6 border-gray-200 dark:border-gray-700"
            >
              بستن
            </Button>
            <Button
              onClick={onUse}
              disabled={isUsing}
              className="flex-1 h-11 rounded-xl bg-gradient-to-l from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 font-medium text-sm"
            >
              {isUsing ? (
                <>
                  <Loader2 className="size-4 ml-2 animate-spin" />
                  در حال ساخت فرم...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 ml-2" />
                  استفاده از این الگو
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Template Card ─────────────────────────────────────────────────────── */

function TemplateCard({
  template,
  onPreview,
  onUse,
  isUsing,
  isFavorite,
  onToggleFavorite,
}: {
  template: AnyTemplate;
  onPreview: () => void;
  onUse: () => void;
  isUsing: boolean;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
}) {
  const colors = categoryColorMap[template.category] || categoryColorMap['other'];
  const hasQuestions = isBaseTemplate(template);

  return (
    <motion.div variants={cardVariants} layout className="group relative">
      {/* Hover glow border */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.3), rgba(249,115,22,0.2))',
        }}
      />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-sm flex flex-col h-full group-hover:shadow-xl group-hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
        {/* Icon area */}
        <div className={cn('bg-gradient-to-br relative flex items-center justify-center h-32 overflow-hidden', template.gradient)}>
          <div className="absolute -top-8 -right-8 size-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 rounded-full bg-white/10" />

          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl group-hover:scale-110 transition-transform duration-300">
            <TemplateIcon name={template.icon} className="size-8 text-gray-700" />
          </div>

          {/* Favorite button on card */}
          <button
            onClick={onToggleFavorite}
            className="absolute top-3 left-3 size-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900 shadow-sm transition-all z-10"
            aria-label={isFavorite ? 'حذف از برگزیده‌ها' : 'افزودن به برگزیده‌ها'}
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.25, 1] } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Star
                className={cn(
                  'size-4 transition-colors',
                  isFavorite ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
                )}
                fill={isFavorite ? 'currentColor' : 'none'}
              />
            </motion.div>
          </button>
        </div>

        {/* Content */}
        <button
          type="button"
          onClick={onPreview}
          className="flex flex-col flex-1 p-4 gap-2.5 text-right w-full cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed line-clamp-2 flex-1">
              {template.name}
            </h3>
            <Badge
              variant="secondary"
              className={cn(
                'shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border-0 font-medium',
                colors.bg, colors.text, colors.darkBg, colors.darkText
              )}
            >
              {template.categoryLabel}
            </Badge>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
            {template.description}
          </p>

          {/* Mini question type indicators */}
          <div className="flex flex-wrap gap-1 mt-0.5">
            {hasQuestions ? (
              (template as TemplateData).questions.slice(0, 4).map((q, i) => (
                <span
                  key={i}
                  className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-1.5 py-0.5 rounded"
                >
                  {getQuestionTypeLabel(q.type)}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-violet-400 dark:text-violet-500 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 px-1.5 py-0.5 rounded">
                {template.questionCount} سؤال تخصصی
              </span>
            )}
            {hasQuestions && (template as TemplateData).questions.length > 4 && (
              <span className="text-[10px] text-gray-400 dark:text-gray-500 px-1.5 py-0.5">
                +{(template as TemplateData).questions.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'text-[10px] font-medium px-1.5 py-0.5 rounded-full border-0',
                  getDifficulty(template.questionCount).bg,
                  getDifficulty(template.questionCount).text,
                  getDifficulty(template.questionCount).darkBg,
                  getDifficulty(template.questionCount).darkText
                )}
              >
                {getDifficulty(template.questionCount).label}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {template.questionCount} سؤال
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 cursor-pointer transition-colors">
                <Eye className="size-3.5" />
              </span>
              <span
                onClick={(e) => { e.stopPropagation(); onUse(); }}
                className="inline-flex items-center justify-center h-8 rounded-lg bg-gradient-to-l from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 dark:from-gray-200 dark:to-gray-300 text-white dark:text-gray-900 shadow-sm text-xs font-medium px-3 gap-1.5 transition-all cursor-pointer"
              >
                {isUsing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                استفاده
              </span>
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Template Library Page ────────────────────────────────────────── */

type SortOption = 'default' | 'most-questions' | 'least-questions' | 'alpha-asc' | 'alpha-desc';
type QuestionFilterOption = 'all' | '1-3' | '4-6' | '7+';

export default function TemplateLibraryPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<AnyTemplate | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [questionFilter, setQuestionFilter] = useState<QuestionFilterOption>('all');
  const [usedCount, setUsedCount] = useState(0);
  const [allTemplates, setAllTemplates] = useState<AnyTemplate[]>(templatesData);
  const [metaLoaded, setMetaLoaded] = useState(false);
  const { setCurrentForm, setCurrentView, setForms, forms } = useAppStore();

  // Load favorites & used count from localStorage
  useEffect(() => {
    setFavorites(getFavorites());
    setUsedCount(getUsedTemplatesCount());
  }, []);

  // Fetch specialized forms metadata from API
  useEffect(() => {
    if (metaLoaded) return;
    let cancelled = false;
    fetch('/api/templates/list')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (cancelled || !data?.data) return;
        const existingIds = new Set(templatesData.map(t => t.id));
        const uniqueMeta = (data.data as FormMeta[]).filter(t => !existingIds.has(t.id));
        setAllTemplates([...templatesData, ...uniqueMeta]);
        setMetaLoaded(true);
      })
      .catch(() => setMetaLoaded(true));
    return () => { cancelled = true; };
  }, [metaLoaded]);

  const toggleFavorite = useCallback((templateId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId];
      saveFavorites(next);
      return next;
    });
  }, []);

  const filteredTemplates = useMemo(() => {
    let result = allTemplates;

    // Filter by tab
    if (activeTab === 'favorites') {
      result = result.filter((t) => favorites.includes(t.id));
    } else if (activeTab !== 'all') {
      result = result.filter((t) => t.category === activeTab);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categoryLabel.includes(q)
      );
    }

    // Filter by question count range
    if (questionFilter === '1-3') {
      result = result.filter((t) => t.questionCount >= 1 && t.questionCount <= 3);
    } else if (questionFilter === '4-6') {
      result = result.filter((t) => t.questionCount >= 4 && t.questionCount <= 6);
    } else if (questionFilter === '7+') {
      result = result.filter((t) => t.questionCount >= 7);
    }

    // Sort
    switch (sortBy) {
      case 'most-questions':
        result = [...result].sort((a, b) => b.questionCount - a.questionCount);
        break;
      case 'least-questions':
        result = [...result].sort((a, b) => a.questionCount - b.questionCount);
        break;
      case 'alpha-asc':
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        break;
      case 'alpha-desc':
        result = [...result].sort((a, b) => b.name.localeCompare(a.name, 'fa'));
        break;
    }

    return result;
  }, [activeTab, searchQuery, sortBy, favorites, questionFilter, allTemplates]);

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  }, []);

  const handleQuestionFilterChange = useCallback((value: string) => {
    setQuestionFilter(value as QuestionFilterOption);
    setCurrentPage(1);
  }, []);

  const handleUseTemplate = async (template: AnyTemplate) => {
    try {
      setUsingTemplateId(template.id);

      let questionsPayload: Record<string, unknown>[];

      if (isBaseTemplate(template)) {
        questionsPayload = template.questions.map((q, i) => ({
          ...q,
          id: `q-${Date.now()}-${i}`,
          order: i,
        }));
      } else {
        // Fetch questions from API for specialized forms
        const tplRes = await fetch(`/api/templates?id=${template.id}`);
        if (!tplRes.ok) throw new Error('Failed to fetch template');
        const tplData = await tplRes.json();
        if (!tplData?.data?.questions) throw new Error('No questions found');
        questionsPayload = tplData.data.questions;
      }

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.name,
          description: template.description,
          questions: questionsPayload,
        }),
      });

      if (res.ok) {
        const newForm = await res.json();
        setForms([newForm, ...forms]);
        setCurrentForm(newForm);
        setCurrentView('builder');
        setPreviewTemplate(null);
        incrementUsedTemplatesCount();
        setUsedCount((c) => c + 1);
      }
    } catch (err) {
      console.error('Failed to create form from template:', err);
    } finally {
      setUsingTemplateId(null);
    }
  };

  const getPageNumbers = useCallback(() => {
    const pages: number[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1);
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push(-1);
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push(-1);
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  const favCount = favorites.length;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/80 dark:bg-gray-950 flex flex-col">
      {/* ─── Hero Header ─── */}
      <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-300/15 rounded-full blur-2xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => setCurrentView('dashboard')}
              className="text-white/80 hover:text-white hover:bg-white/10 gap-2 rounded-xl"
            >
              <ArrowRight className="size-4" />
              بازگشت به داشبورد
            </Button>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-4 backdrop-blur-sm">
              <Sparkles className="size-4 text-yellow-300" />
              {allTemplates.length} الگوی آماده
              {favCount > 0 && (
                <>
                  <span className="text-white/30 mx-1">|</span>
                  <Heart className="size-3.5 text-rose-300" fill="currentColor" />
                  <span className="text-rose-200">{favCount} برگزیده</span>
                </>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
              گالری الگوهای آماده
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              از میان الگوهای حرفه‌ای انتخاب کنید و در کمتر از ۳۰ ثانیه فرم خود را بسازید
            </p>
          </motion.div>

          {/* Templates used badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex justify-center mb-3"
          >
            {usedCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-medium backdrop-blur-sm">
                <Check className="size-3 text-emerald-300" />
                {usedCount} الگو استفاده شده
              </span>
            )}
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-white/50" />
              <Input
                placeholder="جستجو در الگوها... (مثلاً: نظرسنجی، ثبت‌نام، بازخورد)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-12 h-12 rounded-2xl border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/40 text-sm focus:border-white/40 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Category Tabs ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1.5 overflow-x-auto py-3 scrollbar-none -mx-1 px-1">
            {categoryTabs.map((tab) => {
              const count = tab.value === 'all'
                ? allTemplates.length
                : tab.value === 'favorites'
                ? favCount
                : allTemplates.filter((t) => t.category === tab.value).length;
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0',
                    isActive
                      ? 'bg-gray-900 text-white shadow-md dark:bg-white dark:text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                    isActive ? 'bg-white/20 dark:bg-gray-900/20' : 'bg-gray-200/80 dark:bg-gray-700'
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ─── Results Info & Sort ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-400" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-bold text-gray-900 dark:text-white">{filteredTemplates.length}</span>
              {' '}الگو یافت شد
            </p>
            {activeTab !== 'all' && (
              <Badge variant="outline" className="text-[11px] border-gray-300 dark:border-gray-700">
                {categoryTabs.find(c => c.value === activeTab)?.label}
              </Badge>
            )}
            {searchQuery && (
              <p className="text-sm text-gray-400 hidden sm:block">
                نتایج جستجو برای «<span className="font-medium text-gray-600 dark:text-gray-300">{searchQuery}</span>»
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Select value={questionFilter} onValueChange={handleQuestionFilterChange}>
              <SelectTrigger className="h-8 w-[130px] text-xs rounded-lg border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="تعداد سؤال" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                <SelectItem value="1-3">۱-۳ سؤال</SelectItem>
                <SelectItem value="4-6">۴-۶ سؤال</SelectItem>
                <SelectItem value="7+">۷+ سؤال</SelectItem>
              </SelectContent>
            </Select>
            <ArrowUpDown className="size-3.5 text-gray-400" />
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="h-8 w-[150px] text-xs rounded-lg border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">پیش‌فرض</SelectItem>
                <SelectItem value="most-questions">بیشترین سؤال</SelectItem>
                <SelectItem value="least-questions">کمترین سؤال</SelectItem>
                <SelectItem value="alpha-asc">الفبایی (صعودی)</SelectItem>
                <SelectItem value="alpha-desc">الفبایی (نزولی)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ─── Templates Grid ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${searchQuery}-${currentPage}-${sortBy}-${questionFilter}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {paginatedTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={() => setPreviewTemplate(template)}
                onUse={() => handleUseTemplate(template)}
                isUsing={usingTemplateId === template.id}
                isFavorite={favorites.includes(template.id)}
                onToggleFavorite={(e) => { e.stopPropagation(); toggleFavorite(template.id); }}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="flex size-20 items-center justify-center rounded-3xl bg-gray-100 dark:bg-gray-800 mb-4">
              {activeTab === 'favorites' ? (
                <Heart className="size-10 text-gray-300 dark:text-gray-600" />
              ) : (
                <Search className="size-10 text-gray-300 dark:text-gray-600" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {activeTab === 'favorites' ? 'هنوز برگزیده‌ای ندارید' : 'الگویی یافت نشد'}
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {activeTab === 'favorites'
                ? 'با کلیک روی ستاره، الگوهای مورد علاقه خود را ذخیره کنید'
                : 'عبارت جستجو یا دسته‌بندی دیگری را امتحان کنید'}
            </p>
            <Button
              variant="outline"
              onClick={() => { handleSearchChange(''); handleTabChange('all'); }}
              className="mt-4 rounded-xl"
            >
              {activeTab === 'favorites' ? 'مشاهده همه الگوها' : 'نمایش همه الگوها'}
            </Button>
          </motion.div>
        )}
      </div>

      {/* ─── Pagination ─── */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-9 w-9 rounded-lg"
              >
                <ChevronRight className="size-4" />
              </Button>

              {getPageNumbers().map((pageNum, idx) =>
                pageNum === -1 ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">...</span>
                ) : (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'h-9 w-9 rounded-lg text-sm font-medium transition-all',
                      currentPage === pageNum
                        ? 'bg-gray-900 hover:bg-gray-800 text-white shadow-sm dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {pageNum}
                  </Button>
                )
              )}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-9 w-9 rounded-lg"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
              صفحه {currentPage} از {totalPages}
            </p>
          </div>
        </div>
      )}

      {/* ─── Template Preview Overlay (with AnimatePresence) ─── */}
      <AnimatePresence>
        {previewTemplate && (
          <TemplatePreviewOverlay
            key={previewTemplate.id}
            template={previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            onUse={() => handleUseTemplate(previewTemplate)}
            onToggleFavorite={() => toggleFavorite(previewTemplate.id)}
            isUsing={usingTemplateId === previewTemplate.id}
            isFavorite={favorites.includes(previewTemplate.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
