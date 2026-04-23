'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Import,
  FileText,
  ChevronLeft,
  Search,
  CheckCircle2,
  ClipboardList,
  CircleDot,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore, type FormQuestion } from '@/lib/store';
import { toast } from 'sonner';

interface FormListItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  questionCount: number;
  questions: FormQuestion[];
}

interface ImportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: {
    label: 'پیش‌نویس',
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    icon: <ClipboardList className="size-3" />,
  },
  published: {
    label: 'منتشر شده',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: <CircleDot className="size-3" />,
  },
  closed: {
    label: 'بسته شده',
    color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    icon: <Lock className="size-3" />,
  },
};

function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
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
    section_divider: 'جداکننده بخش',
    image_choice: 'انتخاب تصویری',
    matrix: 'ماتریس',
  };
  return labels[type] || type;
}

export default function ImportQuestionsDialog({ open, onOpenChange }: ImportQuestionsDialogProps) {
  const { currentForm, questions, setQuestions } = useAppStore();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<FormListItem | null>(null);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/forms');
      if (res.ok) {
        const data = await res.json();
        const allForms: FormListItem[] = (data || []).map((form: Record<string, unknown>) => ({
          id: form.id as string,
          title: form.title as string,
          description: form.description as string | null,
          status: form.status as string,
          createdAt: form.createdAt as string,
          questionCount: ((form as Record<string, unknown>)._count as Record<string, number>)?.questions || 0,
          questions: (form.questions as FormQuestion[]) || [],
        }));
        // Filter out the current form
        const filtered = allForms.filter((f) => f.id !== currentForm?.id);
        setForms(filtered);
      }
    } catch {
      toast.error('خطا در بارگذاری فرم‌ها');
    } finally {
      setLoading(false);
    }
  }, [currentForm?.id]);

  useEffect(() => {
    if (open) {
      fetchForms();
      setSelectedFormId(null);
      setSelectedForm(null);
      setSearchQuery('');
    }
  }, [open, fetchForms]);

  const handleSelectForm = async (formId: string) => {
    setSelectedFormId(formId);
    const form = forms.find((f) => f.id === formId) || null;
    setSelectedForm(form);

    // If questions not loaded, fetch them
    if (form && form.questions.length === 0 && form.questionCount > 0) {
      try {
        const res = await fetch(`/api/forms/${formId}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedForm({
            ...form,
            questions: data.questions || [],
          });
        }
      } catch {
        // silent
      }
    }
  };

  const handleImport = () => {
    if (!selectedForm || !selectedForm.questions.length) return;

    setImporting(true);
    try {
      // Generate new IDs for imported questions and append
      const importedQuestions: FormQuestion[] = selectedForm.questions.map((q, i) => ({
        ...q,
        id: crypto.randomUUID(),
        order: questions.length + i,
        title: q.title,
        config: {
          ...q.config,
          options: q.config.options?.map((o) => ({ ...o, id: crypto.randomUUID() })),
          imageOptions: q.config.imageOptions?.map((o) => ({ ...o, id: crypto.randomUUID() })),
        },
      }));

      setQuestions([...questions, ...importedQuestions]);
      toast.success(`${importedQuestions.length} سؤال با موفقیت وارد شد`);
      onOpenChange(false);
    } catch {
      toast.error('خطا در وارد کردن سؤالات');
    } finally {
      setImporting(false);
    }
  };

  const filteredForms = forms.filter(
    (f) =>
      f.title.includes(searchQuery) ||
      (f.description && f.description.includes(searchQuery))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800"
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 bg-gradient-to-l from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <Import className="size-5 text-violet-500" />
            </div>
            <div className="text-right">
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
                وارد کردن سؤال از فرم دیگر
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                سؤالات از فرم‌های موجود را وارد کنید
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی فرم..."
              className="pr-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="size-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <FileText className="size-7 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {searchQuery ? 'نتیجه‌ای یافت نشد' : 'فرمی برای وارد کردن وجود ندارد'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {searchQuery ? 'عبارت جستجو را تغییر دهید' : 'ابتدا فرم‌های دیگری ایجاد کنید'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* Forms list */}
              <ScrollArea className="flex-1 max-h-[240px]">
                <div className="p-3 space-y-1">
                  {filteredForms.map((form) => (
                    <button
                      key={form.id}
                      onClick={() => handleSelectForm(form.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all duration-200 cursor-pointer ${
                        selectedFormId === form.id
                          ? 'bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 shadow-sm'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                      }`}
                    >
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                        selectedFormId === form.id
                          ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                        <FileText className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          selectedFormId === form.id
                            ? 'text-violet-700 dark:text-violet-300'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {form.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {form.questionCount} سؤال
                          </span>
                          <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
                          <span className="text-[10px] text-gray-500 dark:text-gray-400">
                            {formatDate(form.createdAt)}
                          </span>
                        </div>
                      </div>
                      {selectedFormId === form.id && (
                        <CheckCircle2 className="size-5 text-violet-500 shrink-0" />
                      )}
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${statusConfig[form.status]?.color}`}>
                        {statusConfig[form.status]?.label}
                      </Badge>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {/* Preview section */}
              {selectedForm && selectedForm.questions.length > 0 && (
                <>
                  <Separator />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="size-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        پیش‌نمایش سؤالات ({selectedForm.questions.length} سؤال)
                      </span>
                    </div>
                    <ScrollArea className="max-h-[160px]">
                      <div className="space-y-2">
                        {selectedForm.questions.map((q, i) => (
                          <div
                            key={q.id}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50"
                          >
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] font-bold">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                {q.title}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                                  {getQuestionTypeLabel(q.type)}
                                </Badge>
                                {q.required && (
                                  <span className="text-[9px] text-red-500 dark:text-red-400">الزامی</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-gray-200 dark:border-gray-700 text-sm"
          >
            انصراف
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedForm || !selectedForm.questions.length || importing}
            className="rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-sm shadow-md shadow-violet-200/50 dark:shadow-violet-500/20 gap-1.5"
          >
            {importing ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                در حال وارد کردن...
              </>
            ) : (
              <>
                <Import className="size-4" />
                وارد کردن ({selectedForm?.questions.length || 0} سؤال)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
