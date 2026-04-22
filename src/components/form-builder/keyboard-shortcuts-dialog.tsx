'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Keyboard, Command } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

interface KeyboardShortcutsDialogProps {
  children?: React.ReactNode;
}

/* ========== Constants ========== */

const SHORTCUTS: ShortcutItem[] = [
  {
    keys: ['Ctrl', 'Z'],
    label: 'برگشت',
    description: 'Undo',
  },
  {
    keys: ['Ctrl', 'Shift', 'Z'],
    label: 'دوباره',
    description: 'Redo',
  },
  {
    keys: ['Ctrl', 'Y'],
    label: 'دوباره',
    description: 'Redo',
  },
  {
    keys: ['Ctrl', 'S'],
    label: 'ذخیره فرم',
    description: 'Save form',
  },
  {
    keys: ['Delete'],
    label: 'حذف سؤال انتخاب شده',
    description: 'Delete selected question',
  },
  {
    keys: ['Escape'],
    label: 'لغو انتخاب',
    description: 'Deselect question',
  },
  {
    keys: ['Ctrl', 'Shift', 'S'],
    label: 'تنظیمات فرم',
    description: 'Form settings',
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

/* ========== Main Component ========== */

export default function KeyboardShortcutsDialog({ children }: KeyboardShortcutsDialogProps) {
  const [open, setOpen] = useState(false);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerContent}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[460px] p-0 gap-0 overflow-hidden"
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

        <div className="px-6 pt-5 pb-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50 divide-y divide-zinc-200 dark:divide-zinc-700/50 overflow-hidden">
            {SHORTCUTS.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition-colors duration-150"
              >
                {/* Description (right side in RTL) */}
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium">
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
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            <KeyBadge>/</KeyBadge>
            <span className="mr-2 ml-1">همچنین برای باز شدن این پنجره فشار دهید</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
