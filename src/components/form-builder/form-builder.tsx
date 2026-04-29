'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Eye,
  Save,
  Send,
  ChevronRight,
  ArrowRight,
  Undo2,
  Redo2,
  Menu,
  Settings,
  Loader2,
  Plus,
  Import,
  CheckCircle2,
  AlertCircle,
  Circle,
  CircleHelp,
  Keyboard,
  Sparkles,
  X,
  Lightbulb,
  CirclePlus,
} from 'lucide-react';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import QuestionTypes from './question-types';
import FormPreview from './form-preview';
import PropertiesPanel from './properties-panel';
import FormSettingsDialog from './form-settings-dialog';
import KeyboardShortcutsDialog from './keyboard-shortcuts-dialog';
import ImportQuestionsDialog from './import-questions-dialog';
import { toast } from 'sonner';

/* ========== Helpers ========== */
function toPersianDigits(str: string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

/* ========== AI Suggestion Dialog ========== */
interface AISuggestedQuestion {
  type: string;
  title: string;
  required: boolean;
  options?: string[] | null;
}

function AISuggestionDialog({
  open,
  onOpenChange,
  formTitle,
  questionCount,
  onAddQuestion,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formTitle: string;
  questionCount: number;
  onAddQuestion: (question: AISuggestedQuestion) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestedQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const questionTypeLabels: Record<string, string> = {
    short_text: 'متن کوتاه',
    long_text: 'متن بلند',
    multiple_choice: 'تک انتخابی',
    multiple_select: 'چند انتخابی',
    dropdown: 'لیست کشویی',
    number: 'عدد',
    email: 'ایمیل',
    phone: 'تلفن',
    date: 'تاریخ',
    rating: 'امتیازدهی',
    scale: 'مقیاس',
    yes_no: 'بله/خیر',
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setSuggestions([]);
      setError(null);
      setAddedIds(new Set());
    }
    onOpenChange(isOpen);
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    setAddedIds(new Set());

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_questions',
          context: {
            title: formTitle || 'فرم جدید',
            description: '',
            existingQuestionCount: questionCount,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.data?.questions && Array.isArray(data.data.questions)) {
        setSuggestions(data.data.questions);
      } else {
        setError(data.error || 'خطا در دریافت پیشنهادات');
      }
    } catch {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchSuggestions();
    }
  }, [open]);

  const handleAddSuggestion = (suggestion: AISuggestedQuestion, index: number) => {
    onAddQuestion(suggestion);
    setAddedIds((prev) => new Set(prev).add(index));
    toast.success(`سؤال "${suggestion.title}" اضافه شد`);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-lg p-0 gap-0 overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800"
      >
        {/* Header with glassmorphism */}
        <DialogHeader className="relative p-6 pb-4 border-b border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-bl from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/40 dark:via-purple-950/30 dark:to-fuchsia-950/30" />
          <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/20 backdrop-blur-sm" />
          <div className="absolute -top-6 -left-6 size-24 rounded-full bg-violet-200/40 dark:bg-violet-800/20 blur-2xl" />
          <div className="absolute -bottom-4 -right-4 size-20 rounded-full bg-fuchsia-200/40 dark:bg-fuchsia-800/20 blur-2xl" />

          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20"
            >
              <Sparkles className="size-5 text-white" />
            </motion.div>
            <div className="text-right flex-1 min-w-0">
              <DialogTitle className="text-base font-extrabold text-gray-900 dark:text-white">
                پیشنهاد هوشمند سؤال
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {formTitle} · {toPersianDigits(String(questionCount))} سؤال موجود
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={() => !loading && fetchSuggestions()}
              disabled={loading}
            >
              <motion.div animate={loading ? { rotate: 360 } : {}} transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}>
                <Loader2 className={`h-4 w-4 ${loading ? 'text-violet-500' : ''}`} />
              </motion.div>
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 min-h-[200px]">
          {/* Loading state */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="size-2 rounded-full bg-violet-400"
                />
                <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                  هوش مصنوعی در حال فکر کردن...
                </span>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-gray-200/80 dark:border-gray-700/80 p-3">
                  <Skeleton className="h-4 w-3/4 rounded-md mb-2" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                </div>
              ))}
            </motion.div>
          )}

          {/* Error state */}
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="flex size-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 mb-3">
                <AlertCircle className="size-6 text-red-500" />
              </div>
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-xl text-xs"
                onClick={fetchSuggestions}
              >
                تلاش مجدد
              </Button>
            </motion.div>
          )}

          {/* Suggestions list */}
          {!loading && !error && suggestions.length > 0 && (
            <ScrollArea className="max-h-[360px] pr-1">
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => {
                  const isAdded = addedIds.has(index);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index, duration: 0.25 }}
                      className={cn(
                        'group relative rounded-xl border border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80 p-3 transition-all duration-200',
                        isAdded
                          ? 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20 opacity-60'
                          : 'hover:border-violet-200 dark:hover:border-violet-800/50 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/50 text-xs font-bold text-violet-600 dark:text-violet-400">
                          {toPersianDigits(String(index + 1))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                            {suggestion.title}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-medium px-2 py-0.5 h-5 border-0 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400"
                            >
                              {questionTypeLabels[suggestion.type] || suggestion.type}
                            </Badge>
                            {suggestion.required && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] font-medium px-2 py-0.5 h-5 border-0 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                              >
                                الزامی
                              </Badge>
                            )}
                            {suggestion.options && (
                              <span className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-[200px]">
                                {suggestion.options.join(' · ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {isAdded ? (
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                              <CheckCircle2 className="size-4" />
                            </div>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddSuggestion(suggestion, index)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors border border-violet-200/60 dark:border-violet-800/40"
                            >
                              <CirclePlus className="size-3" />
                              افزودن
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {/* Empty suggestions */}
          {!loading && !error && suggestions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-violet-100/60 dark:bg-violet-900/30 mb-3">
                <Lightbulb className="size-6 text-violet-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">پیشنهادی یافت نشد</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FormBuilder() {
  const { questions, selectedQuestionId, currentForm, setCurrentForm, setFillForm, formTheme, setFormTheme, setCurrentView, canUndo, canRedo, undo, redo, addQuestion, removeQuestion, setSelectedQuestionId, moveQuestionUp, moveQuestionDown } = useAppStore();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [importOpen, setImportOpen] = useState(false);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const [formTitle, setFormTitle] = useState(currentForm?.title || 'فرم بدون عنوان');
  const [formDescription, setFormDescription] = useState(currentForm?.description || '');
  const [showFab, setShowFab] = useState(false);
  const hasUnsavedChanges = useRef(false);

  const handleSave = useCallback(async (isAutoSave = false) => {
    if (isAutoSave) {
      setAutoSaveStatus('saving');
    } else {
      setIsSaving(true);
    }
    try {
      const payload = {
        title: formTitle,
        description: formDescription || null,
        theme: formTheme,
        status: currentForm?.status || 'draft',
        questions: questions.map((q, i) => ({
          type: q.type,
          title: q.title,
          required: q.required,
          order: i,
          config: q.config,
          logic: q.logic || undefined,
        })),
      };

      let res;
      if (currentForm?.id) {
        res = await fetch(`/api/forms/${currentForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const savedForm = await res.json();
        setCurrentForm(savedForm);
        if (isAutoSave) {
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 3000);
        } else {
          toast.success('فرم با موفقیت ذخیره شد');
          setAutoSaveStatus('idle');
        }
      } else {
        if (isAutoSave) {
          setAutoSaveStatus('error');
          setTimeout(() => setAutoSaveStatus('dirty'), 4000);
        } else {
          toast.error('خطا در ذخیره فرم');
        }
      }
    } catch {
      if (isAutoSave) {
        setAutoSaveStatus('error');
        setTimeout(() => setAutoSaveStatus('dirty'), 4000);
      } else {
        toast.error('خطا در ذخیره فرم');
      }
    } finally {
      setIsSaving(false);
      if (!isAutoSave) {
        hasUnsavedChanges.current = false;
      } else {
        hasUnsavedChanges.current = false;
      }
    }
  }, [formTitle, formDescription, formTheme, currentForm, questions, setCurrentForm]);

  // Track unsaved changes
  useEffect(() => {
    if (questions.length > 0) {
      hasUnsavedChanges.current = true;
      setAutoSaveStatus('dirty');
    }
  }, [questions, formTitle, formDescription, formTheme]);

  // Auto-save every 30 seconds when there are unsaved changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges.current && questions.length > 0) {
        handleSave(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [handleSave, questions.length]);

  // Show FAB after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setShowFab(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handlePublish = async () => {
    if (questions.length === 0) {
      toast.error('لطفاً حداقل یک سؤال اضافه کنید');
      return;
    }
    setIsPublishing(true);
    try {
      // Save first if new form
      const payload = {
        title: formTitle,
        description: formDescription || null,
        theme: formTheme,
        status: 'published',
        questions: questions.map((q, i) => ({
          type: q.type,
          title: q.title,
          required: q.required,
          order: i,
          config: q.config,
          logic: q.logic || undefined,
        })),
      };

      let res;
      if (currentForm?.id) {
        res = await fetch(`/api/forms/${currentForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const savedForm = await res.json();
        setCurrentForm(savedForm);
        setFillForm(savedForm);
        toast.success('فرم با موفقیت منتشر شد!');
        setCurrentView('fill');
      } else {
        toast.error('خطا در انتشار فرم');
      }
    } catch {
      toast.error('خطا در انتشار فرم');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = () => {
    const previewForm = {
      id: currentForm?.id || 'preview',
      title: formTitle,
      description: formDescription || null,
      theme: JSON.stringify(formTheme),
      status: 'draft',
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiresAt: null,
      questions,
      _count: { submissions: 0 },
    };
    setFillForm(previewForm);
    setCurrentView('fill');
  };

  const handleAddQuickQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: 'short_text',
      title: 'سؤال متنی کوتاه',
      required: false,
      order: questions.length,
      config: { placeholder: '' },
    };
    addQuestion(newQuestion);
  };

  const handleAddAISuggestion = (suggestion: AISuggestedQuestion) => {
    const newQuestion = {
      id: crypto.randomUUID(),
      type: suggestion.type || 'short_text',
      title: suggestion.title,
      required: suggestion.required || false,
      order: questions.length,
      config: {
        ...(suggestion.options
          ? {
              options: suggestion.options.map((opt) => ({
                id: crypto.randomUUID(),
                text: opt,
              })),
            }
          : {}),
        placeholder: '',
      },
    };
    addQuestion(newQuestion);
  };

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore when typing in inputs/textareas
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement).isContentEditable) {
      // Only handle Escape and Ctrl+S even inside inputs
      if (e.key === 'Escape') {
        (e.target as HTMLElement).blur();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
        return;
      }
      return;
    }

    // Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (canUndo) undo();
      return;
    }
    // Redo (Ctrl+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
      e.preventDefault();
      if (canRedo) redo();
      return;
    }
    // Redo (Ctrl+Y)
    if ((e.ctrlKey || e.metaKey) && e.key === 'y' && !e.shiftKey) {
      e.preventDefault();
      if (canRedo) redo();
      return;
    }
    // Save (Ctrl+S)
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
      return;
    }
    // Form Settings (Ctrl+Shift+S)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      return;
    }
    // Delete selected question
    if (e.key === 'Delete' && selectedQuestionId !== null) {
      e.preventDefault();
      removeQuestion(selectedQuestionId);
      return;
    }
    // Escape - deselect question
    if (e.key === 'Escape' && selectedQuestionId !== null) {
      e.preventDefault();
      setSelectedQuestionId(null);
      return;
    }
  }, [canUndo, canRedo, undo, redo, selectedQuestionId, removeQuestion, setSelectedQuestionId, handleSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const hasQuestions = questions.length > 0;
  const hasSelection = selectedQuestionId !== null;

  return (
    <div className="flex h-screen flex-col bg-muted/30 overflow-hidden" dir="rtl">
      {/* ============ TOOLBAR ============ */}
      <header className="relative flex h-14 items-center justify-between border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-sm px-3 sm:px-4 shrink-0 z-20">
        {/* Gradient accent line at top of toolbar */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500" />
        {/* Right section (RTL - logo/nav) */}
        <div className="flex items-center gap-2">
          {/* Mobile menu buttons */}
          <div className="flex items-center gap-1 sm:hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setMobileLeftOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>انواع سؤال</TooltipContent>
            </Tooltip>
            {hasSelection && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setMobileRightOpen(true)}
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>تنظیمات سؤال</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Desktop collapse buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setLeftCollapsed(!leftCollapsed)}
                >
                  {leftCollapsed ? (
                    <PanelLeftOpen className="h-4 w-4" />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{leftCollapsed ? 'نمایش پنل سؤال‌ها' : 'بستن پنل سؤال‌ها'}</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* Mobile question count badge */}
          <Badge
            variant="secondary"
            className="sm:hidden shrink-0 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 text-[10px] px-1.5 py-0 gap-0.5 font-semibold"
          >
            <CircleHelp className="h-2.5 w-2.5" />
            {toPersianDigits(String(questions.length))} سؤال
          </Badge>

          <div className="flex items-center gap-2">
            <button
              onClick={() => useAppStore.getState().setCurrentView('dashboard')}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">بازگشت</span>
            </button>
          </div>
        </div>

        {/* Center - Form title */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-center max-w-md mx-4">
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 flex-1 justify-center">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-sm font-medium text-foreground bg-transparent border-none outline-none w-full text-center truncate"
              placeholder="عنوان فرم..."
            />
            <Badge
              variant="secondary"
              className="shrink-0 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-0 text-xs font-bold px-2.5 py-1 rounded-full"
            >
              {toPersianDigits(String(questions.length))} سؤال
            </Badge>
          </div>
          {formTitle.length > 0 && (
            <span className={cn(
              'text-[11px] tabular-nums shrink-0 transition-colors',
              formTitle.length > 150
                ? 'text-red-500 dark:text-red-400'
                : 'text-muted-foreground'
            )}>
              {toPersianDigits(String(formTitle.length))} / {toPersianDigits('150')}
            </span>
          )}
        </div>

        {/* Left section (RTL - actions) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Undo/Redo */}
          <div className="hidden lg:flex items-center gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  disabled={!canUndo}
                  onClick={undo}
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>برگشت (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  disabled={!canRedo}
                  onClick={redo}
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>دوباره (Ctrl+Shift+Z)</TooltipContent>
            </Tooltip>
          </div>

          {/* Auto-save indicator */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-in fade-in duration-300">
            {autoSaveStatus === 'idle' && (
              <>
                <Circle className="size-2.5 text-gray-400 dark:text-gray-500" fill="currentColor" />
                <span className="hidden sm:inline">ذخیره خودکار غیرفعال</span>
              </>
            )}
            {autoSaveStatus === 'dirty' && (
              <>
                <Circle className="size-2.5 text-gray-400 dark:text-gray-500" fill="currentColor" />
                <span className="hidden sm:inline">تغییرات ذخیره نشده</span>
              </>
            )}
            {autoSaveStatus === 'saving' && (
              <>
                <Loader2 className="size-2.5 animate-spin text-blue-500" />
                <span className="hidden sm:inline text-blue-500 dark:text-blue-400">در حال ذخیره...</span>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <CheckCircle2 className="size-2.5 text-emerald-500" />
                <span className="hidden sm:inline text-emerald-500 dark:text-emerald-400">ذخیره شد</span>
              </>
            )}
            {autoSaveStatus === 'error' && (
              <>
                <AlertCircle className="size-2.5 text-red-500" />
                <span className="hidden sm:inline text-red-500 dark:text-red-400">خطا در ذخیره</span>
              </>
            )}
          </div>

          <Separator orientation="vertical" className="h-6 mx-0.5 hidden lg:block" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => setImportOpen(true)}
              >
                <Import className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>وارد کردن سؤال</TooltipContent>
          </Tooltip>

          <KeyboardShortcutsDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <span>
                    <Keyboard className="h-4 w-4" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>میانبرهای کلیدی (Ctrl+/)</TooltipContent>
            </Tooltip>
          </KeyboardShortcutsDialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs sm:text-sm bg-gradient-to-l from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 text-violet-700 dark:text-violet-400 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-950/60 dark:hover:to-purple-950/60 border border-violet-200/60 dark:border-violet-800/40"
                onClick={() => setAiSuggestionOpen(true)}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </motion.div>
                <span className="hidden sm:inline">پیشنهاد هوشمند</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>پیشنهاد سؤال با هوش مصنوعی</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">پیش‌نمایش</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>مشاهده پیش‌نمایش فرم</TooltipContent>
          </Tooltip>

          <FormSettingsDialog
            formTitle={formTitle}
            formDescription={formDescription}
            formTheme={formTheme}
            onTitleChange={setFormTitle}
            onDescriptionChange={setFormDescription}
            onThemeChange={setFormTheme}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <span>
                    <Settings className="h-4 w-4" />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>تنظیمات فرم</TooltipContent>
            </Tooltip>
          </FormSettingsDialog>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs sm:text-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">{isSaving ? 'در حال ذخیره...' : 'ذخیره'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>ذخیره فرم</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="h-8 gap-1.5 text-xs sm:text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                disabled={!hasQuestions || isPublishing}
                onClick={handlePublish}
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">{isPublishing ? 'در حال انتشار...' : 'انتشار'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>انتشار فرم</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Gradient divider between toolbar and content */}
      <div className="h-px bg-gradient-to-l from-transparent via-violet-300/30 dark:via-violet-700/20 to-transparent shrink-0" />

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 overflow-hidden relative">
        {/* Desktop layout */}
        <div className="hidden sm:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Question Types */}
            <ResizablePanel
              defaultSize={18}
              minSize={12}
              maxSize={25}
              collapsedSize={4}
              collapsible
              collapsed={leftCollapsed}
              onCollapse={() => setLeftCollapsed(true)}
              onExpand={() => setLeftCollapsed(false)}
            >
              <div
                className={cn(
                  'h-full transition-all',
                  'bg-gradient-to-b from-violet-50/80 via-purple-50/40 to-fuchsia-50/60 dark:from-violet-950/30 dark:via-purple-950/15 dark:to-fuchsia-950/20',
                  'border-l dark:border-violet-500/10'
                )}
              >
                <QuestionTypes collapsed={leftCollapsed} />
              </div>
            </ResizablePanel>

            {/* Enhanced gradient resize handle */}
            <ResizableHandle className="w-px bg-gradient-to-b from-transparent via-violet-300/60 to-transparent dark:via-violet-700/40 hover:via-violet-400/80 dark:hover:via-violet-500/60 transition-all duration-300" />

            {/* Center Panel - Form Preview */}
            <ResizablePanel defaultSize={56} minSize={40}>
              <div className="h-full bg-muted/30 relative">
                <FormPreview
                  formTitle={formTitle}
                  formDescription={formDescription}
                  formTheme={formTheme}
                  onDescriptionChange={setFormDescription}
                />

                {/* FAB - سؤال جدید + */}
                <AnimatePresence>
                  {showFab && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0, y: 20 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
                      className="absolute bottom-6 left-6 z-10"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddQuickQuestion}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-l from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-300/40 dark:shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-400/40 transition-shadow duration-300 breathing-glow"
                          >
                            <Plus className="size-5" />
                            <span className="text-sm font-medium">سؤال جدید</span>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>افزودن سؤال متنی کوتاه</TooltipContent>
                      </Tooltip>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ResizablePanel>

            {/* Enhanced gradient resize handle */}
            <ResizableHandle className="w-px bg-gradient-to-b from-transparent via-violet-300/60 to-transparent dark:via-violet-700/40 hover:via-violet-400/80 dark:hover:via-violet-500/60 transition-all duration-300" />

            {/* Right Panel - Properties */}
            <ResizablePanel
              defaultSize={26}
              minSize={20}
              maxSize={35}
              collapsedSize={0}
              collapsible
              collapsed={rightCollapsed || !hasSelection}
              onCollapse={() => setRightCollapsed(true)}
              onExpand={() => setRightCollapsed(false)}
            >
              <div className="h-full border-r bg-white dark:bg-zinc-950">
                <PropertiesPanel />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile layout */}
        <div className="sm:hidden h-full relative">
          <FormPreview
            formTitle={formTitle}
            formDescription={formDescription}
            formTheme={formTheme}
            onDescriptionChange={setFormDescription}
          />

          {/* Mobile FAB */}
          <AnimatePresence>
            {showFab && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
                className="absolute bottom-5 left-5 z-10"
              >
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddQuickQuestion}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-l from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-300/40 dark:shadow-violet-500/25"
                >
                  <Plus className="size-5" />
                  <span className="text-sm font-medium">سؤال جدید</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============ IMPORT QUESTIONS DIALOG ============ */}
      <ImportQuestionsDialog open={importOpen} onOpenChange={setImportOpen} />

      {/* AI Suggestion Dialog */}
      <AISuggestionDialog
        open={aiSuggestionOpen}
        onOpenChange={setAiSuggestionOpen}
        formTitle={formTitle}
        questionCount={questions.length}
        onAddQuestion={handleAddAISuggestion}
      />

      {/* ============ MOBILE SHEETS ============ */}
      {/* Left sheet - Question types */}
      <Sheet open={mobileLeftOpen} onOpenChange={setMobileLeftOpen}>
        <SheetContent side="right" className="w-[280px] p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-right text-sm">انواع سؤال</SheetTitle>
          </SheetHeader>
          <QuestionTypes collapsed={false} />
        </SheetContent>
      </Sheet>

      {/* Right sheet - Properties */}
      <Sheet open={mobileRightOpen} onOpenChange={setMobileRightOpen}>
        <SheetContent side="left" className="w-[320px] p-0">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="text-right text-sm">تنظیمات سؤال</SheetTitle>
          </SheetHeader>
          <PropertiesPanel />
        </SheetContent>
      </Sheet>
    </div>
  );
}
