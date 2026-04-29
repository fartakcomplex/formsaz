'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Loader2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Star,
  Sparkles,
  Eye,
  Heart,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { templatesData, type TemplateData, type TemplateCategory } from '@/lib/templates-data';
import { specializedFormsMeta } from '@/lib/specialized-forms-meta-client';
import { useAppStore } from '@/lib/store';

// ── Form metadata type (same shape as specialized-forms-meta) ────────────────
type FormMeta = {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  icon: string;
  gradient: string;
  questionCount: number;
};

// ── Category configuration ────────────────────────────────────────────────────

const categoryTabs: { value: string; label: string }[] = [
  { value: 'all', label: 'همه' },
  { value: 'survey', label: 'نظرسنجی' },
  { value: 'registration', label: 'ثبت‌نام' },
  { value: 'feedback', label: 'بازخورد' },
  { value: 'evaluation', label: 'ارزیابی' },
  { value: 'order', label: 'سفارش' },
  { value: 'education', label: 'آموزش' },
  { value: 'health', label: 'سلامت' },
  { value: 'event', label: 'رویداد' },
  { value: 'hr', label: 'منابع انسانی' },
  { value: 'other', label: 'سایر' },
];

const categoryColorMap: Record<TemplateCategory, string> = {
  survey: 'bg-rose-100 text-rose-700',
  registration: 'bg-violet-100 text-violet-700',
  feedback: 'bg-emerald-100 text-emerald-700',
  evaluation: 'bg-amber-100 text-amber-700',
  order: 'bg-sky-100 text-sky-700',
  education: 'bg-indigo-100 text-indigo-700',
  health: 'bg-teal-100 text-teal-700',
  event: 'bg-orange-100 text-orange-700',
  hr: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-700',
};

// Base templates are imported directly (small), specialized forms loaded via client import
const ITEMS_PER_PAGE = 24;

// ── Question type helpers ─────────────────────────────────────────────────────

function getQuestionTypeLabel(type: string): string {
  const map: Record<string, string> = {
    short_text: 'متن کوتاه', long_text: 'متن بلند', multiple_choice: 'چند گزینه‌ای',
    multiple_select: 'چک‌باکس', dropdown: 'دراپ‌داون', rating: 'امتیازدهی',
    scale: 'مقیاس', yes_no: 'بله/خیر', date: 'تاریخ', time: 'ساعت',
    file_upload: 'آپلود فایل', phone: 'تلفن', email: 'ایمیل',
    number: 'عدد', statement: 'بیان', section_divider: 'بخش',
    matrix: 'ماتریسی', slider: 'اسلایدر', url: 'آدرس وب', password: 'رمز عبور',
    color: 'انتخاب رنگ', range: 'نوار لغزان', address: 'آدرس',
    postal_code: 'کد پستی', national_id: 'کد ملی', iban: 'شماره شبا',
    website: 'وب‌سایت', country: 'استان', city: 'شهر',
    education: 'تحصیلات', gender: 'جنسیت', marital_status: 'وضعیت تاهل',
    job_title: 'شغل', company: 'شرکت', emoji_rating: 'امتیاز ایموجی',
    nps: 'شاخص NPS', ranking: 'رتبه‌بندی', thumbs_up_down: 'موافق/مخالف',
    consent: 'تاییدیه', signature: 'امضا', captcha: 'کد امنیتی',
    datetime: 'تاریخ و ساعت', image_choice: 'انتخاب تصویری', map: 'نقشه',
  };
  return map[type] || type;
}

function getQuestionTypeColor(type: string): string {
  const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown', 'country', 'city', 'education', 'gender', 'marital_status', 'image_choice'];
  const textTypes = ['short_text', 'long_text', 'email', 'phone', 'number', 'url', 'password', 'website', 'address', 'job_title', 'company'];
  const ratingTypes = ['rating', 'scale', 'yes_no', 'emoji_rating', 'nps', 'thumbs_up_down', 'ranking'];
  if (choiceTypes.includes(type)) return 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300';
  if (textTypes.includes(type)) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  if (ratingTypes.includes(type)) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  if (type === 'file_upload') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (type === 'date' || type === 'time' || type === 'datetime') return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300';
  if (type === 'range' || type === 'color') return 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300';
  if (type === 'postal_code' || type === 'national_id' || type === 'iban') return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
  if (type === 'consent' || type === 'signature' || type === 'captcha') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300';
}

