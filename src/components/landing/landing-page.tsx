'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FileQuestion,
  Palette,
  GitBranch,
  BarChart3,
  Download,
  Smartphone,
  ClipboardList,
  MessageSquareHeart,
  Users,
  GraduationCap,
  CalendarDays,
  HeartPulse,
  ArrowLeft,
  ChevronDown,
  Star,
  Zap,
  Shield,
  Menu,
  X,
  MousePointerClick,
  Share2,
  TrendingUp,
  Check,
  Crown,
  Building2,
  Quote,
  Sparkles,
  CheckCircle2,
  CircleDot,
  Rocket,
  Send,
  ArrowUp,
} from 'lucide-react';

/* ──────────────────────────── animation helpers ──────────────────────────── */

function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/* ── Animated counter hook ── */
function useAnimatedCounter(end: number, duration: number = 2, isInView: boolean = false) {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = prefersReduced ? 0.01 : duration;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end, duration]);

  return display;
}

/* ── Floating particles component ── */
function FloatingParticles({ count = 20, className = '' }: { count?: number; className?: string }) {
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.3 + 0.1,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400/30 dark:bg-indigo-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() > 0.5 ? 15 : -15, 0],
            opacity: [p.opacity, p.opacity + 0.2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────── Navbar ──────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'ویژگی‌ها', href: '#features' },
    { label: 'محیط‌های کاربردی', href: '#use-cases' },
    { label: 'قیمت‌گذاری', href: '#pricing' },
  ];

  const handleNavClick = (href?: string) => {
    setMobileOpen(false);
    if (!href) return;
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/[0.04] border-b border-gray-100 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              فرم‌ساز
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50/60 dark:hover:bg-indigo-950/50"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-indigo-600"
              onClick={() => setCurrentView('dashboard')}
            >
              ورود
            </Button>
            <Button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              شروع رایگان
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button - hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              asChild
            >
              <SheetTrigger asChild>
                <button>
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </SheetTrigger>
            </Button>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] bg-white dark:bg-gray-900 border-l-gray-200 dark:border-l-gray-800 p-0">
              <SheetHeader className="px-6 pt-8 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
                    <ClipboardList className="h-5 w-5 text-white" />
                  </div>
                  <SheetTitle className="text-lg font-bold bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    فرم‌ساز
                  </SheetTitle>
                </div>
                <SheetDescription className="text-xs text-gray-500 dark:text-gray-400">
                  ساخت فرم آنلاین حرفه‌ای و هوشمند
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4">
                <nav className="space-y-1 mt-2">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(link.href);
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          {idx === 0 && <FileQuestion className="h-4 w-4" />}
                          {idx === 1 && <BarChart3 className="h-4 w-4" />}
                          {idx === 2 && <Sparkles className="h-4 w-4" />}
                        </div>
                        {link.label}
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <SheetFooter className="border-t border-gray-100 dark:border-gray-800 px-4 pb-6 pt-4 gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => { setMobileOpen(false); setCurrentView('dashboard'); }}
                >
                  ورود
                </Button>
                <Button
                  className="w-full justify-center bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25"
                  onClick={() => { setMobileOpen(false); setCurrentView('dashboard'); }}
                >
                  شروع رایگان
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}

/* ──────────────────────────── Hero Section ──────────────────────────── */

