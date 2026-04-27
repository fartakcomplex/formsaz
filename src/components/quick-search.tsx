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
  ClipboardList,
  Clock,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppStore, type ViewType, type Form } from '@/lib/store';
import { templatesData } from '@/lib/templates-data';

// ─── Recent searches helpers ──────────────────────────────────────────
const RECENT_SEARCHES_KEY = 'porsline_recent_searches';
const MAX_RECENT_SEARCHES = 5;

function loadRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
  } catch { /* quota exceeded, silent */ }
}

function addToRecentSearches(query: string): void {
  if (!query.trim()) return;
  const trimmed = query.trim();
  const current = loadRecentSearches();
  const filtered = current.filter((s) => s !== trimmed);
  const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
  saveRecentSearches(updated);
}

function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch { /* silent */ }
}

// ─── Section dot colors ──────────────────────────────────────────────
const sectionDotColors: Record<string, string> = {
  'صفحات': 'bg-violet-500',
  'الگوها': 'bg-emerald-500',
  'فرم‌ها': 'bg-amber-500',
  'تنظیمات': 'bg-gray-400',
};

// ─── Section icon gradient backgrounds ───────────────────────────────
const sectionIconGradients: Record<string, string> = {
  'صفحات': 'bg-gradient-to-br from-violet-500 to-purple-600',
  'الگوها': 'bg-gradient-to-br from-emerald-500 to-teal-600',
  'فرم‌ها': 'bg-gradient-to-br from-amber-500 to-orange-600',
  'تنظیمات': 'bg-gradient-to-br from-gray-400 to-gray-600',
};

// ─── Category chips ──────────────────────────────────────────────────
const categoryChips = [
  { label: 'همه', section: null },
  { label: 'فرمها', section: 'فرم‌ها' },
  { label: 'الگوها', section: 'الگوها' },
  { label: 'تنظیمات', section: 'تنظیمات' },
  { label: 'صفحات', section: 'صفحات' },
];

// ─── Types ───────────────────────────────────────────────────────────
interface SearchResult {
  id: string;
  label: string;
  icon: React.ReactNode;
  section: string;
  action: () => void;
}

