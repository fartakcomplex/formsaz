'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Plus,
  Bell,
  Sparkles,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { useAppStore, type ViewType } from '@/lib/store';
import NotificationBell from '@/components/notifications/notification-bell';
import QuickSearch, { QuickSearchTrigger } from '@/components/quick-search';

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

/* ─── ThemeToggle with ripple, tooltip & bounce ──────────────────────────── */

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ripple, setRipple] = useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  const handleClick = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
    setRipple(true);
    setTimeout(() => setRipple(false), 600);
  }, [isDark, setTheme]);

  if (!mounted) {
    return (
      <div className="size-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClick}
          className="relative flex size-9 items-center justify-center rounded-full bg-gray-100 hover:bg-violet-100 dark:bg-gray-800 dark:hover:bg-violet-900/40 transition-colors duration-200 overflow-hidden"
        >
          {/* Ripple ring on click */}
          <AnimatePresence>
            {ripple && (
              <motion.span
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-violet-400/30 dark:bg-violet-500/20"
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isDark ? 'sun' : 'moon'}
              initial={{ rotate: -180, scale: 0.5, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 180, scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 15 }}
            >
              {isDark ? (
                <Sun className="size-[18px] text-amber-500" />
              ) : (
                <Moon className="size-[18px] text-violet-500" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </TooltipTrigger>
      <TooltipContent sideOffset={8} className="text-xs font-medium">
        {isDark ? 'حالت روشن' : 'حالت تاریک'}
      </TooltipContent>
    </Tooltip>
  );
}

/* ─── Mobile Notification Row ────────────────────────────────────────────── */

function MobileNotificationRow() {
  const [mounted, setMounted] = useState(false);
  const { notifications } = useAppStore();

  React.useEffect(() => setMounted(true), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.08 }}
      className="flex items-center justify-between rounded-xl px-4 py-3 bg-violet-50/50 dark:bg-violet-900/15 backdrop-blur-sm border border-violet-100/60 dark:border-violet-800/30"
    >
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-800/40">
          <Bell className="size-4 text-violet-600 dark:text-violet-400" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          اعلان‌ها
        </span>
      </div>
      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          className="flex min-size-5 size-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white shadow-md shadow-violet-500/25"
        >
          {unreadCount > 99 ? '۹+' : unreadCount}
        </motion.span>
      )}
    </motion.div>
  );
}

/* ─── Logo Icon with Sparkle/Pulse Animation ─────────────────────────────── */

function LogoIcon() {
  return (
    <div className="relative">
      <motion.div
        animate={{
          boxShadow: [
            '0 0 0 0 oklch(0.55 0.24 270 / 0%)',
            '0 0 0 4px oklch(0.55 0.24 270 / 15%)',
            '0 0 0 0 oklch(0.55 0.24 270 / 0%)',
          ],
        }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 3,
        }}
        className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-200/50 dark:shadow-violet-500/20 group-hover:shadow-lg group-hover:shadow-violet-300/50 transition-all duration-300 group-hover:scale-105"
      >
        <FileText className="size-5 text-white" />
      </motion.div>
      {/* Sparkle overlay */}
      <motion.div
        animate={{
          scale: [0.8, 1.2, 0.8],
          opacity: [0, 0.7, 0],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 3,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 4,
        }}
        className="absolute -top-1 -left-1 pointer-events-none"
      >
        <Sparkles className="size-3 text-amber-400" />
      </motion.div>
    </div>
  );
}

/* ─── Mobile Sheet Dots Pattern Background ───────────────────────────────── */

function DotsPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
      style={{
        backgroundImage: 'radial-gradient(circle, oklch(0.55 0.24 270 / 12%) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    />
  );
}

/* ─── Main App Header ────────────────────────────────────────────────────── */

