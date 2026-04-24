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
  Layout,
  Bell,
  Send,
  Zap,
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  { label: 'مدرن', value: 'Vazirmatn', preview: 'فرم‌ساز حرفه‌ای' },
  { label: 'کلاسیک', value: 'Vazirmatn', preview: 'فرم‌ساز حرفه‌ای' },
  { label: 'مینیمال', value: 'Vazirmatn', preview: 'فرم‌ساز حرفه‌ای' },
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
        {/* Gradient header bar */}
        <div className="h-1 bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500" />

        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-0 flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg font-bold flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
              <Sparkles className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
            </div>
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
          <TabsList className="w-full grid grid-cols-4 gap-1">
            <TabsTrigger value="general" className="gap-1.5 text-xs sm:text-sm">
              <Type className="h-3.5 w-3.5" />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="form-page" className="gap-1.5 text-xs sm:text-sm">
              <Layout className="h-3.5 w-3.5" />
              صفحه فرم
            </TabsTrigger>
            <TabsTrigger value="theme" className="gap-1.5 text-xs sm:text-sm">
              <Palette className="h-3.5 w-3.5" />
              ظاهر و تم
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm">
              <Bell className="h-3.5 w-3.5" />
              اعلان‌ها
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
                    className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
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
                    className="text-sm min-h-[100px] resize-none focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
                  />
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ---- Form Page Tab ---- */}
          <TabsContent value="form-page" className="mt-4 pb-6">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-5 px-1">
                {/* Welcome Message */}
                <div className="space-y-2">
                  <Label htmlFor="settings-welcome" className="text-sm font-medium">
                    پیام خوش‌آمدگویی
                  </Label>
                  <Textarea
                    id="settings-welcome"
                    value={draftTheme.welcomeMessage || ''}
                    onChange={(e) =>
                      setDraftTheme({ ...draftTheme, welcomeMessage: e.target.value })
                    }
                    placeholder="متن خوش‌آمدگویی نمایش داده شود..."
                    className="text-sm min-h-[80px] resize-none focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    در صورت خالی بودن، نمایش داده نمی‌شود
                  </p>
                </div>

                <Separator />

                {/* Submit Button Text */}
                <div className="space-y-2">
                  <Label htmlFor="settings-submit-text" className="text-sm font-medium">
                    متن دکمه ارسال
                  </Label>
                  <Input
                    id="settings-submit-text"
                    value={draftTheme.submitButtonText || 'ارسال پاسخ'}
                    onChange={(e) =>
                      setDraftTheme({ ...draftTheme, submitButtonText: e.target.value })
                    }
                    placeholder="ارسال پاسخ"
                    className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
                  />
                </div>

                <Separator />

                {/* Thank You Message */}
                <div className="space-y-2">
                  <Label htmlFor="settings-thankyou" className="text-sm font-medium">
                    پیام تشکر
                  </Label>
                  <Textarea
                    id="settings-thankyou"
                    value={draftTheme.thankYouMessage || ''}
                    onChange={(e) =>
                      setDraftTheme({ ...draftTheme, thankYouMessage: e.target.value })
                    }
                    placeholder="متن تشکر پس از ارسال..."
                    className="text-sm min-h-[80px] resize-none focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    در صورت خالی بودن، پیام پیش‌فرض نمایش داده می‌شود
                  </p>
                </div>

                <Separator />

                {/* Progress Style */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Square className="h-3.5 w-3.5" />
                    سبک نوار پیشرفت
                  </Label>
                  <Select
                    value={draftTheme.progressStyle || 'bar'}
                    onValueChange={(val) =>
                      setDraftTheme({
                        ...draftTheme,
                        progressStyle: val as 'bar' | 'dots' | 'hidden',
                      })
                    }
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">نوار پیشرفت</SelectItem>
                      <SelectItem value="dots">نقاط</SelectItem>
                      <SelectItem value="hidden">مخفی</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    نحوه نمایش پیشرفت فرم در صفحه پر کردن
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ---- Notifications Tab ---- */}
          <TabsContent value="notifications" className="mt-4 pb-6">
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-5 px-1">
                {/* Email Notification Toggle */}
                <div className="rounded-xl border border-violet-100 dark:border-violet-900/40 bg-gradient-to-br from-violet-50/50 to-purple-50/30 dark:from-violet-950/20 dark:to-purple-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings-notif-toggle" className="text-sm font-medium flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                        <Bell className="h-3.5 w-3.5 text-violet-500" />
                      </div>
                      اعلان ایمیل هنگام دریافت پاسخ جدید
                    </Label>
                    <Switch
                      id="settings-notif-toggle"
                      checked={draftTheme.notificationEnabled || false}
                      onCheckedChange={(checked) =>
                        setDraftTheme({ ...draftTheme, notificationEnabled: checked })
                      }
                      className="data-[state=checked]:bg-violet-500"
                    />
                  </div>
                  <Input
                    type="email"
                    value={draftTheme.notificationEmail || ''}
                    onChange={(e) =>
                      setDraftTheme({ ...draftTheme, notificationEmail: e.target.value })
                    }
                    placeholder="your@email.com"
                    dir="ltr"
                    className="text-sm focus-visible:ring-violet-500/40 focus-visible:border-violet-400 transition-all duration-200"
                    disabled={!draftTheme.notificationEnabled}
                  />
                  {draftTheme.notificationEnabled && (
                    <p className="text-xs text-violet-600 dark:text-violet-400">
                      هر بار که پاسخ جدیدی ثبت شود، ایمیلی حاوی خلاصه پاسخ ارسال می‌شود
                    </p>
                  )}
                </div>

                {/* Daily Summary */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="settings-daily-summary" className="text-sm font-medium flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40">
                      <AlignRight className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    خلاصه روزانه پاسخ‌ها
                  </Label>
                  <Switch
                    id="settings-daily-summary"
                    checked={draftTheme.dailySummary || false}
                    onCheckedChange={(checked) =>
                      setDraftTheme({ ...draftTheme, dailySummary: checked })
                    }
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>

                <Separator />

                {/* Webhook Integration */}
                <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/50 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings-webhook" className="text-sm font-medium flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/40">
                        <Zap className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      وب‌هوک (Webhook)
                    </Label>
                    <Switch
                      id="settings-webhook-toggle"
                      checked={!!draftTheme.webhookUrl}
                      onCheckedChange={(checked) =>
                        setDraftTheme({ ...draftTheme, webhookUrl: checked ? 'https://' : '' })
                      }
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                  <Input
                    type="url"
                    value={draftTheme.webhookUrl || ''}
                    onChange={(e) =>
                      setDraftTheme({ ...draftTheme, webhookUrl: e.target.value })
                    }
                    placeholder="https://your-server.com/webhook"
                    dir="ltr"
                    className="text-sm focus-visible:ring-emerald-500/40 focus-visible:border-emerald-400 transition-all duration-200"
                    disabled={!draftTheme.webhookUrl}
                  />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    با دریافت هر پاسخ، داده‌ها به این آدرس ارسال می‌شود
                  </p>
                </div>

                {/* Telegram Notification */}
                <div className="rounded-xl border border-sky-100 dark:border-sky-900/40 bg-gradient-to-br from-sky-50/50 to-cyan-50/30 dark:from-sky-950/20 dark:to-cyan-950/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings-telegram" className="text-sm font-medium flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/40">
                        <Send className="h-3.5 w-3.5 text-sky-500" />
                      </div>
                      اعلان تلگرام
                    </Label>
                    <Switch
                      id="settings-telegram-toggle"
                      checked={draftTheme.telegramNotification || false}
                      onCheckedChange={(checked) =>
                        setDraftTheme({ ...draftTheme, telegramNotification: checked })
                      }
                      className="data-[state=checked]:bg-sky-500"
                    />
                  </div>
                  <Input
                    type="text"
                    value={draftTheme.telegramChatId || ''}
                    onChange={(e) =>
                      setDraftTheme({ ...draftTheme, telegramChatId: e.target.value })
                    }
                    placeholder="Chat ID تلگرام"
                    dir="ltr"
                    className="text-sm focus-visible:ring-sky-500/40 focus-visible:border-sky-400 transition-all duration-200"
                    disabled={!draftTheme.telegramNotification}
                  />
                  <p className="text-xs text-sky-600 dark:text-sky-400">
                    Chat ID تلگرام را وارد کنید تا پاسخ‌ها به صورت خودکار ارسال شود
                  </p>
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
                      className="h-3 w-3 rounded-full ring-2 ring-offset-2 ring-offset-background"
                      style={{ backgroundColor: draftTheme.primaryColor, ringColor: draftTheme.primaryColor }}
                    />
                    رنگ اصلی
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIMARY_COLORS.map((color) => {
                      const isSelected = draftTheme.primaryColor === color.value;
                      return (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() =>
                            setDraftTheme({ ...draftTheme, primaryColor: color.value })
                          }
                          className={cn(
                            'relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105 hover:shadow-md',
                            isSelected
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-sm'
                              : 'border-transparent bg-muted/30 hover:bg-muted/50'
                          )}
                        >
                          <div className="relative">
                            <div
                              className="h-8 w-8 rounded-full shadow-sm transition-transform duration-200"
                              style={{ backgroundColor: color.value }}
                            />
                            {/* Active ring indicator */}
                            {isSelected && (
                              <div
                                className="absolute -inset-1 rounded-full ring-2 transition-all duration-200"
                                style={{ ringColor: color.value }}
                              />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-none font-medium">
                            {color.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-violet-500 text-white shadow-sm">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Background Color */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    رنگ پس‌زمینه
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {BACKGROUND_COLORS.map((bg) => {
                      const isSelected = draftTheme.backgroundColor === bg.value;
                      return (
                        <button
                          key={bg.value}
                          type="button"
                          onClick={() =>
                            setDraftTheme({ ...draftTheme, backgroundColor: bg.value })
                          }
                          className={cn(
                            'relative flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105 hover:shadow-md',
                            isSelected
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-sm'
                              : 'border-transparent bg-muted/30 hover:bg-muted/50'
                          )}
                        >
                          <div className="relative">
                            <div
                              className={cn('h-8 w-8 rounded-full shadow-sm transition-transform duration-200', bg.className)}
                            />
                            {isSelected && (
                              <div className="absolute -inset-1 rounded-full ring-2 ring-violet-500 transition-all duration-200" />
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground leading-none font-medium">
                            {bg.label}
                          </span>
                          {isSelected && (
                            <div className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-violet-500 text-white shadow-sm">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
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
                    {BORDER_RADIUS_OPTIONS.map((opt) => {
                      const isSelected = draftTheme.borderRadius === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setDraftTheme({ ...draftTheme, borderRadius: opt.value })
                          }
                          className={cn(
                            'relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105 hover:shadow-md',
                            isSelected
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-sm'
                              : 'border-transparent bg-muted/30 hover:bg-muted/50'
                          )}
                        >
                          <div
                            className="h-8 w-8 bg-foreground/20 transition-transform duration-200"
                            style={{ borderRadius: `${opt.value}px` }}
                          />
                          <span className="text-xs text-muted-foreground font-medium">{opt.label}</span>
                          {isSelected && (
                            <div className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-violet-500 text-white shadow-sm">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
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
                    {FONT_OPTIONS.map((opt) => {
                      const isSelected = draftTheme.fontFamily === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setDraftTheme({ ...draftTheme, fontFamily: opt.value })
                          }
                          className={cn(
                            'relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 hover:scale-105 hover:shadow-md',
                            isSelected
                              ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30 shadow-sm'
                              : 'border-transparent bg-muted/30 hover:bg-muted/50'
                          )}
                        >
                          {/* Font preview */}
                          <span
                            className={cn(
                              'text-base text-foreground leading-relaxed transition-all duration-200',
                              opt.label === 'مدرن' && 'font-bold tracking-tight',
                              opt.label === 'کلاسیک' && 'font-semibold',
                              opt.label === 'مینیمال' && 'font-normal text-muted-foreground'
                            )}
                          >
                            {opt.label === 'مدرن' && 'فرم'}
                            {opt.label === 'کلاسیک' && 'فرم'}
                            {opt.label === 'مینیمال' && 'فرم'}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">{opt.label}</span>
                          {isSelected && (
                            <div className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-violet-500 text-white shadow-sm">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
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
            className="gap-1.5 transition-all duration-200 hover:shadow-md"
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
