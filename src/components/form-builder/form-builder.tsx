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

export default function FormBuilder() {
  const { questions, selectedQuestionId, currentForm, setCurrentForm, setFillForm, formTheme, setFormTheme, setCurrentView, canUndo, canRedo, undo, redo, addQuestion, removeQuestion, setSelectedQuestionId } = useAppStore();
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false);
  const [mobileRightOpen, setMobileRightOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error'>('idle');
  const [importOpen, setImportOpen] = useState(false);
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
      <header className="flex h-14 items-center justify-between border-b bg-white px-3 sm:px-4 shrink-0 z-20 dark:bg-zinc-950">
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
              className="shrink-0 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 text-[11px] px-2 py-0 gap-1 font-semibold"
            >
              <CircleHelp className="h-3 w-3" />
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
      <div className="h-px bg-gradient-to-l from-transparent via-violet-300/50 dark:via-violet-700/30 to-transparent shrink-0" />

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
