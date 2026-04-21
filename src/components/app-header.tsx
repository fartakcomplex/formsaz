'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  FileText,
  ArrowRight,
  Menu,
  X,
  User,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAppStore, type ViewType } from '@/lib/store';

const navItems: Record<string, { label: string; icon: React.ReactNode; view?: ViewType }[]> = {
  landing: [
    { label: 'ویژگی‌ها', icon: <ListChecks className="size-4" /> },
    { label: 'الگوها', icon: <FileText className="size-4" />, view: 'templates' },
  ],
  dashboard: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
    { label: 'الگوهای آماده', icon: <FileText className="size-4" />, view: 'templates' },
  ],
  builder: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
    { label: 'الگوهای آماده', icon: <FileText className="size-4" />, view: 'templates' },
  ],
  fill: [],
  results: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
    { label: 'الگوهای آماده', icon: <FileText className="size-4" />, view: 'templates' },
  ],
  templates: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
  ],
};

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="size-9 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex size-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      title={isDark ? 'حالت روشن' : 'حالت تاریک'}
    >
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="size-4 text-amber-500" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="size-4 text-indigo-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export default function AppHeader() {
  const { currentView, previousView, setCurrentView, currentForm } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showBackButton = currentView === 'builder' || currentView === 'fill' || currentView === 'results' || currentView === 'templates';
  const showAuthButton = currentView === 'landing';
  const showUserAvatar = currentView !== 'landing' && currentView !== 'templates';

  const currentNavKey = navItems[currentView] ? currentView : 'dashboard';
  const items = navItems[currentNavKey];

  const handleBack = () => {
    if (currentView === 'results' && currentForm) {
      setCurrentView('dashboard');
    } else if (previousView) {
      setCurrentView(previousView);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleNavClick = (view?: ViewType) => {
    if (view) {
      setCurrentView(view);
      setMobileOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 border-gray-200 dark:border-gray-800"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Right side: Back button + Logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <ArrowRight className="size-5" />
            </Button>
          )}

          <button
            onClick={() => {
              if (currentView === 'landing') return;
              setCurrentView('dashboard');
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200/50 dark:shadow-indigo-500/20 group-hover:shadow-lg group-hover:shadow-indigo-300/50 transition-shadow">
              <FileText className="size-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-l from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
              فرم‌ساز
            </span>
          </button>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <AnimatePresence mode="wait">
            {items.map((item) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                onClick={() => handleNavClick(item.view)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </nav>

        {/* Left side: Theme toggle + Auth/User + Mobile menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {showAuthButton && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => setCurrentView('dashboard')}
                className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200/50 dark:shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-300/50 rounded-xl px-5 font-medium"
              >
                <LogIn className="size-4 ml-2" />
                ورود / ثبت‌نام
              </Button>
            </motion.div>
          )}

          {showUserAvatar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            >
              <User className="size-4" />
            </motion.div>
          )}

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetTitle className="sr-only">منوی ناوبری</SheetTitle>
                <div className="flex flex-col gap-1 mt-8">
                  {items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleNavClick(item.view)}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
