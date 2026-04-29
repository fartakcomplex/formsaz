'use client';

import React, { useState, useEffect } from 'react';
import { User, FileText, Activity, Bell, Settings, Loader2, Shield, Star, Crown, CreditCard, LogOut, ChevronLeft, Pencil, Save, Camera, Mail, Phone, Globe, Moon, Sun, KeyRound, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

type Tab = 'profile' | 'my-forms' | 'activity' | 'notifications' | 'settings';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  bio: string | null;
  role: string;
  status: string;
  createdAt: string;
  formCount: number;
  notificationCount: number;
}

export default function UserPanel() {
  const { setCurrentView } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditName(data.name);
          setEditEmail(data.email);
          setEditPhone(data.phone || '');
          setEditBio(data.bio || '');
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => setDarkMode(document.documentElement.classList.contains('dark')));
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail, phone: editPhone, bio: editBio }),
      });
      if (res.ok) setProfile(await res.json());
      setIsEditing(false);
    } catch {}
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'پروفایل من', icon: <User className="size-4" /> },
    { id: 'my-forms', label: 'فرمهای من', icon: <FileText className="size-4" /> },
    { id: 'activity', label: 'فعالیتها', icon: <Activity className="size-4" /> },
    { id: 'notifications', label: 'اعلانها', icon: <Bell className="size-4" /> },
    { id: 'settings', label: 'تنظیمات', icon: <Settings className="size-4" /> },
  ];

  if (loading) {
    return (
      <div dir="rtl" className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="h-screen bg-gray-50 dark:bg-gray-950 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        {/* Gradient accent */}
        <div className="h-1 bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500 shrink-0" />

        {/* User Info */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              {profile?.name ? (
                <span className="text-white font-bold text-base">{profile.name.charAt(0)}</span>
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold truncate">{profile?.name || 'کاربر'}</h3>
              <p className="text-xs text-gray-500 truncate">{profile?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Back button */}
        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <Button variant="outline" className="w-full gap-2 rounded-xl" onClick={() => setCurrentView('dashboard')}>
            <ChevronLeft className="w-4 h-4" />
            بازگشت به داشبورد
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="p-6 lg:p-8 max-w-4xl">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">پروفایل من</h1>
                  {!isEditing ? (
                    <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setIsEditing(true)}>
                      <Pencil className="w-4 h-4" />
                      ویرایش
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => setIsEditing(false)}>انصراف</Button>
                      <Button className="gap-2 rounded-xl" onClick={saveProfile}>
                        <Save className="w-4 h-4" />
                        ذخیره
                      </Button>
                    </div>
                  )}
                </div>

                <Card className="rounded-2xl">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                          {profile?.name ? (
                            <span className="text-white font-bold text-xl">{profile.name.charAt(0)}</span>
                          ) : (
                            <User className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <button className="absolute -bottom-1 -left-1 w-6 h-6 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-md border border-gray-200 dark:border-gray-700">
                          <Camera className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{profile?.name || 'کاربر'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{profile?.role === 'admin' ? 'مدیر' : 'کاربر'}</Badge>
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">فعال</Badge>
                        </div>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label>نام و نام خانوادگی</Label>
                          <Input value={editName} onChange={e => setEditName(e.target.value)} className="rounded-xl" />
                        </div>
                        <div className="grid gap-2">
                          <Label>ایمیل</Label>
                          <Input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="rounded-xl" dir="ltr" />
                        </div>
                        <div className="grid gap-2">
                          <Label>شماره تلفن</Label>
                          <Input value={editPhone} onChange={e => setEditPhone(e.target.value)} className="rounded-xl" dir="ltr" placeholder="09123456789" />
                        </div>
                        <div className="grid gap-2">
                          <Label>درباره من</Label>
                          <textarea className="flex min-h-[80px] w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent px-4 py-3 text-sm" value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="یک جمله درباره خودتان..." />
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile?.email || '-'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{profile?.phone || 'تنظیم نشده'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">عضو از {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fa-IR') : '-'}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-2">
                        <FileText className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="text-xl font-bold">{profile?.formCount || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">فرم ایجاد شده</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                        <Star className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-xl font-bold">{profile?.notificationCount || 0}</div>
                      <div className="text-xs text-gray-500 mt-1">اعلان خوانده شده</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-2xl">
                    <CardContent className="p-4 text-center">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-xl font-bold">{profile?.role === 'admin' ? 'مدیر' : 'کاربر'}</div>
                      <div className="text-xs text-gray-500 mt-1">نقش کاربری</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* My Forms Tab */}
            {activeTab === 'my-forms' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">فرمهای من</h1>
                <Card className="rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">فرمی یافت نشد</h3>
                    <p className="text-gray-500 text-sm mb-4">شما هنوز فرمی ایجاد نکرده‌اید.</p>
                    <Button className="rounded-xl" onClick={() => setCurrentView('builder')}>
                      ایجاد اولین فرم
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">فعالیتها</h1>
                <Card className="rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">فعالیتی ثبت نشده</h3>
                    <p className="text-gray-500 text-sm">فعالیت‌های شما اینجا نمایش داده می‌شود.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">اعلانها</h1>
                <Card className="rounded-2xl">
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">اعلان جدیدی ندارید</h3>
                    <p className="text-gray-500 text-sm">اعلان‌های جدید اینجا نمایش داده می‌شود.</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold">تنظیمات</h1>
                
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      ظاهر
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">حالت تاریک</p>
                        <p className="text-xs text-gray-500">تغییر به حالت تاریک</p>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      امنیت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">تغییر رمز عبور</p>
                        <p className="text-xs text-gray-500">رمز عبور خود را تغییر دهید</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl">تغییر</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      اشتراک
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">پلن فعلی: رایگان</p>
                        <p className="text-xs text-gray-500">به پلن حرفه‌ای ارتقا دهید</p>
                      </div>
                      <Button size="sm" className="rounded-xl bg-gradient-to-l from-violet-600 to-purple-600">ارتقا</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-red-200 dark:border-red-900/30">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-600">حذف حساب</p>
                          <p className="text-xs text-gray-500">این عمل غیرقابل بازگشت است</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50">حذف</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
