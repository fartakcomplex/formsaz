'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
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
  BookOpen,
  ArrowUpDown,
  HelpCircle,
  FileEdit,
  Rocket,
  TrendingUp,
  Calendar,
  Clock,
  Undo2,
  CheckSquare,
  Square,
  X,
  Download,
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
  DialogFooter,
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

const statusBorderGradient: Record<string, string> = {
  draft: 'from-violet-400 to-purple-500',
  published: 'from-violet-400 to-purple-500',
  closed: 'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500',
};

function formatRelativeTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: faIR,
    });
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy', { locale: faIR });
  } catch {
    return dateStr;
  }
}

function getExpirationStatus(expiresAt: string | null | undefined): { isExpired: boolean; text: string; color: string } {
  if (!expiresAt) return { isExpired: false, text: '', color: '' };
  const now = new Date();
  const expDate = new Date(expiresAt);
  if (isBefore(expDate, now)) {
    return {
      isExpired: true,
      text: 'منقضی',
      color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    };
  }
  return {
    isExpired: false,
    text: `منقضی در ${formatDate(expiresAt)}`,
    color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
  };
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
  const [qrLoaded, setQrLoaded] = useState(false);
  const [qrError, setQrError] = useState(false);

  const formLink = form ? `formsaz.ir/f/${form.id}` : '';
  const qrKey = form?.id || 'none';
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
          color: 'hover:bg-violet-100 dark:hover:bg-violet-950/50 text-violet-500 border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
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
        <DialogHeader className="p-6 pb-4 bg-gradient-to-l from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <Share2 className="size-5 text-violet-500" />
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
                      : 'bg-violet-500 hover:bg-violet-600 text-white shadow-md shadow-violet-200/50 dark:shadow-violet-500/20'
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

          {/* QR Code */}
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
              <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                <div className="relative size-44 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                  {!qrError ? (
                    <>
                      {!qrLoaded && (
                        <Skeleton className="absolute inset-0 size-full rounded-xl" />
                      )}
                      <img
                        key={qrKey}
                        src={`/api/qr?data=${encodeURIComponent(formLink)}`}
                        alt="کد QR فرم"
                        className={`size-full object-contain p-2 transition-opacity duration-300 ${qrLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setQrLoaded(true)}
                        onError={() => setQrError(true)}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                      <QrCode className="size-10" />
                      <span className="text-xs">خطا در بارگذاری</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <QrCode className="size-3.5" />
                  <span>کد QR فرم</span>
                </div>
                {qrLoaded && !qrError && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/api/qr?data=${encodeURIComponent(formLink)}`, '_blank')}
                    className="rounded-lg text-xs gap-1.5 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Download className="size-3.5" />
                    دانلود QR
                  </Button>
                )}
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

// ─── Expiration Date Dialog ────────────────────────────────────────────────

