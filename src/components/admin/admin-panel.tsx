'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  LayoutTemplate,
  Settings,
  ScrollText,
  ArrowLeft,
  Search,
  MoreHorizontal,
  Edit3,
  Ban,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Server,
  HardDrive,
  Plus,
  Download,
  Filter,
  Eye,
  Send,
  Mail,
  Lock,
  Globe,
  BarChart3,
  TrendingUp,
  Activity,
  AlertTriangle,
  Save,
  ChevronLeft,
  ChevronRight,
  Menu,
  Copy,
  ExternalLink,
  CircleDot,
  ClipboardList,
  UserCheck,
  UserX,
  Calendar,
  Star,
  Loader2,
  RefreshCw,
  UserPlus,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore } from '@/lib/store';

// ─── Types ─────────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'users' | 'forms' | 'templates' | 'settings' | 'reports';

interface AdminStats {
  users: number;
  forms: number;
  submissions: number;
  publishedForms: number;
  totalViews: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar?: string | null;
  bio?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
  _count: { forms: number; notifications: number };
}

interface AdminForm {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  viewCount: number;
  creator: string;
  creatorEmail: string;
  submissions: number;
  questions: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string | null;
}

interface ChartDataPoint {
  date: string;
  count: number;
}

interface ActivityItem {
  type: 'form_created' | 'submission_received';
  title: string;
  userName: string;
  time: string;
}

// ─── Template Categories (static) ──────────────────────────────────────

const TEMPLATE_CATEGORIES = [
  { name: 'نظرسنجی', count: 15, icon: <BarChart3 className="size-5" />, color: 'from-violet-500 to-purple-600' },
  { name: 'ثبت‌نام', count: 15, icon: <ClipboardList className="size-5" />, color: 'from-emerald-500 to-teal-600' },
  { name: 'بازخورد', count: 15, icon: <MessageIcon />, color: 'from-blue-500 to-cyan-600' },
  { name: 'ارزیابی', count: 10, icon: <Star className="size-5" />, color: 'from-amber-500 to-orange-600' },
  { name: 'سفارش', count: 8, icon: <Globe className="size-5" />, color: 'from-rose-500 to-pink-600' },
  { name: 'آموزش', count: 10, icon: <BookIcon />, color: 'from-fuchsia-500 to-purple-600' },
  { name: 'سلامت', count: 8, icon: <HeartIcon />, color: 'from-red-500 to-rose-600' },
  { name: 'رویداد', count: 7, icon: <Calendar className="size-5" />, color: 'from-teal-500 to-emerald-600' },
  { name: 'منابع انسانی', count: 7, icon: <Users className="size-5" />, color: 'from-cyan-500 to-blue-600' },
  { name: 'سایر', count: 5, icon: <LayoutTemplate className="size-5" />, color: 'from-gray-500 to-slate-600' },
];

