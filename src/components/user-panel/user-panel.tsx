'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  LayoutTemplate,
  Search,
  Loader2,
  KeyRound,
  TrendingUp,
  CalendarDays,
  Megaphone,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore, type Form } from '@/lib/store';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

// ─── Types ──────────────────────────────────────────────────────────────────

type UserTab = 'profile' | 'my-forms' | 'activity' | 'notifications' | 'settings' | 'subscription';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  avatar: string | null;
  role: string;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  formCount: number;
  notificationCount: number;
}

interface UserForm {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    submissions: number;
    questions: number;
  };
}

interface ActivityItem {
  id: string;
  type: string;
  formTitle: string;
  createdAt: string;
}

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  userId: string;
}

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

const formStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode; dotColor: string }> = {
  published: {
    label: 'منتشر شده',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    icon: <CircleDot className="size-3" />,
    dotColor: 'bg-emerald-500',
  },
  draft: {
    label: 'پیش‌نویس',
    color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    icon: <ClipboardList className="size-3" />,
    dotColor: 'bg-amber-500',
  },
  closed: {
    label: 'بسته شده',
    color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    icon: <Lock className="size-3" />,
    dotColor: 'bg-gray-400',
  },
};

const navItems: { id: UserTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'پروفایل من', icon: <User className="size-5" /> },
  { id: 'my-forms', label: 'فرم‌های من', icon: <FileText className="size-5" /> },
  { id: 'activity', label: 'فعالیت‌ها', icon: <Activity className="size-5" /> },
  { id: 'notifications', label: 'اعلان‌ها', icon: <Bell className="size-5" /> },
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

const slideIn = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const staggerContainerNew = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const staggerItemNew = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ─── Animated Counter Hook ──────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200): number {
  const [count, setCount] = useState(0);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = prevTarget.current;
    const diff = target - start;
    if (diff === 0) { setCount(target); return; }

    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevTarget.current = target;
  }, [target, duration]);

  return count;
}

