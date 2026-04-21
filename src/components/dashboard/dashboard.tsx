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
} from 'lucide-react';
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
import { useAppStore, type Form } from '@/lib/store';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  draft: {
    label: 'پیش‌نویس',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <ClipboardList className="size-3.5" />,
  },
  published: {
    label: 'منتشر شده',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <CircleDot className="size-3.5" />,
  },
  closed: {
    label: 'بسته شده',
    color: 'bg-gray-100 text-gray-600 border-gray-200',
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

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className={`flex size-12 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative mb-6">
        <div className="flex size-28 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <FilePlus className="size-14 text-indigo-300" />
        </div>
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        >
          <Plus className="size-7 rounded-full bg-white text-indigo-500 shadow-lg" />
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">هنوز فرمی نساخته‌اید!</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">
        با ساخت اولین فرم خود، شروع به جمع‌آوری اطلاعات و بازخورد کنید.
      </p>
      <Button
        onClick={onCreateNew}
        className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 rounded-xl px-6 font-medium"
      >
        <Plus className="size-4 ml-2" />
        ایجاد فرم جدید
      </Button>
    </motion.div>
  );
}

function FormCardSkeleton() {
  return (
    <Card className="overflow-hidden">
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

function FormCard({
  form,
  onEdit,
  onPreview,
  onResults,
  onDelete,
}: {
  form: Form;
  onEdit: (form: Form) => void;
  onPreview: (form: Form) => void;
  onResults: (form: Form) => void;
  onDelete: (form: Form) => void;
}) {
  const status = statusConfig[form.status] || statusConfig.draft;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className="overflow-hidden border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 group">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-bold text-gray-900 truncate">
                {form.title}
              </CardTitle>
              {form.description && (
                <CardDescription className="mt-1 line-clamp-2 text-sm">
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
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 p-2.5 group-hover:bg-indigo-50 transition-colors">
              <FileText className="size-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-semibold text-gray-700">{form.questions?.length || 0}</span>
              <span className="text-[10px] text-gray-400">سؤال</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 p-2.5 group-hover:bg-indigo-50 transition-colors">
              <Send className="size-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-semibold text-gray-700">{form._count?.submissions || 0}</span>
              <span className="text-[10px] text-gray-400">پاسخ</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-50 p-2.5 group-hover:bg-indigo-50 transition-colors">
              <Eye className="size-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
              <span className="text-xs font-semibold text-gray-700">{form.viewCount || 0}</span>
              <span className="text-[10px] text-gray-400">بازدید</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3 pt-0">
          <div className="flex items-center justify-between w-full text-xs text-gray-400 px-1">
            <span>آخرین ویرایش</span>
            <span>{formatDate(form.updatedAt)}</span>
          </div>

          <div className="flex items-center gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              onClick={() => onEdit(form)}
            >
              <Edit3 className="size-3.5 ml-1" />
              ویرایش
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs rounded-lg hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
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
                <DropdownMenuItem>
                  <Copy className="size-4 ml-2 text-gray-500" />
                  کپی لینک
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" select={false}>
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

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            icon={<FileText className="size-6 text-indigo-600" />}
            label="کل فرم‌ها"
            value={forms.length}
            color="bg-indigo-100"
          />
          <StatCard
            icon={<Send className="size-6 text-emerald-600" />}
            label="کل پاسخ‌ها"
            value={totalSubmissions}
            color="bg-emerald-100"
          />
          <StatCard
            icon={<Eye className="size-6 text-blue-600" />}
            label="کل بازدیدها"
            value={totalViews}
            color="bg-blue-100"
          />
          <StatCard
            icon={<CircleDot className="size-6 text-purple-600" />}
            label="فرم‌های منتشر شده"
            value={publishedForms}
            color="bg-purple-100"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">فرم‌های من</h1>
            <p className="text-sm text-gray-500 mt-0.5">مدیریت و مشاهده تمام فرم‌های خود</p>
          </div>
          <Button
            onClick={handleCreateNew}
            className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 rounded-xl px-5 font-medium w-full sm:w-auto"
          >
            <Plus className="size-4 ml-2" />
            ایجاد فرم جدید
          </Button>
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
                className="pr-10 h-10 rounded-xl border-gray-200 bg-white focus:border-indigo-300 focus:ring-indigo-100"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl border-gray-200 bg-white">
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
            <Search className="size-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-1">فرمی یافت نشد</h3>
            <p className="text-sm text-gray-400">فیلتر یا عبارت جستجوی خود را تغییر دهید</p>
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
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
