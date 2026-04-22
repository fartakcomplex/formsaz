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
import { useAppStore } from '@/lib/store';

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

const ITEMS_PER_PAGE = 12;

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
}: {
  template: TemplateData;
  onUse: () => void;
  isUsing: boolean;
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
  const { setCurrentForm, setCurrentView, setForms, forms } = useAppStore();

  const filteredTemplates = useMemo(() => {
    let result = templatesData;
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

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, []);

  const handleUseTemplate = async (template: TemplateData) => {
    try {
      setUsingTemplateId(template.id);

      const questionsPayload = template.questions.map((q, i) => ({
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
                  {templatesData.length} الگوی آماده برای شروع سریع
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
        </div>

        {/* Category tabs */}
        <div className="px-5 pt-3 pb-1 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoryTabs.map((tab) => {
              const count = tab.value === 'all'
                ? templatesData.length
                : templatesData.filter((t) => t.category === tab.value).length;
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
    </Dialog>
  );
}
