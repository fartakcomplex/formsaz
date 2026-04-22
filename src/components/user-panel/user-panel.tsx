'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  FileText,
  Activity,
  Bell,
  Settings,
  CreditCard,
  ArrowRight,
  Camera,
  Mail,
  Phone,
  Edit3,
  Save,
  X,
  Clock,
  Trash2,
  Send,
  Share2,
  BarChart3,
  Plus,
  CircleDot,
  ClipboardList,
  Eye,
  Star,
  Check,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Shield,
  Globe,
  Sun,
  Moon,
  ChevronLeft,
  Zap,
  Lock,
  Users,
  Crown,
  Gift,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

// ─── Types ──────────────────────────────────────────────────────────────────

type UserTab = 'profile' | 'my-forms' | 'activity' | 'notifications' | 'settings' | 'subscription';

interface MockForm {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'closed';
  submissions: number;
  createdAt: string;
  questions: number;
}

interface MockActivity {
  id: string;
  type: 'new_form' | 'new_response' | 'edit_form' | 'publish_form' | 'delete_form';
  description: string;
  time: string;
}

interface MockNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const currentUser = {
  id: '1',
  name: 'علی محمدی',
  email: 'ali@example.com',
  phone: '09121234567',
  bio: 'طراح و توسعه‌دهنده وب',
  role: 'user',
  avatar: null,
  createdAt: '1402/01/15',
  formsCount: 12,
  submissionsCount: 245,
};

const mockForms: MockForm[] = [
  { id: '1', title: 'فرم ثبت‌نام همایش توسعه‌دهندگان', status: 'published', submissions: 87, createdAt: '1403/08/15', questions: 12 },
  { id: '2', title: 'نظرسنجی رضایت مشتریان', status: 'published', submissions: 124, createdAt: '1403/07/20', questions: 8 },
  { id: '3', title: 'فرم درخواست استخدام', status: 'draft', submissions: 0, createdAt: '1403/09/01', questions: 15 },
  { id: '4', title: 'ارزیابی عملکرد کارکنان', status: 'published', submissions: 34, createdAt: '1403/06/10', questions: 20 },
  { id: '5', title: 'فرم سفارش آنلاین', status: 'closed', submissions: 56, createdAt: '1403/05/05', questions: 10 },
  { id: '6', title: 'ثبت‌نام دوره آموزشی رایگان', status: 'draft', submissions: 0, createdAt: '1403/09/10', questions: 6 },
];

const mockActivities: MockActivity[] = [
  { id: '1', type: 'new_response', description: 'پاسخ جدید در فرم «نظرسنجی رضایت مشتریان» دریافت شد', time: '۵ دقیقه پیش' },
  { id: '2', type: 'publish_form', description: 'فرم «ثبت‌نام همایش توسعه‌دهندگان» منتشر شد', time: '۱ ساعت پیش' },
  { id: '3', type: 'edit_form', description: 'فرم «ارزیابی عملکرد کارکنان» ویرایش شد', time: '۳ ساعت پیش' },
  { id: '4', type: 'new_form', description: 'فرم جدید «فرم درخواست استخدام» ایجاد شد', time: '۵ ساعت پیش' },
  { id: '5', type: 'new_response', description: 'پاسخ جدید در فرم «ثبت‌نام همایش توسعه‌دهندگان» دریافت شد', time: 'دیروز' },
  { id: '6', type: 'delete_form', description: 'فرم «آزمون ورودی» حذف شد', time: 'دیروز' },
  { id: '7', type: 'new_response', description: '۵ پاسخ جدید در فرم «فرم سفارش آنلاین» دریافت شد', time: '۲ روز پیش' },
  { id: '8', type: 'edit_form', description: 'فرم «نظرسنجی رضایت مشتریان» ویرایش شد', time: '۳ روز پیش' },
  { id: '9', type: 'publish_form', description: 'فرم «فرم سفارش آنلاین» منتشر شد', time: '۵ روز پیش' },
  { id: '10', type: 'new_form', description: 'فرم جدید «ثبت‌نام دوره آموزشی رایگان» ایجاد شد', time: '۱ هفته پیش' },
];