// ── Animation variants ────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

// ── Icon resolver ─────────────────────────────────────────────────────────────

function TemplateIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name] || LucideIcons.FileText;
  return <IconComponent className={className} />;
}

// ── TemplateCard ──────────────────────────────────────────────────────────────

function TemplateCard({
  template,
  onUse,
  isUsing,
  onPreview,
  isFavorite,
  onToggleFavorite,
  isRecent,
}: {
  template: TemplateData;
  onUse: () => void;
  isUsing: boolean;
  onPreview: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isRecent: boolean;
}) {
  return (
    <motion.div
      variants={cardVariants}
      layout
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="group relative"
    >
      {/* Hover glow border */}
      <div className="absolute -inset-[1.5px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.4), rgba(249,115,22,0.3))',
        }}
      />

      <div className="relative bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden flex flex-col h-full group-hover:shadow-lg transition-shadow duration-300">
        {/* Icon area */}
        <div className={`bg-gradient-to-br ${template.gradient} flex items-center justify-center h-28 relative overflow-hidden`}>
          {/* Decorative shapes */}
          <div className="absolute -top-6 -right-6 size-20 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 size-28 rounded-full bg-white/8" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 rounded-full bg-white/10" />

          {/* Favorite button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
          >
            <Heart className={`size-3.5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
          </button>

          {/* New badge for recent templates */}
          {isRecent && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 z-10"
            >
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-l from-emerald-400 to-teal-500 text-white text-[9px] font-bold shadow-sm">
                جدید
              </span>
            </motion.div>
          )}

          <div className="relative flex size-14 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg">
            <TemplateIcon name={template.icon} className="size-7 text-gray-700" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3.5 gap-2.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[13px] font-bold text-gray-900 leading-relaxed line-clamp-2">
              {template.name}
            </h3>
            <Badge
              variant="secondary"
              className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border-0 font-medium ${categoryColorMap[template.category]}`}
            >
              {template.categoryLabel}
            </Badge>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
            {template.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-1">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <Layers className="size-3" />
              <span>{template.questionCount} سؤال</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={onPreview}
                className="rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 shadow-none text-[11px] font-medium h-8 px-2 transition-all"
              >
                <Eye className="size-3 ml-1" />
                پیش‌نمایش
              </Button>
              <Button
                onClick={onUse}
                disabled={isUsing}
                size="sm"
                className="rounded-lg bg-gradient-to-l from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white shadow-sm text-[11px] font-medium h-8 px-3 transition-all"
              >
                {isUsing ? (
                  <Loader2 className="size-3 ml-1 animate-spin" />
                ) : (
                  <Sparkles className="size-3 ml-1" />
                )}
                استفاده
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── TemplateGallery ──────────────────────────────────────────────────────────

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TemplateGallery({ open, onOpenChange }: TemplateGalleryProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usingTemplateId, setUsingTemplateId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | FormMeta | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<TemplateData['questions'] | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  // Merge base templates with specialized forms directly from client-side import
  // (no server API call needed — avoids OOM in constrained environments)
  const [allTemplatesMeta] = useState<(TemplateData | FormMeta)[]>(() => {
    const existingIds = new Set(templatesData.map((t) => t.id));
    const uniqueMeta = specializedFormsMeta.filter((t) => !existingIds.has(t.id));
    return [...templatesData, ...uniqueMeta];
  });
  const [loadingMeta] = useState(false);
  const { setCurrentForm, setCurrentView, setForms, forms } = useAppStore();

  // Load questions for preview (lazy for specialized forms)
  React.useEffect(() => {
    if (!previewTemplate) {
      setPreviewQuestions(null);
      return;
    }
    // If it's a TemplateData with questions already
    if ('questions' in previewTemplate && previewTemplate.questions && previewTemplate.questions.length > 0) {
      setPreviewQuestions(previewTemplate.questions);
      return;
    }
    // Fetch from API for specialized forms
    let cancelled = false;
    setLoadingPreview(true);
    fetch(`/api/templates?id=${previewTemplate.id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (!cancelled && data?.data?.questions) {
          setPreviewQuestions(data.data.questions);
        } else if (!cancelled) {
          setPreviewQuestions([]);
        }
      })
      .catch(() => { if (!cancelled) setPreviewQuestions([]); })
      .finally(() => { if (!cancelled) setLoadingPreview(false); });
    return () => { cancelled = true; };
  }, [previewTemplate]);

  const filteredTemplates = useMemo(() => {
    let result = allTemplatesMeta;
    if (activeTab !== 'all') {
      result = result.filter((t) => t.category === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categoryLabel.includes(q)
      );
    }
    return result;
  }, [activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleUseTemplate = async (template: TemplateData | FormMeta) => {
    try {
      setUsingTemplateId(template.id);

      // For specialized forms (FormMeta), fetch full data from API
      let questions: TemplateData['questions'] = ('questions' in template && template.questions)
        ? template.questions
        : [];

      if (!('questions' in template) || !template.questions) {
        const res = await fetch(`/api/templates?id=${template.id}`);
        if (res.ok) {
          const data = await res.json();
          questions = data.data?.questions || [];
        }
      }

      const questionsPayload = questions.map((q, i) => ({
        ...q,
        id: `q-${Date.now()}-${i}`,
        order: i,
      }));

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
        onOpenChange(false);
      }
    } catch (err) {
      console.error('Failed to create form from template:', err);
    } finally {
      setUsingTemplateId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="max-w-5xl w-[95vw] sm:w-full max-h-[92vh] overflow-hidden flex flex-col p-0 rounded-2xl border-gray-200 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-gray-50 to-white border-b border-gray-100 px-5 py-4 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                <Star className="size-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  گالری الگوها
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 mt-0.5">
                  {loadingMeta
                    ? 'در حال بارگذاری...'
                    : `${allTemplatesMeta.length} الگوی آماده (شامل فرم‌های تخصصی)`
                  }
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="rounded-full hover:bg-gray-100 size-9"
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="جستجو در الگوها..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pr-10 h-9 rounded-xl border-gray-200 bg-white text-sm focus:border-purple-300 focus:ring-purple-100"
            />
          </div>

          {/* Category stats */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.filter(t => t.value !== 'all').map((cat) => {
              const count = allTemplatesMeta.filter(t => t.category === cat.value).length;
              if (count === 0) return null;
              return (
                <motion.div
                  key={cat.value}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap cursor-pointer hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
                  onClick={() => handleTabChange(cat.value)}
                >
                  {cat.label}
                  <span className="font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full px-1.5 min-w-[20px] text-center">
                    {count}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Category tabs */}
        <div className="px-5 pt-3 pb-1 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.map((tab) => {
              const count = tab.value === 'all'
                ? allTemplatesMeta.length
                : allTemplatesMeta.filter((t) => t.category === tab.value).length;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                    activeTab === tab.value
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.value ? 'bg-white/20' : 'bg-gray-200/80'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results info + grid */}
        <div className="flex-1 overflow-hidden flex flex-col px-5 pb-1">
          <div className="flex items-center justify-between py-2">
            <p className="text-xs text-gray-500">
              {filteredTemplates.length} الگو یافت شد
            </p>
            {totalPages > 1 && (
              <p className="text-xs text-gray-400">
                صفحه {currentPage} از {totalPages}
              </p>
            )}
          </div>

          <div className="overflow-y-auto flex-1 pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${searchQuery}-${currentPage}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
              >
                {paginatedTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onUse={() => handleUseTemplate(template)}
                    isUsing={usingTemplateId === template.id}
                    onPreview={() => setPreviewTemplate(template)}
                    isFavorite={favorites.has(template.id)}
                    onToggleFavorite={() => toggleFavorite(template.id)}
                    isRecent={/health-\d{2,}$/.test(template.id) && parseInt(template.id.replace('health-', ''), 10) >= 80}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredTemplates.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <Search className="size-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">الگویی یافت نشد</p>
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-3 border-t border-gray-100 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="size-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs ${currentPage === pageNum ? 'bg-gray-900 hover:bg-gray-800' : ''}`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      {/* Template Preview Dialog */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Glassmorphism overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => { setPreviewTemplate(null); setPreviewQuestions(null); }}
            />

            {/* Dialog content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              dir="rtl"
              className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="relative p-5 pb-4 border-b border-gray-100 dark:border-gray-800 overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-gradient-to-bl from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/30" />
                <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/20 backdrop-blur-sm" />
                <div className="absolute -top-6 -left-6 size-24 rounded-full bg-violet-200/40 dark:bg-violet-800/20 blur-2xl" />
                <div className="absolute -bottom-4 -right-4 size-20 rounded-full bg-fuchsia-200/40 dark:bg-fuchsia-800/20 blur-2xl" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${previewTemplate.gradient} shadow-lg shrink-0`}
                      >
                        <TemplateIcon name={previewTemplate.icon} className="size-5 text-white" />
                      </motion.div>
                      <div className="text-right min-w-0">
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-white truncate">
                          {previewTemplate.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {previewTemplate.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPreviewTemplate(null)}
                      className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X className="size-4 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0.5 rounded-full border-0 font-medium ${categoryColorMap[previewTemplate.category]}`}
                    >
                      {previewTemplate.categoryLabel}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0.5 rounded-full border-0 font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    >
                      <Layers className="size-3 ml-1" />
                      {previewTemplate.questionCount} سؤال
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Questions list */}
              <div className="flex-1 overflow-y-auto p-5">
                {loadingPreview ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="size-8 border-2 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
                    <p className="text-sm text-gray-400">در حال بارگذاری...</p>
                  </div>
                ) : previewQuestions && previewQuestions.length > 0 ? (
                <div className="space-y-2.5">
                  {previewQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * index, duration: 0.25 }}
                      className="p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 hover:bg-violet-50/80 dark:hover:bg-violet-950/30 border border-transparent hover:border-violet-100 dark:hover:border-violet-900/50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* Step number badge */}
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                          {index + 1}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                              {question.title}
                            </span>
                            {/* Required indicator */}
                            {question.required ? (
                              <span className="shrink-0 text-[10px] font-bold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 rounded">
                                الزامی
                              </span>
                            ) : (
                              <span className="shrink-0 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                                اختیاری
                              </span>
                            )}
                          </div>

                          {/* Type badge */}
                          <Badge
                            variant="secondary"
                            className={`mt-1.5 text-[10px] font-medium px-2 py-0.5 h-5 border-0 ${getQuestionTypeColor(question.type)}`}
                          >
                            {getQuestionTypeLabel(question.type)}
                          </Badge>

                          {/* Options for choice-based questions */}
                          {(question.type === 'multiple_choice' || question.type === 'multiple_select' || question.type === 'dropdown') &&
                            question.config?.options &&
                            Array.isArray(question.config.options) &&
                            (question.config.options as { text: string }[]).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {(question.config.options as { text: string }[]).slice(0, 6).map((opt, i) => (
                                  <span
                                    key={i}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                                  >
                                    {opt.text}
                                  </span>
                                ))}
                                {(question.config.options as { text: string }[]).length > 6 && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                                    +{(question.config.options as { text: string }[]).length - 6}
                                  </span>
                                )}
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Layers className="size-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">سؤالات این الگو هنگام انتخاب بارگذاری می‌شود</p>
                  </div>
                )}
              </div>

              {/* Footer action */}
              <div className="p-5 pt-3 border-t border-gray-100 dark:border-gray-800 shrink-0">
                <Button
                  onClick={() => {
                    handleUseTemplate(previewTemplate!);
                    setPreviewTemplate(null);
                    setPreviewQuestions(null);
                  }}
                  disabled={usingTemplateId === previewTemplate?.id}
                  className="w-full rounded-xl bg-gradient-to-l from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md text-sm font-medium h-10 transition-all"
                >
                  {usingTemplateId === previewTemplate?.id ? (
                    <Loader2 className="size-4 ml-2 animate-spin" />
                  ) : (
                    <Sparkles className="size-4 ml-2" />
                  )}
                  استفاده از این الگو
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