export default function AppHeader() {
  const { currentView, previousView, setCurrentView, currentForm, notifications } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showBackButton = currentView === 'builder' || currentView === 'fill' || currentView === 'results' || currentView === 'templates';
  const showAuthButton = currentView === 'landing';
  const showUserAvatar = currentView !== 'landing' && currentView !== 'templates';

  const currentNavKey = navItems[currentView] ? currentView : 'dashboard';
  const items = navItems[currentNavKey];

  const unreadCount = notifications.filter((n) => !n.read).length;

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

  const isActiveNav = (view?: ViewType) => {
    if (!view) return false;
    if (view === 'dashboard' && currentView === 'dashboard') return true;
    if (view === 'templates' && currentView === 'templates') return true;
    if (view === 'admin' && currentView === 'admin') return true;
    if (view === 'user-panel' && currentView === 'user-panel') return true;
    return false;
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
      {/* ─── Scroll Progress Indicator ──────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-[60]">
        <motion.div
          className="h-full"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, oklch(0.55 0.24 270), oklch(0.55 0.24 293), oklch(0.65 0.20 320))',
            backgroundSize: '200% 100%',
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

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
            <LogoIcon />
            <span
              className="text-lg font-extrabold hidden sm:block text-gradient-animated"
              style={{ filter: 'drop-shadow(0 0 8px oklch(0.55 0.24 270 / 30%))' }}
            >
              فرم‌ساز
            </span>
          </button>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <AnimatePresence mode="wait">
            {items.map((item) => {
              const active = isActiveNav(item.view);
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => handleNavClick(item.view)}
                  className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-colors duration-200"
                >
                  {item.icon}
                  {item.label}
                  {/* Active indicator gradient line */}
                  {active && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, oklch(0.55 0.24 270), oklch(0.65 0.22 310), oklch(0.55 0.24 270))',
                        backgroundSize: '200% 100%',
                        animation: 'text-gradient-flow 3s ease infinite',
                      }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </nav>

        {/* Left side: Quick Search + Theme toggle + Notifications + Auth/User + Mobile menu */}
        <div className="flex items-center gap-2">
          <QuickSearchTrigger />
          <ThemeToggle />

          {showUserAvatar && <NotificationBell />}

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
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-gray-400 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/30"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 overflow-hidden">
                <SheetTitle className="sr-only">منوی ناوبری</SheetTitle>

                {/* Gradient header */}
                <div className="relative bg-gradient-to-bl from-violet-500 via-purple-500 to-fuchsia-600 px-5 pt-8 pb-6 overflow-hidden">
                  {/* Decorative circles */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-14 h-14 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

                  <div className="relative flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                      <FileText className="size-5 text-white" />
                    </div>
                    <span className="text-lg font-extrabold text-white">فرم‌ساز</span>
                  </div>
                </div>

                {/* ─── User Info Section ──────────────────────────────────── */}
                <div className="relative px-4 py-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 20 }}
                      className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold shadow-md shadow-violet-300/30 dark:shadow-violet-500/20 shrink-0"
                    >
                      ک
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        کاربر گرامی
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                        <Mail className="size-3 shrink-0" />
                        user@example.com
                      </p>
                    </div>
                  </div>
                </div>

                {/* ─── Nav Items with Dots Pattern Background ────────────── */}
                <div className="relative flex-1 overflow-y-auto">
                  <DotsPattern />
                  <div className="relative flex flex-col gap-1 p-3">
                    {/* ─── Notification Row (before nav items) ──────────── */}
                    {showUserAvatar && <MobileNotificationRow />}

                    {/* ─── Navigation Items ─────────────────────────────── */}
                    {items.map((item, idx) => {
                      const active = isActiveNav(item.view);
                      return (
                        <motion.button
                          key={item.label}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 + 0.1 }}
                          onClick={() => handleNavClick(item.view)}
                          className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 backdrop-blur-sm ${
                            active
                              ? 'bg-white/70 dark:bg-gray-800/60 text-violet-700 dark:text-violet-300 shadow-sm border border-violet-200/50 dark:border-violet-700/40'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/40 hover:text-violet-700 dark:hover:text-violet-300 border border-transparent'
                          }`}
                        >
                          {/* Icon container with glassmorphism */}
                          <div className={`flex size-8 items-center justify-center rounded-lg shrink-0 backdrop-blur-sm ${
                            active
                              ? 'bg-violet-200/60 dark:bg-violet-800/40 shadow-inner'
                              : 'bg-gray-100/80 dark:bg-gray-800/60'
                          }`}>
                            {item.icon}
                          </div>
                          {item.label}
                          {/* Active gradient bar */}
                          {active && (
                            <div
                              className="absolute right-0 top-2 bottom-2 w-1 rounded-full"
                              style={{
                                background: 'linear-gradient(180deg, oklch(0.55 0.24 270), oklch(0.65 0.22 310))',
                              }}
                            />
                          )}
                        </motion.button>
                      );
                    })}

                    {/* ─── Create new form button with glow ──────────────── */}
                    {currentView !== 'landing' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: items.length * 0.05 + 0.2 }}
                        className="mt-2 pt-2 border-t border-gray-200/60 dark:border-gray-800/60"
                      >
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setCurrentView('builder');
                            setMobileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-gradient-to-l from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-md shadow-violet-300/40 dark:shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-400/50"
                          style={{
                            boxShadow: '0 0 16px oklch(0.55 0.24 270 / 25%), 0 4px 12px oklch(0.55 0.24 270 / 15%)',
                          }}
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                            <Plus className="size-4" />
                          </div>
                          ایجاد فرم جدید
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Quick Search Dialog (global) */}
      <QuickSearch />
    </motion.header>
  );
}