const mockNotifications: MockNotification[] = [
  { id: '1', type: 'success', title: 'فرم منتشر شد', message: 'فرم «ثبت‌نام همایش توسعه‌دهندگان» با موفقیت منتشر شد.', time: '۱ ساعت پیش', read: false },
  { id: '2', type: 'info', title: 'پاسخ جدید', message: 'یک پاسخ جدید در فرم «نظرسنجی رضایت مشتریان» ثبت شده است.', time: '۲ ساعت پیش', read: false },
  { id: '3', type: 'warning', title: 'محدودیت پلن', message: 'شما از ۶۰٪ سهمیه فرم‌های رایگان خود استفاده کرده‌اید.', time: '۱ روز پیش', read: false },
  { id: '4', type: 'error', title: 'خطا در ارسال اعلان', message: 'ارسال ایمیل اعلان برای فرم «ارزیابی عملکرد» با خطا مواجه شد.', time: '۲ روز پیش', read: true },
  { id: '5', type: 'info', title: 'به‌روزرسانی سیستم', message: 'نسخه جدید پلتفرم فرمساز با قابلیت‌های جدید منتشر شد.', time: '۳ روز پیش', read: true },
  { id: '6', type: 'success', title: 'فرم تکمیل شد', message: 'فرم «درخواست استخدام» با ۱۵ سؤال آماده انتشار است.', time: '۵ روز پیش', read: true },
  { id: '7', type: 'warning', title: 'فرم منقضی می‌شود', message: 'فرم «فرم سفارش آنلاین» تا ۳ روز دیگر منقضی خواهد شد.', time: '۱ هفته پیش', read: true },
  { id: '8', type: 'info', title: 'خوش آمدید!', message: 'به پنل کاربری فرمساز خوش آمدید. از تجربه ساخت فرم لذت ببرید!', time: '۲ هفته پیش', read: true },
];

// ─── Configs ────────────────────────────────────────────────────────────────

const activityConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string; label: string }> = {
  new_form: {
    icon: <Plus className="size-4" />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/40',
    label: 'فرم جدید',
  },
  new_response: {
    icon: <Send className="size-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
    label: 'پاسخ جدید',
  },
  edit_form: {
    icon: <Edit3 className="size-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
    label: 'ویرایش فرم',
  },
  publish_form: {
    icon: <CircleDot className="size-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
    label: 'انتشار فرم',
  },
  delete_form: {
    icon: <Trash2 className="size-4" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
    label: 'حذف فرم',
  },
};

const notificationTypeConfig: Record<string, { icon: React.ReactNode; color: string; bgColor: string; borderColor: string }> = {
  info: {
    icon: <Info className="size-4" />,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/40',
    borderColor: 'border-r-blue-500 dark:border-r-blue-400',
  },
  success: {
    icon: <CheckCircle className="size-4" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/40',
    borderColor: 'border-r-emerald-500 dark:border-r-emerald-400',
  },
  warning: {
    icon: <AlertTriangle className="size-4" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/40',
    borderColor: 'border-r-amber-500 dark:border-r-amber-400',
  },
  error: {
    icon: <XCircle className="size-4" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
    borderColor: 'border-r-red-500 dark:border-r-red-400',
  },
};

const formStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  published: {
    label: 'منتشر شده',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: <CircleDot className="size-3" />,
  },
  draft: {
    label: 'پیش‌نویس',
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    icon: <ClipboardList className="size-3" />,
  },
  closed: {
    label: 'بسته شده',
    color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    icon: <Lock className="size-3" />,
  },
};

const navItems: { id: UserTab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'profile', label: 'پروفایل من', icon: <User className="size-5" /> },
  { id: 'my-forms', label: 'فرم‌های من', icon: <FileText className="size-5" /> },
  { id: 'activity', label: 'فعالیت‌ها', icon: <Activity className="size-5" /> },
  { id: 'notifications', label: 'اعلان‌ها', icon: <Bell className="size-5" />, badge: 3 },
  { id: 'settings', label: 'تنظیمات', icon: <Settings className="size-5" /> },
  { id: 'subscription', label: 'اشتراک من', icon: <CreditCard className="size-5" /> },
];

// ─── Animation variants ────────────────────────────────────────────────────

const contentVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UserPanel() {
  const { setCurrentView } = useAppStore();
  const [activeTab, setActiveTab] = useState<UserTab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const unreadNotifications = mockNotifications.filter((n) => !n.read).length;

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* User Info */}
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
                {currentUser.name.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -left-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900">
                <div className="size-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {currentUser.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-violet-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className={activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : ''}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.id === 'notifications' && unreadNotifications > 0 && (
                <span className="mr-auto flex size-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {unreadNotifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back Button */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <Button
            variant="outline"
            onClick={() => setCurrentView('dashboard')}
            className="w-full justify-center gap-2 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all duration-200"
          >
            <ArrowRight className="size-4" />
            بازگشت به داشبورد
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex size-9 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
              <span className="text-violet-600 dark:text-violet-400">
                {navItems.find((n) => n.id === activeTab)?.icon}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                مدیریت و سفارشی‌سازی حساب کاربری شما
              </p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={contentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {activeTab === 'profile' && <ProfileSection />}
              {activeTab === 'my-forms' && <MyFormsSection />}
              {activeTab === 'activity' && <ActivitySection />}
              {activeTab === 'notifications' && <NotificationsSection />}
              {activeTab === 'settings' && <SettingsSection />}
              {activeTab === 'subscription' && <SubscriptionSection />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Profile Section ────────────────────────────────────────────────────────

function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bio, setBio] = useState(currentUser.bio);

  const handleSave = () => {
    setIsEditing(false);
    toast.success('پروفایل با موفقیت ذخیره شد');
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setBio(currentUser.bio);
    setIsEditing(false);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <motion.div variants={staggerItem}>
        <Card className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {/* Gradient Banner */}
          <div className="relative h-32 sm:h-40 bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {/* Floating shapes */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Number.MAX_SAFE_INTEGER }}
              className="absolute top-6 left-10 size-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            />
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Number.MAX_SAFE_INTEGER, delay: 1 }}
              className="absolute bottom-4 left-24 size-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Number.MAX_SAFE_INTEGER, delay: 2 }}
              className="absolute top-10 left-40 size-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
            />
          </div>

          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4 flex items-end gap-4">
              <div className="relative group">
                <div className="flex size-28 sm:size-32 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-extrabold text-3xl shadow-xl shadow-violet-300/30 dark:shadow-violet-500/20 border-4 border-white dark:border-gray-900">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
                  <Camera className="size-6 text-white" />
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentUser.name}</h2>
                  <Badge className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 text-[10px]">
                    <Crown className="size-3 ml-0.5" />
                    کاربر حرفه‌ای
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Mail className="size-3.5" />{currentUser.email}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="size-3.5" />{currentUser.phone}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{currentUser.bio}</p>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="size-4 text-violet-500" />
                <span className="text-gray-600 dark:text-gray-300 font-medium">{currentUser.formsCount} فرم</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Send className="size-4 text-emerald-500" />
                <span className="text-gray-600 dark:text-gray-300 font-medium">{currentUser.submissionsCount} پاسخ</span>
              </div>
              <div className="flex items-center gap-2 text-sm mr-auto">
                <Clock className="size-4 text-gray-400" />
                <span className="text-gray-500 dark:text-gray-400 text-xs">عضویت از {currentUser.createdAt}</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit Profile Card */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">اطلاعات پروفایل</CardTitle>
                <CardDescription>اطلاعات حساب کاربری خود را ویرایش کنید</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-lg gap-1.5 bg-violet-500 hover:bg-violet-600 text-white shadow-sm"
                >
                  <Edit3 className="size-3.5" />
                  ویرایش
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">نام کامل</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">ایمیل</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 h-11"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره تماس</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 h-11"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">بیوگرافی</Label>
                  <Textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 resize-none"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl gap-1.5 shadow-sm"
                  >
                    <Save className="size-4" />
                    ذخیره تغییرات
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  >
                    <X className="size-4 ml-1" />
                    انصراف
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">نام کامل</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ایمیل</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" dir="ltr">{currentUser.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">شماره تماس</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" dir="ltr">{currentUser.phone}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">تاریخ عضویت</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.createdAt}</p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── My Forms Section ───────────────────────────────────────────────────────

function MyFormsSection() {
  const totalForms = mockForms.length;
  const publishedCount = mockForms.filter((f) => f.status === 'published').length;
  const draftCount = mockForms.filter((f) => f.status === 'draft').length;
  const totalSubmissions = mockForms.reduce((sum, f) => sum + f.submissions, 0);

  const stats = [
    { label: 'کل فرم‌ها', value: totalForms, icon: <FileText className="size-5" />, color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400' },
    { label: 'منتشر شده', value: publishedCount, icon: <CircleDot className="size-5" />, color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' },
    { label: 'پیش‌نویس', value: draftCount, icon: <ClipboardList className="size-5" />, color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400' },
    { label: 'کل پاسخ‌ها', value: totalSubmissions, icon: <Send className="size-5" />, color: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm"
          >
            <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockForms.map((form, i) => (
          <motion.div
            key={form.id}
            variants={staggerItem}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <Card className="h-full overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-200">
              {/* Status stripe */}
              <div className={`h-1 bg-gradient-to-l ${
                form.status === 'published' ? 'from-emerald-400 to-emerald-500' :
                form.status === 'draft' ? 'from-violet-400 to-purple-500' :
                'from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500'
              }`} />
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-bold line-clamp-2 leading-relaxed">
                    {form.title}
                  </CardTitle>
                  <Badge variant="outline" className={`text-[10px] shrink-0 ${formStatusConfig[form.status].color}`}>
                    {formStatusConfig[form.status].icon}
                    {formStatusConfig[form.status].label}
                  </Badge>
                </div>
                <CardDescription className="text-xs flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <FileText className="size-3" />
                    {form.questions} سؤال
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {form.createdAt}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1.5 mb-4">
                  <Send className="size-3.5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{form.submissions}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">پاسخ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg gap-1 border-gray-200 dark:border-gray-700">
                    <Edit3 className="size-3" />
                    ویرایش
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg gap-1 border-gray-200 dark:border-gray-700">
                    <BarChart3 className="size-3" />
                    نتایج
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg border-gray-200 dark:border-gray-700">
                    <Share2 className="size-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Activity Section ───────────────────────────────────────────────────────

function ActivitySection() {
  const [filter, setFilter] = useState<string>('all');

  const filteredActivities = filter === 'all'
    ? mockActivities
    : mockActivities.filter((a) => a.type === filter);

  const filterOptions = [
    { value: 'all', label: 'همه فعالیت‌ها' },
    { value: 'new_form', label: 'فرم جدید' },
    { value: 'new_response', label: 'پاسخ جدید' },
    { value: 'edit_form', label: 'ویرایش فرم' },
    { value: 'publish_form', label: 'انتشار فرم' },
    { value: 'delete_form', label: 'حذف فرم' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-3xl mx-auto space-y-6">
      {/* Filter */}
      <motion.div variants={staggerItem} className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredActivities.length} فعالیت
        </span>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute right-[19px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredActivities.map((activity, i) => {
              const config = activityConfig[activity.type];
              return (
                <motion.div
                  key={activity.id}
                  layout
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="relative flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group"
                >
                  {/* Icon */}
                  <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor} ${config.color} shadow-sm`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="size-3 text-gray-400" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                      <Badge variant="outline" className={`text-[10px] ${config.color} border-current/20`}>
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Notifications Section ──────────────────────────────────────────────────

function NotificationsSection() {
  const [notifications, setNotifications] = useState<MockNotification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند');
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success('اعلان حذف شد');
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-3xl mx-auto space-y-6">
      {/* Header Actions */}
      <motion.div variants={staggerItem} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount} اعلان خوانده نشده
          </span>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="rounded-lg text-xs gap-1.5 border-gray-200 dark:border-gray-700 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30"
          >
            <Check className="size-3.5" />
            خواندن همه
          </Button>
        )}
      </motion.div>

      {/* Notification List */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification, i) => {
            const config = notificationTypeConfig[notification.type];
            return (
              <motion.div
                key={notification.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.04 }}
                onClick={() => !notification.read && handleMarkRead(notification.id)}
                className={`relative overflow-hidden rounded-xl border bg-white dark:bg-gray-900 p-4 transition-all duration-200 cursor-pointer group hover:shadow-md border-r-4 ${
                  !notification.read
                    ? `${config.borderColor} border-gray-200 dark:border-gray-800 bg-gradient-to-l from-transparent to-gray-50/50 dark:to-gray-800/20`
                    : 'border-gray-100 dark:border-gray-800 border-r-gray-100 dark:border-r-gray-800'
                }`}
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor} ${config.color}`}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                          className="opacity-0 group-hover:opacity-100 flex size-7 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-red-500 transition-all"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="size-3 text-gray-400" />
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">{notification.time}</span>
                      {!notification.read && (
                        <span className="flex size-2 rounded-full bg-violet-500" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Settings Section ───────────────────────────────────────────────────────

function SettingsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifBrowser, setNotifBrowser] = useState(true);
  const [notifResponse, setNotifResponse] = useState(true);
  const [notifExpiry, setNotifExpiry] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('لطفاً تمام فیلدها را پر کنید');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('رمز عبور جدید و تأیید آن مطابقت ندارند');
      return;
    }
    toast.success('رمز عبور با موفقیت تغییر کرد');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-6">
      {/* Account Settings */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                <Shield className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات حساب</CardTitle>
                <CardDescription>امنیت و مدیریت حساب کاربری</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Password */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="size-4 text-gray-500" />
                تغییر رمز عبور
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">رمز عبور فعلی</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">رمز عبور جدید</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-gray-500 dark:text-gray-400">تأیید رمز عبور</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10 text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={handleChangePassword}
                className="rounded-xl gap-1.5 bg-violet-500 hover:bg-violet-600 text-white shadow-sm text-sm"
              >
                <Shield className="size-4" />
                تغییر رمز عبور
              </Button>
            </div>

            <Separator className="bg-gray-100 dark:bg-gray-800" />

            {/* Delete Account */}
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4">
              <h4 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
                <AlertTriangle className="size-4" />
                منطقه خطر
              </h4>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-3">
                با حذف حساب کاربری، تمام فرم‌ها، پاسخ‌ها و داده‌های شما برای همیشه حذف خواهند شد. این عمل قابل بازگشت نیست.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-xl gap-1.5 text-sm h-9">
                    <Trash2 className="size-3.5" />
                    حذف حساب کاربری
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl border-gray-200 dark:border-gray-800" dir="rtl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-right">آیا مطمئن هستید؟</AlertDialogTitle>
                    <AlertDialogDescription className="text-right leading-relaxed">
                      این عمل غیرقابل بازگشت است. تمام فرم‌ها، پاسخ‌ها و تنظیمات شما حذف خواهند شد.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-row gap-2 sm:justify-start">
                    <AlertDialogCancel className="rounded-xl border-gray-200 dark:border-gray-700 text-sm">
                      انصراف
                    </AlertDialogCancel>
                    <AlertDialogAction className="rounded-xl bg-red-500 hover:bg-red-600 text-sm">
                      بله، حذف کن
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                <Bell className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات اعلان‌ها</CardTitle>
                <CardDescription>نحوه دریافت اعلان‌ها را مشخص کنید</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: 'اعلان ایمیل', desc: 'دریافت اعلان از طریق ایمیل', value: notifEmail, onChange: setNotifEmail },
              { label: 'اعلان مرورگر', desc: 'نمایش اعلان در مرورگر', value: notifBrowser, onChange: setNotifBrowser },
              { label: 'اعلان پاسخ جدید', desc: 'اطلاع از پاسخ جدید در فرم‌ها', value: notifResponse, onChange: setNotifResponse },
              { label: 'اعلان فرم منقضی', desc: 'یادآوری تاریخ انقضای فرم', value: notifExpiry, onChange: setNotifExpiry },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                </div>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Display Settings */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400">
                <Globe className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات نمایش</CardTitle>
                <CardDescription>زبان و ظاهر برنامه را تنظیم کنید</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700 dark:text-gray-300">زبان</Label>
                <Select defaultValue="fa">
                  <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10">
                    <Globe className="size-4 text-gray-400 ml-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fa">فارسی</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700 dark:text-gray-300">تم</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-10">
                    {theme === 'light' ? (
                      <Sun className="size-4 text-amber-500 ml-2" />
                    ) : (
                      <Moon className="size-4 text-violet-400 ml-2" />
                    )}
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">روشن</SelectItem>
                    <SelectItem value="dark">تاریکی</SelectItem>
                    <SelectItem value="system">سیستم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview Card */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">پیش‌نمایش ظاهر فرم</p>
              <div className={`rounded-xl border p-4 transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-900 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-2 w-24 rounded-full bg-gradient-to-l from-violet-500 to-purple-500" />
                </div>
                <div className="space-y-2">
                  <div className={`h-3 w-full rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  <div className={`h-8 w-full rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
                  <div className={`h-3 w-3/4 rounded-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  <div className="flex gap-2">
                    <div className={`h-6 w-16 rounded-full border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
                    <div className={`h-6 w-16 rounded-full border-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
                  </div>
                  <div className="h-8 w-24 rounded-lg bg-violet-500 mt-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Subscription Section ───────────────────────────────────────────────────

function SubscriptionSection() {
  const usageItems = [
    { label: 'فرم‌ها', current: 3, max: 5, color: 'from-violet-500 to-purple-500' },
    { label: 'سؤال در هر فرم', current: 25, max: 50, color: 'from-fuchsia-500 to-pink-500' },
    { label: 'پاسخ‌ها', current: 150, max: 500, color: 'from-emerald-500 to-teal-500' },
  ];

  const features = [
    { text: 'حداکثر ۵ فرم فعال', included: true },
    { text: 'حداکثر ۵۰ سؤال در هر فرم', included: true },
    { text: 'حداکثر ۵۰۰ پاسخ در ماه', included: true },
    { text: 'آپلود فایل', included: false },
    { text: 'قانون شرطی پیشرفته', included: false },
    { text: 'خروجی PDF', included: false },
    { text: 'دامنه اختصاصی', included: false },
    { text: 'پشتیبانی اولویت‌دار', included: false },
  ];

  const plans = [
    {
      name: 'رایگان',
      price: '۰',
      period: 'تومان/ماهانه',
      features: ['۵ فرم فعال', '۵۰ سؤال در هر فرم', '۵۰۰ پاسخ در ماه', '۱۰ الگوی آماده'],
      current: true,
    },
    {
      name: 'حرفه‌ای',
      price: '۱۴۹,۰۰۰',
      period: 'تومان/ماهانه',
      features: ['فرم نامحدود', '۱۰۰۰ سؤال در هر فرم', '۱۰,۰۰۰ پاسخ در ماه', 'تمام الگوها', 'آپلود فایل', 'قانون شرطی', 'خروجی PDF'],
      current: false,
      popular: true,
    },
    {
      name: 'سازمانی',
      price: '۴۹۹,۰۰۰',
      period: 'تومان/ماهانه',
      features: ['همه امکانات حرفه‌ای', '۵۰,۰۰۰ پاسخ در ماه', 'دامنه اختصاصی', 'API اختصاصی', 'پشتیبانی تلفنی', 'SSO', 'گزارش‌های پیشرفته'],
      current: false,
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
      {/* Current Plan */}
      <motion.div variants={staggerItem}>
        <Card className="overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="h-2 bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500" />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
                  <Crown className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">پلن رایگان</CardTitle>
                  <CardDescription>برنامه فعلی شما</CardDescription>
                </div>
              </div>
              <Badge className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 text-xs">
                فعال
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2.5 py-1.5">
                  {feature.included ? (
                    <div className="flex size-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : (
                    <div className="flex size-5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <X className="size-3 text-gray-400" />
                    </div>
                  )}
                  <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-100 dark:bg-gray-800" />

            {/* Usage Progress */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="size-4 text-violet-500" />
                میزان مصرف
              </h4>
              <div className="space-y-4">
                {usageItems.map((item, i) => {
                  const percentage = Math.round((item.current / item.max) * 100);
                  const isWarning = percentage >= 80;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                        <span className={`text-xs font-medium ${isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.current} از {item.max}
                        </span>
                      </div>
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
                          className={`h-full rounded-full bg-gradient-to-l ${item.color} ${isWarning ? 'animate-pulse' : ''}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upgrade CTA */}
      <motion.div variants={staggerItem}>
        <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-60" />
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 30, repeat: Number.MAX_SAFE_INTEGER, ease: 'linear' }}
            className="absolute -top-10 -left-10 size-40 rounded-full border border-white/10"
          />
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 20, repeat: Number.MAX_SAFE_INTEGER, ease: 'linear' }}
            className="absolute -bottom-8 -right-8 size-32 rounded-full border border-white/10"
          />

          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-xl">
              <Sparkles className="size-8 text-white" />
            </div>
            <div className="text-center sm:text-right flex-1">
              <h3 className="text-xl font-bold text-white mb-1">ارتقا به پلن حرفه‌ای</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                از فرم‌های نامحدود، قوانین شرطی پیشرفته، خروجی PDF و امکانات بیشتر بهره‌مند شوید.
              </p>
            </div>
            <Button
              size="lg"
              className="bg-white text-violet-700 hover:bg-white/90 rounded-xl shadow-xl font-bold gap-2 h-12 px-6"
            >
              <Zap className="size-5" />
              ارتقا دهید
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Plan Comparison Table */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">مقایسه پلن‌ها</CardTitle>
            <CardDescription>بهترین پلن را برای نیازهای خود انتخاب کنید</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300 py-3 px-4">ویژگی</TableHead>
                    <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-3 px-4">رایگان</TableHead>
                    <TableHead className="text-center py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 rounded-lg px-3 py-1 text-xs font-bold">
                        <Star className="size-3" />
                        حرفه‌ای
                      </div>
                    </TableHead>
                    <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-3 px-4">سازمانی</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { feature: 'فرم‌ها', free: '۵', pro: 'نامحدود', enterprise: 'نامحدود' },
                    { feature: 'سؤال در هر فرم', free: '۵۰', pro: '۱,۰۰۰', enterprise: '۱,۰۰۰' },
                    { feature: 'پاسخ در ماه', free: '۵۰۰', pro: '۱۰,۰۰۰', enterprise: '۵۰,۰۰۰' },
                    { feature: 'آپلود فایل', free: false, pro: true, enterprise: true },
                    { feature: 'قانون شرطی', free: false, pro: true, enterprise: true },
                    { feature: 'خروجی PDF', free: false, pro: true, enterprise: true },
                    { feature: 'خروجی Excel', free: false, pro: true, enterprise: true },
                    { feature: 'دامنه اختصاصی', free: false, pro: false, enterprise: true },
                    { feature: 'API اختصاصی', free: false, pro: false, enterprise: true },
                    { feature: 'پشتیبانی', free: 'ایمیل', pro: 'چت زنده', enterprise: 'تلفنی + اختصاصی' },
                    { feature: 'SSO', free: false, pro: false, enterprise: true },
                  ].map((row, i) => (
                    <TableRow key={i} className="border-gray-100 dark:border-gray-800">
                      <TableCell className="text-right text-sm text-gray-700 dark:text-gray-300 font-medium py-3 px-4">
                        {row.feature}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4">
                        {typeof row.free === 'boolean' ? (
                          row.free ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="size-4 text-gray-300 dark:text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-600 dark:text-gray-400">{row.free}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4 bg-violet-50/50 dark:bg-violet-950/20">
                        {typeof row.pro === 'boolean' ? (
                          row.pro ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="size-4 text-gray-300 dark:text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-600 dark:text-gray-400">{row.pro}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center py-3 px-4">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <Check className="size-4 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="size-4 text-gray-300 dark:text-gray-600 mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-gray-600 dark:text-gray-400">{row.enterprise}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className={`h-full relative overflow-hidden border-2 ${
              plan.current
                ? 'border-violet-300 dark:border-violet-600 bg-white dark:bg-gray-900'
                : plan.popular
                  ? 'border-violet-400 dark:border-violet-500 bg-white dark:bg-gray-900'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}>
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-violet-500 to-fuchsia-500" />
              )}
              <CardHeader className="text-center pb-2">
                {plan.popular && (
                  <Badge className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 text-[10px] mx-auto mb-2">
                    <Star className="size-3 ml-0.5" />
                    محبوب‌ترین
                  </Badge>
                )}
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="size-3.5 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-4 rounded-xl h-10 text-sm font-medium ${
                    plan.current
                      ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-default'
                      : plan.popular
                        ? 'bg-violet-500 hover:bg-violet-600 text-white shadow-md shadow-violet-200/50 dark:shadow-violet-500/20'
                        : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900'
                  }`}
                  disabled={plan.current}
                >
                  {plan.current ? 'پلن فعلی' : 'انتخاب پلن'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
