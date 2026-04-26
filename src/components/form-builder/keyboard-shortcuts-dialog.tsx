'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, Command, Settings2, ListPlus, Eye, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/* ========== Types ========== */

interface ShortcutItem {
  keys: string[];
  label: string;
  description: string;
}

interface ShortcutCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  shortcuts: ShortcutItem[];
}

interface KeyboardShortcutsDialogProps {
  children?: React.ReactNode;
}

/* ========== Constants ========== */

const SHORTCUT_CATEGORIES: ShortcutCategory[] = [
  {
    id: 'general',
    title: 'عمومی',
    icon: <Settings2 className="size-4" />,
    accentColor: 'violet',
    accentBg: 'bg-violet-50 dark:bg-violet-950/30',
    accentBorder: 'border-violet-200 dark:border-violet-800',
    accentText: 'text-violet-600 dark:text-violet-400',
    shortcuts: [
      { keys: ['Ctrl', 'S'], label: 'ذخیره', description: 'Save' },
      { keys: ['Ctrl', 'Z'], label: 'برگردان', description: 'Undo' },
      { keys: ['Ctrl', 'Y'], label: 'دوباره', description: 'Redo' },
      { keys: ['Ctrl', 'N'], label: 'جدید', description: 'New' },
    ],
  },
  {
    id: 'questions',
    title: 'سؤالات',
    icon: <ListPlus className="size-4" />,
    accentColor: 'emerald',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    accentBorder: 'border-emerald-200 dark:border-emerald-800',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    shortcuts: [
      { keys: ['Ctrl', 'D'], label: 'تکرار', description: 'Duplicate' },
      { keys: ['Delete'], label: 'حذف', description: 'Delete' },
      { keys: ['Ctrl', '↑'], label: 'بالا', description: 'Move up' },
      { keys: ['Ctrl', '↓'], label: 'پایین', description: 'Move down' },
    ],
  },
  {
    id: 'view',
    title: 'مشاهده',
    icon: <Eye className="size-4" />,
    accentColor: 'amber',
    accentBg: 'bg-amber-50 dark:bg-amber-950/30',
    accentBorder: 'border-amber-200 dark:border-amber-800',
    accentText: 'text-amber-600 dark:text-amber-400',
    shortcuts: [
      { keys: ['Ctrl', 'P'], label: 'پیش‌نمایش', description: 'Preview' },
      { keys: ['Ctrl', 'Shift', 'P'], label: 'انتشار', description: 'Publish' },
      { keys: ['Escape'], label: 'بستن', description: 'Close' },
    ],
  },
];

/* ========== Keyboard Badge Component ========== */

function KeyBadge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'mod' }) {
  return (
    <kbd
      className={`
        inline-flex items-center justify-center min-w-[26px] h-7 px-1.5
        text-[11px] font-semibold leading-none
        rounded-md border
        transition-all duration-150
        ${
          variant === 'mod'
            ? 'bg-violet-100 dark:bg-violet-900/40 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 shadow-sm'
            : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.3)]'
        }
      `}
    >
      {children}
    </kbd>
  );
}

/* ========== Shortcut Row Component ========== */

function ShortcutRow({ shortcut }: { shortcut: ShortcutItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between px-4 py-3 hover:bg-white/60 dark:hover:bg-white/5 rounded-lg transition-all duration-200 group cursor-default"
    >
      {/* Label (right side in RTL) */}
      <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
        {shortcut.label}
      </span>

      {/* Keys (left side in RTL) */}
      <div className="flex items-center gap-1 flex-row-reverse">
        {shortcut.keys.map((key, keyIndex) => (
          <React.Fragment key={keyIndex}>
            {keyIndex > 0 && (
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mx-0.5">
                +
              </span>
            )}
            <KeyBadge variant={key === 'Ctrl' || key === 'Shift' || key === 'Command' ? 'mod' : 'default'}>
              {key}
            </KeyBadge>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

/* ========== Category Section Component ========== */

function CategorySection({ category, index }: { category: ShortcutCategory; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={`rounded-xl border ${category.accentBorder} ${category.accentBg} overflow-hidden`}
      style={{
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      {/* Category header */}
      <div className="flex items-center gap-2.5 px-4 pt-3.5 pb-2">
        <div className={`flex size-7 items-center justify-center rounded-lg ${category.accentBg} ${category.accentText} ring-1 ${category.accentBorder}`}>
          {category.icon}
        </div>
        <h3 className={`text-sm font-bold ${category.accentText}`}>
          {category.title}
        </h3>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mr-auto">
          {category.shortcuts.length} میانبر
        </span>
      </div>

      {/* Shortcuts list */}
      <div className="px-2 pb-2 divide-y divide-zinc-200/50 dark:divide-zinc-700/30">
        {category.shortcuts.map((shortcut, shortcutIndex) => (
          <ShortcutRow key={shortcutIndex} shortcut={shortcut} />
        ))}
      </div>
    </motion.div>
  );
}

/* ========== Main Component ========== */

export default function KeyboardShortcutsDialog({ children }: KeyboardShortcutsDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  /* Listen for Ctrl+/ to open the dialog */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* Reset search when dialog closes */
  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearchQuery('');
  }, []);

  /* Filter categories based on search */
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SHORTCUT_CATEGORIES;

    const query = searchQuery.trim().toLowerCase();
    return SHORTCUT_CATEGORIES
      .map((category) => ({
        ...category,
        shortcuts: category.shortcuts.filter(
          (s) =>
            s.label.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.keys.some((k) => k.toLowerCase().includes(query))
        ),
      }))
      .filter((category) => category.shortcuts.length > 0);
  }, [searchQuery]);

  const hasResults = filteredCategories.length > 0;

  const triggerContent = children || (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          asChild
        >
          <span>
            <Keyboard className="h-4 w-4" />
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>میانبرهای کیبورد</TooltipContent>
    </Tooltip>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[500px] p-0 gap-0 overflow-hidden"
        dir="rtl"
        showCloseButton={false}
      >
        {/* Gradient header bar */}
        <div className="h-1 bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500" />

        <DialogHeader className="px-6 pt-5 pb-0">
          <DialogTitle className="text-lg font-bold flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40">
              <Command className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            میانبرهای کیبورد
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground pr-[46px]">
            برای کار سریع‌تر از میانبرهای زیر استفاده کنید
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pt-4 pb-6 space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <Input
              placeholder="جستجوی میانبر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 h-9 rounded-lg border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-violet-300 focus:ring-violet-100"
              dir="rtl"
            />
          </div>

          {/* Categories */}
          <div className="space-y-3 max-h-[340px] overflow-y-auto">
            <AnimatePresence mode="wait">
              {hasResults ? (
                filteredCategories.map((category, index) => (
                  <CategorySection key={category.id} category={category} index={index} />
                ))
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 mb-3">
                    <Search className="size-5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    میانبری یافت نشد
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                    عبارت دیگری را جستجو کنید
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-muted-foreground">
            <KeyBadge>Ctrl</KeyBadge>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mx-0.5">+</span>
            <KeyBadge>/</KeyBadge>
            <span className="mr-2 ml-1">برای باز شدن این پنجره</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