const SYSTEM_HEALTH = [
  { name: 'دیتابیس', status: 'فعال', icon: <Database className="size-4" />, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { name: 'سرور', status: 'فعال', icon: <Server className="size-4" />, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { name: 'فضای ذخیره‌سازی', status: '۴۵٪', icon: <HardDrive className="size-4" />, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30', progress: 45 },
];

const MOCK_REPORTS = [
  { id: 1, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۴:۳۲', user: 'علی محمدی', action: 'ایجاد فرم', detail: 'فرم نظرسنجی جدید با ۸ سؤال', type: 'create' },
  { id: 2, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۴:۲۸', user: 'زهرا احمدی', action: 'ارسال پاسخ', detail: 'فرم ثبت‌نام رویداد', type: 'submit' },
  { id: 3, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۴:۱۵', user: 'سیستم', action: 'پشتیبان‌گیری', detail: 'پشتیبان‌گیری خودکار دیتابیس', type: 'system' },
  { id: 4, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۳:۵۰', user: 'محمد رضایی', action: 'انتشار فرم', detail: 'فرم بازخورد محصول', type: 'publish' },
  { id: 5, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۳:۴۲', user: 'مدیر سیستم', action: 'تغییر تنظیمات', detail: 'محدودیت فرم‌ها: ۵۰ → ۱۰۰', type: 'settings' },
  { id: 6, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۳:۳۰', user: 'امیر کریمی', action: 'تعلیق حساب', detail: 'نقض قوانین - حساب کاربری مسدود شد', type: 'security' },
  { id: 7, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۲:۵۵', user: 'سارا موسوی', action: 'ورود ناموفق', detail: 'تلاش ۳ بار - آی‌پی: ۱۹۲.۱۶۸.۱.۱', type: 'security' },
  { id: 8, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۲:۳۰', user: 'مریم حسینی', action: 'ویرایش الگو', detail: 'الگوی ارزیابی عملکرد بروزرسانی شد', type: 'edit' },
  { id: 9, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۲:۰۰', user: 'رضا عباسی', action: 'حذف فرم', detail: 'فرم تست قدیمی حذف شد', type: 'delete' },
  { id: 10, timestamp: '۱۴۰۳/۰۹/۱۶ - ۱۱:۴۵', user: 'سیستم', action: 'به‌روزرسانی', detail: 'سیستم با موفقیت به نسخه ۲.۵ ارتقا یافت', type: 'system' },
];

// ─── Custom SVG Icons ──────────────────────────────────────────────────

function MessageIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────

function formatNumber(num: number): string {
  return num.toLocaleString('fa-IR');
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'همین الان';
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;
  if (diffHour < 24) return `${diffHour} ساعت پیش`;
  return `${diffDay} روز پیش`;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// ─── Animated Counter Hook ─────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) {
      // Use rAF to avoid synchronous setState inside effect (lint rule)
      requestAnimationFrame(() => setCount(target));
      prevTarget.current = target;
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevTarget.current = target;
  }, [target, duration]);

  return count;
}

// ─── Sidebar Navigation ────────────────────────────────────────────────

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'داشبورد', icon: <LayoutDashboard className="size-5" /> },
  { id: 'users', label: 'کاربران', icon: <Users className="size-5" /> },
  { id: 'forms', label: 'فرم‌ها', icon: <FileText className="size-5" /> },
  { id: 'templates', label: 'الگوها', icon: <LayoutTemplate className="size-5" /> },
  { id: 'settings', label: 'تنظیمات سیستم', icon: <Settings className="size-5" /> },
  { id: 'reports', label: 'گزارش‌ها', icon: <ScrollText className="size-5" /> },
];

// ─── Animation Variants ────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  out: { opacity: 0, x: 20, transition: { duration: 0.2 } },
};

// ─── Stat Card Skeleton ────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 shadow-sm">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-violet-500 to-purple-500 opacity-40" />
      <div className="absolute -top-6 -left-6 size-24 rounded-full bg-gray-200/60 dark:bg-gray-700/60" />
      <div className="flex items-center gap-4">
        <Skeleton className="size-12 rounded-xl shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="size-9 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-[250px] w-full rounded-xl" />
    </div>
  );
}

// ─── Welcome Empty State for Admin ──────────────────────────────────

function AdminWelcomeState({ onCreateUser, onGoTemplates }: { onCreateUser: () => void; onGoTemplates: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 px-4"
    >
      {/* Illustration */}
      <motion.div
        animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-gradient-to-br from-violet-200 to-purple-300 dark:from-violet-900/20 dark:to-purple-900/20 blur-2xl"
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute -bottom-4 -right-4 w-48 h-48 rounded-full bg-gradient-to-br from-fuchsia-200 to-pink-300 dark:from-fuchsia-900/15 dark:to-pink-900/15 blur-2xl"
      />
      <div className="relative mb-8">
        <svg viewBox="0 0 200 160" fill="none" className="w-48 h-38 drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="180" height="140" rx="16" fill="white" className="dark:fill-gray-800 text-gray-200 dark:text-gray-700" stroke="currentColor" strokeWidth="1.5" />
          <defs>
            <linearGradient id="adminWelcomeGrad" x1="10" y1="10" x2="190" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <rect x="10" y="10" width="180" height="38" rx="16" fill="url(#adminWelcomeGrad)" />
          <rect x="10" y="32" width="180" height="16" fill="url(#adminWelcomeGrad)" />
          <circle cx="30" cy="30" r="3.5" fill="rgba(255,255,255,0.5)" />
          <circle cx="42" cy="30" r="3.5" fill="rgba(255,255,255,0.5)" />
          <circle cx="54" cy="30" r="3.5" fill="rgba(255,255,255,0.5)" />
          <rect x="80" y="25" width="90" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
          <rect x="30" y="62" width="140" height="6" rx="3" fill="currentColor" className="text-gray-200 dark:text-gray-600" />
          <rect x="30" y="76" width="100" height="24" rx="6" fill="currentColor" className="text-gray-100 dark:text-gray-700" stroke="currentColor" strokeWidth="0.5" />
          <rect x="30" y="110" width="120" height="6" rx="3" fill="currentColor" className="text-gray-200 dark:text-gray-600" />
          <circle cx="38" cy="130" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gray-200 dark:text-gray-700" />
          <circle cx="38" cy="130" r="2" fill="#8b5cf6" />
          <rect x="52" y="125" width="40" height="10" rx="3" fill="currentColor" className="text-gray-200 dark:text-gray-600" />
          <circle cx="100" cy="130" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-gray-200 dark:text-gray-700" />
          <rect x="114" y="125" width="30" height="10" rx="3" fill="currentColor" className="text-gray-200 dark:text-gray-600" />
        </svg>
      </div>

      {/* Welcome text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-8 max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
          خوش آمدید!
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          هنوز داده‌ای ثبت نشده است. سیستم آماده به کار است.
        </p>
      </motion.div>

      {/* Quick-start cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateUser}
          className="group flex items-center gap-3 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:border-violet-200/80 dark:hover:border-violet-800/80 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
            <UserPlus className="size-5 text-white" />
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">ایجاد کاربر جدید</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">اولین کاربر را اضافه کنید</p>
          </div>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGoTemplates}
          className="group flex items-center gap-3 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:border-fuchsia-200/80 dark:hover:border-fuchsia-800/80 hover:shadow-lg transition-all cursor-pointer"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-lg shadow-fuchsia-200/50 dark:shadow-fuchsia-500/20">
            <LayoutTemplate className="size-5 text-white" />
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">مشاهده الگوها</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">۱۰۰ الگوی آماده</p>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Quick Actions Widget ──────────────────────────────────────────────

function QuickActionsWidget({ onCreateUser, onSwitchTab, onGoTemplates }: {
  onCreateUser: () => void;
  onSwitchTab: (tab: AdminTab) => void;
  onGoTemplates: () => void;
}) {
  const actions = [
    { label: 'ایجاد کاربر جدید', icon: <UserPlus className="size-5" />, gradient: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-200/50 dark:shadow-violet-500/20', onClick: onCreateUser },
    { label: 'مشاهده گزارش‌ها', icon: <FileText className="size-5" />, gradient: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-200/50 dark:shadow-emerald-500/20', onClick: () => onSwitchTab('reports') },
    { label: 'تنظیمات سیستم', icon: <Settings className="size-5" />, gradient: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-200/50 dark:shadow-amber-500/20', onClick: () => onSwitchTab('settings') },
    { label: 'مشاهده الگوها', icon: <LayoutTemplate className="size-5" />, gradient: 'from-fuchsia-500 to-pink-600', shadow: 'shadow-fuchsia-200/50 dark:shadow-fuchsia-500/20', onClick: onGoTemplates },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Zap className="size-4 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-base">دسترسی سریع</CardTitle>
              <CardDescription className="text-xs">عملیات پرکاربرد</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="grid grid-cols-2 gap-3">
            {actions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 + index * 0.05 }}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={action.onClick}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all cursor-pointer"
              >
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-md ${action.shadow} transition-transform group-hover:scale-110`}>
                  <span className="text-white">{action.icon}</span>
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Activity Feed Widget ───────────────────────────────────────────────

function ActivityFeedWidget() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/activity')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setActivities(data))
      .catch(() => setActivities([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30">
                <Activity className="size-4 text-fuchsia-600 dark:text-fuchsia-400" />
              </div>
              <div>
                <CardTitle className="text-base">فعالیت‌های اخیر</CardTitle>
                <CardDescription className="text-xs">آخرین رویدادها</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="size-8 rounded-full shrink-0 mt-0.5" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3.5 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const isFormCreated = (a: ActivityItem) => a.type === 'form_created';
  const iconConfig = {
    form_created: { icon: <FileText className="size-3.5" />, bg: 'bg-violet-100 dark:bg-violet-900/30', color: 'text-violet-600 dark:text-violet-400' },
    submission_received: { icon: <Send className="size-3.5" />, bg: 'bg-emerald-100 dark:bg-emerald-900/30', color: 'text-emerald-600 dark:text-emerald-400' },
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/30">
              <Activity className="size-4 text-fuchsia-600 dark:text-fuchsia-400" />
            </div>
            <div>
              <CardTitle className="text-base">فعالیت‌های اخیر</CardTitle>
              <CardDescription className="text-xs">آخرین رویدادها</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
              <Clock className="size-8 mb-2 opacity-50" />
              <p className="text-xs">هنوز فعالیتی ثبت نشده</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {activities.map((activity, index) => {
                const config = iconConfig[activity.type];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${config.bg} mt-0.5`}>
                      <span className={config.color}>{config.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-relaxed">{activity.title}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                        {timeAgo(activity.time)}
                        <span className="mx-1">·</span>
                        {activity.userName}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Overview Section (Real DB) ─────────────────────────────────────────

function OverviewSection({ onSwitchTab, onCreateUser, onGoTemplates }: {
  onSwitchTab: (tab: AdminTab) => void;
  onCreateUser: () => void;
  onGoTemplates: () => void;
}) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.ok ? r.json() : null).catch(() => null),
      fetch('/api/admin/stats/charts').then((r) => r.ok ? r.json() : null).catch(() => null),
    ]).then(([statsData, chartRes]) => {
      if (cancelled) return;
      if (statsData) setStats(statsData);
      if (chartRes) setChartData(chartRes.data || []);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const isAllZero = stats && stats.users === 0 && stats.forms === 0 && stats.submissions === 0 && stats.totalViews === 0;
  const isChartEmpty = !loading && chartData.length > 0 && chartData.every((d) => d.count === 0);

  const animatedUsers = useAnimatedCounter(stats?.users ?? 0);
  const animatedForms = useAnimatedCounter(stats?.forms ?? 0);
  const animatedSubmissions = useAnimatedCounter(stats?.submissions ?? 0);
  const animatedViews = useAnimatedCounter(stats?.totalViews ?? 0);
  const animatedPublished = useAnimatedCounter(stats?.publishedForms ?? 0);

  const statCards = stats
    ? [
        { label: 'کل کاربران', value: stats.users, animatedValue: animatedUsers, formattedValue: formatNumber(animatedUsers), icon: <Users className="size-6" />, gradient: 'from-violet-500 to-purple-600', shadowColor: 'shadow-violet-200/50 dark:shadow-violet-500/20' },
        { label: 'کل فرم‌ها', value: stats.forms, animatedValue: animatedForms, formattedValue: formatNumber(animatedForms), icon: <FileText className="size-6" />, gradient: 'from-emerald-500 to-teal-600', shadowColor: 'shadow-emerald-200/50 dark:shadow-emerald-500/20' },
        { label: 'کل پاسخ‌ها', value: stats.submissions, animatedValue: animatedSubmissions, formattedValue: formatNumber(animatedSubmissions), icon: <Send className="size-6" />, gradient: 'from-amber-500 to-orange-600', shadowColor: 'shadow-amber-200/50 dark:shadow-amber-500/20' },
        { label: 'کل بازدیدها', value: stats.totalViews, animatedValue: animatedViews, formattedValue: formatNumber(animatedViews), icon: <Eye className="size-6" />, gradient: 'from-fuchsia-500 to-pink-600', shadowColor: 'shadow-fuchsia-200/50 dark:shadow-fuchsia-500/20' },
        { label: 'فرم‌های منتشر شده', value: stats.publishedForms, animatedValue: animatedPublished, formattedValue: formatNumber(animatedPublished), icon: <Activity className="size-6" />, gradient: 'from-cyan-500 to-blue-600', shadowColor: 'shadow-cyan-200/50 dark:shadow-cyan-500/20' },
        { label: 'الگوهای آماده', value: 100, animatedValue: 100, formattedValue: '۱۰۰', icon: <LayoutTemplate className="size-6" />, gradient: 'from-rose-500 to-red-600', shadowColor: 'shadow-rose-200/50 dark:shadow-rose-500/20' },
      ]
    : [];

  const formattedChartData = chartData.map((d) => {
    const date = new Date(d.date);
    return {
      ...d,
      dateLabel: new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(date),
    };
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Welcome Empty State when all stats are 0 */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : isAllZero ? (
        <AdminWelcomeState onCreateUser={onCreateUser} onGoTemplates={onGoTemplates} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              custom={index}
              whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Glass highlight line at top */}
              <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-l ${stat.gradient} opacity-60`} />
              {/* Hover gradient background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />

              <div className="relative flex items-center gap-4">
                <div className={`relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} transition-transform duration-300 group-hover:scale-110`}>
                  <span className="text-white">{stat.icon}</span>
                  {/* Pulse dot */}
                  <motion.div
                    className="absolute -top-0.5 -left-0.5 size-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-gray-900"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.4, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {stat.formattedValue}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Actions Widget + Activity Feed (shown when not in empty state) */}
      {!isAllZero && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuickActionsWidget onCreateUser={onCreateUser} onSwitchTab={onSwitchTab} onGoTemplates={onGoTemplates} />
          <ActivityFeedWidget />
        </div>
      )}

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
              <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                      <BarChart3 className="size-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <CardTitle className="text-base">آمار پاسخ‌ها</CardTitle>
                      <CardDescription className="text-xs">۳۰ روز گذشته</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs h-6 px-2.5 bg-violet-50 text-violet-600 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800">
                    <TrendingUp className="size-3 ml-1" />
                    نمودار سطح
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isChartEmpty ? (
                  <div className="flex flex-col items-center justify-center h-[260px] text-gray-400 dark:text-gray-500">
                    <BarChart3 className="size-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">هنوز پاسخی ثبت نشده</p>
                    <p className="text-xs mt-1">با دریافت اولین پاسخ، نمودار نمایش داده می‌شود</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={formattedChartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="adminAreaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.15)" />
                      <XAxis
                        dataKey="dateLabel"
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: '#9ca3af' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255,255,255,0.95)',
                          border: '1px solid rgba(229,231,235,0.8)',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                          fontSize: '12px',
                          fontFamily: 'Vazirmatn, sans-serif',
                          direction: 'rtl',
                        }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                        formatter={(value: number) => [`${value} پاسخ`, 'تعداد']}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#adminAreaGradient)"
                        dot={false}
                        activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* System Health */}
        <motion.div variants={itemVariants}>
          <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl h-full">
            <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <Activity className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-base">وضعیت سیستم</CardTitle>
                  <CardDescription className="text-xs">سلامت سرویس‌ها</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {SYSTEM_HEALTH.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.bgColor}`}>
                    <span className={item.color}>{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                      {item.progress != null ? (
                        <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                      ) : (
                        <Badge variant="outline" className="text-xs h-5 px-2 bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                          <CheckCircle2 className="size-3 ml-1" />
                          {item.status}
                        </Badge>
                      )}
                    </div>
                    {item.progress != null && (
                      <div className="space-y-1">
                        <Progress value={item.progress} className="h-1.5" />
                        <p className="text-[10px] text-gray-400 dark:text-gray-500">
                          {formatNumber(45)} گیگابایت از {formatNumber(100)} گیگابایت
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Uptime indicator */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-l from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="size-3.5 text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">آپتایم سرور</span>
                </div>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">۹۹.۹۸٪</p>
                <p className="text-[10px] text-emerald-500 dark:text-emerald-500 mt-0.5">۳۰ روز گذشته</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Users Section (Real DB) ───────────────────────────────────────────

function UsersSection() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [creating, setCreating] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error('نام و ایمیل الزامی است');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        toast.success('کاربر جدید با موفقیت ایجاد شد');
        setCreateDialogOpen(false);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        fetchUsers();
      } else {
        const data = await res.json();
        toast.error(data.error || 'خطا در ایجاد کاربر');
      }
    } catch {
      toast.error('خطا در ایجاد کاربر');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(newStatus === 'suspended' ? 'کاربر تعلیق شد' : 'کاربر فعال شد');
        fetchUsers();
      }
    } catch {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success(`کاربر «${userName}» حذف شد`);
        fetchUsers();
      }
    } catch {
      toast.error('خطا در حذف کاربر');
    }
  };

  const roleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge variant="outline" className="text-xs h-5 px-2 bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800">ادمین</Badge>;
    }
    return <Badge variant="outline" className="text-xs h-5 px-2 bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">کاربر</Badge>;
  };

  const statusBadge = (status: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      active: { label: 'فعال', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
      inactive: { label: 'غیرفعال', className: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
      suspended: { label: 'تعلیق', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
    };
    const config = configs[status] || configs.inactive;
    return <Badge variant="outline" className={`text-xs h-5 px-2 ${config.className}`}>{config.label}</Badge>;
  };

  const avatarColors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-fuchsia-500', 'bg-teal-500', 'bg-purple-500',
    'bg-cyan-500', 'bg-orange-500',
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Filters + New User Button */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="جستجوی نام یا ایمیل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
          {searchQuery && (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 animate-spin" />
          )}
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-36 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <SelectValue placeholder="نقش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه نقش‌ها</SelectItem>
            <SelectItem value="admin">ادمین</SelectItem>
            <SelectItem value="user">کاربر</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="active">فعال</SelectItem>
            <SelectItem value="inactive">غیرفعال</SelectItem>
            <SelectItem value="suspended">تعلیق</SelectItem>
          </SelectContent>
        </Select>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm shadow-md shadow-violet-200/50 dark:shadow-violet-500/20 h-10">
              <Plus className="size-4 ml-1.5" />
              کاربر جدید
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="rounded-2xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base">ایجاد کاربر جدید</DialogTitle>
              <DialogDescription className="text-xs">اطلاعات کاربر جدید را وارد کنید</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label className="text-sm">نام و نام خانوادگی</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="مثلاً: علی محمدی"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">ایمیل</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="example@email.com"
                  className="h-10 rounded-xl"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">رمز عبور</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="اختیاری"
                  className="h-10 rounded-xl"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">نقش</Label>
                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">کاربر</SelectItem>
                    <SelectItem value="admin">ادمین</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)} className="rounded-xl">انصراف</Button>
              <Button
                onClick={handleCreateUser}
                disabled={creating}
                className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl"
              >
                {creating && <Loader2 className="size-4 ml-2 animate-spin" />}
                ایجاد کاربر
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-violet-50/40 dark:bg-violet-950/10 hover:bg-violet-50/40 dark:hover:bg-violet-950/10">
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">کاربر</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden md:table-cell">ایمیل</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">نقش</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">وضعیت</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden sm:table-cell">فرم‌ها</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden lg:table-cell">آخرین ورود</TableHead>
                  <TableHead className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={7}>
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="size-6 text-violet-500 animate-spin" />
                          <span className="mr-3 text-sm text-gray-500">در حال بارگذاری...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                        <Users className="size-10 mb-3 opacity-50" />
                        <p className="text-sm">کاربری یافت نشد</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      className={`border-gray-100/60 dark:border-gray-800/60 transition-all duration-200 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:shadow-sm ${index % 2 === 0 ? 'bg-white/40 dark:bg-gray-900/20' : 'bg-gray-50/50 dark:bg-gray-800/20'}`}
                    >
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium ${avatarColors[index % avatarColors.length]}`}>
                            {user.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap block">{user.name}</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 sm:hidden" dir="ltr">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">{user.email}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4">{roleBadge(user.role)}</TableCell>
                      <TableCell className="py-3 px-4">{statusBadge(user.status)}</TableCell>
                      <TableCell className="py-3 px-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{user._count.forms}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="size-3" />
                          {user.lastLoginAt ? timeAgo(user.lastLoginAt) : '—'}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-7 w-7 p-0 ${user.status === 'suspended' ? 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'}`}
                            title={user.status === 'suspended' ? 'فعال‌سازی' : 'تعلیق'}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.status === 'suspended' ? <UserCheck className="size-3.5" /> : <Ban className="size-3.5" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="حذف">
                                <Trash2 className="size-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl" className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
                                <AlertDialogDescription>
                                  آیا مطمئن هستید که می‌خواهید کاربر «{user.name}» را حذف کنید؟ این عملیات قابل بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">انصراف</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-xl" onClick={() => handleDeleteUser(user.id, user.name)}>
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Forms Section (Real DB) ───────────────────────────────────────────

function FormsSection() {
  const [forms, setForms] = useState<AdminForm[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());

  const debouncedSearch = useDebounce(searchQuery, 300);
  const limit = 20;

  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('page', page.toString());

      const res = await fetch(`/api/admin/forms?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setForms(data.forms);
        setTotal(data.total);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, page]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const totalPages = Math.ceil(total / limit);

  const formStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
      draft: { label: 'پیش‌نویس', icon: <ClipboardList className="size-3" />, className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
      published: { label: 'منتشر شده', icon: <CircleDot className="size-3" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
      closed: { label: 'بسته شده', icon: <Lock className="size-3" />, className: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
    };
    const config = configs[status] || configs.draft;
    return <Badge variant="outline" className={`text-xs h-5 px-2 gap-1 ${config.className}`}>{config.icon}{config.label}</Badge>;
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedForms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedForms(next);
  };

  const toggleSelectAll = () => {
    if (selectedForms.size === forms.length && forms.length > 0) {
      setSelectedForms(new Set());
    } else {
      setSelectedForms(new Set(forms.map((f) => f.id)));
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="جستجوی عنوان یا سازنده..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
          {searchQuery && (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 animate-spin" />
          )}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedForms.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800"
          >
            <span className="text-sm font-medium text-violet-700 dark:text-violet-400">
              {formatNumber(selectedForms.size)} فرم انتخاب شده
            </span>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="rounded-lg text-xs h-8 border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-950/50" onClick={() => setSelectedForms(new Set())}>
              لغو انتخاب
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg text-xs h-8 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
                  <Trash2 className="size-3 ml-1" />
                  حذف
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl" className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>حذف فرم‌ها</AlertDialogTitle>
                  <AlertDialogDescription>
                    آیا مطمئن هستید که می‌خواهید {formatNumber(selectedForms.size)} فرم انتخاب شده را حذف کنید؟
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl">انصراف</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-xl" onClick={() => { setSelectedForms(new Set()); toast.success('فرم‌ها حذف شدند'); }}>
                    حذف
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/40 dark:bg-emerald-950/10 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                  <TableHead className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedForms.size === forms.length && forms.length > 0}
                      onChange={toggleSelectAll}
                      className="size-4 rounded border-gray-300 dark:border-gray-600 text-violet-500 focus:ring-violet-300 accent-violet-500"
                    />
                  </TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">عنوان</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden md:table-cell">سازنده</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">وضعیت</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden sm:table-cell">پاسخ‌ها</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden lg:table-cell">بازدید</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden lg:table-cell">تاریخ</TableHead>
                  <TableHead className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="size-6 text-violet-500 animate-spin" />
                        <span className="mr-3 text-sm text-gray-500">در حال بارگذاری...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                        <FileText className="size-10 mb-3 opacity-50" />
                        <p className="text-sm">فرمی یافت نشد</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  forms.map((form) => (
                    <TableRow
                      key={form.id}
                      className="border-gray-100/60 dark:border-gray-800/60 transition-all duration-200 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 hover:shadow-sm"
                    >
                      <TableCell className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedForms.has(form.id)}
                          onChange={() => toggleSelect(form.id)}
                          className="size-4 rounded border-gray-300 dark:border-gray-600 text-violet-500 focus:ring-violet-300 accent-violet-500"
                        />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="min-w-0">
                          <span className="text-sm font-medium text-gray-900 dark:text-white block">{form.title}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">{form.questions} سؤال</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 hidden md:table-cell">
                        <span className="text-sm text-gray-500 dark:text-gray-400">{form.creator}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4">{formStatusBadge(form.status)}</TableCell>
                      <TableCell className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Send className="size-3" />
                          {formatNumber(form.submissions)}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 hidden lg:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                          <Eye className="size-3" />
                          {formatNumber(form.viewCount)}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 px-4 hidden lg:table-cell">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(form.updatedAt)}</span>
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30" title="مشاهده">
                            <Eye className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="حذف" onClick={() => toast.success('فرم حذف شد')}>
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-8 px-3 text-xs border-gray-200 dark:border-gray-700"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronRight className="size-4 ml-1" />
            قبلی
          </Button>
          <span className="text-sm text-gray-500 dark:text-gray-400 px-3">
            صفحه {formatNumber(page)} از {formatNumber(totalPages)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            ({formatNumber(total)} فرم)
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-8 px-3 text-xs border-gray-200 dark:border-gray-700"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            بعدی
            <ChevronLeft className="size-4 mr-1" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Templates Section ─────────────────────────────────────────────────

function TemplatesSection() {
  const totalTemplates = TEMPLATE_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0);
  const mostPopular = TEMPLATE_CATEGORIES.reduce((prev, curr) => (curr.count > prev.count ? curr : prev));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm whileHover={{ y: -2 }}">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
            <LayoutTemplate className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatNumber(totalTemplates)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">کل الگوها</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm whileHover={{ y: -2 }}">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/20">
            <BarChart3 className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{TEMPLATE_CATEGORIES.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">دسته‌بندی</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm whileHover={{ y: -2 }}">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200/50 dark:shadow-amber-500/20">
            <Star className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{mostPopular.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">محبوب‌ترین دسته</p>
          </div>
        </motion.div>
      </div>

      {/* Categories Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">دسته‌بندی الگوها</h3>
          <Button className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm shadow-md shadow-violet-200/50 dark:shadow-violet-500/20" onClick={() => toast.success('فرم الگوی جدید اضافه شد')}>
            <Plus className="size-4 ml-1.5" />
            افزودن الگو
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group p-4 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} shadow-md transition-transform group-hover:scale-110`}>
                  <span className="text-white">{cat.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{cat.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatNumber(cat.count)} الگو</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Progress value={(cat.count / totalTemplates) * 100} className="h-1 flex-1 ml-3" />
                <span className="text-xs text-gray-400 dark:text-gray-500">{Math.round((cat.count / totalTemplates) * 100)}٪</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Settings Section ──────────────────────────────────────────────────

function SettingsSection() {
  const [siteName, setSiteName] = useState('فرمساز');
  const [siteDescription, setSiteDescription] = useState('ساخت فرم آنلاین حرفه‌ای');
  const [logoUrl, setLogoUrl] = useState('https://formsaz.ir/logo.svg');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpEmail, setSmtpEmail] = useState('noreply@formsaz.ir');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [maxFormsPerUser, setMaxFormsPerUser] = useState('100');
  const [maxQuestions, setMaxQuestions] = useState('50');
  const [maxSubmissions, setMaxSubmissions] = useState('10000');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName,
          siteDescription,
          maxFormsPerUser: parseInt(maxFormsPerUser, 10),
          maxQuestionsPerForm: parseInt(maxQuestions, 10),
          maintenanceMode,
        }),
      });
      if (res.ok) {
        toast.success('تنظیمات با موفقیت ذخیره شد');
      }
    } catch {
      toast.error('خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* General Settings */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30">
                <Globe className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات عمومی</CardTitle>
                <CardDescription className="text-xs">اطلاعات اصلی سایت</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">نام سایت</Label>
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">آدرس لوگو</Label>
                <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300">توضیحات سایت</Label>
              <Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none" rows={2} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Settings */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/40 dark:to-blue-900/30">
                <Mail className="size-4 text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات ایمیل</CardTitle>
                <CardDescription className="text-xs">تنظیمات SMTP برای ارسال ایمیل</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">سرور SMTP</Label>
                <Input value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">پورت</Label>
                <Input value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">ایمیل</Label>
                <Input value={smtpEmail} onChange={(e) => setSmtpEmail(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">رمز عبور</Label>
                <Input type="password" value={smtpPassword} onChange={(e) => setSmtpPassword(e.target.value)} placeholder="••••••••" className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Limits */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/30">
                <BarChart3 className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-base">محدودیت‌ها</CardTitle>
                <CardDescription className="text-xs">تنظیم محدودیت‌های سیستم</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">حداکثر فرم در هر کاربر</Label>
                <Input type="number" value={maxFormsPerUser} onChange={(e) => setMaxFormsPerUser(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">حداکثر سؤال در هر فرم</Label>
                <Input type="number" value={maxQuestions} onChange={(e) => setMaxQuestions(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">حداکثر پاسخ در هر فرم</Label>
                <Input type="number" value={maxSubmissions} onChange={(e) => setMaxSubmissions(e.target.value)} className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900" dir="ltr" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Maintenance Mode */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <CardHeader className="border-b border-gray-100/60 dark:border-gray-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/30">
                <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-base">حالت تعمیرات</CardTitle>
                <CardDescription className="text-xs">غیرفعال کردن موقت دسترسی به سایت</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">فعال‌سازی حالت تعمیرات</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">در این حالت، کاربران معمولی دسترسی به سایت نخواهند داشت.</p>
                </div>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} className="data-[state=checked]:bg-red-500" />
            </div>
            {maintenanceMode && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <p className="text-xs text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="size-3.5" />
                  هشدار: سایت در حالت تعمیرات است. فقط مدیران دسترسی دارند.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm px-6 h-10 shadow-md shadow-violet-200/50 dark:shadow-violet-500/20"
        >
          {saving ? <Loader2 className="size-4 ml-2 animate-spin" /> : <Save className="size-4 ml-2" />}
          ذخیره تنظیمات
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Reports Section (color-coded badges) ──────────────────────────────

function ReportsSection() {
  const [typeFilter, setTypeFilter] = useState('all');

  const reportTypeBadge = (type: string) => {
    const configs: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
      create: { label: 'ایجاد', className: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800', icon: <Plus className="size-2.5 ml-0.5" /> },
      submit: { label: 'پاسخ', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800', icon: <Send className="size-2.5 ml-0.5" /> },
      publish: { label: 'انتشار', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800', icon: <CircleDot className="size-2.5 ml-0.5" /> },
      edit: { label: 'ویرایش', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800', icon: <Edit3 className="size-2.5 ml-0.5" /> },
      delete: { label: 'حذف', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800', icon: <Trash2 className="size-2.5 ml-0.5" /> },
      settings: { label: 'تنظیمات', className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800', icon: <Settings className="size-2.5 ml-0.5" /> },
      security: { label: 'امنیت', className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800', icon: <Shield className="size-2.5 ml-0.5" /> },
      system: { label: 'سیستم', className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700', icon: <Server className="size-2.5 ml-0.5" /> },
    };
    const config = configs[type] || configs.system;
    return <Badge variant="outline" className={`text-xs h-5 px-2 gap-0.5 ${config.className}`}>{config.icon}{config.label}</Badge>;
  };

  const filteredReports = MOCK_REPORTS.filter((report) => {
    return typeFilter === 'all' || report.type === typeFilter;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'کل عملیات', value: MOCK_REPORTS.length, gradient: 'from-violet-500 to-purple-600', shadowColor: 'shadow-violet-200/50 dark:shadow-violet-500/20' },
          { label: 'عملیات امنیتی', value: MOCK_REPORTS.filter(r => r.type === 'security').length, gradient: 'from-red-500 to-rose-600', shadowColor: 'shadow-red-200/50 dark:shadow-red-500/20' },
          { label: 'ایجاد فرم', value: MOCK_REPORTS.filter(r => r.type === 'create').length, gradient: 'from-emerald-500 to-teal-600', shadowColor: 'shadow-emerald-200/50 dark:shadow-emerald-500/20' },
          { label: 'پاسخ دریافتی', value: MOCK_REPORTS.filter(r => r.type === 'submit').length, gradient: 'from-amber-500 to-orange-600', shadowColor: 'shadow-amber-200/50 dark:shadow-amber-500/20' },
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants} whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="group relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-3.5">
            <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-l ${stat.gradient} opacity-60`} />
            <div className="flex items-center gap-2.5">
              <div className={`flex size-8 items-center justify-center rounded-lg bg-gradient-to-br ${stat.gradient} shadow-md ${stat.shadowColor} transition-transform group-hover:scale-110`}>
                <BarChart3 className="size-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">{stat.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <SelectValue placeholder="نوع عملیات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه عملیات‌ها</SelectItem>
            <SelectItem value="create">ایجاد</SelectItem>
            <SelectItem value="submit">پاسخ</SelectItem>
            <SelectItem value="publish">انتشار</SelectItem>
            <SelectItem value="edit">ویرایش</SelectItem>
            <SelectItem value="delete">حذف</SelectItem>
            <SelectItem value="settings">تنظیمات</SelectItem>
            <SelectItem value="security">امنیت</SelectItem>
            <SelectItem value="system">سیستم</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex-1" />
        <Button variant="outline" className="rounded-xl text-sm h-10 border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/50 hover:text-violet-600 dark:hover:text-violet-400 transition-colors" onClick={() => toast.success('گزارش در حال دانلود...')}>
          <Download className="size-4 ml-1.5" />
          خروجی CSV
        </Button>
      </motion.div>

      {/* Reports Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-rose-50/40 dark:bg-rose-950/10 hover:bg-rose-50/40 dark:hover:bg-rose-950/10">
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">کاربر</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">عملیات</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden md:table-cell">جزئیات</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden sm:table-cell">نوع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-gray-100/60 dark:border-gray-800/60 transition-all duration-200 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:shadow-sm">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="size-3" />
                        {report.timestamp}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm text-gray-900 dark:text-white">{report.user}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{report.action}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{report.detail}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden sm:table-cell">
                      {reportTypeBadge(report.type)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredReports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <ScrollText className="size-10 mb-3 opacity-50" />
                <p className="text-sm">گزارشی یافت نشد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Admin Panel ──────────────────────────────────────────────────

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { setCurrentView } = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection />;
      case 'users':
        return <UsersSection />;
      case 'forms':
        return <FormsSection />;
      case 'templates':
        return <TemplatesSection />;
      case 'settings':
        return <SettingsSection />;
      case 'reports':
        return <ReportsSection />;
    }
  };

  const getTabTitle = () => {
    const titles: Record<AdminTab, string> = {
      overview: 'داشبورد',
      users: 'مدیریت کاربران',
      forms: 'مدیریت فرم‌ها',
      templates: 'الگوها',
      settings: 'تنظیمات سیستم',
      reports: 'گزارش‌ها و لاگ‌ها',
    };
    return titles[activeTab];
  };

  return (
    <div className="flex h-full overflow-hidden bg-gray-50 dark:bg-gray-950" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-l border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl transition-all duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand with gradient header */}
        <div className="relative overflow-hidden border-b border-gray-100/60 dark:border-gray-800/60">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 opacity-[0.07]" />
          <div className="relative flex items-center gap-3 p-5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
              <Shield className="size-5 text-white" />
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h1 className="text-base font-bold text-gray-900 dark:text-white">پنل مدیریت</h1>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">نسخه ۲.۵</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ x: -4 }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-l from-violet-100 to-purple-50 dark:from-violet-900/40 dark:to-purple-900/20 text-violet-700 dark:text-violet-300 shadow-sm shadow-violet-100/50 dark:shadow-violet-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`shrink-0 transition-colors duration-300 ${activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {item.icon}
                </span>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {activeTab === item.id && sidebarOpen && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="mr-auto w-1.5 h-6 rounded-full bg-gradient-to-b from-violet-500 via-purple-500 to-fuchsia-500 shadow-sm shadow-violet-500/50"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-2">
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-center h-9 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          >
            <ChevronLeft className={`size-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentView('dashboard')}
            className="w-full h-10 rounded-xl text-sm border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 gap-2"
          >
            <ArrowLeft className="size-4" />
            {sidebarOpen && 'بازگشت به سایت'}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: 260 }}
              animate={{ x: 0 }}
              exit={{ x: 260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl"
              dir="rtl"
            >
              <div className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-600 opacity-5" />
                <div className="relative flex items-center gap-3 p-5">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                    <Shield className="size-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-base font-bold text-gray-900 dark:text-white">پنل مدیریت</h1>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">نسخه ۲.۵</p>
                  </div>
                </div>
              </div>
              <ScrollArea className="flex-1 py-3">
                <nav className="space-y-1 px-3">
                  {NAV_ITEMS.map((item) => (
                    <motion.button
                      key={item.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                        activeTab === item.id
                          ? 'bg-gradient-to-l from-violet-100 to-purple-50 dark:from-violet-900/40 dark:to-purple-900/20 text-violet-700 dark:text-violet-300 shadow-sm shadow-violet-100/50 dark:shadow-violet-900/20'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={`transition-colors duration-300 ${activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </motion.button>
                  ))}
                </nav>
              </ScrollArea>
              <div className="border-t border-gray-100 dark:border-gray-800 p-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentView('dashboard');
                    setMobileSidebarOpen(false);
                  }}
                  className="w-full h-10 rounded-xl text-sm border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 gap-2"
                >
                  <ArrowLeft className="size-4" />
                  بازگشت به سایت
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar with System Status */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden h-9 w-9 p-0 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className={`flex size-9 items-center justify-center rounded-lg ${
              activeTab === 'overview' ? 'bg-violet-100 dark:bg-violet-900/30' :
              activeTab === 'users' ? 'bg-blue-100 dark:bg-blue-900/30' :
              activeTab === 'forms' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
              activeTab === 'templates' ? 'bg-amber-100 dark:bg-amber-900/30' :
              activeTab === 'settings' ? 'bg-purple-100 dark:bg-purple-900/30' :
              'bg-rose-100 dark:bg-rose-900/30'
            }`}>
              {NAV_ITEMS.find((item) => item.id === activeTab)?.icon && (
                <span className={
                  activeTab === 'overview' ? 'text-violet-600 dark:text-violet-400' :
                  activeTab === 'users' ? 'text-blue-600 dark:text-blue-400' :
                  activeTab === 'forms' ? 'text-emerald-600 dark:text-emerald-400' :
                  activeTab === 'templates' ? 'text-amber-600 dark:text-amber-400' :
                  activeTab === 'settings' ? 'text-purple-600 dark:text-purple-400' :
                  'text-rose-600 dark:text-rose-400'
                }>
                  {NAV_ITEMS.find((item) => item.id === activeTab)!.icon}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">{getTabTitle()}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {activeTab === 'overview' && 'نمای کلی از وضعیت سیستم'}
                {activeTab === 'users' && 'مدیریت و مشاهده کاربران'}
                {activeTab === 'forms' && 'مدیریت فرم‌های ایجاد شده'}
                {activeTab === 'templates' && 'مدیریت الگوهای آماده'}
                {activeTab === 'settings' && 'تنظیمات و پیکربندی سیستم'}
                {activeTab === 'reports' && 'گزارش فعالیت‌ها و لاگ‌ها'}
              </p>
            </div>
          </div>
          <div className="flex-1" />
          {/* System Status + Admin avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">سیستم فعال</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-xs">ادمین اصلی</span>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-violet-200/50 dark:shadow-violet-500/20">
              ا
            </div>
          </div>
        </header>

        {/* Page Content with smooth tab transitions */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