// ─── Helper ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'همین الان';
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;
  if (diffHour < 24) return `${diffHour} ساعت پیش`;
  if (diffDay < 7) return `${diffDay} روز پیش`;
  if (diffDay < 30) return `${Math.floor(diffDay / 7)} هفته پیش`;
  return `${Math.floor(diffDay / 30)} ماه پیش`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getActivityDescription(activity: ActivityItem): string {
  switch (activity.type) {
    case 'new_form':
      return `فرم جدید «${activity.formTitle}» ایجاد شد`;
    case 'publish_form':
      return `فرم «${activity.formTitle}» منتشر شد`;
    case 'new_response':
      return `پاسخ جدید در فرم «${activity.formTitle}» دریافت شد`;
    case 'edit_form':
      return `فرم «${activity.formTitle}» ویرایش شد`;
    default:
      return activity.formTitle;
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UserPanel() {
  const { setCurrentView, setCurrentForm, setFillForm } = useAppStore();
  const [activeTab, setActiveTab] = useState<UserTab>('profile');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) setProfile(await res.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    const load = async () => {
      await fetchProfile();
      try {
        const res = await fetch('/api/user/notifications');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount || 0);
        }
      } catch { /* silent */ }
    };
    load();
  }, [fetchProfile]);

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
        className={`fixed right-0 top-0 z-50 h-full w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-l border-gray-200/80 dark:border-gray-800/80 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Gradient accent at top */}
        <div className="h-1 bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500" />

        {/* User Info */}
        <div className="p-5 border-b border-gray-100/80 dark:border-gray-800/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* Animated ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-500 opacity-60 blur-[2px]"
              />
              <div className="relative flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold text-lg shadow-lg shadow-violet-200/50 dark:shadow-violet-500/20">
                {profile ? profile.name.charAt(0) : <Loader2 className="size-5 animate-spin" />}
              </div>
              <div className="absolute -bottom-0.5 -left-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900">
                <div className="size-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                {profile?.name || 'در حال بارگذاری...'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {profile?.email || ''}
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
                  ? 'bg-violet-50/80 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 shadow-sm backdrop-blur-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200 hover:backdrop-blur-sm'
              }`}
            >
              {activeTab === item.id && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className={activeTab === item.id ? 'text-violet-600 dark:text-violet-400' : ''}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.id === 'notifications' && unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mr-auto flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-500 text-white text-[10px] font-bold shadow-sm"
                >
                  {unreadCount > 9 ? '۹+' : unreadCount}
                </motion.span>
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
        <header className="sticky top-0 z-30 flex items-center gap-4 px-4 sm:px-8 py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl border-b border-gray-200/60 dark:border-gray-800/60 shadow-sm">
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
              {activeTab === 'profile' && <ProfileSection profile={profile} onProfileUpdate={fetchProfile} />}
              {activeTab === 'my-forms' && <MyFormsSection />}
              {activeTab === 'activity' && <ActivitySection />}
              {activeTab === 'notifications' && <NotificationsSection onUnreadChange={setUnreadCount} />}
              {activeTab === 'settings' && <SettingsSection />}
              {activeTab === 'subscription' && <SubscriptionSection profile={profile} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ─── Profile Section ────────────────────────────────────────────────────────

function ProfileSection({ profile, onProfileUpdate }: { profile: UserProfile | null; onProfileUpdate: () => void }) {
  const { setCurrentView } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');

  // Animated counters
  const animatedFormCount = useAnimatedCounter(profile?.formCount || 0);
  const animatedNotifCount = useAnimatedCounter(profile?.notificationCount || 0);
  // Calculate days since registration
  const daysSinceJoin = profile ? Math.max(1, Math.floor((Date.now() - new Date(profile.createdAt).getTime()) / 86400000)) : 0;
  const animatedDays = useAnimatedCounter(daysSinceJoin);

  const startEditing = () => {
    if (profile) {
      setEditName(profile.name);
      setEditEmail(profile.email);
      setEditPhone(profile.phone || '');
      setEditBio(profile.bio || '');
    }
    setIsEditing(true);
  };

  const completeness = (() => {
    if (!profile) return 0;
    let pct = 0;
    if (profile.name) pct += 25;
    if (profile.email) pct += 25;
    if (profile.phone) pct += 25;
    if (profile.bio) pct += 25;
    return pct;
  })();

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error('نام نمی‌تواند خالی باشد');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail, phone: editPhone, bio: editBio }),
      });
      if (res.ok) {
        toast.success('پروفایل با موفقیت ذخیره شد');
        setIsEditing(false);
        onProfileUpdate();
      } else {
        const data = await res.json();
        toast.error(data.error || 'خطا در ذخیره پروفایل');
      }
    } catch {
      toast.error('خطا در اتصال به سرور');
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const quickActions = [
    {
      label: 'ایجاد فرم',
      icon: <Plus className="size-5" />,
      color: 'from-violet-500 to-purple-600',
      onClick: () => setCurrentView('dashboard'),
    },
    {
      label: 'الگوهای آماده',
      icon: <LayoutTemplate className="size-5" />,
      color: 'from-fuchsia-500 to-pink-600',
      onClick: () => setCurrentView('templates'),
    },
    {
      label: 'مشاهده نتایج',
      icon: <BarChart3 className="size-5" />,
      color: 'from-emerald-500 to-teal-600',
      onClick: () => setCurrentView('dashboard'),
    },
  ];

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card - Glassmorphism */}
      <motion.div variants={staggerItem}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800/80 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-lg"
        >
          {/* Gradient accent at top */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500" />

          {/* Completeness Progress Bar */}
          <div className="h-1.5 bg-gray-100/50 dark:bg-gray-800/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className={`h-full transition-colors duration-500 ${
                completeness >= 75
                  ? 'bg-gradient-to-l from-emerald-400 to-teal-500'
                  : completeness >= 50
                    ? 'bg-gradient-to-l from-violet-400 to-purple-500'
                    : 'bg-gradient-to-l from-amber-400 to-orange-500'
              }`}
            />
          </div>

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
            {/* Completeness Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/20 text-[10px]">
                {completeness}% تکمیل پروفایل
              </Badge>
            </div>
          </div>

          <div className="relative px-6 pb-6">
            {/* Avatar with animated ring */}
            <div className="relative -mt-16 mb-4 flex items-end gap-4">
              <div className="relative group">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-500 opacity-50 blur-[3px]"
                />
                <div className="relative flex size-28 sm:size-32 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-extrabold text-3xl shadow-xl shadow-violet-300/30 dark:shadow-violet-500/20 border-4 border-white dark:border-gray-900">
                  {profile.name.charAt(0)}
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 left-1 size-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-4 border-transparent">
                  <Camera className="size-6 text-white" />
                </div>
              </div>
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                  <Badge className="bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800 text-[10px]">
                    <Crown className="size-3 ml-0.5" />
                    کاربر حرفه‌ای
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1"><Mail className="size-3.5" />{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <Phone className="size-3.5" />{profile.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {profile.bio ? (
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{profile.bio}</p>
            ) : completeness < 100 && (
              <p className="text-sm text-gray-400 dark:text-gray-500 italic">بیوگرافی اضافه نشده است</p>
            )}

            {/* Animated Stats Row */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200/60 dark:border-gray-800/60">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100/60 dark:border-gray-700/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1.5">
                  <FileText className="size-4 text-violet-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{animatedFormCount}</span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">فرم</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100/60 dark:border-gray-700/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Bell className="size-4 text-amber-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{animatedNotifCount}</span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">اعلان</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100/60 dark:border-gray-700/40 backdrop-blur-sm"
              >
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-emerald-500" />
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{animatedDays}</span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">روز فعالیت</span>
              </motion.div>
            </div>

            {/* Member since */}
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400 dark:text-gray-500">
              <Clock className="size-3" />
              <span>عضویت از {formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.onClick}
              className="relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-4 text-right transition-all hover:shadow-lg hover:border-gray-300/60 dark:hover:border-gray-700/60 group"
            >
              <div className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md mb-3`}>
                {action.icon}
              </div>
              <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {i === 0 ? 'فرم جدید بسازید' : i === 1 ? 'از الگوها استفاده کنید' : 'آمار و نتایج فرم‌ها'}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Edit Profile Card */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">اطلاعات پروفایل</CardTitle>
                <CardDescription>اطلاعات حساب کاربری خود را ویرایش کنید</CardDescription>
              </div>
              {!isEditing && (
                <Button
                  size="sm"
                  onClick={startEditing}
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
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">ایمیل</Label>
                    <Input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 h-11"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">شماره تماس</Label>
                  <Input
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 h-11"
                    dir="ltr"
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">بیوگرافی</Label>
                  <Textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-violet-300 focus:ring-violet-100 resize-none"
                    placeholder="درباره خودتان بنویسید..."
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-violet-500 hover:bg-violet-600 text-white rounded-xl gap-1.5 shadow-sm"
                  >
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    ذخیره تغییرات
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
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
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{profile.name}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ایمیل</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" dir="ltr">{profile.email}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">شماره تماس</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white" dir="ltr">
                    {profile.phone || <span className="text-gray-400">اضافه نشده</span>}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">تاریخ عضویت</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(profile.createdAt)}</p>
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
  const { setCurrentForm, setCurrentView, setFillForm } = useAppStore();
  const [forms, setForms] = useState<UserForm[]>([]);
  const [stats, setStats] = useState({ totalForms: 0, publishedCount: 0, draftCount: 0, closedCount: 0, totalSubmissions: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [localSearch, setLocalSearch] = useState('');

  // Animated counters for stats
  const animTotalForms = useAnimatedCounter(stats.totalForms);
  const animPublished = useAnimatedCounter(stats.publishedCount);
  const animDraft = useAnimatedCounter(stats.draftCount);
  const animSubmissions = useAnimatedCounter(stats.totalSubmissions);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (statusFilter && statusFilter !== 'all') params.set('status', statusFilter);
        const res = await fetch(`/api/user/forms?${params.toString()}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setForms(data.forms || []);
          if (!search && (!statusFilter || statusFilter === 'all')) {
            setStats(data.stats || { totalForms: 0, publishedCount: 0, draftCount: 0, closedCount: 0, totalSubmissions: 0 });
          }
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [search, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(localSearch);
  };

  const handleEditForm = async (form: UserForm) => {
    try {
      const res = await fetch(`/api/forms/${form.id}`);
      if (res.ok) {
        const data: Form = await res.json();
        setCurrentForm(data);
        setCurrentView('builder');
      }
    } catch {
      toast.error('خطا در بارگذاری فرم');
    }
  };

  const handleViewResults = async (form: UserForm) => {
    try {
      const res = await fetch(`/api/forms/${form.id}`);
      if (res.ok) {
        const data: Form = await res.json();
        setCurrentForm(data);
        setCurrentView('results');
      }
    } catch {
      toast.error('خطا در بارگذاری فرم');
    }
  };

  const statsCards = [
    { label: 'کل فرم‌ها', value: animTotalForms, icon: <FileText className="size-5" />, color: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400', gradient: 'from-violet-500 to-purple-500' },
    { label: 'منتشر شده', value: animPublished, icon: <CircleDot className="size-5" />, color: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'پیش‌نویس', value: animDraft, icon: <ClipboardList className="size-5" />, color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400', gradient: 'from-amber-500 to-orange-500' },
    { label: 'کل پاسخ‌ها', value: animSubmissions, icon: <Send className="size-5" />, color: 'bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-400', gradient: 'from-fuchsia-500 to-pink-500' },
  ];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-5xl mx-auto space-y-6">
      {/* Stats - Glassmorphism cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {statsCards.map((stat, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="relative overflow-hidden rounded-xl border border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 inset-x-0 h-0.5 bg-gradient-to-l ${stat.gradient}`} />
            <div className={`flex size-10 items-center justify-center rounded-lg ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div variants={staggerItem} className="flex items-center gap-3 flex-wrap">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px] max-w-sm">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="جستجوی فرم..."
              className="rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-10 pr-10 text-sm"
            />
          </div>
        </form>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 h-10 text-sm">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="published">منتشر شده</SelectItem>
            <SelectItem value="draft">پیش‌نویس</SelectItem>
            <SelectItem value="closed">بسته شده</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty State - Enhanced */}
      {!loading && forms.length === 0 && (
        <motion.div variants={staggerItem} className="text-center py-16">
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 mx-auto shadow-lg"
            >
              <FileText className="size-10 text-violet-500 dark:text-violet-400" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 -right-1 size-6 rounded-full bg-fuchsia-400/20 flex items-center justify-center"
            >
              <Plus className="size-3 text-fuchsia-500" />
            </motion.div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {search || statusFilter !== 'all' ? 'نتیجه‌ای یافت نشد' : 'هنوز فرمی نساخته‌اید'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all' ? 'فیلترها را تغییر دهید' : 'اولین فرم خود را بسازید یا از الگوها استفاده کنید'}
          </p>
        </motion.div>
      )}

      {/* Forms Grid */}
      {!loading && forms.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.map((form, i) => {
            const statusConf = formStatusConfig[form.status] || formStatusConfig.draft;
            return (
              <motion.div
                key={form.id}
                variants={slideIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
              >
                <Card className="h-full overflow-hidden border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:shadow-lg transition-all duration-200 hover:border-gray-300/60 dark:hover:border-gray-700/60">
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
                      <Badge variant="outline" className={`text-[10px] shrink-0 ${statusConf.color}`}>
                        {statusConf.icon}
                        {statusConf.label}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <FileText className="size-3" />
                        {form._count.questions} سؤال
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {timeAgo(form.updatedAt)}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-1.5 mb-4">
                      <Send className="size-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{form._count.submissions}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">پاسخ</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditForm(form)}
                        className="flex-1 h-8 text-xs rounded-lg gap-1 border-gray-200 dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-950/30 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-200 dark:hover:border-violet-800"
                      >
                        <Edit3 className="size-3" />
                        ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewResults(form)}
                        className="flex-1 h-8 text-xs rounded-lg gap-1 border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800"
                      >
                        <BarChart3 className="size-3" />
                        نتایج
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// ─── Activity Section ───────────────────────────────────────────────────────

function ActivitySection() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/activity');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setActivities(data.activities || []);
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filteredActivities = filter === 'all'
    ? activities
    : activities.filter((a) => a.type === filter);

  const filterOptions = [
    { value: 'all', label: 'همه فعالیت‌ها' },
    { value: 'new_form', label: 'فرم جدید' },
    { value: 'new_response', label: 'پاسخ جدید' },
    { value: 'publish_form', label: 'انتشار فرم' },
  ];

  // Group by date
  const grouped = new Map<string, ActivityItem[]>();
  for (const activity of filteredActivities) {
    const dateKey = new Date(activity.createdAt).toISOString().split('T')[0];
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(activity);
  }

  const filterLabels: Record<string, string> = {
    today: 'امروز',
    yesterday: 'دیروز',
    thisWeek: 'این هفته',
    older: 'قدیمی‌تر',
  };

  function getDateLabel(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 86400000).toISOString().split('T')[0];

    if (dateStr === today) return 'امروز';
    if (dateStr === yesterday) return 'دیروز';

    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffDays < 7) return formatDate(dateStr);
    return formatDate(dateStr);
  }

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

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && filteredActivities.length === 0 && (
        <motion.div variants={staggerItem} className="text-center py-16">
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 mx-auto shadow-lg"
            >
              <Activity className="size-10 text-emerald-500 dark:text-emerald-400" />
            </motion.div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">فعالیتی یافت نشد</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">هنوز فعالیتی ثبت نشده است</p>
        </motion.div>
      )}

      {!loading && filteredActivities.length > 0 && (
        <div className="relative">
          {Array.from(grouped.entries()).map(([dateKey, items]) => (
            <div key={dateKey} className="mb-6 last:mb-0">
              {/* Date Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-3"
              >
                <CalendarDays className="size-4 text-gray-400" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {getDateLabel(dateKey)}
                </span>
              </motion.div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute right-[19px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {items.map((activity, i) => {
                      const config = activityConfig[activity.type] || activityConfig.new_form;
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
                          <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-xl ${config.bgColor} ${config.color} shadow-sm`}>
                            {config.icon}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                              {getActivityDescription(activity)}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Clock className="size-3 text-gray-400" />
                              <span className="text-xs text-gray-500 dark:text-gray-400">{timeAgo(activity.createdAt)}</span>
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
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Notifications Section ──────────────────────────────────────────────────

function NotificationsSection({ onUnreadChange }: { onUnreadChange: (count: number) => void }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/notifications');
        if (res.ok && !cancelled) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          onUnreadChange(data.unreadCount || 0);
        }
      } catch { /* silent */ }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [onUnreadChange]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        onUnreadChange(0);
        toast.success('همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند');
      }
    } catch {
      toast.error('خطا در اتصال');
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, read: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
        const newUnread = notifications.filter((n) => !n.read && n.id !== id).length;
        onUnreadChange(newUnread);
      }
    } catch {
      // silent
    }
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

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && notifications.length === 0 && (
        <motion.div variants={staggerItem} className="text-center py-16">
          <div className="relative inline-block mb-6">
            <motion.div
              animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 mx-auto shadow-lg"
            >
              <Bell className="size-10 text-amber-500 dark:text-amber-400" />
            </motion.div>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">اعلانی وجود ندارد</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">اعلان‌های جدید اینجا نمایش داده می‌شوند</p>
        </motion.div>
      )}

      {/* Notification List */}
      {!loading && notifications.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {notifications.map((notification, i) => {
              const config = notificationTypeConfig[notification.type] || notificationTypeConfig.info;
              return (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => !notification.read && handleMarkRead(notification.id)}
                  className={`relative overflow-hidden rounded-xl border bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-4 transition-all duration-200 cursor-pointer group hover:shadow-md border-r-4 ${
                    !notification.read
                      ? `${config.borderColor} border-gray-200/60 dark:border-gray-800/60 bg-gradient-to-l from-transparent to-gray-50/30 dark:to-gray-800/10`
                      : 'border-gray-100/60 dark:border-gray-800/60 border-r-gray-100 dark:border-r-gray-800'
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
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="size-3 text-gray-400" />
                        <span className="text-[11px] text-gray-400 dark:text-gray-500">{timeAgo(notification.createdAt)}</span>
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
      )}
    </motion.div>
  );
}

// ─── Settings Section ───────────────────────────────────────────────────────

function SettingsSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Notification preferences
  const [notifSubmission, setNotifSubmission] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);
  const [notifSystem, setNotifSystem] = useState(true);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const [theme, setTheme] = useState('light');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('لطفاً رمز عبور جدید و تأیید را وارد کنید');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('رمز عبور باید حداقل ۶ کاراکتر باشد');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('رمز عبور جدید و تأیید آن مطابقت ندارند');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'change_password',
          currentPassword: currentPassword || undefined,
          newPassword,
        }),
      });
      if (res.ok) {
        toast.success('رمز عبور با موفقیت تغییر کرد');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'خطا در تغییر رمز عبور');
      }
    } catch {
      toast.error('خطا در اتصال به سرور');
    }
    setIsChangingPassword(false);
  };

  const handleSavePreferences = async () => {
    setIsSavingPrefs(true);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'preferences',
          preferences: {
            notifSubmission,
            notifWeekly,
            notifSystem,
          },
        }),
      });
      if (res.ok) {
        toast.success('تنظیمات اعلان‌ها ذخیره شد');
      } else {
        toast.error('خطا در ذخیره تنظیمات');
      }
    } catch {
      toast.error('خطا در اتصال به سرور');
    }
    setIsSavingPrefs(false);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'حذف') {
      toast.error('لطفاً کلمه «حذف» را وارد کنید');
      return;
    }
    toast.info('این قابلیت به زودی فعال می‌شود');
    setShowDeleteDialog(false);
    setDeleteConfirmText('');
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="max-w-4xl mx-auto space-y-6">
      {/* Account Settings */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm">
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
                <KeyRound className="size-4 text-gray-500" />
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
                disabled={isChangingPassword}
                className="rounded-xl gap-1.5 bg-violet-500 hover:bg-violet-600 text-white shadow-sm text-sm"
              >
                {isChangingPassword ? <Loader2 className="size-4 animate-spin" /> : <Shield className="size-4" />}
                تغییر رمز عبور
              </Button>
            </div>

            <Separator className="bg-gray-100 dark:bg-gray-800" />

            {/* Delete Account - Danger Zone */}
            <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-4">
              <h4 className="text-sm font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
                <AlertTriangle className="size-4" />
                منطقه خطر
              </h4>
              <p className="text-xs text-red-600/80 dark:text-red-400/80 mb-3">
                با حذف حساب کاربری، تمام فرم‌ها، پاسخ‌ها و داده‌های شما برای همیشه حذف خواهند شد. این عمل قابل بازگشت نیست.
              </p>
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="rounded-xl gap-1.5 text-sm h-9">
                    <Trash2 className="size-3.5" />
                    حذف حساب کاربری
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl border-gray-200 dark:border-gray-800" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right flex items-center gap-2">
                      <AlertTriangle className="size-5 text-red-500" />
                      آیا مطمئن هستید؟
                    </DialogTitle>
                    <DialogDescription className="text-right leading-relaxed">
                      این عمل غیرقابل بازگشت است. تمام فرم‌ها، پاسخ‌ها و تنظیمات شما حذف خواهند شد.
                      برای تأیید، کلمه «حذف» را در فیلد زیر وارد کنید.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    <Label className="text-sm text-gray-700 dark:text-gray-300">
                      برای تأیید عبارت «حذف» را تایپ کنید:
                    </Label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="حذف"
                      className="rounded-xl border-red-200 dark:border-red-900/50 bg-white dark:bg-gray-900 focus:border-red-400 h-11 text-center"
                      dir="rtl"
                    />
                  </div>
                  <DialogFooter className="flex-row gap-2 sm:justify-start">
                    <Button
                      variant="outline"
                      onClick={() => { setShowDeleteDialog(false); setDeleteConfirmText(''); }}
                      className="rounded-xl border-gray-200 dark:border-gray-700 text-sm"
                    >
                      انصراف
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== 'حذف'}
                      className="rounded-xl text-sm"
                    >
                      بله، حذف کن
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                <Megaphone className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base">تنظیمات اعلان‌ها</CardTitle>
                <CardDescription>نحوه دریافت اعلان‌ها را مشخص کنید</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: 'اعلان پاسخ جدید', desc: 'اطلاع از دریافت پاسخ جدید در فرم‌ها', value: notifSubmission, onChange: setNotifSubmission, icon: <Send className="size-4" /> },
              { label: 'گزارش هفتگی', desc: 'دریافت خلاصه فعالیت‌ها در ایمیل', value: notifWeekly, onChange: setNotifWeekly, icon: <TrendingUp className="size-4" /> },
              { label: 'به‌روزرسانی‌های سیستم', desc: 'اطلاع از امکانات و بروزرسانی‌های جدید', value: notifSystem, onChange: setNotifSystem, icon: <Globe className="size-4" /> },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <Switch checked={item.value} onCheckedChange={item.onChange} />
              </div>
            ))}
            <div className="pt-3">
              <Button
                onClick={handleSavePreferences}
                disabled={isSavingPrefs}
                className="rounded-xl gap-1.5 bg-violet-500 hover:bg-violet-600 text-white shadow-sm text-sm"
              >
                {isSavingPrefs ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                ذخیره تنظیمات
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Display Settings */}
      <motion.div variants={staggerItem}>
        <Card className="border-gray-200/60 dark:border-gray-800/60 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl shadow-sm">
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
                    <SelectItem value="dark">تاریک</SelectItem>
                    <SelectItem value="system">سیستم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ─── Subscription Section ───────────────────────────────────────────────────

function SubscriptionSection({ profile }: { profile: UserProfile | null }) {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const formsCount = profile?.formCount || 0;
  const submissionsCount = 0; // Would need a separate query

  const usageItems = [
    { label: 'فرم‌ها', current: formsCount, max: 5, color: 'from-violet-500 to-purple-500' },
    { label: 'سؤال در هر فرم', current: 25, max: 50, color: 'from-fuchsia-500 to-pink-500' },
    { label: 'پاسخ‌ها', current: submissionsCount, max: 500, color: 'from-emerald-500 to-teal-500' },
  ];

  const currentFeatures = [
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
      {/* Current Plan - Glassmorphism */}
      <motion.div variants={staggerItem}>
        <Card className="overflow-hidden border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg">
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
              {currentFeatures.map((feature, i) => (
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

            {/* Usage Progress - Animated */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="size-4 text-violet-500" />
                میزان مصرف
              </h4>
              <div className="space-y-4">
                {usageItems.map((item, i) => {
                  const percentage = Math.min(Math.round((item.current / item.max) * 100), 100);
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
                          transition={{ duration: 1.2, delay: i * 0.2, ease: 'easeOut' }}
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
              onClick={() => {
                setShowUpgradeDialog(true);
                toast.info('به زودی فعال می‌شود');
              }}
              className="bg-white text-violet-700 hover:bg-white/90 rounded-xl shadow-xl font-bold gap-2 h-12 px-6"
            >
              <Zap className="size-5" />
              ارتقا دهید
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="rounded-2xl border-gray-200 dark:border-gray-800 max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right text-lg">مقایسه پلن‌ها</DialogTitle>
            <DialogDescription className="text-right">
              بهترین پلن را برای نیازهای خود انتخاب کنید
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="text-right font-bold text-gray-700 dark:text-gray-300 py-3 px-3">ویژگی</TableHead>
                  <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-3 px-3">رایگان</TableHead>
                  <TableHead className="text-center py-3 px-3">
                    <div className="inline-flex items-center gap-1.5 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 rounded-lg px-3 py-1 text-xs font-bold">
                      <Star className="size-3" />
                      حرفه‌ای
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold text-gray-700 dark:text-gray-300 py-3 px-3">سازمانی</TableHead>
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
                  { feature: 'پشتیبانی', free: 'ایمیل', pro: 'چت زنده', enterprise: 'تلفنی' },
                ].map((row, i) => (
                  <TableRow key={i} className="border-gray-100 dark:border-gray-800">
                    <TableCell className="text-right text-sm text-gray-700 dark:text-gray-300 font-medium py-2.5 px-3">
                      {row.feature}
                    </TableCell>
                    <TableCell className="text-center py-2.5 px-3">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="size-4 text-emerald-500 mx-auto" /> : <X className="size-4 text-gray-300 dark:text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.free}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-2.5 px-3 bg-violet-50/50 dark:bg-violet-950/20">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="size-4 text-emerald-500 mx-auto" /> : <X className="size-4 text-gray-300 dark:text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.pro}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center py-2.5 px-3">
                      {typeof row.enterprise === 'boolean' ? (
                        row.enterprise ? <Check className="size-4 text-emerald-500 mx-auto" /> : <X className="size-4 text-gray-300 dark:text-gray-600 mx-auto" />
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">{row.enterprise}</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpgradeDialog(false)} className="rounded-xl">
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Cards - Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            variants={staggerItem}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className={`h-full relative overflow-hidden border-2 backdrop-blur-xl ${
              plan.current
                ? 'border-violet-300 dark:border-violet-600 bg-white/70 dark:bg-gray-900/70 shadow-lg'
                : plan.popular
                  ? 'border-violet-400 dark:border-violet-500 bg-white/80 dark:bg-gray-900/80 shadow-xl'
                  : 'border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 shadow-lg'
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
                  onClick={() => {
                    if (!plan.current) {
                      toast.info('به زودی فعال می‌شود');
                    }
                  }}
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