function ExpirationDateDialog({
  form,
  open,
  onOpenChange,
  onSave,
}: {
  form: Form | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (formId: string, expiresAt: string | null) => void;
}) {
  const [dateValue, setDateValue] = useState('');

  const getInitialDate = () => {
    if (form?.expiresAt) {
      try {
        return format(new Date(form.expiresAt), 'yyyy-MM-dd');
      } catch {
        return '';
      }
    }
    return '';
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setDateValue(getInitialDate());
    }
    onOpenChange(isOpen);
  };

  const handleSave = () => {
    if (!form) return;
    onSave(form.id, dateValue || null);
    onOpenChange(false);
  };

  const handleRemove = () => {
    if (!form) return;
    onSave(form.id, null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent dir="rtl" className="sm:max-w-md rounded-2xl border-gray-200 dark:border-gray-800 overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-l from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <Clock className="size-5 text-violet-500" />
            </div>
            <div className="text-right">
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
                تاریخ انقضای فرم
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {form?.title}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              تاریخ انقضا
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              پس از این تاریخ، فرم دیگر قابل پر کردن نخواهد بود.
            </p>
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              <Input
                type="date"
                value={dateValue}
                onChange={(e) => setDateValue(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="pr-10 h-11 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 text-gray-900 dark:text-white"
                dir="ltr"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            {form?.expiresAt && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl text-sm"
              >
                <X className="size-3.5 ml-1" />
                حذف تاریخ
              </Button>
            )}
            <div className="flex-1" />
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-gray-200 dark:border-gray-700 text-sm"
            >
              انصراف
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm shadow-md shadow-violet-200/50 dark:shadow-violet-500/20"
            >
              <Check className="size-3.5 ml-1" />
              ذخیره
            </Button>
          </DialogFooter>
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

// ─── Welcome Empty State SVG Illustration ───────────────────────────────────

function WelcomeIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Background orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-4 -right-4 size-32 rounded-full bg-gradient-to-br from-violet-200 to-purple-300 dark:from-violet-800/30 dark:to-purple-800/30 blur-xl"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -bottom-2 -left-6 size-40 rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-300 dark:from-fuchsia-800/20 dark:to-pink-800/20 blur-xl"
      />

      {/* Main form document */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotateY: -15 }}
        animate={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative mx-auto w-64"
      >
        <svg viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
          {/* Document shadow */}
          <rect x="22" y="14" width="200" height="270" rx="16" fill="currentColor" className="text-gray-300 dark:text-gray-700" />

          {/* Document body */}
          <rect x="16" y="8" width="200" height="270" rx="16" fill="white" className="dark:fill-gray-800" stroke="currentColor" />
          <rect x="16" y="8" width="200" height="270" rx="16" stroke="currentColor" strokeWidth="1.5" className="text-gray-200 dark:text-gray-700" fill="none" />

          {/* Header bar */}
          <rect x="16" y="8" width="200" height="44" rx="16" className="fill-gradient-top" />
          <rect x="16" y="36" width="200" height="16" className="fill-gradient-top" />

          {/* Gradient for header using defs */}
          <defs>
            <linearGradient id="headerGrad" x1="16" y1="8" x2="216" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <rect x="16" y="8" width="200" height="44" rx="16" fill="url(#headerGrad)" />
          <rect x="16" y="36" width="200" height="16" fill="url(#headerGrad)" />

          {/* Header dots */}
          <circle cx="36" cy="30" r="4" fill="rgba(255,255,255,0.5)" />
          <circle cx="50" cy="30" r="4" fill="rgba(255,255,255,0.5)" />
          <circle cx="64" cy="30" r="4" fill="rgba(255,255,255,0.5)" />

          {/* Header title line */}
          <rect x="90" y="25" width="100" height="10" rx="5" fill="rgba(255,255,255,0.7)" />

          {/* Question rows */}
          {/* Row 1 */}
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <rect x="36" y="68" width="160" height="8" rx="4" className="text-gray-300 dark:text-gray-600" fill="currentColor" />
            <rect x="36" y="84" width="120" height="32" rx="8" className="text-gray-100 dark:text-gray-700" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          </motion.g>

          {/* Row 2 */}
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <rect x="36" y="130" width="140" height="8" rx="4" className="text-gray-300 dark:text-gray-600" fill="currentColor" />
            {/* Radio buttons */}
            <circle cx="44" cy="156" r="8" className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="44" cy="156" r="3" fill="#8b5cf6" />
            <rect x="60" y="149" width="50" height="14" rx="4" className="text-gray-200 dark:text-gray-600" fill="currentColor" />
            <circle cx="120" cy="156" r="8" className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <rect x="136" y="149" width="40" height="14" rx="4" className="text-gray-200 dark:text-gray-600" fill="currentColor" />
          </motion.g>

          {/* Row 3 */}
          <motion.g
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <rect x="36" y="190" width="155" height="8" rx="4" className="text-gray-300 dark:text-gray-600" fill="currentColor" />
            <rect x="36" y="206" width="160" height="32" rx="8" className="text-gray-100 dark:text-gray-700" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
          </motion.g>

          {/* Submit button */}
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.4 }}
          >
            <rect x="66" y="256" width="100" height="14" rx="7" fill="url(#headerGrad)" />
          </motion.g>
        </svg>

        {/* Floating pencil */}
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-3 left-4"
        >
          <div className="size-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200/50 dark:shadow-amber-500/20">
            <Edit3 className="size-5 text-white" />
          </div>
        </motion.div>

        {/* Floating checkmark */}
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -top-2 left-8"
        >
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/20">
            <Check className="size-4 text-white" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Help Dialog ────────────────────────────────────────────────────────────

function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const steps = [
    {
      icon: <FileEdit className="size-5 text-violet-500" />,
      title: 'فرم بسازید',
      description: 'یک فرم خالی یا از الگو بسازید',
      stepNumber: '۱',
    },
    {
      icon: <HelpCircle className="size-5 text-fuchsia-500" />,
      title: 'سؤالات اضافه کنید',
      description: 'انواع سؤال را اضافه کنید',
      stepNumber: '۲',
    },
    {
      icon: <Rocket className="size-5 text-rose-500" />,
      title: 'فرم را منتشر کنید',
      description: 'لینک فرم را به اشتراک بگذارید',
      stepNumber: '۳',
    },
    {
      icon: <TrendingUp className="size-5 text-emerald-500" />,
      title: 'نتایج را ببینید',
      description: 'پاسخ‌ها و آمار را تحلیل کنید',
      stepNumber: '۴',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="sm:max-w-lg rounded-2xl border-gray-200 dark:border-gray-800 overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 bg-gradient-to-l from-violet-50 to-fuchsia-50 dark:from-violet-950/40 dark:to-fuchsia-950/40 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm">
              <BookOpen className="size-5 text-violet-500" />
            </div>
            <div className="text-right">
              <DialogTitle className="text-base font-bold text-gray-900 dark:text-white">
                راهنمای شروع سریع
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                در ۴ قدم ساده فرم خود را بسازید و منتشر کنید
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center justify-center size-10 shrink-0 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-violet-500 dark:text-violet-400">
                    مرحله {step.stepNumber}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              برای سؤالات بیشتر، از الگوهای آماده استفاده کنید یا فرم جدیدی بسازید.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Empty State (Welcome) ─────────────────────────────────────────────────

function EmptyState({
  onCreateNew,
  onGoTemplates,
}: {
  onCreateNew: () => void;
  onGoTemplates: () => void;
}) {
  const [helpOpen, setHelpOpen] = useState(false);

  const quickStartItems = [
    {
      icon: <Plus className="size-6 text-white" />,
      title: 'ایجاد فرم خالی',
      description: 'یک فرم جدید از ابتدا بسازید',
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-200/50 dark:shadow-violet-500/20',
      onClick: onCreateNew,
    },
    {
      icon: <LayoutTemplate className="size-6 text-white" />,
      title: 'استفاده از الگو',
      description: 'از فرم‌های آماده استفاده کنید',
      gradient: 'from-fuchsia-500 to-pink-600',
      shadowColor: 'shadow-fuchsia-200/50 dark:shadow-fuchsia-500/20',
      onClick: onGoTemplates,
    },
    {
      icon: <BookOpen className="size-6 text-white" />,
      title: 'مشاهده راهنما',
      description: 'مراحل شروع کار را ببینید',
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-200/50 dark:shadow-amber-500/20',
      onClick: () => setHelpOpen(true),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12 px-4"
    >
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8"
      >
        <WelcomeIllustration />
      </motion.div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
          به فرمساز{' '}
          <span className="bg-gradient-to-l from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            خوش آمدید!
          </span>
        </h2>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md">
          اولین فرم خود را بسازید یا از الگوهای آماده استفاده کنید
        </p>
      </motion.div>

      {/* Quick-start cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {quickStartItems.map((item, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.12, duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={item.onClick}
            className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <div className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg ${item.shadowColor} group-hover:shadow-xl transition-shadow`}>
              {item.icon}
            </div>
            <div className="text-center">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </motion.div>
  );
}

// ─── Quick Stats Bar ────────────────────────────────────────────────────────

function QuickStatsBar({
  totalForms,
  publishedCount,
  totalSubmissions,
  totalViews,
}: {
  totalForms: number;
  publishedCount: number;
  totalSubmissions: number;
  totalViews: number;
}) {
  const stats = [
    { label: 'کل فرم‌ها', value: totalForms, icon: <FileText className="size-4" /> },
    { label: 'منتشر شده', value: publishedCount, icon: <CircleDot className="size-4" /> },
    { label: 'کل پاسخ‌ها', value: totalSubmissions, icon: <Send className="size-4" /> },
    { label: 'کل بازدیدها', value: totalViews, icon: <Eye className="size-4" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative mb-6 rounded-2xl overflow-hidden"
    >
      {/* Gradient background with glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 opacity-90" />
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5 backdrop-blur-xl" />

      <div className="relative flex items-center justify-around gap-2 py-4 px-4 sm:px-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + index * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center justify-center size-9 rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-white">{stat.icon}</span>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-white/70">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Activity Feed Widget ──────────────────────────────────────────────────

interface ActivityItem {
  id: string;
  type: string;
  formTitle: string;
  createdAt: string;
}

function ActivityFeedWidget() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/user/activity');
        if (res.ok) {
          const data = await res.json();
          setActivities((data.activities || []).slice(0, 5));
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const getActivityMeta = (type: string) => {
    switch (type) {
      case 'new_form':
        return {
          icon: <FilePlus className="size-4 text-violet-500" />,
          description: (title: string) => `فرم «${title}» ایجاد شد`,
          bgColor: 'bg-violet-100 dark:bg-violet-900/40',
        };
      case 'publish_form':
        return {
          icon: <Rocket className="size-4 text-emerald-500" />,
          description: (title: string) => `فرم «${title}» منتشر شد`,
          bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
        };
      case 'new_response':
        return {
          icon: <Send className="size-4 text-fuchsia-500" />,
          description: (title: string) => `پاسخ جدید برای «${title}»`,
          bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/40',
        };
      default:
        return {
          icon: <CircleDot className="size-4 text-gray-400" />,
          description: (title: string) => title,
          bgColor: 'bg-gray-100 dark:bg-gray-800',
        };
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="size-5 rounded" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (activities.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
        <Clock className="size-4 text-violet-500" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">فعالیت‌های اخیر</h3>
        <Badge variant="secondary" className="text-[10px] h-5 mr-auto">
          {activities.length} مورد
        </Badge>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800/50 max-h-80 overflow-y-auto scrollbar-thin">
        {activities.map((activity, index) => {
          const meta = getActivityMeta(activity.type);
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <div className={`flex items-center justify-center size-8 rounded-lg shrink-0 ${meta.bgColor}`}>
                {meta.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {meta.description(activity.formTitle)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {formatRelativeTime(activity.createdAt)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Form Card Skeleton ────────────────────────────────────────────────────

function FormCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <div className="h-1 bg-gray-200 dark:bg-gray-800" />
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
  onSetExpiration,
  selectMode,
  selected,
  onToggleSelect,
}: {
  form: Form;
  onEdit: (form: Form) => void;
  onPreview: (form: Form) => void;
  onResults: (form: Form) => void;
  onDelete: (form: Form) => void;
  onDuplicate: (form: Form) => void;
  onShare: (form: Form) => void;
  onSetExpiration: (form: Form) => void;
  selectMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  const status = statusConfig[form.status] || statusConfig.draft;
  const borderGradient = statusBorderGradient[form.status] || statusBorderGradient.draft;
  const questionCount = form.questions?.length || 0;
  const expiration = getExpirationStatus(form.expiresAt);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={selectMode ? {} : { y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className={`overflow-hidden transition-all duration-300 group relative bg-white dark:bg-gray-900 ${
        selected
          ? 'border-violet-400 dark:border-violet-600 ring-2 ring-violet-200 dark:ring-violet-800 shadow-lg shadow-violet-100/50 dark:shadow-violet-900/30'
          : 'border-gray-200 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg'
      }`}>
        {/* Shimmer hover effect */}
        {!selectMode && (
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          </div>
        )}
        {/* Status color top stripe */}
        <div className={`h-1 bg-gradient-to-l ${borderGradient}`} />

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {selectMode && (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onToggleSelect?.(form.id)}
                    className="shrink-0"
                  >
                    {selected ? (
                      <div className="flex size-5 items-center justify-center rounded-md bg-violet-500 text-white">
                        <Check className="size-3.5" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="flex size-5 items-center justify-center rounded-md border-2 border-gray-300 dark:border-gray-600 group-hover:border-violet-400 dark:group-hover:border-violet-500 transition-colors" />
                    )}
                  </motion.button>
                )}
                <CardTitle className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {form.title}
                </CardTitle>
                {/* Question count badge */}
                <Badge
                  variant="secondary"
                  className="shrink-0 text-[10px] font-semibold px-1.5 py-0 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400 h-5"
                >
                  {questionCount} سؤال
                </Badge>
                {/* Expiration badge */}
                {expiration.text && (
                  <Badge variant="outline" className={`shrink-0 text-[10px] ${expiration.color}`}>
                    {expiration.isExpired ? <Lock className="size-3 ml-0.5" /> : <Clock className="size-3 ml-0.5" />}
                    {expiration.text}
                  </Badge>
                )}
              </div>
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
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/50 transition-colors">
              <FileText className="size-4 text-gray-400 group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{questionCount}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">سؤال</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/50 transition-colors">
              <Send className="size-4 text-gray-400 group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{form._count?.submissions || 0}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">پاسخ</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 dark:bg-gray-800 p-2.5 group-hover:bg-violet-50 dark:group-hover:bg-violet-950/50 transition-colors">
              <Eye className="size-4 text-gray-400 group-hover:text-violet-400 dark:group-hover:text-violet-500 transition-colors" />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{form.viewCount || 0}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">بازدید</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-gray-400 dark:text-gray-500 px-1">
            <span>آخرین ویرایش</span>
            <span>{formatRelativeTime(form.updatedAt)}</span>
          </div>

          {selectMode ? (
            <Button
              variant="outline"
              size="sm"
              className={`w-full text-xs rounded-lg transition-colors ${
                selected
                  ? 'bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800'
                  : 'hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 dark:hover:bg-violet-950/50 dark:hover:text-violet-400 dark:hover:border-violet-800'
              }`}
              onClick={() => onToggleSelect?.(form.id)}
            >
              {selected ? (
                <>
                  <CheckSquare className="size-3.5 ml-1" />
                  انتخاب شده
                </>
              ) : (
                <>
                  <Square className="size-3.5 ml-1" />
                  انتخاب
                </>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs rounded-lg hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 dark:hover:bg-violet-950/50 dark:hover:text-violet-400 dark:hover:border-violet-800 transition-colors"
                onClick={() => onEdit(form)}
              >
                <Edit3 className="size-3.5 ml-1" />
                ویرایش
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs rounded-lg hover:bg-violet-50 hover:text-violet-600 hover:border-violet-200 dark:hover:bg-violet-950/50 dark:hover:text-violet-400 dark:hover:border-violet-800 transition-colors"
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
                    <BarChart3 className="size-4 ml-2 text-violet-500" />
                    نتایج
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onShare(form)}>
                    <Share2 className="size-4 ml-2 text-purple-500" />
                    اشتراک‌گذاری
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onSetExpiration(form)}>
                    <Clock className="size-4 ml-2 text-orange-500" />
                    تاریخ انقضا
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(form)}>
                    <Copy className="size-4 ml-2 text-gray-500" />
                    کپی فرم
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50" onSelect={(e) => e.preventDefault()}>
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
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────────────

type SortOption = 'newest' | 'oldest' | 'most_responses' | 'least_responses';

export default function Dashboard() {
  const {
    forms,
    setForms,
    setCurrentView,
    setCurrentForm,
    setFillForm,
    addToDeletedForms,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [loading, setLoading] = useState(true);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [shareForm, setShareForm] = useState<Form | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [expirationForm, setExpirationForm] = useState<Form | null>(null);
  const [expirationDialogOpen, setExpirationDialogOpen] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchDeleteConfirmOpen, setBatchDeleteConfirmOpen] = useState(false);

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

  const filteredAndSortedForms = forms
    .filter((form) => {
      const matchesSearch =
        !searchQuery ||
        form.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'most_responses':
          return (b._count?.submissions || 0) - (a._count?.submissions || 0);
        case 'least_responses':
          return (a._count?.submissions || 0) - (b._count?.submissions || 0);
        default:
          return 0;
      }
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

  const handleUndoDelete = async (deletedForm: Form) => {
    try {
      const questionsPayload = (deletedForm.questions || []).map((q, i) => ({
        ...q,
        order: q.order ?? i,
      }));

      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: deletedForm.title,
          description: deletedForm.description || '',
          questions: questionsPayload,
        }),
      });

      if (res.ok) {
        const restoredForm = await res.json();
        setForms([restoredForm, ...forms]);
        toast.success(`فرم «${deletedForm.title}» بازگردانده شد`);
      }
    } catch (err) {
      console.error('Failed to restore form:', err);
      toast.error('خطا در بازگردانی فرم');
    }
  };

  const handleDelete = async (form: Form) => {
    try {
      const res = await fetch(`/api/forms/${form.id}`, { method: 'DELETE' });
      if (res.ok) {
        addToDeletedForms(form);
        setForms(forms.filter((f) => f.id !== form.id));
        toast(`فرم «${form.title}» حذف شد`, {
          description: 'فرم از لیست حذف شد',
          duration: 5000,
          action: {
            label: (
              <span className="flex items-center gap-1">
                <Undo2 className="size-3.5" />
                بازگردانی
              </span>
            ),
            onClick: () => handleUndoDelete(form),
          },
        });
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

  const handleSetExpiration = (form: Form) => {
    setExpirationForm(form);
    setExpirationDialogOpen(true);
  };

  const handleSaveExpiration = async (formId: string, expiresAt: string | null) => {
    try {
      const res = await fetch(`/api/forms/${formId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresAt }),
      });
      if (res.ok) {
        const updatedForm = await res.json();
        setForms(forms.map((f) => (f.id === updatedForm.id ? updatedForm : f)));
        toast.success(expiresAt ? 'تاریخ انقضا تنظیم شد' : 'تاریخ انقضا حذف شد');
      }
    } catch (err) {
      console.error('Failed to set expiration:', err);
      toast.error('خطا در تنظیم تاریخ انقضا');
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filteredAndSortedForms.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSortedForms.map((f) => f.id)));
    }
  };

  const handleBatchDelete = async () => {
    try {
      const idsToDelete = Array.from(selectedIds);
      const formsToDelete = forms.filter((f) => idsToDelete.includes(f.id));

      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/forms/${id}`, { method: 'DELETE' })
        )
      );

      // Store all for potential undo
      formsToDelete.forEach((f) => addToDeletedForms(f));

      setForms(forms.filter((f) => !idsToDelete.includes(f.id)));
      setSelectedIds(new Set());
      setSelectMode(false);
      setBatchDeleteConfirmOpen(false);

      toast(`${idsToDelete.length} فرم حذف شد`, {
        description: 'فرم‌ها از لیست حذف شدند',
        duration: 5000,
        action: {
          label: (
            <span className="flex items-center gap-1">
              <Undo2 className="size-3.5" />
              بازگردانی همه
            </span>
          ),
          onClick: () => {
            Promise.all(
              formsToDelete.map((f) => handleUndoDelete(f))
            );
          },
        },
      });
    } catch (err) {
      console.error('Failed to batch delete:', err);
      toast.error('خطا در حذف فرم‌ها');
    }
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            icon={<FileText className="size-6 text-violet-600 dark:text-violet-400" />}
            label="کل فرم‌ها"
            value={forms.length}
            color="bg-violet-100"
            colorDark="dark:bg-violet-900/30"
          />
          <StatCard
            icon={<Send className="size-6 text-emerald-600 dark:text-emerald-400" />}
            label="کل پاسخ‌ها"
            value={totalSubmissions}
            color="bg-emerald-100"
            colorDark="dark:bg-emerald-900/30"
          />
          <StatCard
            icon={<Eye className="size-6 text-fuchsia-600 dark:text-fuchsia-400" />}
            label="کل بازدیدها"
            value={totalViews}
            color="bg-fuchsia-100"
            colorDark="dark:bg-fuchsia-900/30"
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
            {forms.length > 0 && (
              <Button
                variant={selectMode ? 'default' : 'outline'}
                onClick={() => {
                  if (selectMode) {
                    exitSelectMode();
                  } else {
                    setSelectMode(true);
                  }
                }}
                className={`rounded-xl px-4 font-medium h-10 transition-all ${
                  selectMode
                    ? 'bg-violet-500 hover:bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-200/50 dark:shadow-violet-500/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {selectMode ? (
                  <>
                    <X className="size-4 ml-1.5" />
                    خروج
                  </>
                ) : (
                  <>
                    <CheckSquare className="size-4 ml-1.5 text-violet-500" />
                    انتخاب
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setCurrentView('templates')}
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl px-5 font-medium w-full sm:w-auto h-10 transition-colors text-gray-700 dark:text-gray-300"
            >
              <LayoutTemplate className="size-4 ml-2 text-purple-500" />
              الگوهای آماده
            </Button>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-l from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md shadow-violet-200/50 dark:shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-300/50 rounded-xl px-5 font-medium w-full sm:w-auto h-10"
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
                className="pr-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 text-gray-900 dark:text-white"
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
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                <ArrowUpDown className="size-4 ml-2 text-gray-400" />
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
                <SelectItem value="most_responses">بیشترین پاسخ</SelectItem>
                <SelectItem value="least_responses">کمترین پاسخ</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        )}

        {/* Select mode header bar */}
        <AnimatePresence>
          {selectMode && filteredAndSortedForms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="text-xs text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 rounded-lg"
              >
                {selectedIds.size === filteredAndSortedForms.length ? (
                  <>
                    <Square className="size-3.5 ml-1" />
                    لغو همه
                  </>
                ) : (
                  <>
                    <CheckSquare className="size-3.5 ml-1" />
                    انتخاب همه
                  </>
                )}
              </Button>
              <div className="flex-1" />
              <span className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                {selectedIds.size} فرم انتخاب شده
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <FormCardSkeleton key={i} />
            ))}
          </div>
        ) : forms.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} onGoTemplates={() => setCurrentView('templates')} />
        ) : filteredAndSortedForms.length === 0 ? (
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
          <>
            {/* Quick Stats Bar */}
            <QuickStatsBar
              totalForms={forms.length}
              publishedCount={publishedForms}
              totalSubmissions={totalSubmissions}
              totalViews={totalViews}
            />

            {/* Activity Feed Widget */}
            <ActivityFeedWidget />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedForms.map((form) => (
                  <FormCard
                    key={form.id}
                    form={form}
                    onEdit={handleEdit}
                    onPreview={handlePreview}
                    onResults={handleResults}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                    onShare={handleShare}
                    onSetExpiration={handleSetExpiration}
                    selectMode={selectMode}
                    selected={selectedIds.has(form.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Floating batch action bar */}
      <AnimatePresence>
        {selectMode && selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl shadow-gray-300/50 dark:shadow-black/30">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                انتخاب {selectedIds.size} فرم
              </span>
              <AlertDialog open={batchDeleteConfirmOpen} onOpenChange={setBatchDeleteConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-4 text-sm shadow-md shadow-red-200/50 dark:shadow-red-500/20"
                  >
                    <Trash2 className="size-3.5 ml-1.5" />
                    حذف انتخاب شده‌ها
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>حذف فرم‌های انتخاب شده</AlertDialogTitle>
                    <AlertDialogDescription>
                      آیا از حذف {selectedIds.size} فرم انتخاب شده مطمئن هستید؟ این عمل قابل بازگشت نیست.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-lg" onClick={() => setBatchDeleteConfirmOpen(false)}>
                      انصراف
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleBatchDelete}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    >
                      حذف {selectedIds.size} فرم
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ShareFormDialog
        form={shareForm}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onPublish={handlePublishFromShare}
      />

      <ExpirationDateDialog
        form={expirationForm}
        open={expirationDialogOpen}
        onOpenChange={setExpirationDialogOpen}
        onSave={handleSaveExpiration}
      />
    </div>
  );
}
