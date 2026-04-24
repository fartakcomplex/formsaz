'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
  Search,
  LayoutDashboard,
  Wrench,
  FileText,
  BarChart2,
  Moon,
  Sun,
  Keyboard,
  Command,
  LayoutTemplate,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore, type ViewType } from '@/lib/store';
import { templatesData } from '@/lib/templates-data';

interface SearchResult {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
  action: () => void;
}

const pageItems: { label: string; icon: React.ReactNode; view: ViewType }[] = [
  { label: 'داشبورد', icon: <LayoutDashboard className="size-4" />, view: 'dashboard' },
  { label: 'فرم‌ساز', icon: <Wrench className="size-4" />, view: 'builder' },
  { label: 'الگوها', icon: <LayoutTemplate className="size-4" />, view: 'templates' },
  { label: 'نتایج', icon: <BarChart2 className="size-4" />, view: 'results' },
];

function SearchHighlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === query.toLowerCase() || regex.test(part);
        return isMatch ? (
          <mark key={i} className="search-highlight bg-transparent text-inherit">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

export default function QuickSearch() {
  const { quickSearchOpen, setQuickSearchOpen, setCurrentView } = useAppStore();
  const { setTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === 'dark';

  // Build all search results
  const buildResults = useCallback((): SearchResult[] => {
    const results: SearchResult[] = [];
    const q = query.trim().toLowerCase();

    // Pages section
    const pages = pageItems.filter((p) => !q || p.label.includes(q));
    pages.forEach((p) => {
      results.push({
        id: `page-${p.view}`,
        label: p.label,
        icon: p.icon,
        section: 'صفحات',
        action: () => {
          setCurrentView(p.view);
          setQuickSearchOpen(false);
        },
      });
    });

    // Templates section
    if (!q || q.length > 0) {
      const filteredTemplates = templatesData
        .filter((t) => !q || t.name.includes(q) || t.description.includes(q))
        .slice(0, 10);
      filteredTemplates.forEach((t) => {
        results.push({
          id: `template-${t.id}`,
          label: t.name,
          icon: <FileText className="size-4" />,
          section: 'الگوها',
          action: () => {
            setCurrentView('templates');
            setQuickSearchOpen(false);
          },
        });
      });
    }

    // Settings section
    if (!q || 'حالت تاریک'.includes(q) || 'حالت روشن'.includes(q) || 'تم'.includes(q)) {
      results.push({
        id: 'setting-theme',
        label: isDark ? 'حالت روشن' : 'حالت تاریک',
        icon: isDark ? <Sun className="size-4" /> : <Moon className="size-4" />,
        section: 'تنظیمات',
        action: () => {
          setTheme(isDark ? 'light' : 'dark');
          setQuickSearchOpen(false);
        },
      });
    }

    if (!q || 'میانبر'.includes(q) || 'کیبورد'.includes(q)) {
      results.push({
        id: 'setting-shortcuts',
        label: 'میانبرهای کیبورد',
        icon: <Keyboard className="size-4" />,
        section: 'تنظیمات',
        action: () => {
          setQuickSearchOpen(false);
        },
      });
    }

    return results;
  }, [query, isDark, setCurrentView, setQuickSearchOpen, setTheme]);

  const results = buildResults();

  // Group results by section
  const groupedResults: Record<string, SearchResult[]> = {};
  results.forEach((r) => {
    if (!groupedResults[r.section]) groupedResults[r.section] = [];
    groupedResults[r.section].push(r);
  });

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen(!quickSearchOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickSearchOpen, setQuickSearchOpen]);

  // Focus input when opened
  useEffect(() => {
    if (quickSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [quickSearchOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % results.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (results[activeIndex]) {
          results[activeIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setQuickSearchOpen(false);
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  let flatIndex = -1;
  const sectionLabels: Record<string, string> = {
    'صفحات': 'Pages',
    'الگوها': 'Templates',
    'تنظیمات': 'Settings',
  };

  return (
    <Dialog open={quickSearchOpen} onOpenChange={setQuickSearchOpen}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden rounded-2xl top-[20%] translate-y-0 gap-0 border border-violet-200/40 dark:border-violet-500/20"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">جستجوی سریع</DialogTitle>

        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-200/60 dark:border-gray-700/40 px-4 py-3">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="جستجو..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            dir="rtl"
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <Search className="size-8 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground text-center">
                نتیجه‌ای یافت نشد
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([section, items]) => (
              <div key={section} className="mb-1">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {section}
                  </span>
                  <div className="flex-1 h-px bg-gray-200/60 dark:bg-gray-700/40" />
                </div>
                {items.map((item) => {
                  flatIndex++;
                  const currentIndex = flatIndex;
                  const isActive = currentIndex === activeIndex;
                  return (
                    <motion.button
                      key={item.id}
                      data-active={isActive}
                      whileHover={{ x: 2 }}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-right transition-colors ${
                        isActive
                          ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                          : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800/50'
                      }`}
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg shrink-0 ${
                          isActive
                            ? 'bg-violet-200/60 dark:bg-violet-800/40'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <SearchHighlight text={item.label} query={query} />
                      </div>
                      {isActive && (
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          Enter ↵
                        </kbd>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200/60 dark:border-gray-700/40 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono">↑↓</kbd>
              انتخاب
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono">↵</kbd>
              باز کردن
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 font-mono">esc</kbd>
              بستن
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground/40">
            {results.length > 0 ? `${results.length} نتیجه` : ''}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Trigger button for the header */
export function QuickSearchTrigger() {
  const setQuickSearchOpen = useAppStore((s) => s.setQuickSearchOpen);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setQuickSearchOpen(true)}
      className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 text-xs text-muted-foreground hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
      title="جستجوی سریع (Ctrl+K)"
    >
      <Search className="size-3.5" />
      <span>جستجو...</span>
      <kbd className="mr-1 flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-mono">
        <Command className="size-2.5" />K
      </kbd>
    </motion.button>
  );
}
