'use client';

import React, { useState, useCallback } from 'react';
import {
  X,
  Palette,
  Type,
  AlignRight,
  Square,
  Sparkles,
  Check,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { FormTheme } from '@/lib/store';

/* ========== Constants ========== */

const PRIMARY_COLORS = [
  { label: 'بنفش', value: '#6366f1' },
  { label: 'آبی', value: '#3b82f6' },
  { label: 'سبز زمردی', value: '#10b981' },
  { label: 'سرخ‌رنگ', value: '#f43f5e' },
  { label: 'کهربایی', value: '#f59e0b' },
  { label: 'فیروزه‌ای', value: '#14b8a6' },
  { label: 'سربی', value: '#64748b' },
  { label: 'صورتی', value: '#ec4899' },
];

const BACKGROUND_COLORS = [
  { label: 'سفید', value: '#ffffff', className: 'bg-white border border-gray-200' },
  { label: 'خاکستری روشن', value: '#f9fafb', className: 'bg-gray-50 border border-gray-200' },
  { label: 'آبی روشن', value: '#eff6ff', className: 'bg-blue-50 border border-blue-100' },
  { label: 'بنفش روشن', value: '#f5f3ff', className: 'bg-purple-50 border border-purple-100' },
];

const BORDER_RADIUS_OPTIONS = [
  { label: 'گرد', value: 16, previewClass: 'rounded-2xl' },
  { label: 'استاندارد', value: 8, previewClass: 'rounded-lg' },
  { label: 'تیز', value: 2, previewClass: 'rounded-sm' },
];

const FONT_OPTIONS = [
  { label: 'مدرن', value: 'Vazirmatn' },
  { label: 'کلاسیک', value: 'Vazirmatn' },
  { label: 'مینیمال', value: 'Vazirmatn' },
];

/* ========== Types ========== */

interface FormSettingsDialogProps {
  formTitle: string;
  formDescription: string;
  formTheme: FormTheme;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onThemeChange: (theme: Partial<FormTheme>) => void;
  children: React.ReactNode;
}

/* ========== Component ========== */

export default function FormSettingsDialog({
  formTitle,
  formDescription,
  formTheme,
  onTitleChange,
  onDescriptionChange,
  onThemeChange,
  children,
}: FormSettingsDialogProps) {
  const [open, setOpen] = useState(false);

  /* Local draft state so edits only apply when user explicitly keeps them */
  const [draftTitle, setDraftTitle] = useState(formTitle);
  const [draftDescription, setDraftDescription] = useState(formDescription);
  const [draftTheme, setDraftTheme] = useState<FormTheme>(formTheme);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      /* Snapshot current values when dialog opens */
      setDraftTitle(formTitle);
      setDraftDescription(formDescription);
      setDraftTheme(formTheme);
    }
    setOpen(nextOpen);
  }, [formTitle, formDescription, formTheme]);

  const handleApply = () => {
    onTitleChange(draftTitle);
    onDescriptionChange(draftDescription);
    onThemeChange(draftTheme);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="sm:max-w-[520px] p-0 gap-0 overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-0 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            تنظیمات فرم
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 -mt-1 -ml-1"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <Tabs defaultValue="general" className="px-6 pt-4" dir="rtl">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="general" className="gap-1.5 text-xs sm:text-sm">
              <Type className="h-3.5 w-3.5" />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-1.5 text-xs sm:text-sm">
              <Palette className="h-3.5 w-3.5" />
              ظاهر و تم
            </TabsTrigger>
          </TabsList>

          {/* ---- General Tab ---- */}
          <TabsContent value="general" className="mt-4 pb-6">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-5 px-1">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="settings-title" className="text-sm font-medium">
                    عنوان فرم
                  </Label>
                  <Input
                    id="settings-title"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="عنوان فرم خود را وارد کنید..."
                    className="text-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="settings-desc" className="text-sm font-medium">
                    توضیحات فرم
                  </Label>
                  <Textarea
                    id="settings-desc"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="توضیحات اختیاری فرم را وارد کنید..."
                    className="text-sm min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ---- Theme Tab ---- */}
          <TabsContent value="theme" className="mt-4 pb-6">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 px-1">
                {/* Primary Color */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: draftTheme.primaryColor }}
                    />
                    رنگ اصلی
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIMARY_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() =>
                          setDraftTheme({ ...draftTheme, primaryColor: color.value })
                        }
                        className={cn(
                          'relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all hover:shadow-sm',
                          draftTheme.primaryColor === color.value
                            ? 'border-foreground bg-muted/50'
                            : 'border-transparent bg-muted/30 hover:bg-muted/60'
                        )}
                      >
                        <div
                          className="h-7 w-7 rounded-full shadow-sm ring-2 ring-white"
                          style={{ backgroundColor: color.value }}
                        />
                        <span className="text-[10px] text-muted-foreground leading-none">
                          {color.label}
                        </span>
                        {draftTheme.primaryColor === color.value && (
                          <div className="absolute top-1.5 left-1.5">
                            <Check className="h-3 w-3 text-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Background Color */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    رنگ پس‌زمینه
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {BACKGROUND_COLORS.map((bg) => (
                      <button
                        key={bg.value}
                        type="button"
                        onClick={() =>
                          setDraftTheme({ ...draftTheme, backgroundColor: bg.value })
                        }
                        className={cn(
                          'relative flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all hover:shadow-sm',
                          draftTheme.backgroundColor === bg.value
                            ? 'border-foreground bg-muted/50'
                            : 'border-transparent bg-muted/30 hover:bg-muted/60'
                        )}
                      >
                        <div
                          className={cn('h-7 w-7 rounded-full shadow-sm ring-2 ring-white', bg.className)}
                        />
                        <span className="text-[10px] text-muted-foreground leading-none">
                          {bg.label}
                        </span>
                        {draftTheme.backgroundColor === bg.value && (
                          <div className="absolute top-1.5 left-1.5">
                            <Check className="h-3 w-3 text-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Border Radius */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Square className="h-3.5 w-3.5" />
                    گردی گوشه‌ها
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {BORDER_RADIUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setDraftTheme({ ...draftTheme, borderRadius: opt.value })
                        }
                        className={cn(
                          'relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:shadow-sm',
                          draftTheme.borderRadius === opt.value
                            ? 'border-foreground bg-muted/50'
                            : 'border-transparent bg-muted/30 hover:bg-muted/60'
                        )}
                      >
                        <div
                          className="h-8 w-8 bg-foreground/20"
                          style={{ borderRadius: `${opt.value}px` }}
                        />
                        <span className="text-xs text-muted-foreground">{opt.label}</span>
                        {draftTheme.borderRadius === opt.value && (
                          <div className="absolute top-1.5 left-1.5">
                            <Check className="h-3 w-3 text-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Font Style */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlignRight className="h-3.5 w-3.5" />
                    سبک فونت
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FONT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() =>
                          setDraftTheme({ ...draftTheme, fontFamily: opt.value })
                        }
                        className={cn(
                          'relative flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-all hover:shadow-sm',
                          draftTheme.fontFamily === opt.value
                            ? 'border-foreground bg-muted/50'
                            : 'border-transparent bg-muted/30 hover:bg-muted/60'
                        )}
                      >
                        <span className="text-sm font-semibold text-foreground">
                          {opt.label === 'مدرن' && 'الف ب'}
                          {opt.label === 'کلاسیک' && 'الف ب'}
                          {opt.label === 'مینیمال' && 'الف ب'}
                        </span>
                        <span className="text-xs text-muted-foreground">{opt.label}</span>
                        {draftTheme.fontFamily === opt.value && (
                          <div className="absolute top-1.5 left-1.5">
                            <Check className="h-3 w-3 text-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer actions */}
        <div className="border-t px-6 py-3 flex items-center justify-between bg-muted/30">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            انصراف
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            style={{ backgroundColor: draftTheme.primaryColor }}
            onClick={handleApply}
          >
            <Check className="h-4 w-4" />
            اعمال تغییرات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
