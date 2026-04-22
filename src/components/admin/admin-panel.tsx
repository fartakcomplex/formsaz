'use client';

import React, { useState } from 'react';
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
  Menu,
  Copy,
  ExternalLink,
  CircleDot,
  ClipboardList,
  UserCheck,
  UserX,
  Calendar,
  Star,
} from 'lucide-react';
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
import { useAppStore } from '@/lib/store';

// ─── Types ─────────────────────────────────────────────────────────────

type AdminTab = 'overview' | 'users' | 'forms' | 'templates' | 'settings' | 'reports';

// ─── Mock Data ─────────────────────────────────────────────────────────

const MOCK_STATS = {
  totalUsers: 12458,
  totalForms: 34892,
  totalResponses: 1875643,
  totalViews: 8945672,
  activeForms: 12456,
  totalTemplates: 100,
};

const MOCK_ACTIVITY = [
  { id: 1, user: 'علی محمدی', action: 'فرم جدید ایجاد کرد', detail: 'فرم نظرسنجی مشتریان', time: '۲ دقیقه پیش', icon: <Plus className="size-3.5" />, color: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400' },
  { id: 2, user: 'زهرا احمدی', action: 'پاسخ جدید ثبت شد', detail: 'فرم ثبت‌نام رویداد', time: '۵ دقیقه پیش', icon: <Send className="size-3.5" />, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: 3, user: 'محمد رضایی', action: 'فرم را منتشر کرد', detail: 'فرم بازخورد محصول', time: '۱۲ دقیقه پیش', icon: <CircleDot className="size-3.5" />, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 4, user: 'مریم حسینی', action: 'کاربر جدید ثبت‌نام کرد', detail: 'marim.h@gmail.com', time: '۱۸ دقیقه پیش', icon: <UserCheck className="size-3.5" />, color: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400' },
  { id: 5, user: 'امیر کریمی', action: 'فرم را ویرایش کرد', detail: 'فرم سفارش آنلاین', time: '۲۵ دقیقه پیش', icon: <Edit3 className="size-3.5" />, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: 6, user: 'سارا موسوی', action: 'حساب تعلیق شد', detail: 'نقض قوانین استفاده', time: '۳۰ دقیقه پیش', icon: <Ban className="size-3.5" />, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  { id: 7, user: 'رضا عباسی', action: 'الگوی جدید اضافه شد', detail: 'فرم ارزیابی عملکرد', time: '۴۵ دقیقه پیش', icon: <LayoutTemplate className="size-3.5" />, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: 8, user: 'نازنین قاسمی', action: 'فرم را حذف کرد', detail: 'فرم تست قدیمی', time: '۱ ساعت پیش', icon: <Trash2 className="size-3.5" />, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
];

const SYSTEM_HEALTH = [
  { name: 'دیتابیس', status: 'فعال', icon: <Database className="size-4" />, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { name: 'سرور', status: 'فعال', icon: <Server className="size-4" />, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { name: 'فضای ذخیره‌سازی', status: '۴۵٪', icon: <HardDrive className="size-4" />, color: 'text-amber-500', bgColor: 'bg-amber-100 dark:bg-amber-900/30', progress: 45 },
];

const MOCK_USERS = [
  { id: 1, name: 'علی محمدی', email: 'ali.mohammadi@gmail.com', role: 'admin', status: 'active', forms: 24, lastLogin: '۲ ساعت پیش', avatar: 'ع' },
  { id: 2, name: 'زهرا احمدی', email: 'zahra.ahmadi@yahoo.com', role: 'user', status: 'active', forms: 12, lastLogin: '۵ ساعت پیش', avatar: 'ز' },
  { id: 3, name: 'محمد رضایی', email: 'm.rezaei@outlook.com', role: 'user', status: 'active', forms: 8, lastLogin: '۱ روز پیش', avatar: 'م' },
  { id: 4, name: 'مریم حسینی', email: 'maryam.h@gmail.com', role: 'admin', status: 'active', forms: 31, lastLogin: '۳ ساعت پیش', avatar: 'م' },
  { id: 5, name: 'امیر کریمی', email: 'amir.karimi@company.ir', role: 'user', status: 'suspended', forms: 3, lastLogin: '۱۰ روز پیش', avatar: 'ا' },
  { id: 6, name: 'سارا موسوی', email: 'sara.m@university.edu', role: 'user', status: 'inactive', forms: 0, lastLogin: '۳۰ روز پیش', avatar: 'س' },
  { id: 7, name: 'رضا عباسی', email: 'reza.abbasi@gmail.com', role: 'user', status: 'active', forms: 15, lastLogin: '۱ ساعت پیش', avatar: 'ر' },
  { id: 8, name: 'نازنین قاسمی', email: 'nazanin.q@gmail.com', role: 'user', status: 'active', forms: 6, lastLogin: '۶ ساعت پیش', avatar: 'ن' },
  { id: 9, name: 'حسن نوری', email: 'hassan.nori@company.ir', role: 'user', status: 'inactive', forms: 1, lastLogin: '۶۰ روز پیش', avatar: 'ح' },
  { id: 10, name: 'فاطمه جعفری', email: 'fatemeh.j@gmail.com', role: 'admin', status: 'active', forms: 42, lastLogin: '۳۰ دقیقه پیش', avatar: 'ف' },
];

const MOCK_FORMS = [
  { id: 1, title: 'فرم نظرسنجی مشتریان', creator: 'علی محمدی', status: 'published', responses: 1245, views: 8930, date: '۱۴۰۳/۰۹/۱۵' },
  { id: 2, title: 'فرم ثبت‌نام رویداد فناوری', creator: 'زهرا احمدی', status: 'published', responses: 876, views: 5420, date: '۱۴۰۳/۰۹/۱۴' },
  { id: 3, title: 'فرم بازخورد محصول', creator: 'محمد رضایی', status: 'draft', responses: 0, views: 120, date: '۱۴۰۳/۰۹/۱۳' },
  { id: 4, title: 'فرم ارزیابی عملکرد کارکنان', creator: 'مریم حسینی', status: 'published', responses: 456, views: 3210, date: '۱۴۰۳/۰۹/۱۲' },
  { id: 5, title: 'فرم سفارش آنلاین', creator: 'رضا عباسی', status: 'closed', responses: 2341, views: 15420, date: '۱۴۰۳/۰۹/۱۰' },
  { id: 6, title: 'فرم تماس با ما', creator: 'نازنین قاسمی', status: 'published', responses: 89, views: 780, date: '۱۴۰۳/۰۹/۰۸' },
  { id: 7, title: 'فرم ثبت‌نام دوره آموزشی', creator: 'فاطمه جعفری', status: 'draft', responses: 0, views: 45, date: '۱۴۰۳/۰۹/۱۶' },
  { id: 8, title: 'فرم نظرسنجی رضایت شغلی', creator: 'علی محمدی', status: 'published', responses: 567, views: 4100, date: '۱۴۰۳/۰۹/۰۵' },
];

const TEMPLATE_CATEGORIES = [
  { name: 'نظرسنجی', count: 15, icon: <BarChart3 className="size-5" />, color: 'from-violet-500 to-purple-600' },
  { name: 'ثبت‌نام', count: 15, icon: <ClipboardList className="size-5" />, color: 'from-emerald-500 to-teal-600' },
  { name: 'بازخورد', count: 15, icon: <MessageIcon />, color: 'from-blue-500 to-cyan-600' },
  { name: 'ارزیابی', count: 10, icon: <Star className="size-5" />, color: 'from-amber-500 to-orange-600' },
  { name: 'سفارش', count: 8, icon: <Globe className="size-5" />, color: 'from-rose-500 to-pink-600' },
  { name: 'آموزش', count: 10, icon: <BookIcon />, color: 'from-indigo-500 to-blue-600' },
  { name: 'سلامت', count: 8, icon: <HeartIcon />, color: 'from-red-500 to-rose-600' },
  { name: 'رویداد', count: 7, icon: <Calendar className="size-5" />, color: 'from-fuchsia-500 to-purple-600' },
  { name: 'منابع انسانی', count: 7, icon: <Users className="size-5" />, color: 'from-teal-500 to-emerald-600' },
  { name: 'سایر', count: 5, icon: <LayoutTemplate className="size-5" />, color: 'from-gray-500 to-slate-600' },
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

// ─── Helper: format number with Persian locale ─────────────────────────

function formatNumber(num: number): string {
  return num.toLocaleString('fa-IR');
}

// ─── Sidebar Navigation Items ──────────────────────────────────────────

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'داشبورد', icon: <LayoutDashboard className="size-5" /> },
  { id: 'users', label: 'کاربران', icon: <Users className="size-5" /> },
  { id: 'forms', label: 'فرم‌ها', icon: <FileText className="size-5" /> },
  { id: 'templates', label: 'الگوها', icon: <LayoutTemplate className="size-5" /> },
  { id: 'settings', label: 'تنظیمات سیستم', icon: <Settings className="size-5" /> },
  { id: 'reports', label: 'گزارش‌ها', icon: <ScrollText className="size-5" /> },
];

// ─── Animation Variants ───────────────────────────────────────────────

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

// ─── Overview Section ─────────────────────────────────────────────────

function OverviewSection() {
  const statCards = [
    { label: 'کل کاربران', value: formatNumber(MOCK_STATS.totalUsers), icon: <Users className="size-6" />, gradient: 'from-violet-500 to-purple-600', shadowColor: 'shadow-violet-200/50 dark:shadow-violet-500/20' },
    { label: 'کل فرم‌ها', value: formatNumber(MOCK_STATS.totalForms), icon: <FileText className="size-6" />, gradient: 'from-blue-500 to-cyan-600', shadowColor: 'shadow-blue-200/50 dark:shadow-blue-500/20' },
    { label: 'کل پاسخ‌ها', value: formatNumber(MOCK_STATS.totalResponses), icon: <Send className="size-6" />, gradient: 'from-emerald-500 to-teal-600', shadowColor: 'shadow-emerald-200/50 dark:shadow-emerald-500/20' },
    { label: 'کل بازدیدها', value: formatNumber(MOCK_STATS.totalViews), icon: <Eye className="size-6" />, gradient: 'from-fuchsia-500 to-pink-600', shadowColor: 'shadow-fuchsia-200/50 dark:shadow-fuchsia-500/20' },
    { label: 'فرم‌های فعال', value: formatNumber(MOCK_STATS.activeForms), icon: <Activity className="size-6" />, gradient: 'from-amber-500 to-orange-600', shadowColor: 'shadow-amber-200/50 dark:shadow-amber-500/20' },
    { label: 'الگوهای آماده', value: formatNumber(MOCK_STATS.totalTemplates), icon: <LayoutTemplate className="size-6" />, gradient: 'from-rose-500 to-red-600', shadowColor: 'shadow-rose-200/50 dark:shadow-rose-500/20' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="absolute -top-6 -left-6 size-24 rounded-full bg-gradient-to-br opacity-10" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }} />
            <div className="flex items-center gap-4">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor}`}>
                <span className="text-white">{stat.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                    <Clock className="size-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base">فعالیت اخیر</CardTitle>
                    <CardDescription className="text-xs">آخرین فعالیت‌های سیستم</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="max-h-[400px]">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {MOCK_ACTIVITY.map((activity) => (
                    <motion.div
                      key={activity.id}
                      whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.03)' }}
                      className="flex items-start gap-3 px-6 py-3.5 transition-colors"
                    >
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${activity.color} mt-0.5`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{activity.user}</span>{' '}
                          <span className="text-gray-600 dark:text-gray-400">{activity.action}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5 truncate">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 whitespace-nowrap">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Health */}
        <motion.div variants={itemVariants}>
          <Card className="border-gray-200 dark:border-gray-800 h-full">
            <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
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

// ─── Users Section ────────────────────────────────────────────────────

function UsersSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch = user.name.includes(searchQuery) || user.email.includes(searchQuery);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const avatarColors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-rose-500', 'bg-fuchsia-500', 'bg-teal-500', 'bg-purple-500',
    'bg-cyan-500', 'bg-indigo-500',
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="جستجوی نام یا ایمیل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          />
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
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id} className="border-gray-100 dark:border-gray-800">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium ${avatarColors[index % avatarColors.length]}`}>
                          {user.avatar}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">{user.email}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">{roleBadge(user.role)}</TableCell>
                    <TableCell className="py-3 px-4">{statusBadge(user.status)}</TableCell>
                    <TableCell className="py-3 px-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{user.forms}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="size-3" />
                        {user.lastLogin}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30" title="ویرایش">
                          <Edit3 className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-7 w-7 p-0 ${user.status === 'suspended' ? 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30'}`}
                          title={user.status === 'suspended' ? 'فعال‌سازی' : 'تعلیق'}
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
                              <AlertDialogAction className="bg-red-500 hover:bg-red-600 text-white rounded-xl" onClick={() => toast.success('کاربر حذف شد')}>
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredUsers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <Users className="size-10 mb-3 opacity-50" />
                <p className="text-sm">کاربری یافت نشد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Forms Section ────────────────────────────────────────────────────

function FormsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedForms, setSelectedForms] = useState<Set<number>>(new Set());

  const formStatusBadge = (status: string) => {
    const configs: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
      draft: { label: 'پیش‌نویس', icon: <ClipboardList className="size-3" />, className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
      published: { label: 'منتشر شده', icon: <CircleDot className="size-3" />, className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
      closed: { label: 'بسته شده', icon: <Lock className="size-3" />, className: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
    };
    const config = configs[status] || configs.draft;
    return <Badge variant="outline" className={`text-xs h-5 px-2 gap-1 ${config.className}`}>{config.icon}{config.label}</Badge>;
  };

  const filteredForms = MOCK_FORMS.filter((form) => {
    const matchesSearch = form.title.includes(searchQuery) || form.creator.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: number) => {
    const next = new Set(selectedForms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedForms(next);
  };

  const toggleSelectAll = () => {
    if (selectedForms.size === filteredForms.length) {
      setSelectedForms(new Set());
    } else {
      setSelectedForms(new Set(filteredForms.map((f) => f.id)));
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
        <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedForms.size === filteredForms.length && filteredForms.length > 0}
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
                {filteredForms.map((form) => (
                  <TableRow key={form.id} className="border-gray-100 dark:border-gray-800">
                    <TableCell className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedForms.has(form.id)}
                        onChange={() => toggleSelect(form.id)}
                        className="size-4 rounded border-gray-300 dark:border-gray-600 text-violet-500 focus:ring-violet-300 accent-violet-500"
                      />
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{form.title}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell">
                      <span className="text-sm text-gray-500 dark:text-gray-400">{form.creator}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">{formStatusBadge(form.status)}</TableCell>
                    <TableCell className="py-3 px-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Send className="size-3" />
                        {formatNumber(form.responses)}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <Eye className="size-3" />
                        {formatNumber(form.views)}
                      </div>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{form.date}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/30" title="مشاهده">
                          <Eye className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30" title="ویرایش">
                          <Edit3 className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30" title="حذف" onClick={() => toast.success('فرم حذف شد')}>
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredForms.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <FileText className="size-10 mb-3 opacity-50" />
                <p className="text-sm">فرمی یافت نشد</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Templates Section ────────────────────────────────────────────────

function TemplatesSection() {
  const totalTemplates = TEMPLATE_CATEGORIES.reduce((sum, cat) => sum + cat.count, 0);
  const mostPopular = TEMPLATE_CATEGORIES.reduce((prev, curr) => (curr.count > prev.count ? curr : prev));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
            <LayoutTemplate className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatNumber(totalTemplates)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">کل الگوها</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200/50 dark:shadow-emerald-500/20">
            <BarChart3 className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{TEMPLATE_CATEGORIES.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">دسته‌بندی</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
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
          {TEMPLATE_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all cursor-pointer"
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

// ─── Settings Section ─────────────────────────────────────────────────

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

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* General Settings */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                <Globe className="size-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات عمومی</CardTitle>
                <CardDescription className="text-xs">اطلاعات اصلی سایت</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">نام سایت</Label>
                <Input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">آدرس لوگو</Label>
                <Input
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-700 dark:text-gray-300">توضیحات سایت</Label>
              <Textarea
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 resize-none"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Email Settings */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Mail className="size-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات ایمیل</CardTitle>
                <CardDescription className="text-xs">تنظیمات SMTP برای ارسال ایمیل</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">سرور SMTP</Label>
                <Input
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">پورت</Label>
                <Input
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">ایمیل</Label>
                <Input
                  value={smtpEmail}
                  onChange={(e) => setSmtpEmail(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">رمز عبور</Label>
                <Input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Limits */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <BarChart3 className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-base">محدودیت‌ها</CardTitle>
                <CardDescription className="text-xs">تنظیم محدودیت‌های سیستم</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">حداکثر فرم در هر کاربر</Label>
                <Input
                  type="number"
                  value={maxFormsPerUser}
                  onChange={(e) => setMaxFormsPerUser(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">حداکثر سؤال در هر فرم</Label>
                <Input
                  type="number"
                  value={maxQuestions}
                  onChange={(e) => setMaxQuestions(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-gray-700 dark:text-gray-300">حداکثر پاسخ در هر فرم</Label>
                <Input
                  type="number"
                  value={maxSubmissions}
                  onChange={(e) => setMaxSubmissions(e.target.value)}
                  className="h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Maintenance Mode */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-800">
          <CardHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-base">حالت تعمیرات</CardTitle>
                <CardDescription className="text-xs">غیرفعال کردن موقت دسترسی به سایت</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">فعال‌سازی حالت تعمیرات</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">در این حالت، کاربران معمولی دسترسی به سایت نخواهند داشت.</p>
                </div>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={setMaintenanceMode}
                className="data-[state=checked]:bg-red-500"
              />
            </div>
            {maintenanceMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
              >
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
          className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl text-sm px-6 h-10 shadow-md shadow-violet-200/50 dark:shadow-violet-500/20"
          onClick={() => toast.success('تنظیمات با موفقیت ذخیره شد')}
        >
          <Save className="size-4 ml-2" />
          ذخیره تنظیمات
        </Button>
      </motion.div>
    </motion.div>
  );
}

// ─── Reports Section ──────────────────────────────────────────────────

function ReportsSection() {
  const [typeFilter, setTypeFilter] = useState('all');

  const reportTypeBadge = (type: string) => {
    const configs: Record<string, { label: string; className: string }> = {
      create: { label: 'ایجاد', className: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800' },
      submit: { label: 'پاسخ', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' },
      publish: { label: 'انتشار', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' },
      edit: { label: 'ویرایش', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' },
      delete: { label: 'حذف', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' },
      settings: { label: 'تنظیمات', className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800' },
      security: { label: 'امنیت', className: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800' },
      system: { label: 'سیستم', className: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
    };
    const config = configs[type] || configs.system;
    return <Badge variant="outline" className={`text-xs h-5 px-2 ${config.className}`}>{config.label}</Badge>;
  };

  const filteredReports = MOCK_REPORTS.filter((report) => {
    return typeFilter === 'all' || report.type === typeFilter;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
        <Button
          variant="outline"
          className="rounded-xl text-sm h-10 border-gray-200 dark:border-gray-700"
          onClick={() => toast.success('گزارش در حال دانلود...')}
        >
          <Download className="size-4 ml-1.5" />
          خروجی CSV
        </Button>
      </motion.div>

      {/* Reports Table */}
      <motion.div variants={itemVariants}>
        <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">زمان</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">کاربر</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4">عملیات</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden md:table-cell">جزئیات</TableHead>
                  <TableHead className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 py-3 px-4 hidden sm:table-cell">نوع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="border-gray-100 dark:border-gray-800">
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

// ─── Main Admin Panel ─────────────────────────────────────────────────

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
    <div className="flex h-[100vh] overflow-hidden bg-gray-50 dark:bg-gray-950" dir="rtl">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 ease-in-out shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
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

        {/* Navigation */}
        <ScrollArea className="flex-1 py-3">
          <nav className="space-y-1 px-3">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`shrink-0 transition-colors ${activeTab === item.id ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`}>
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
                    layoutId="activeIndicator"
                    className="mr-auto size-1.5 rounded-full bg-violet-500"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-100 dark:border-gray-800 p-3 space-y-2">
          {/* Toggle sidebar */}
          <Button
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full justify-center h-9 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50"
          >
            <ChevronLeft className={`size-4 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </Button>

          {/* Back to site */}
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
              <div className="flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                  <Shield className="size-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-gray-900 dark:text-white">پنل مدیریت</h1>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">نسخه ۲.۵</p>
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
                      className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className={activeTab === item.id ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}>
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
        {/* Top Bar */}
        <header className="flex items-center gap-4 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
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
          {/* Admin user avatar */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-xs">ادمین اصلی</span>
            </div>
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-violet-200/50 dark:shadow-violet-500/20">
              ا
            </div>
          </div>
        </header>

        {/* Page Content */}
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
