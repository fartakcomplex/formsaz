'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  FileText,
  ArrowRight,
  Menu,
  User,
  LayoutDashboard,
  ListChecks,
  LogIn,
  Sun,
  Moon,
  Shield,
  Settings,
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
    { label: 'پنل ادمین', icon: <Shield className="size-4" />, view: 'admin' },
    { label: 'پنل کاربری', icon: <User className="size-4" />, view: 'user-panel' },
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
  admin: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'پنل ادمین', icon: <Shield className="size-4" />, view: 'admin' },
    { label: 'پنل کاربری', icon: <User className="size-4" />, view: 'user-panel' },
  ],
  'user-panel': [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'پنل ادمین', icon: <Shield className="size-4" />, view: 'admin' },
    { label: 'پنل کاربری', icon: <User className="size-4" />, view: 'user-panel' },
  ],
};

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="size-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex size-9 items-center justify-center rounded-full bg-gray-100 hover:bg-violet-100 dark:bg-gray-800 dark:hover:bg-violet-900/40 transition-colors duration-200"
      title={isDark ? 'حالت روشن' : 'حالت تاریک'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'sun' : 'moon'}
          initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.35, type: 'spring', stiffness: 200, damping: 20 }}
        >
          {isDark ? (
            <Sun className="size-[18px] text-amber-500" />
          ) : (
            <Moon className="size-[18px] text-violet-500" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

export default function AppHeader() {
  const { currentView, previousView, setCurrentView, currentForm } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-[0_1px_3px_-1px_oklch(0.55_0.24_270/6%)]'
          : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg'
      }`}
    >
      {/* Gradient bottom border */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300 ${
          scrolled ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(90deg, transparent, oklch(0.55 0.24 270 / 30%), oklch(0.55 0.24 270 / 50%), oklch(0.55 0.24 270 / 30%), transparent)',
        }}
      />
      {/* Static subtle border for non-scrolled state */}
      {!scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200/60 dark:bg-gray-800/60" />
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Right side: Back button + Logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
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
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-200/50 dark:shadow-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-300/50 transition-all duration-300 group-hover:scale-105">
              <FileText className="size-5 text-white" />
            </div>
            <span className="text-lg font-extrabold hidden sm:block bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
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
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors duration-200"
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
                className="bg-gradient-to-l from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md shadow-violet-200/50 dark:shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-300/50 rounded-xl px-5 font-medium transition-all duration-300"
              >
                <LogIn className="size-4 ml-2" />
                ورود / ثبت‌نام
              </Button>
            </motion.div>
          )}

          {showUserAvatar && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentView('user-panel')}
              className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md cursor-pointer hover:shadow-lg transition-all duration-300"
              title="پنل کاربری"
            >
              <User className="size-4" />
            </motion.button>
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
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
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
