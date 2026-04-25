'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  Info,
  CheckCircle2,
  AlertTriangle,
  Check,
  Trash2,
} from 'lucide-react';
import { useAppStore, type NotificationItem } from '@/lib/store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'همین الان';
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;
  if (diffHour < 24) return `${diffHour} ساعت پیش`;
  if (diffDay < 7) return `${diffDay} روز پیش`;
  return new Date(date).toLocaleDateString('fa-IR');
}

function getTypeIcon(type: NotificationItem['type']) {
  switch (type) {
    case 'info':
      return <Info className="size-4 text-blue-500" />;
    case 'success':
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case 'warning':
      return <AlertTriangle className="size-4 text-amber-500" />;
  }
}

function getTypeBorderColor(type: NotificationItem['type']) {
  switch (type) {
    case 'info':
      return 'border-r-blue-500';
    case 'success':
      return 'border-r-emerald-500';
    case 'warning':
      return 'border-r-amber-500';
  }
}

function getTypeBgColor(type: NotificationItem['type']) {
  switch (type) {
    case 'info':
      return 'bg-blue-100 dark:bg-blue-900/30';
    case 'success':
      return 'bg-emerald-100 dark:bg-emerald-900/30';
    case 'warning':
      return 'bg-amber-100 dark:bg-amber-900/30';
  }
}

function toPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

export default function NotificationBell() {
  const [mounted, setMounted] = useState(false);
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
  } = useAppStore();

  React.useEffect(() => setMounted(true), []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  if (!mounted) {
    return (
      <div className="size-9 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  const handleMarkAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.read) markNotificationAsRead(n.id);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative flex size-9 items-center justify-center rounded-full bg-gray-100 hover:bg-violet-100 dark:bg-gray-800 dark:hover:bg-violet-900/40 transition-colors duration-200"
          title="اعلان‌ها"
        >
          <Bell className="size-[18px] text-gray-600 dark:text-gray-400" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -left-0.5 flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-[9px] font-bold text-white shadow-sm notification-badge-ping"
            >
              {toPersianNumber(unreadCount > 9 ? 9 : unreadCount)}
            </motion.span>
          )}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 glass rounded-xl border border-violet-200/30 dark:border-violet-500/20 p-0 overflow-hidden"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-l from-violet-500 to-purple-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">اعلان‌ها</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-white/80">
                {toPersianNumber(unreadCount)} خوانده‌نشده
              </span>
            )}
          </div>
        </div>

        {/* Actions bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/40 px-3 py-2">
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Check className="size-3.5" />
              خواندن همه
            </button>
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 className="size-3.5" />
              پاک کردن همه
            </button>
          </div>
        )}

        {/* Notifications list */}
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
          {recentNotifications.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30 mb-3">
                <BellOff className="size-6 text-violet-400" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                بدون اعلان
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1 text-center">
                اعلان‌های جدید اینجا نمایش داده می‌شوند
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {recentNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{
                    duration: 0.25,
                    delay: index * 0.05,
                    layout: { duration: 0.2 },
                  }}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={`flex items-start gap-3 px-3 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-r-[3px] ${getTypeBorderColor(notification.type)} ${
                    !notification.read ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''
                  }`}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5 ${getTypeBgColor(notification.type)}`}
                  >
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm leading-relaxed ${
                          !notification.read
                            ? 'font-semibold text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="size-2 rounded-full bg-violet-500 shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {notification.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      {getRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer: View all link */}
        {notifications.length > 5 && (
          <div className="border-t border-gray-200/60 dark:border-gray-700/40 px-3 py-2.5">
            <button className="w-full text-center text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
              مشاهده همه اعلان‌ها
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
