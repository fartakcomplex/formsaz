'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ArrowRight,
  Menu,
  X,
  User,
  LayoutDashboard,
  ListChecks,
  LogIn,
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
    { label: 'الگوها', icon: <FileText className="size-4" /> },
  ],
  dashboard: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
  ],
  builder: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
  ],
  fill: [],
  results: [
    { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
    { label: 'فرم‌های من', icon: <ListChecks className="size-4" />, view: 'dashboard' },
  ],
};

export default function AppHeader() {
  const { currentView, previousView, setCurrentView, currentForm } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const showBackButton = currentView === 'builder' || currentView === 'fill' || currentView === 'results';
  const showAuthButton = currentView === 'landing';
  const showUserAvatar = currentView !== 'landing';

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
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Right side: Back button + Logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
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
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200 group-hover:shadow-lg group-hover:shadow-indigo-300 transition-shadow">
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
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {item.icon}
                {item.label}
              </motion.button>
            ))}
          </AnimatePresence>
        </nav>

        {/* Left side: Auth/User + Mobile menu */}
        <div className="flex items-center gap-2">
          {showAuthButton && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={() => setCurrentView('dashboard')}
                className="bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 rounded-xl px-5 font-medium"
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
                <Button variant="ghost" size="icon" className="text-gray-600">
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
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
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