/* ── Animated stat counter ── */
function AnimatedStat({ value, suffix, label, delay = 0, isInView }: {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
  isInView: boolean;
}) {
  const count = useAnimatedCounter(value, 2.2, isInView);

  return (
    <motion.div
      className="text-center"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, delay: delay + 1.5, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
    >
      <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
        {isInView ? count.toLocaleString('fa-IR') : '۰'}{suffix}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

function HeroSection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-40px' });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-violet-50/50 to-white dark:from-indigo-950/50 dark:via-violet-950/30 dark:to-gray-950" />
      {/* Animated gradient mesh blobs */}
      <motion.div
        className="absolute top-[10%] right-[8%] w-80 h-80 bg-indigo-300/25 dark:bg-indigo-600/15 rounded-full blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[5%] w-96 h-96 bg-violet-300/25 dark:bg-violet-600/15 rounded-full blur-3xl"
        animate={{ x: [0, -25, 20, 0], y: [0, 15, -25, 0], scale: [1, 0.95, 1.1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute top-[40%] left-[40%] w-64 h-64 bg-fuchsia-200/20 dark:bg-fuchsia-600/10 rounded-full blur-3xl"
        animate={{ x: [0, 15, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/10 to-violet-200/10 rounded-full blur-3xl" />

      {/* Floating particles */}
      <FloatingParticles count={25} />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium bg-indigo-100/80 text-indigo-700 border-indigo-200/50 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 cursor-default"
          >
            <Zap className="h-3.5 w-3.5 ml-1" />
            سریع، رایگان و بدون محدودیت
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
        >
          <span className="text-gray-900 dark:text-white">فرم‌ساز آنلاین</span>
          <br />
          <span className="bg-gradient-to-l from-indigo-600 via-violet-500 to-fuchsia-500 dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
            حرفه‌ای و هوشمند
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          ساخت فرم، پرسشنامه و نظرسنجی آنلاین به صورت رایگان.
          <br className="hidden sm:block" />
          با بیش از ۲۰ نوع سوال و امکانات حرفه‌ای.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => setCurrentView('dashboard')}
            className="w-full sm:w-auto min-w-[200px] h-13 text-base font-semibold bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all rounded-xl px-8"
          >
            شروع رایگان
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto min-w-[200px] h-13 text-base font-semibold rounded-xl px-8 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all"
            onClick={() => setCurrentView('dashboard')}
          >
            مشاهده نمونه‌ها
            <ChevronDown className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Animated Stats with counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          ref={statsRef}
          className="mt-16 mx-auto max-w-3xl"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            <AnimatedStat value={100000} suffix={"+"} label={"فرم ساخته شده"} delay={0} isInView={statsInView} />
            <AnimatedStat value={50000} suffix={"+"} label={"کاربر فعال"} delay={0.15} isInView={statsInView} />
            <AnimatedStat value={2000000} suffix={"+"} label={"پاسخ ثبت شده"} delay={0.3} isInView={statsInView} />
          </div>
        </motion.div>

        {/* 3D-style floating form mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 8 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="mt-16 relative"
          style={{ perspective: '1200px' }}
        >
          <div className="relative mx-auto max-w-4xl">
            {/* Animated glow behind */}
            <motion.div
              className="absolute -inset-8 bg-gradient-to-r from-indigo-500/25 via-violet-500/30 to-purple-500/25 rounded-3xl blur-3xl"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Subtle reflection below mockup */}
            <div className="absolute -bottom-12 left-[5%] right-[5%] h-20 bg-gradient-to-b from-gray-300/20 via-gray-300/5 to-transparent rounded-full blur-2xl dark:from-gray-600/10" />
            {/* Main browser mockup with 3D tilt */}
            <motion.div
              className="relative rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-2xl shadow-indigo-500/15 dark:shadow-indigo-950/40 overflow-hidden"
              whileHover={{ rotateY: -2, rotateX: 1, y: -4 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded-lg max-w-sm mx-auto flex items-center justify-center text-[10px] text-gray-400 dark:text-gray-500">
                    formsaz.ir/builder
                  </div>
                </div>
              </div>

              {/* Split view: builder sidebar + form preview */}
              <div className="flex min-h-[280px] sm:min-h-[320px]">
                {/* Left sidebar - question types */}
                <div className="hidden sm:flex w-52 shrink-0 flex-col border-l border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 p-3 gap-1.5">
                  <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-1 px-2">انواع سوال</div>
                  {[['متن کوتاه', 'T'], ['چند گزینه‌ای', '◎'], ['مقیاس', '☆'], ['تاریخ', '📅'], ['آپلود', '📎']].map(([name, icon], idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + idx * 0.1 }}
                      className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-gray-500 dark:text-gray-400 transition-colors ${idx === 1 ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium' : ''}`}
                    >
                      <span className="text-sm">{icon}</span>
                      {name}
                    </motion.div>
                  ))}
                </div>

                {/* Form preview content */}
                <div className="flex-1 p-5 sm:p-8 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950">
                  <div className="max-w-md mx-auto space-y-5">
                    {/* Form header */}
                    <div className="text-center space-y-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="h-5 bg-gradient-to-l from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded w-48 mx-auto"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-64 mx-auto"
                      />
                    </div>

                    {/* Form field: text input */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="space-y-2"
                    >
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-600 rounded w-24" />
                      <div className="h-10 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200/80 dark:border-gray-700 flex items-center px-3">
                        <span className="text-[11px] text-gray-300 dark:text-gray-600">نام و نام خانوادگی...</span>
                      </div>
                    </motion.div>

                    {/* Form field: radio buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.1 }}
                      className="space-y-2"
                    >
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-600 rounded w-28" />
                      <div className="flex flex-col gap-1.5">
                        {['گزینه اول', 'گزینه دوم', 'گزینه سوم'].map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 ${idx === 0 ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                              {idx === 0 && <div className="w-1.5 h-1.5 rounded-full bg-white mx-auto mt-[1px]" />}
                            </div>
                            <span className={`text-xs ${idx === 0 ? 'text-gray-700 dark:text-gray-300 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Form field: rating stars */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="space-y-2"
                    >
                      <div className="h-3.5 bg-gray-200 dark:bg-gray-600 rounded w-32" />
                      <div className="flex gap-1.5" dir="ltr">
                        {[1,2,3,4,5].map((s) => (
                          <motion.div
                            key={s}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.4 + s * 0.08 }}
                          >
                            <Star className={`h-5 w-5 ${s <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-600'}`} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Submit button */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.6, type: 'spring' }}
                      className="pt-1"
                    >
                      <div className="h-11 bg-gradient-to-l from-indigo-500 to-violet-500 rounded-xl w-36 mx-auto shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">ثبت پاسخ</span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Trusted By Section ──────────────────────────── */

const logos = ["دیجی‌کالا", "اسنپ", "ایران‌ایر", "بانک ملت", "دانشگاه تهران", "شهرداری", "صنایع پتروشیمی", "تپسی", "بلیط‌چی", "فینوتک"];

function TrustedBySection() {
  const trustedRef = useRef<HTMLDivElement>(null);
  const trustedInView = useInView(trustedRef, { once: true, margin: '-60px' });

  return (
    <motion.section
      ref={trustedRef}
      initial={{ opacity: 0, y: 20 }}
      animate={trustedInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="py-16 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 mb-8 text-center">
        <h2 className="text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-2">
          مورد اعتماد هزاران سازمان
        </h2>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          از استارتاپ‌ها تا سازمان‌های بزرگ
        </p>
      </div>
      <div className="relative">
        <div className="flex animate-marquee gap-8 whitespace-nowrap">
          {[...logos, ...logos].map((logo, i) => (
            <div key={i} className="flex-shrink-0 px-6 py-3 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-sm">
              <span className="text-lg font-medium text-zinc-600 dark:text-zinc-300">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ──────────────────────────── Features Section ──────────────────────────── */

function FeaturesSection() {
  const features = [
    {
      icon: FileQuestion,
      title: 'بیش از ۲۰ نوع سوال',
      description:
        'از متن ساده تا مقیاس امتیازدهی، ماتریسی، آپلود فایل و شبکه. هر نوع سوالی که نیاز داشته باشید.',
      gradient: 'from-blue-500 to-indigo-500',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      icon: Palette,
      title: 'طراحی گرافیکی فرم',
      description:
        'فرم خود را با رنگ‌ها، فونت‌ها و تم‌های متنوع سفارشی کنید و برند خود را منعکس نمایید.',
      gradient: 'from-pink-500 to-rose-500',
      shadowColor: 'shadow-pink-500/20',
    },
    {
      icon: GitBranch,
      title: 'منطق شرطی و امتیازدهی',
      description:
        'با منطق شرطی هوشمند، مسیر پاسخ‌دهی را شخصی‌سازی و با امتیازدهی نتایج را ارزیابی کنید.',
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'shadow-amber-500/20',
    },
    {
      icon: BarChart3,
      title: 'نمودار و تحلیل آماری',
      description:
        'نتایج را با نمودارهای متنوع و گزارش‌های تحلیلی به صورت لحظه‌ای مشاهده و تحلیل کنید.',
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      icon: Download,
      title: 'خروجی اکسل و CSV',
      description:
        'تمامی پاسخ‌ها را به صورت فایل اکسل یا CSV دانلود کنید و در ابزارهای دیگر استفاده نمایید.',
      gradient: 'from-violet-500 to-purple-500',
      shadowColor: 'shadow-violet-500/20',
    },
    {
      icon: Smartphone,
      title: 'کاملاً واکنش‌گرا',
      description:
        'فرم‌ها در تمام دستگاه‌ها از موبایل تا دسکتاپ به بهترین شکل نمایش داده می‌شوند.',
      gradient: 'from-cyan-500 to-sky-500',
      shadowColor: 'shadow-cyan-500/20',
    },
  ];

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-white dark:bg-gray-950">
      {/* Dot grid background pattern */}
      <div className="absolute inset-0 opacity-[0.025]" style={{
        backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-indigo-100/80 text-indigo-700 border-indigo-200/50"
          >
            ویژگی‌ها
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            همه‌چیز برای ساخت فرم‌های حرفه‌ای
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 leading-relaxed">
            با ابزارهای قدرتمند و رابط کاربری ساده، فرم‌هایی بسازید که نرخ مشارکت بالایی دارند.
          </p>
        </FadeInSection>

        {/* Feature Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div key={i} variants={staggerChild}>
              <Card className="group relative h-full border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-default overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                {/* Animated gradient top border (2px) */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-l ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                {/* Animated gradient border on hover */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} p-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className="w-full h-full rounded-[10px] bg-white dark:bg-gray-900" />
                </div>

                {/* Spotlight glow effect on hover */}
                <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.08] blur-xl transition-opacity duration-500`} />

                <CardContent className="p-6 relative z-10">
                  {/* Animated icon container */}
                  <div
                    className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadowColor} mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <feature.icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ──────────────────────────── Use Cases Section ──────────────────────────── */

function UseCasesSection() {
  const useCases = [
    {
      icon: BarChart3,
      title: 'تحقیقات بازار',
      description: 'شناخت بهتر مشتریان و بازار هدف با پرسشنامه‌های تخصصی',
      color: 'from-blue-50 to-indigo-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: MessageSquareHeart,
      title: 'رضایت مشتری',
      description: 'سنجش رضایت و بهبود تجربه مشتریان با فرم‌های NPS و CSAT',
      color: 'from-pink-50 to-rose-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
    {
      icon: Users,
      title: 'منابع انسانی',
      description: 'ارزیابی عملکرد، نظرسنجی کارکنان و فرم‌های استخدام',
      color: 'from-amber-50 to-orange-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: GraduationCap,
      title: 'آموزش و دانشگاه',
      description: 'آزمون‌های آنلاین، فرم‌های ثبت‌نام و ارزیابی دانشجویان',
      color: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: CalendarDays,
      title: 'رویدادها',
      description: 'فرم ثبت‌نام رویداد، نظرسنجی حضار و مدیریت شرکت‌کنندگان',
      color: 'from-violet-50 to-purple-50',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
    },
    {
      icon: HeartPulse,
      title: 'سلامت و درمان',
      description: 'فرم‌های ویزیت آنلاین، پرسشنامه‌های پزشکی و پیگیری بیماران',
      color: 'from-cyan-50 to-sky-50',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
    },
  ];

  return (
    <section id="use-cases" className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-violet-100/80 text-violet-700 border-violet-200/50"
          >
            محیط‌های کاربردی
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            مناسب برای هر صنعت و نیازی
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 leading-relaxed">
            از استارتاپ تا سازمان بزرگ، فرم‌ساز ابزار مناسبی برای همه کاربردهاست.
          </p>
        </FadeInSection>

        {/* Use Case Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div key={i} variants={staggerChild}>
              <Card className="group relative h-full border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/[0.06] transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden">
                {/* Colored top stripe */}
                <div className={`h-1.5 w-full bg-gradient-to-l ${useCase.color}`} />
                <CardContent className="p-6">
                  <div
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${useCase.iconBg} mb-4`}
                  >
                    <useCase.icon className={`h-5 w-5 ${useCase.iconColor}`} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{useCase.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{useCase.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ──────────────────────────── How It Works Section ──────────────────────────── */

function HowItWorksSection() {
  const steps = [
    {
      number: '۱',
      icon: MousePointerClick,
      title: 'فرم خود را بسازید',
      description:
        'با رابط کاربری کشیدن و رها کردن، فرم دلخواه خود را در کمتر از ۵ دقیقه بسازید.',
      gradient: 'from-indigo-500 to-violet-500',
      shadowColor: 'shadow-indigo-500/25 dark:shadow-indigo-500/15',
      ringColor: 'ring-indigo-200/60 dark:ring-indigo-500/20',
    },
    {
      number: '۲',
      icon: Share2,
      title: 'با مخاطبان به اشتراک بگذارید',
      description:
        'لینک فرم را از طریق ایمیل، شبکه‌های اجتماعی یا کد QR با مخاطبان به اشتراک بگذارید.',
      gradient: 'from-violet-500 to-purple-500',
      shadowColor: 'shadow-violet-500/25 dark:shadow-violet-500/15',
      ringColor: 'ring-violet-200/60 dark:ring-violet-500/20',
    },
    {
      number: '۳',
      icon: TrendingUp,
      title: 'نتایج را تحلیل کنید',
      description:
        'با داشبورد تحلیلی قدرتمند، نتایج را به صورت لحظه‌ای بررسی و گزارش بگیرید.',
      gradient: 'from-purple-500 to-fuchsia-500',
      shadowColor: 'shadow-purple-500/25 dark:shadow-purple-500/15',
      ringColor: 'ring-purple-200/60 dark:ring-purple-500/20',
    },
  ];

  const stepsRef = React.useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '-60px' });

  return (
    <section className="relative py-24 sm:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-emerald-100/80 text-emerald-700 border-emerald-200/50"
          >
            راهنمای شروع
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            چگونه کار می‌کند؟
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            تنها در سه مرحله ساده فرم خود را بسازید و نتایج را دریافت کنید.
          </p>
        </FadeInSection>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Dotted connector lines (desktop only) */}
            <div className="hidden md:block absolute top-[48px] right-[20%] left-[20%] z-0">
              <div className="relative h-0 steps-connector" />
            </div>

            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: i * 0.2, ease: 'easeOut' }}
                  className="relative z-10"
                >
                  <div className="text-center">
                    {/* Step number gradient circle + icon */}
                    <div className="relative mx-auto mb-8">
                      {/* Outer glow ring */}
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={stepsInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.2 + 0.2, ease: 'easeOut' }}
                        className={`absolute inset-[-8px] rounded-full bg-gradient-to-br ${step.gradient} opacity-20 blur-xl`}
                      />
                      {/* Main circle with gradient */}
                      <motion.div
                        whileHover={{ y: -6, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`relative inline-flex size-[88px] items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-xl ${step.shadowColor} ring-4 ring-white dark:ring-gray-950 ${step.ringColor}`}
                      >
                        {/* Large gradient number */}
                        <motion.span
                          initial={{ scale: 0, rotate: -90 }}
                          animate={stepsInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -90 }}
                          transition={{ duration: 0.5, delay: i * 0.2 + 0.1, type: 'spring', stiffness: 200 }}
                          className="absolute inset-0 flex items-center justify-center text-3xl font-black text-white/20 select-none"
                        >
                          {step.number}
                        </motion.span>
                        {/* Icon */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={stepsInView ? { scale: 1 } : { scale: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.2 + 0.25, type: 'spring', stiffness: 300 }}
                          className="relative flex size-12 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm"
                        >
                          <step.icon className="h-6 w-6 text-white" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: i * 0.2 + 0.3 }}
                      className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3"
                    >
                      {step.title}
                    </motion.h3>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: i * 0.2 + 0.4 }}
                      className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto"
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </motion.div>
                {/* Mobile-only dot divider between steps */}
                {i < steps.length - 1 && (
                  <div className="dot-divider md:hidden py-2">
                    <div className="dot-divider-dot" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Testimonials Section ──────────────────────────── */

function TestimonialsSection() {
  const testimonials = [
    {
      name: 'سارا محمدی',
      role: 'مدیر بازاریابی',
      company: 'شرکت نوآوران',
      quote: 'با فرم‌ساز، نظرسنجی‌های ما ۳ برابر بیشتر پاسخ دریافت می‌کنند. رابط کاربری فوق‌العاده ساده و نتایج خیلی سریع آماده می‌شود.',
      rating: 5,
      initials: 'سم',
      color: 'bg-gradient-to-br from-rose-400 to-pink-500',
    },
    {
      name: 'علی رضایی',
      role: 'مدیر منابع انسانی',
      company: 'گروه صنعتی پارس',
      quote: 'ارزیابی عملکرد سالانه کارکنان با این ابزار بسیار ساده‌تر شد. گزارش‌های تحلیلی دقیقی به ما میده و زمانمان خیلی کمتر شده.',
      rating: 5,
      initials: 'عر',
      color: 'bg-gradient-to-br from-indigo-400 to-violet-500',
    },
    {
      name: 'مریم احمدی',
      role: 'استاد دانشگاه',
      company: 'دانشگاه تهران',
      quote: 'آزمون‌های آنلاین دانشجویان را به راحتی مدیریت می‌کنم. امکان امتیازدهی خودکار و خروجی اکسل واقعاً کار ما را راحت کرده.',
      rating: 5,
      initials: 'ما',
      color: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    },
    {
      name: 'رضا کریمی',
      role: 'صاحب فروشگاه آنلاین',
      company: 'دیجی‌مارکت',
      quote: 'فرم ثبت سفارش و پیگیری مشتریان ما حرفه‌ای‌تر شد. مشتریان هم از تجربه کاربری جدید خیلی راضی‌اند.',
      rating: 4,
      initials: 'رک',
      color: 'bg-gradient-to-br from-amber-400 to-orange-500',
    },
    {
      name: 'نازنین حسینی',
      role: 'مدیر رویداد',
      company: 'آژانس رویداد ستاره',
      quote: 'ثبت‌نام در رویدادها و نظرسنجی حضار خیلی راحت شده. بیش از ۵۰۰ شرکت‌کننده تونستیم بدون مشکل مدیریت کنیم.',
      rating: 5,
      initials: 'نح',
      color: 'bg-gradient-to-br from-cyan-400 to-sky-500',
    },
    {
      name: 'محمد جعفری',
      role: 'پژوهشگر',
      company: 'موسسه تحقیقاتی آینده',
      quote: 'برای تحقیقات بازار ابزار فوق‌العاده‌ای است. نمودارها و تحلیل‌های آماری به من کمک می‌کنه سریع‌تر به نتیجه برسم.',
      rating: 5,
      initials: 'مج',
      color: 'bg-gradient-to-br from-violet-400 to-purple-500',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-[5%] w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-[5%] w-80 h-80 bg-violet-100/40 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-rose-100/80 text-rose-700 border-rose-200/50"
          >
            <Quote className="h-3 w-3 ml-1" />
            نظرات کاربران
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            کاربران ما چه می‌گویند؟
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 leading-relaxed">
            بیش از ۵۰,۰۰۰ کاربر حرفه‌ای به ما اعتماد کرده‌اند. نظرات واقعی آن‌ها را بخوانید.
          </p>
        </FadeInSection>

        {/* Testimonials Grid — horizontal scroll on mobile, grid on desktop */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none"
          staggerDelay={0.08}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              className="snap-start min-w-[300px] md:min-w-0"
            >
              <Card className="group relative h-full border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl hover:shadow-indigo-500/[0.06] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-200 via-violet-200 to-purple-200 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-full h-full rounded-[11px] bg-white dark:bg-gray-900" />
                </div>
                <CardContent className="p-6 relative z-10">
                  {/* Quote icon */}
                  <div className="mb-4">
                    <Quote className="h-8 w-8 text-indigo-200 dark:text-indigo-800" />
                  </div>

                  {/* Star rating with amber gradient */}
                  <div className="flex gap-0.5 mb-4" dir="ltr">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`h-4 w-4 transition-all duration-200 ${
                          starIdx < testimonial.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-200 dark:text-gray-700'
                        }`}
                        style={starIdx < testimonial.rating ? {
                          filter: 'drop-shadow(0 0 2px rgba(251, 191, 36, 0.4))'
                        } : undefined}
                      />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    {/* Avatar */}
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-white text-sm font-bold shrink-0 shadow-lg ${testimonial.color}`}
                    >
                      {testimonial.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {testimonial.role} · {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Subtle scroll indicator for mobile */}
        <FadeInSection delay={0.5} className="md:hidden flex justify-center mt-6">
          <motion.div
            animate={{ x: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 text-gray-400 text-xs"
          >
            <span>اسکرول کنید</span>
            <ChevronDown className="size-4" />
          </motion.div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── FAQ Section ──────────────────────────── */

function FAQSection() {
  const faqs = [
    {
      question: 'آیا استفاده از فرم‌ساز رایگان است؟',
      answer:
        'بله! شما می‌توانید به صورت کاملاً رایگان فرم بسازید، مدیریت کنید و نتایج را تحلیل نمایید. پلن رایگان شامل تمام امکانات اصلی است. برای امکانات پیشرفته‌تر، پلن‌های حرفه‌ای نیز موجود است.',
    },
    {
      question: 'چه نوع سوالاتی پشتیبانی می‌شود؟',
      answer:
        'فرم‌ساز بیش از ۲۰ نوع سوال شامل متن کوتاه و بلند، چند گزینه‌ای، چک‌باکس، مقیاس امتیازدهی، ماتریسی، دراپ‌داون، آپلود فایل، تاریخ و زمان، شبکه و منوی کشویی را پشتیبانی می‌کند.',
    },
    {
      question: 'آیا می‌توانم فرم را به زبان فارسی بسازم؟',
      answer:
        'بله! فرم‌ساز به صورت کامل از زبان فارسی و راست‌چین (RTL) پشتیبانی می‌کند. تمام عناصر فرم شامل برچسب‌ها، دکمه‌ها و پیام‌ها به صورت خودکار راست‌چین نمایش داده می‌شوند.',
    },
    {
      question: 'محدودیت تعداد پاسخ‌ها چقدر است؟',
      answer:
        'در پلن رایگان، هر فرم می‌تواند تا ۱۰۰ پاسخ دریافت کند. در پلن‌های حرفه‌ای این محدودیت به ۱۰,۰۰۰ و نامحدود افزایش می‌یابد. همچنین می‌توانید در هر لحظه پاسخ‌ها را به صورت اکسل دانلود کنید.',
    },
    {
      question: 'آیا امکان منطق شرطی در فرم وجود دارد؟',
      answer:
        'بله! با استفاده از منطق شرطی می‌توانید بر اساس پاسخ کاربر، سوالات خاصی را نمایش یا مخفی کنید، کاربر را به صفحه دیگری هدایت کنید یا فرم را به پایان برسانید.',
    },
    {
      question: 'اطلاعات کاربران چگونه محافظت می‌شود؟',
      answer:
        'ما امنیت داده‌ها را جدی می‌گیریم. تمام ارتباطات با رمزنگاری SSL محافظت می‌شوند، داده‌ها بر روی سرورهای امن ذخیره می‌گردند و ما در قبال حریم خصوصی شما متعهد هستیم.',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 to-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-12 sm:mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100/80 text-amber-700 border-amber-200/50"
          >
            سوالات متداول
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            پاسخ سوالات شما
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            اگر سوالی دارید، احتمالاً پاسخ آن را اینجا پیدا خواهید کرد.
          </p>
        </FadeInSection>

        {/* FAQ Accordion */}
        <FadeInSection delay={0.2}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all data-[state=open]:shadow-lg data-[state=open]:shadow-indigo-500/[0.05] data-[state=open]:border-indigo-100 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-right text-base font-semibold text-gray-900 hover:no-underline hover:text-indigo-600 transition-colors [&[data-state=open]>svg]:text-indigo-600 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── Integrations Section ───────────────────────── */

function IntegrationsSection() {
  const integrations = [
    {
      name: 'Google Sheets',
      description: 'ارسال خودکار پاسخ‌ها به گوگل شیت',
      color: 'from-emerald-400 to-green-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      icon: (
        <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
    },
    {
      name: 'Slack',
      description: 'دریافت نوتیفیکیشن در کانال‌های اسلک',
      color: 'from-violet-500 to-purple-700',
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
      icon: (
        <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.163 0a2.528 2.528 0 012.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.163 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.315A2.528 2.528 0 0124 15.163a2.528 2.528 0 01-2.522 2.523h-6.315z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      description: 'ارسال پاسخ‌ها به ربات تلگرام',
      color: 'from-sky-400 to-blue-600',
      bgColor: 'bg-sky-50 dark:bg-sky-950/30',
      icon: (
        <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: 'ایمیل',
      description: 'ارسال خودکار ایمیل پس از هر پاسخ',
      color: 'from-rose-400 to-red-600',
      bgColor: 'bg-rose-50 dark:bg-rose-950/30',
      icon: <Send className="size-5 text-white" />,
    },
    {
      name: 'Zapier',
      description: 'اتصال به بیش از ۵۰۰۰ اپلیکیشن',
      color: 'from-orange-400 to-amber-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      icon: <Zap className="size-5 text-white" />,
    },
    {
      name: 'تحلیل داده',
      description: 'گزارش‌های تحلیلی پیشرفته',
      color: 'from-cyan-400 to-teal-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
      icon: <BarChart3 className="size-5 text-white" />,
    },
    {
      name: 'CRM',
      description: 'همگام‌سازی با سیستم‌های مدیریت مشتری',
      color: 'from-pink-400 to-fuchsia-600',
      bgColor: 'bg-pink-50 dark:bg-pink-950/30',
      icon: <Users className="size-5 text-white" />,
    },
    {
      name: 'وب‌هوک',
      description: 'دریافت داده‌ها با API سفارشی',
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gray-50 dark:bg-gray-900/50',
      icon: <Share2 className="size-5 text-white" />,
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
              <Sparkles className="size-3 ml-1.5" />
              یکپارچه‌سازی
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              اتصال به{' '}
              <span className="bg-gradient-to-l from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                ابزارهای مورد علاقه
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              فرمساز با بیش از ۵۰۰۰ ابزار و سرویس محبوب یکپارچه می‌شود
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-lg hover:shadow-violet-100/50 dark:hover:shadow-violet-900/20 transition-all duration-300 cursor-pointer"
            >
              {/* Colored icon circle */}
              <div className={`flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${integration.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {integration.icon}
              </div>
              {/* Name */}
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">
                {integration.name}
              </h3>
              {/* Description */}
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {integration.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────── Pricing Section ──────────────────────────── */

function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  const plans = [
    {
      name: 'رایگان',
      icon: CircleDot,
      priceMonthly: 'رایگان همیشگی',
      priceYearly: 'رایگان همیشگی',
      description: 'مناسب برای شروع و استفاده شخصی',
      features: [
        { text: 'تا ۵ فرم فعال', included: true },
        { text: '۱۰۰ پاسخ در هر فرم', included: true },
        { text: 'تم‌های پایه', included: true },
        { text: 'خروجی CSV', included: true },
        { text: 'آمار اولیه', included: true },
        { text: 'منطق شرطی', included: false },
        { text: 'خروجی اکسل', included: false },
        { text: 'پشتیبانی اولویت‌دار', included: false },
      ],
      buttonLabel: 'شروع رایگان',
      buttonVariant: 'outline' as const,
      highlight: false,
    },
    {
      name: 'حرفه‌ای',
      icon: Crown,
      priceMonthly: '۴۹,۰۰۰ تومان / ماه',
      priceYearly: '۳۹,۰۰۰ تومان / ماه',
      description: 'مناسب برای کسب‌وکارهای در حال رشد',
      features: [
        { text: 'فرم نامحدود', included: true },
        { text: '۱۰,۰۰۰ پاسخ در هر فرم', included: true },
        { text: 'تم‌های سفارشی', included: true },
        { text: 'خروجی CSV و اکسل', included: true },
        { text: 'آمار پیشرفته', included: true },
        { text: 'منطق شرطی و شاخه‌ای', included: true },
        { text: 'پشتیبانی اولویت‌دار', included: true },
        { text: 'دامنه سفارشی', included: false },
      ],
      buttonLabel: 'شروع دوره آزمایشی',
      buttonVariant: 'default' as const,
      highlight: true,
      badge: 'محبوب‌ترین',
    },
    {
      name: 'سازمانی',
      icon: Building2,
      priceMonthly: 'تماس بگیرید',
      priceYearly: 'تماس بگیرید',
      description: 'مناسب برای سازمان‌ها و تیم‌های بزرگ',
      features: [
        { text: 'همه امکانات حرفه‌ای', included: true },
        { text: 'پاسخ نامحدود', included: true },
        { text: 'همکاری تیمی', included: true },
        { text: 'دامنه سفارشی', included: true },
        { text: 'دسترسی API', included: true },
        { text: 'ورود یکپارچه (SSO)', included: true },
        { text: 'پشتیبانی اختصاصی', included: true },
        { text: 'SLA تضمین‌شده', included: true },
      ],
      buttonLabel: 'تماس با فروش',
      buttonVariant: 'outline' as const,
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Particle/dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-12 sm:mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-indigo-100/80 text-indigo-700 border-indigo-200/50"
          >
            <Sparkles className="h-3 w-3 ml-1" />
            قیمت‌گذاری
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            پلن مناسب خود را انتخاب کنید
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 leading-relaxed">
            بدون هزینه پنهان. هر زمان که بخواهید ارتقا یا لغو کنید.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-1.5">
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                !isYearly
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              ماهانه
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-indigo-600"
            />
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                isYearly
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              سالانه
              <Badge className="mr-1.5 px-1.5 py-0 text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200/50">
                ۲۰٪ تخفیف
              </Badge>
            </span>
          </div>
        </FadeInSection>

        {/* Pricing Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={i} variants={staggerChild} className="relative">
              {/* Popular badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="px-4 py-1 text-xs font-semibold bg-gradient-to-l from-indigo-600 to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/25">
                    <Rocket className="h-3 w-3 ml-1" />
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <Card
                className={`group relative h-full transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
                  plan.highlight
                    ? 'border-indigo-200 dark:border-indigo-800 shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:shadow-indigo-500/20 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-900 dark:via-indigo-950/20 dark:to-gray-900'
                    : 'border-gray-200 dark:border-gray-800 hover:border-indigo-100 dark:hover:border-indigo-800 hover:shadow-xl hover:shadow-indigo-500/[0.06] bg-white dark:bg-gray-900'
                }`}
              >
                {/* Gradient border glow on hover for highlighted card */}
                {plan.highlight && (
                  <div className="absolute -inset-px rounded-xl bg-gradient-to-b from-indigo-500/20 via-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}

                {/* Shimmer/shine animation for recommended plan */}
                {plan.highlight && (
                  <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                    <motion.div
                      className="absolute inset-0 -translate-x-full"
                      animate={{ translateX: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
                    >
                      <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    </motion.div>
                  </div>
                )}

                <CardContent className="p-6 lg:p-8 flex flex-col h-full">
                  {/* Plan icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        plan.highlight
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      <plan.icon
                        className={`h-5 w-5 ${
                          plan.highlight ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                        }`}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {isYearly ? plan.priceYearly : plan.priceMonthly}
                    </div>
                    {isYearly && plan.name !== 'رایگان' && plan.name !== 'سازمانی' && (
                      <div className="mt-1 text-xs text-emerald-600 font-medium">
                        صرفه‌جویی سالانه ≈ ۱۲۰,۰۰۰ تومان
                      </div>
                    )}
                  </div>

                  <Separator className="mb-6" />

                  {/* Features list */}
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        {feature.included ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <CircleDot className="h-4 w-4 text-gray-300 dark:text-gray-600 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-600 line-through'
                          }`}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    variant={plan.buttonVariant}
                    onClick={() => setCurrentView('dashboard')}
                    className={`w-full rounded-xl font-semibold transition-all ${
                      plan.highlight
                        ? 'bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
                        : plan.name === 'سازمانی'
                        ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    {plan.buttonLabel}
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Bottom note */}
        <FadeInSection delay={0.4} className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            تمام پلن‌ها شامل رمزنگاری SSL، پشتیبانی فارسی و آپتایم ۹۹.۹٪ هستند.
          </p>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── CTA Section ──────────────────────────── */

function CTASection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated shifting gradient background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 50%', '50% 100%', '100% 50%', '50% 0%', '0% 50%'],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundSize: '400% 400%',
          backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed, #9333ea, #6366f1, #4f46e5)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />

      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-[15%] right-[8%] w-16 h-16 border-2 border-white/20 rounded-xl"
        animate={{ y: [0, -25, 0], rotate: [0, 45, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[10%] w-12 h-12 border-2 border-white/15 rounded-full"
        animate={{ y: [0, 20, 0], x: [0, 10, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute top-[30%] left-[20%] w-8 h-8 bg-white/10 rounded-lg"
        animate={{ y: [0, -15, 0], rotate: [0, 90, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[35%] right-[18%] w-6 h-6 bg-white/10 rounded-full"
        animate={{ y: [0, -20, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute top-[60%] left-[35%] w-10 h-10 border border-white/10 rotate-45"
        animate={{ y: [0, 15, 0], rotate: [45, 135, 45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      <motion.div
        className="absolute top-[10%] left-[45%] w-5 h-5 bg-yellow-300/30 rounded-full"
        animate={{ y: [0, -12, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[35%] w-4 h-4 bg-pink-300/25 rotate-12"
        animate={{ y: [0, 18, 0], rotate: [12, 72, 12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Additional varied shapes */}
      <motion.div
        className="absolute top-[45%] right-[5%] w-14 h-14 border-2 border-white/10 rounded-full"
        animate={{ y: [0, -18, 0], x: [0, 12, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      />
      <motion.div
        className="absolute bottom-[40%] left-[25%] w-7 h-7 bg-cyan-300/20 rounded-lg"
        animate={{ y: [0, -22, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
      />
      <motion.div
        className="absolute top-[20%] right-[30%] w-3 h-3 bg-amber-300/20 rotate-45"
        animate={{ y: [0, 10, 0], opacity: [0.2, 0.5, 0.2], rotate: [45, 135, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      {/* Animated glow orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-400/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeInSection>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-medium mb-8 backdrop-blur-sm shadow-lg shadow-black/5"
          >
            <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
            عضو بیش از ۵۰,۰۰۰ کاربر خوشحال شوید
          </motion.div>

          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight"
          >
            همین حالا شروع کنید!
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 mx-auto max-w-xl text-lg text-indigo-100 leading-relaxed"
          >
            ثبت‌نام در کمتر از ۳۰ ثانیه. بدون نیاز به کارت بانکی.
            <br />
            اولین فرم خود را همین امروز بسازید.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* CTA button with pulse animation */}
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Pulse ring behind button */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                animate={{ scale: [1, 1.15], opacity: [0.3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <Button
                size="lg"
                onClick={() => setCurrentView('dashboard')}
                className="relative w-full sm:w-auto min-w-[220px] h-14 text-base font-bold bg-white text-indigo-600 hover:bg-indigo-50 shadow-2xl shadow-black/15 hover:shadow-black/25 hover:-translate-y-1 transition-all rounded-xl px-10 group"
              >
                شروع رایگان
                <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </motion.div>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Shield className="h-4 w-4" />
              بدون نیاز به کارت بانکی
            </div>
          </motion.div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── Footer ──────────────────────────── */

function Footer() {
  const [showBackTop, setShowBackTop] = React.useState(false);
  const [showPulseDot, setShowPulseDot] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setShowBackTop(window.scrollY > 400);
      setShowPulseDot(window.scrollY > window.innerHeight);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const socialLinks = [
    {
      name: 'تلگرام',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-sky-400 hover:bg-sky-400/10',
    },
    {
      name: 'اینستاگرام',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-pink-400 hover:bg-pink-400/10',
    },
    {
      name: 'توییتر',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-gray-300 hover:bg-gray-300/10',
    },
    {
      name: 'لینکدین',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-blue-400 hover:bg-blue-400/10',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-l from-indigo-500 via-violet-500 to-purple-500" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                <ClipboardList className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">فرم‌ساز</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              ساخت فرم، پرسشنامه و نظرسنجی آنلاین به صورت رایگان و حرفه‌ای.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 mt-5">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-all duration-200 ${social.hoverColor}`}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">محصول</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">ویژگی‌ها</a></li>
              <li><a href="#use-cases" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">محیط‌های کاربردی</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block">قیمت‌گذاری</a></li>
              <li><span className="text-gray-600 cursor-default">الگوهای آماده</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">شرکت</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-gray-600 cursor-default">درباره ما</span></li>
              <li><span className="text-gray-600 cursor-default">بلاگ</span></li>
              <li><span className="text-gray-600 cursor-default">تماس با ما</span></li>
              <li><span className="text-gray-600 cursor-default">فرصت‌های شغلی</span></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">پشتیبانی</h4>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-gray-600 cursor-default">مرکز راهنما</span></li>
              <li><span className="text-gray-600 cursor-default">مستندات API</span></li>
              <li><span className="text-gray-600 cursor-default">حریم خصوصی</span></li>
              <li><span className="text-gray-600 cursor-default">شرایط استفاده</span></li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © ۱۴۰۴ فرم‌ساز. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>ساخته‌شده با</span>
            <HeartPulse className="h-3 w-3 text-red-400" />
            <span>در ایران</span>
          </div>
        </div>
      </div>

      {/* Floating pulse dot — back to top indicator */}
      <AnimatePresence>
        {showPulseDot && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 flex items-center justify-center group"
            title="بازگشت به بالا"
          >
            <span className="absolute size-6 rounded-full bg-violet-500/30 pulse-dot" />
            <span className="relative size-3 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50 group-hover:bg-violet-400 transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Back to top button (appears later) */}
      <AnimatePresence>
        {showBackTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-16 left-6 z-40 flex items-center justify-center size-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all"
            title="بازگشت به بالا"
          >
            <ArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

/* ──────────────────────────── Main Landing Page ──────────────────────────── */

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(progress, 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-white font-sans antialiased">
      {/* Scroll progress indicator */}
      <div
        className="scroll-progress"
        style={{ '--scroll-progress': scrollProgress } as React.CSSProperties}
      />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustedBySection />
        <FeaturesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <IntegrationsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