// ─── Stagger animation variants ──────────────────────────────────────
const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
};

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
          <mark key={i} className="search-highlight bg-transparent text-inherit font-semibold">
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
  const { quickSearchOpen, setQuickSearchOpen, setCurrentView, setCurrentForm, forms } = useAppStore();
  const { setTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === 'dark';

  // Load recent searches from localStorage on mount and when dialog opens
  useEffect(() => {
    if (quickSearchOpen) {
      setRecentSearches(loadRecentSearches());
      setActiveCategory(null);
    }
  }, [quickSearchOpen]);

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

    // Forms section - search from Zustand store
    if (q && forms.length > 0) {
      const matchedForms = forms.filter(
        (f) =>
          f.title.toLowerCase().includes(q) ||
          (f.description && f.description.toLowerCase().includes(q))
      ).slice(0, 10);
      matchedForms.forEach((f) => {
        results.push({
          id: `form-${f.id}`,
          label: f.title,
          icon: <ClipboardList className="size-4" />,
          section: 'فرم‌ها',
          action: () => {
            setCurrentForm(f);
            setCurrentView('dashboard');
            setQuickSearchOpen(false);
            addToRecentSearches(query.trim());
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
  }, [query, isDark, setCurrentView, setQuickSearchOpen, setTheme, setCurrentForm, forms]);

  const allResults = buildResults();

  // Group results by section and apply category filter
  const groupedResults: Record<string, SearchResult[]> = {};
  allResults.forEach((r) => {
    if (activeCategory && r.section !== activeCategory) return;
    if (!groupedResults[r.section]) groupedResults[r.section] = [];
    groupedResults[r.section].push(r);
  });

  // Flat filtered results for keyboard navigation
  const filteredResults = allResults.filter(
    (r) => !activeCategory || r.section === activeCategory
  );

  // Calculate total flat items count for keyboard navigation
  const showRecentSearches = !query.trim() && recentSearches.length > 0;

  // Reset active index when results or category change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, activeCategory]);

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
  const totalItems = showRecentSearches ? recentSearches.length + filteredResults.length : filteredResults.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % totalItems);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + totalItems) % totalItems);
        break;
      case 'Enter':
        e.preventDefault();
        handleSelectItem(activeIndex);
        break;
      case 'Escape':
        e.preventDefault();
        setQuickSearchOpen(false);
        break;
    }
  };

  // Handle selecting an item (by flat index)
  const handleSelectItem = (index: number) => {
    if (showRecentSearches) {
      if (index < recentSearches.length) {
        // A recent search was selected
        const recentQuery = recentSearches[index];
        setQuery(recentQuery);
        return;
      }
      // Adjust index to results
      const resultIndex = index - recentSearches.length;
      if (filteredResults[resultIndex]) {
        filteredResults[resultIndex].action();
      }
    } else {
      if (filteredResults[index]) {
        filteredResults[index].action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  // Handle recent search click
  const handleRecentSearchClick = (searchText: string) => {
    setQuery(searchText);
  };

  // Handle clear recent searches
  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  let flatIndex = -1;

  // When showing recent searches, offset for flat index
  const recentSearchOffset = showRecentSearches ? recentSearches.length : 0;

  // Rebuild grouped results for display
  const displayGroupedResults: Record<string, SearchResult[]> = {};
  filteredResults.forEach((r) => {
    if (!displayGroupedResults[r.section]) displayGroupedResults[r.section] = [];
    displayGroupedResults[r.section].push(r);
  });

  return (
    <Dialog open={quickSearchOpen} onOpenChange={setQuickSearchOpen}>
      <DialogContent
        className="sm:max-w-lg p-0 overflow-hidden rounded-2xl top-[20%] translate-y-0 gap-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/60 dark:border-gray-700/40 shadow-2xl"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">جستجوی سریع</DialogTitle>

        {/* Search input with gradient focus ring */}
        <div className="relative flex items-center gap-3 px-5 py-4 focus-within:ring-2 focus-within:ring-violet-500/50 rounded-t-2xl transition-all duration-200">
          {/* Animated search icon */}
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Search className="size-5 text-muted-foreground shrink-0" />
          </motion.div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="برای جستجو تایپ کنید..."
            className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground outline-none"
            dir="rtl"
          />
          <kbd className="hidden sm:flex items-center gap-1 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
            ESC
          </kbd>
        </div>

        {/* Category chips - horizontal scrollable */}
        <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto scrollbar-thin">
          {categoryChips.map((chip) => {
            const isActive = activeCategory === chip.section;
            return (
              <motion.button
                key={chip.label}
                onClick={() => setActiveCategory(chip.section)}
                className={`relative px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="category-indicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{chip.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Gradient divider below search + chips */}
        <div className="px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent dark:via-violet-500/30" />
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
          {/* Recent Searches */}
          <AnimatePresence>
            {showRecentSearches && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-1"
              >
                <div className="flex items-center justify-between px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-gray-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      جستجوهای اخیر
                    </span>
                  </div>
                  <button
                    onClick={handleClearRecentSearches}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="size-3" />
                    پاک کردن
                  </button>
                </div>
                {recentSearches.map((search, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <motion.button
                      key={`recent-${idx}`}
                      data-active={isActive}
                      initial="hidden"
                      animate="visible"
                      variants={listItemVariants}
                      whileHover={{ x: 2 }}
                      onClick={() => handleRecentSearchClick(search)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-right transition-all duration-200 ${
                        isActive
                          ? 'bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm'
                          : 'text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30'
                      }`}
                    >
                      <div
                        className={`flex size-8 items-center justify-center rounded-lg shrink-0 text-white ${
                          isActive
                            ? 'bg-gradient-to-br from-violet-400 to-purple-500'
                            : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                        }`}
                      >
                        <Clock className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="truncate block">{search}</span>
                      </div>
                      {isActive && (
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-1.5 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
                          Enter ↵
                        </kbd>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search results or empty state */}
          {filteredResults.length === 0 && query.trim() ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center py-10 px-4"
            >
              <div className="relative mb-4">
                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-violet-200/60 dark:from-violet-900/40 dark:to-violet-800/20">
                  <Search className="size-7 text-violet-400 dark:text-violet-500" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-200/40 to-transparent dark:from-violet-600/20 dark:to-transparent blur-xl" />
              </div>
              <p className="text-sm font-medium text-foreground/80 mb-1">
                نتیجه‌ای یافت نشد
              </p>
              <p className="text-xs text-muted-foreground/60">
                عبارت دیگری را امتحان کنید
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`${activeCategory}-${query}`}
              initial="hidden"
              animate="visible"
              variants={listVariants}
            >
              {Object.entries(displayGroupedResults).map(([section, items]) => (
                <div key={section} className="mb-1">
                  <div className="flex items-center gap-2 px-3 py-1.5">
                    <span className={`size-1.5 rounded-full ${sectionDotColors[section] || 'bg-gray-400'}`} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                      {section}
                    </span>
                    <div className="flex-1 h-px bg-gray-200/60 dark:bg-gray-700/40" />
                  </div>
                  {items.map((item) => {
                    flatIndex++;
                    const currentIndex = recentSearchOffset + flatIndex;
                    const isActive = currentIndex === activeIndex;
                    const gradientBg = sectionIconGradients[section] || 'bg-gradient-to-br from-gray-400 to-gray-600';
                    return (
                      <motion.button
                        key={item.id}
                        data-active={isActive}
                        variants={listItemVariants}
                        whileHover={{ x: 2 }}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(currentIndex)}
                        className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm text-right transition-all duration-200 ${
                          isActive
                            ? 'bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-sm'
                            : 'text-foreground hover:bg-violet-50 dark:hover:bg-violet-950/30'
                        }`}
                      >
                        {/* Gradient icon container */}
                        <div
                          className={`flex size-8 items-center justify-center rounded-lg shrink-0 text-white transition-all duration-200 ${
                            isActive
                              ? gradientBg
                              : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <SearchHighlight text={item.label} query={query} />
                        </div>
                        {/* Keyboard navigation hint (right side for RTL) */}
                        {isActive && (
                          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-1.5 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
                            Enter ↵
                          </kbd>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="flex items-center justify-between border-t border-gray-200/40 dark:border-gray-700/30 px-4 py-2.5 bg-gray-50/40 dark:bg-gray-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-1 py-0.5 font-mono backdrop-blur-sm">↑↓</kbd>
              برای ناوبری
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-1 py-0.5 font-mono backdrop-blur-sm">↵</kbd>
              برای انتخاب
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-1 py-0.5 font-mono backdrop-blur-sm">esc</kbd>
              برای بستن
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/40">
            <span className="hidden sm:flex items-center gap-0.5">
              <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100/80 dark:bg-gray-800/80 px-1 py-0.5 font-mono backdrop-blur-sm">
                <Command className="size-2.5" />K
              </kbd>
              جستجو
            </span>
            {filteredResults.length > 0 && (
              <span>{filteredResults.length} نتیجه</span>
            )}
          </div>
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
