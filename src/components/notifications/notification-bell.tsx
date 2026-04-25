'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  Bell,
  BellOff,
  Info,
  CheckCircle2,
  AlertTriangle,
  CheckCheck,
  Trash2,
} from 'lucide-react';
import { useAppStore, type NotificationItem } from '@/lib/store';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function getRelativeTime(date: Date): string {
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: faIR,
    });
  } catch {
    // Fallback if date-fns fails
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    if (diffMin < 1) return 'همین الان';
    if (diffMin < 60) return `${toPersianNumber(diffMin)} دقیقه پیش`;
    if (diffHour < 24) return `${toPersianNumber(diffHour)} ساعت پیش`;
    return new Date(date).toLocaleDateString('fa-IR');
  }
}

function toPersianNumber(num: number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num.toString().replace(/\d/g, (d) => persianDigits[parseInt(d)]);
}

function isToday(date: Date): boolean {
  const now = new Date();
  const d = new Date(date);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
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

function getTypeBorderColor(type: NotificationItem['type']) {
  switch (type) {
    case 'info':
      return 'border-sky-400 dark:border-sky-500';
    case 'success':
      return 'border-emerald-400 dark:border-emerald-500';
    case 'warning':
      return 'border-amber-400 dark:border-amber-500';
  }
}

/* ─── Stagger animation variants ───────────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 28,
    },
  },
  exit: {
    opacity: 0,
    x: 16,
    filter: 'blur(3px)',
    transition: { duration: 0.2 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 30 },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      delay: 0.15,
    },
  },
};

/* ─── Group type for time-based categorization ─────────────────────────────── */

interface NotificationGroup {
  label: string;
  notifications: NotificationItem[];
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export default function NotificationBell() {
  const [mounted, setMounted] = useState(false);
  const {
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
  } = useAppStore();

  React.useEffect(() => setMounted(true), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Group notifications by time category
  const groupedNotifications = useMemo((): NotificationGroup[] => {
    if (notifications.length === 0) return [];

    const todayItems = notifications.filter((n) => isToday(n.createdAt));
    const earlierItems = notifications.filter((n) => !isToday(n.createdAt));

    const groups: NotificationGroup[] = [];

    if (todayItems.length > 0) {
      groups.push({ label: 'امروز', notifications: todayItems });
    }
    if (earlierItems.length > 0) {
      groups.push({ label: 'قبلاً', notifications: earlierItems });
    }

    return groups;
  }, [notifications]);

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
          whileTap={{ scale: 0.92 }}
          className="relative flex size-9 items-center justify-center rounded-full bg-gray-100 hover:bg-violet-100 dark:bg-gray-800 dark:hover:bg-violet-900/40 transition-colors duration-200"
          title="اعلان‌ها"
        >
          <Bell className="size-[18px] text-gray-600 dark:text-gray-400" />

          {/* Enhanced pulsing badge with violet-to-purple gradient */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -left-1 z-10">
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-full bg-violet-500/40 animate-ping" />
              {/* Badge */}
              <motion.span
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 20,
                }}
                className="relative flex min-size-5 size-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white shadow-lg shadow-violet-500/30 ring-2 ring-white dark:ring-gray-900"
              >
                {toPersianNumber(unreadCount > 99 ? '۹+' : unreadCount)}
              </motion.span>
            </span>
          )}
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="w-80 p-0 overflow-hidden rounded-xl border border-violet-200/30 dark:border-violet-500/20 glass-card-strong shadow-gradient-violet"
      >
        <AnimatePresence mode="wait">
          {notifications.length === 0 ? (
            /* ─── Empty State ────────────────────────────────────────────── */
            <motion.div
              key="empty"
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center justify-center py-10 px-6"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/20 mb-4"
              >
                <BellOff className="size-7 text-violet-400 dark:text-violet-500" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-sm font-medium text-foreground"
              >
                اعلان جدیدی وجود ندارد
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-xs text-muted-foreground mt-1 text-center leading-relaxed"
              >
                اعلان‌های جدید شما اینجا نمایش داده می‌شوند
              </motion.p>
            </motion.div>
          ) : (
            /* ─── Notifications List ─────────────────────────────────────── */
            <motion.div
              key="list"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
            >
              {/* ─── Gradient Header ─────────────────────────────────────── */}
              <motion.div
                variants={headerVariants}
                className="bg-gradient-to-l from-violet-500 via-purple-500 to-purple-600 px-4 py-3 relative overflow-hidden"
              >
                {/* Decorative circles in header */}
                <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-4 w-10 h-10 bg-white/5 rounded-full translate-y-1/2" />

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-white/20">
                      <Bell className="size-3.5 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-white">اعلان‌ها</h3>
                  </div>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
                      className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
                    >
                      <span className="size-1.5 rounded-full bg-white animate-pulse" />
                      {toPersianNumber(unreadCount)} خوانده‌نشده
                    </motion.span>
                  )}
                </div>
              </motion.div>

              {/* ─── Actions Bar ──────────────────────────────────────────── */}
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between border-b border-gray-200/60 dark:border-gray-700/40 px-3 py-2"
              >
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCheck className="size-3.5" />
                  خواندن همه
                </button>
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  پاک کردن همه
                </button>
              </motion.div>

              {/* ─── Notification Groups (Today / Earlier) ───────────────── */}
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {groupedNotifications.map((group, groupIdx) => (
                  <div key={group.label}>
                    {/* Group Section Header */}
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: groupIdx * 0.1 + 0.15 }}
                      className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-3 pt-3 pb-1.5"
                    >
                      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                        {group.label}
                      </span>
                    </motion.div>

                    {/* Notification Items */}
                    <AnimatePresence mode="popLayout">
                      {group.notifications.slice(0, 5).map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{
                            delay: index * 0.04 + groupIdx * 0.08,
                          }}
                          onClick={() => markNotificationAsRead(notification.id)}
                          className={`
                            group relative flex items-start gap-3 px-3 py-3 cursor-pointer
                            transition-all duration-200
                            hover:translate-x-1
                            ${!notification.read
                              ? 'bg-violet-50/60 dark:bg-violet-950/20'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }
                          `}
                        >
                          {/* Unread indicator — violet left border (RTL: right border) */}
                          {!notification.read && (
                            <motion.div
                              layoutId={`unread-indicator-${notification.id}`}
                              className="absolute right-0 top-2 bottom-2 w-[3px] rounded-l-full bg-gradient-to-b from-violet-400 to-purple-500"
                            />
                          )}

                          {/* Type icon with colored background */}
                          <div
                            className={`
                              flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5
                              transition-transform duration-200 group-hover:scale-110
                              ${getTypeBgColor(notification.type)}
                            `}
                          >
                            {getTypeIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`
                                  text-[13px] leading-relaxed
                                  ${!notification.read
                                    ? 'font-semibold text-foreground'
                                    : 'text-muted-foreground font-normal'
                                  }
                                `}
                              >
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="size-2 rounded-full bg-violet-500 shrink-0 mt-1.5 shadow-sm shadow-violet-500/40" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 leading-relaxed">
                              {notification.description}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-[10px] text-muted-foreground/60">
                                {getRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* ─── Footer ───────────────────────────────────────────────── */}
              {notifications.length > 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="gradient-divider"
                />
              )}
              {notifications.length > 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="px-3 py-2.5"
                >
                  <button className="w-full text-center text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors animated-underline">
                    مشاهده همه اعلان‌ها
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
