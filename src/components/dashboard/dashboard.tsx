'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Send,
  Edit3,
  Trash2,
  BarChart3,
  Copy,
  MoreHorizontal,
  ClipboardList,
  CircleDot,
  Lock,
  FilePlus,
  LayoutTemplate,
  Share2,
  Link2,
  Check,
  QrCode,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore, type Form } from '@/lib/store';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: {
    label: 'پیش‌نویس',
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    icon: <ClipboardList className="size-3.5" />,
  },
  published: {
    label: 'منتشر شده',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: <CircleDot className="size-3.5" />,
  },
  closed: {
    label: 'بسته شده',
    color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    icon: <Lock className="size-3.5" />,
  },
};

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: faIR });
  } catch {
    return dateStr;
  }
}

// ─── Share Form Dialog ─────────────────────────────────────────────────────

function ShareFormDialog({
  form,
  open,
  onOpenChange,
  onPublish,
}: {
  form: Form | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish: (form: Form) => void;
}) {
  const [copied, setCopied] = useState(false);

  const formLink = form ? `formsaz.ir/f/${form.id}` : '';
  const isPublished = form?.status === 'published';
  const isDraft = form?.status === 'draft';
  const isClosed = form?.status === 'closed';

  const handleCopyLink = async () => {
    if (!formLink) return;
    try {
      await navigator.clipboard.writeText(formLink);
      setCopied(true);
      toast.success('لینک با موفقیت کپی شد!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('خطا در کپی لینک');
    }
  };

  const handlePublish = () => {
    if (form) {
      onPublish(form);
      onOpenChange(false);
    }
  };

  const socialLinks = form
    ? [
        {
          label: 'تلگرام',
          href: `https://t.me/share/url?url=${encodeURIComponent(formLink)}&text=${encodeURIComponent(form.title)}`,
          icon: (
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
          ),
          color: 'hover:bg-[#2AABEE]/10 text-[#2AABEE] border-[#2AABEE]/20 hover:border-[#2AABEE]/40',
        },
        {
          label: 'واتساپ',
          href: `https://wa.me/?text=${encodeURIComponent(`${form.title}\n${formLink}`)}`,
          icon: (
            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          ),
          color: 'hover:bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 hover:border-[#25D366]/40',
        },
        {
          label: 'ایمیل',
          href: `mailto:?subject=${encodeURIComponent(form.title)}&body=${encodeURIComponent(`فرم: ${form.title}\n\nلینک: ${formLink}`)}`,
          icon: <Mail className="size-5" />,
          color: 'hover:bg-indigo-100 dark:hover:bg-indigo-950/50 text-indigo-500 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 dark:hover:border-indigo-600',
        },
      ]
    : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-md p-0 gap-0 overflow-hidden rounded-2xl border-gray-200 dark:border-gray-800"
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-l from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <Share2 className="size-5 text-indigo-500" />
            </div>
            <div className="text-right">
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
                اشتراک‌گذاری فرم
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {form?.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">وضعیت فرم</span>
            <Badge variant="outline" className={`text-xs ${statusConfig[form?.status || 'draft']?.color}`}>
              {statusConfig[form?.status || 'draft']?.icon}
              {statusConfig[form?.status || 'draft']?.label}
            </Badge>
          </div>

          {/* Draft Warning */}
          {isDraft && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3.5"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50 mt-0.5">
                <svg className="size-4 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  فرم هنوز منتشر نشده
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                  برای اشتراک‌گذاری ابتدا فرم را منتشر کنید.
                </p>
                <Button
                  size="sm"
                  onClick={handlePublish}
                  className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-lg h-8 px-3"
                >
                  <Send className="size-3 ml-1.5" />
                  انتشار فرم
                </Button>
              </div>
            </motion.div>
          )}

          {/* Link Copy Section */}
          <div className="space-y-2.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              لینک فرم
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3.5 py-2.5 min-w-0">
                <Link2 className="size-4 text-gray-400 dark:text-gray-500 shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate select-all" dir="ltr">
                  {formLink}
                </span>
              </div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyLink}
                  disabled={!isPublished && !isClosed}
                  className={`shrink-0 rounded-xl h-10 px-4 text-sm font-medium transition-all duration-300 ${
                    copied
                      ? 'bg-emerald-500 hover:bg-emerald-500 text-white border-0 shadow-md shadow-emerald-200/50 dark:shadow-emerald-500/20'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-500/20'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5"
                      >
                        <Check className="size-4" />
                        لینک کپی شد!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1.5"
                      >
                        <Copy className="size-4" />
                        کپی لینک
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          {(isPublished || isClosed) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2.5"
            >
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                کد QR
              </label>
              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 p-6">
                <div className="flex flex-col items-center gap-3">
                  {/* QR Placeholder Grid */}
                  <div className="size-32 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden p-2">
                    <div className="grid grid-cols-7 gap-[2px]">
                      {Array.from({ length: 49 }).map((_, i) => {
                        const row = Math.floor(i / 7);
                        const col = i % 7;
                        const isCorner =
                          (row < 2 && col < 2) ||
                          (row < 2 && col > 4) ||
                          (row > 4 && col < 2);
                        const isFilled =
                          isCorner ||
                          (i % 3 === 0 && !isCorner) ||
                          (row === 3 && col > 1 && col < 5);
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.01 }}
                            className={`size-3.5 rounded-[2px] ${
                              isFilled
                                ? 'bg-gray-800 dark:bg-gray-200'
                                : 'bg-white dark:bg-gray-700'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <QrCode className="size-3.5" />
                    <span>کد QR فرم</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Social Sharing */}
          {(isPublished || isClosed) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2.5"
            >
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                اشتراک در شبکه‌های اجتماعی
              </label>
              <div className="grid grid-cols-3 gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm font-medium text-gray-600 dark:text-gray-400 transition-all duration-200 ${item.color}`}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  colorDark,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  colorDark: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-2xl border bg-white dark:bg-gray-900 p-4 shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800"
    >
      <div
        className={`flex size-12 items-center justify-center rounded-xl ${color} ${colorDark}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative mb-6">
        <div className="flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50">
          <FilePlus className="size-14 text-indigo-300 dark:text-indigo-600" />
        </div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        >
          <Plus className="size-7 rounded-full bg-white dark:bg-gray-800 text-indigo-500 shadow-lg" />
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">هنوز فرمی نساخته‌اید!</h3>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        با ساخت اولین فرم خود، شروع به جمع‌آوری اطلاعات و بازخورد کنید.
      </p>
      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateNew}
          className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-300/50 rounded-xl px-6 font-medium"
        >
          <Plus className="size-4 ml-2" />
          ایجاد فرم جدید
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Form Card Skeleton ────────────────────────────────────────────────────

function FormCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-1" />
      </CardHeader>
      <CardContent className="gap-3">
        <div className="flex gap-3">
          <Skeleton className="h-16 flex-1 rounded-lg" />
          <Skeleton className="h-16 flex-1 rounded-lg" />
          <Skeleton className="h-16 flex-1 rounded-lg" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}

// ─── Form Card ──────────────────────────────────────────────────────────────

function FormCard({
  form,
  onEdit,
  onPreview,
  onResults,
  onDelete,
  onDuplicate,
  onShare,
}: {
  form: Form;
  onEdit: (form: Form) => void;
  onPreview: (form: Form) => void;
  onResults: (form: Form) => void;
  onDelete: (form: Form) => void;
  onDuplicate: (form: Form) => void;
  onShare: (form: Form) => void;
}) {
  const status = statusConfig[form.status] || statusConfig.draft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all duration-200 group bg-white dark:bg-gray-900">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-bold text-gray-900 dark:text-white truncate">
                {form.title}
              </CardTitle>
              {form.description && (
                <CardDescription className="mt-1 line-clamp-2 text-sm dark:text-gray-400">
                  {form.description}
                </CardDescription>
              )}
            </div>
            <Badge variant="outline" className={`shrink-0 text-xs ${status.color}`}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="gap-3 pb-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors">
              <FileText className="size-4 text-gray-400 group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{form.questions?.length || 0}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">سؤال</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors">
              <Send className="size-4 text-gray-400 group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{form._count?.submissions || 0}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">پاسخ</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 transition-colors">
              <Eye className="size-4 text-gray-400 group-hover:text-indigo-400 dark:group-hover:text-indigo-500 transition-colors" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{form.viewCount || 0}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">بازدید</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-gray-400 dark:text-gray-500 px-1">
            <span>آخرین ویرایش</span>
            <span>{formatDate(form.updatedAt)}</span>
          </div>

          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-colors"
              onClick={() => onEdit(form)}
            >
              <Edit3 className="size-3.5 ml-1" />
              ویرایش
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 dark:hover:border-indigo-800 transition-colors"
              onClick={() => onPreview(form)}
            >
              <Eye className="size-3.5 ml-1" />
              پیش‌نمایش
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg px-2">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuItem onClick={() => onResults(form)}>
                  <BarChart3 className="size-4 ml-2 text-indigo-500" />
                  نتایج
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShare(form)}>
                  <Share2 className="size-4 ml-2 text-purple-500" />
                  اشتراک‌گذاری
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate(form)}>
                  <Copy className="size-4 ml-2 text-gray-500" />
                  کپی فرم
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50" select={false}>
                      <Trash2 className="size-4 ml-2" />
                      حذف
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent dir="rtl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف فرم</AlertDialogTitle>
                      <AlertDialogDescription>
                        آیا از حذف فرم «{form.title}» مطمئن هستید؟ این عمل قابل بازگشت نیست و تمام پاسخ‌ها نیز حذف خواهند شد.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-lg">انصراف</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(form)}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        حذف فرم
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const {
    forms,
    setForms,
    setCurrentView,
    setCurrentForm,
    setFillForm,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [shareForm, setShareForm] = useState<Form | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (err) {
      console.error('Failed to fetch forms:', err);
    } finally {
      setLoading(false);
    }
  }, [setForms]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      !searchQuery ||
      form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSubmissions = forms.reduce((sum, f) => sum + (f._count?.submissions || 0), 0);
  const totalViews = forms.reduce((sum, f) => sum + (f.viewCount || 0), 0);
  const publishedForms = forms.filter((f) => f.status === 'published').length;

  const handleCreateNew = () => {
    setCurrentForm(null);
    setCurrentView('builder');
  };

  const handleEdit = (form: Form) => {
    setCurrentForm(form);
    setCurrentView('builder');
  };

  const handlePreview = (form: Form) => {
    setFillForm(form);
    setCurrentView('fill');
  };

  const handleResults = (form: Form) => {
    setCurrentForm(form);
    setCurrentView('results');
  };

  const handleDelete = async (form: Form) => {
    try {
      const res = await fetch(`/api/forms/${form.id}`, { method: 'DELETE' });
      if (res.ok) {
        setForms(forms.filter((f) => f.id !== form.id));
      }
    } catch (err) {
      console.error('Failed to delete form:', err);
    }
  };

  const handleDuplicate = async (form: Form) => {
    try {
      setDuplicating(form.id);
      const questionsPayload = (form.questions || []).map((q, i) => ({
        ...q,
        order: i,
      }));

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${form.title} (کپی)`,
          description: form.description,
          questions: questionsPayload,
        }),
      });

      if (res.ok) {
        const newForm = await res.json();
        setForms([newForm, ...forms]);
      }
    } catch (err) {
      console.error('Failed to duplicate form:', err);
    } finally {
      setDuplicating(null);
    }
  };

  const handleShare = (form: Form) => {
    setShareForm(form);
    setShareDialogOpen(true);
  };

  const handlePublishFromShare = async (form: Form) => {
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });
      if (res.ok) {
        const updatedForm = await res.json();
        setForms(forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)));
        toast.success('فرم با موفقیت منتشر شد!');
      }
    } catch (err) {
      console.error('Failed to publish form:', err);
      toast.error('خطا در انتشار فرم');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            icon={<FileText className="size-6 text-indigo-600 dark:text-indigo-400" />}
            label="کل فرم‌ها"
            value={forms.length}
            color="bg-indigo-100"
            colorDark="dark:bg-indigo-900/30"
          />
          <StatCard
            icon={<Send className="size-6 text-emerald-600 dark:text-emerald-400" />}
            label="کل پاسخ‌ها"
            value={totalSubmissions}
            color="bg-emerald-100"
            colorDark="dark:bg-emerald-900/30"
          />
          <StatCard
            icon={<Eye className="size-6 text-blue-600 dark:text-blue-400" />}
            label="کل بازدیدها"
            value={totalViews}
            color="bg-blue-100"
            colorDark="dark:bg-blue-900/30"
          />
          <StatCard
            icon={<CircleDot className="size-6 text-purple-600 dark:text-purple-400" />}
            label="فرم‌های منتشر شده"
            value={publishedForms}
            color="bg-purple-100"
            colorDark="dark:bg-purple-900/30"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">فرم‌های من</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">مدیریت و مشاهده تمام فرم‌های خود</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setCurrentView('templates')
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-5 font-medium w-full sm:w-auto h-10 transition-colors text-gray-700 dark:text-gray-300"
            >
              <LayoutTemplate className="size-4 ml-2 text-purple-500" />
              الگوهای آماده
            </Button>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-300/50 rounded-xl px-5 font-medium w-full sm:w-auto h-10"
            >
              <Plus className="size-4 ml-2" />
              ایجاد فرم جدید
            </Button>
          </div>
        </div>

        {/* Filters */}
        {forms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="جستجو در فرم‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-indigo-300 focus:ring-indigo-100 text-gray-900 dark:text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="draft">پیش‌نویس</SelectItem>
                <SelectItem value="published">منتشر شده</SelectItem>
                <SelectItem value="closed">بسته شده</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FormCardSkeleton key={i} />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : filteredForms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Search className="size-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">فرمی یافت نشد</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">فیلتر یا عبارت جستجوی خود را تغییر دهید</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredForms.map((form) => (
                <FormCard
                  key={form.id}
                  form={form}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onResults={handleResults}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onShare={handleShare}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ShareFormDialog
        form={shareForm}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onPublish={handlePublishFromShare}
      />
    </div>
  );
}
