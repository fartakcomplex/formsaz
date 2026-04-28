'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  FileQuestion,
  Palette,
  GitBranch,
  BarChart3,
  Download,
  Smartphone,
  ClipboardList,
  MessageSquareHeart,
  MessageSquare,
  Users,
  GraduationCap,
  CalendarDays,
  HeartPulse,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
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
  CircleDot,
  Send,
  ArrowUp,
  Search,
  Award,
  UsersRound,
  Clock,
  Rocket,
  Play,
  FileText,
  Globe,
  BadgeCheck,
  Heart,
  Headphones,
  MessageCircle,
  Moon,
  Sun,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  Layers,
  ShoppingCart,
  HelpCircle,
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
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  const particles = React.useMemo(() => {
    // Use a simple seeded pseudo-random to avoid hydration mismatch
    const seed = (i: number) => ((i * 2654435761) >>> 0) % 1000 / 1000;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: seed(i + 1) * 100,
      y: seed(i + 100) * 100,
      size: seed(i + 200) * 3 + 1.5,
      duration: seed(i + 300) * 6 + 4,
      delay: seed(i + 400) * 4,
      opacity: seed(i + 500) * 0.3 + 0.1,
      drift: seed(i + 600) > 0.5 ? 15 : -15,
    }));
  }, [count]);

  if (!mounted) return <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} suppressHydrationWarning />;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} suppressHydrationWarning>
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
          suppressHydrationWarning
          animate={{
            y: [0, -30, 0],
            x: [0, p.drift, 0],
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
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
      className={`fixed top-0 right-0 left-0 z-50 relative transition-all duration-300 ${
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
      {/* Scroll progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-100 dark:bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-l from-violet-500 via-purple-500 to-fuchsia-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </motion.header>
  );
}

/* ──────────────────────────── Hero Section ──────────────────────────── */

/* ── Animated stat counter with glassmorphism card ── */
function AnimatedStat({ value, suffix, label, delay = 0, isInView, icon: Icon }: {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
  isInView: boolean;
  icon: React.ElementType;
}) {
  const count = useAnimatedCounter(value, 2.2, isInView);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: delay * 0.15, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700/40 rounded-2xl p-4 flex flex-col items-center gap-3 cursor-default transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5"
    >
      <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-2.5 shadow-lg shadow-violet-500/20">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          {isInView ? count.toLocaleString('fa-IR') : '۰'}{suffix}
        </div>
        <div className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">
          {label}
        </div>
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
      {/* Gradient mesh background */}
      <div className="absolute inset-0 hero-gradient-mesh" />
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 hero-dot-pattern" />
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-violet-50/50 to-white dark:from-indigo-950/50 dark:via-violet-950/30 dark:to-gray-950" />
      {/* Animated gradient orbs with breathing animations */}
      <motion.div
        className="absolute top-[8%] right-[6%] w-80 h-80 bg-indigo-300/30 dark:bg-indigo-600/15 rounded-full blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[12%] left-[4%] w-96 h-96 bg-violet-300/30 dark:bg-violet-600/15 rounded-full blur-3xl"
        animate={{ x: [0, -25, 20, 0], y: [0, 15, -25, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute top-[35%] left-[38%] w-72 h-72 bg-fuchsia-200/25 dark:bg-fuchsia-600/12 rounded-full blur-3xl"
        animate={{ x: [0, 15, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.85, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      {/* 4th breathing orb */}
      <motion.div
        className="absolute top-[55%] right-[15%] w-56 h-56 bg-purple-200/20 dark:bg-purple-600/10 rounded-full blur-3xl"
        animate={{ x: [0, -20, 10, 0], y: [0, 25, -10, 0], scale: [1, 1.25, 0.9, 1], opacity: [0.6, 1, 0.6, 0.8] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
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

      {/* Animated noise/grain texture overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.018, 0.03, 0.018] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
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
          <div className="relative group">
            {/* Pulsing ring animation */}
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-l from-indigo-500 to-violet-500 opacity-40 blur-md group-hover:opacity-60 transition-opacity duration-300 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-l from-indigo-500/0 via-violet-500/0 to-fuchsia-500/0 group-hover:from-indigo-500/60 group-hover:via-violet-500/60 group-hover:to-fuchsia-500/60 blur-sm transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <Button
              size="lg"
              onClick={() => setCurrentView('dashboard')}
              className="relative w-full sm:w-auto min-w-[200px] h-13 text-base font-semibold bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all rounded-xl px-8"
            >
              شروع رایگان
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative group">
            {/* Animated border shimmer */}
            <div className="absolute -inset-[2px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="absolute inset-0 rounded-xl cta-border-animated" style={{ backgroundImage: 'linear-gradient(90deg, rgba(99,102,241,0), rgba(139,92,246,0.5), rgba(217,70,239,0.5), rgba(139,92,246,0.5), rgba(99,102,241,0))' }} />
            </div>
            <Button
              size="lg"
              variant="outline"
              className="relative w-full sm:w-auto min-w-[200px] h-13 text-base font-semibold rounded-xl px-8 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all backdrop-blur-sm"
              onClick={() => setCurrentView('templates')}
            >
              مشاهده نمونه‌ها
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Animated Stats with counters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          ref={statsRef}
          className="mt-16 mx-auto max-w-3xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <AnimatedStat value={400} suffix={"+"} label={"الگوی آماده"} delay={0} isInView={statsInView} icon={Layers} />
            <AnimatedStat value={100000} suffix={"+"} label={"فرم ساخته شده"} delay={1} isInView={statsInView} icon={FileText} />
            <AnimatedStat value={50000} suffix={"+"} label={"کاربر فعال"} delay={2} isInView={statsInView} icon={Users} />
            <AnimatedStat value={2000000} suffix={"+"} label={"پاسخ ثبت شده"} delay={3} isInView={statsInView} icon={MessageSquare} />
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

            {/* Animated gradient border on the mockup */}
            <motion.div
              className="absolute -inset-[1.5px] rounded-2xl overflow-hidden"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{
                  backgroundSize: '200% 200%',
                  backgroundImage: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7, #6366f1, #8b5cf6)',
                }}
              />
            </motion.div>

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

const featureCardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }),
};

function FeatureCard({ feature, index }: { feature: typeof featuresData[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      className="group relative"
    >
      {/* Persistent glow behind card on hover */}
      <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.15] blur-2xl transition-opacity duration-500`} />

      <Card className="group relative h-full overflow-hidden rounded-2xl border border-gray-200/60 dark:border-gray-700/50 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl cursor-default transition-shadow duration-300 group-hover:shadow-2xl">
        {/* Gradient accent line at top — always visible */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-l ${feature.gradient}`} />

        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

        {/* Gradient border reveal on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
          <div className="w-full h-full rounded-[14px] bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl" />
        </div>

        <CardContent className="p-6 relative z-10">
          {/* Animated icon container */}
          <div className="relative mb-5">
            {/* Icon glow ring */}
            <div className={`absolute inset-[-8px] rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-[0.1] group-hover:opacity-[0.2] blur-lg transition-all duration-500`} />
            <motion.div
              whileHover={{ scale: 1.12, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadowColor} transition-transform duration-300 group-hover:shadow-xl`}
            >
              <feature.icon className="h-6 w-6 text-white" strokeWidth={1.8} />
            </motion.div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {feature.description}
          </p>

          {/* Expandable section */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200/50 dark:border-gray-700/50 pt-3">
                  {feature.extraDescription}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Learn More link */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors animated-underline"
          >
            {expanded ? 'بستن' : 'بررسی بیشتر'}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </motion.span>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const featuresData = [
  {
    icon: FileQuestion,
    title: 'بیش از ۲۰ نوع سوال',
    description:
      'از متن ساده تا مقیاس امتیازدهی، ماتریسی، آپلود فایل و شبکه. هر نوع سوالی که نیاز داشته باشید.',
    extraDescription:
      'شامل انواع متن کوتاه و بلند، چند گزینه‌ای، چک‌باکس، دراپ‌داون، مقیاس NPS، ماتریسی، تاریخ، زمان، آپلود فایل، امضای دیجیتال و موارد دیگر.',
    gradient: 'from-violet-500 to-purple-600',
    shadowColor: 'shadow-violet-500/25',
  },
  {
    icon: Palette,
    title: 'طراحی گرافیکی فرم',
    description:
      'فرم خود را با رنگ‌ها، فونت‌ها و تم‌های متنوع سفارشی کنید و برند خود را منعکس نمایید.',
    extraDescription:
      'از تم‌های آماده استفاده کنید یا رنگ‌ها، لوگو، فونت و پس‌زمینه را به دلخواه تنظیم نمایید. پشتیبانی کامل از RTL و فونت‌های فارسی.',
    gradient: 'from-emerald-500 to-teal-600',
    shadowColor: 'shadow-emerald-500/25',
  },
  {
    icon: GitBranch,
    title: 'منطق شرطی و امتیازدهی',
    description:
      'با منطق شرطی هوشمند، مسیر پاسخ‌دهی را شخصی‌سازی و با امتیازدهی نتایج را ارزیابی کنید.',
    extraDescription:
      'قابلیت نمایش/مخفی کردن سوالات بر اساس پاسخ، پرش به سوال خاص، پایان فرم شرطی و محاسبه امتیاز خودکار.',
    gradient: 'from-amber-500 to-orange-600',
    shadowColor: 'shadow-amber-500/25',
  },
  {
    icon: BarChart3,
    title: 'نمودار و تحلیل آماری',
    description:
      'نتایج را با نمودارهای متنوع و گزارش‌های تحلیلی به صورت لحظه‌ای مشاهده و تحلیل کنید.',
    extraDescription:
      'نمودارهای دایره‌ای، میله‌ای، خطی و جدولی. فیلتر بر اساس تاریخ، دستگاه و پاسخ‌دهنده. گزارش PDF قابل دانلود.',
    gradient: 'from-fuchsia-500 to-pink-600',
    shadowColor: 'shadow-fuchsia-500/25',
  },
  {
    icon: Download,
    title: 'خروجی اکسل و CSV',
    description:
      'تمامی پاسخ‌ها را به صورت فایل اکسل یا CSV دانلود کنید و در ابزارهای دیگر استفاده نمایید.',
    extraDescription:
      'خروجی با فرمت‌های XLSX و CSV، قابلیت فیلتر قبل از دانلود، پشتیبانی از کاراکترهای فارسی و سازگاری با اکسل و گوگل شیت.',
    gradient: 'from-cyan-500 to-blue-600',
    shadowColor: 'shadow-cyan-500/25',
  },
  {
    icon: Smartphone,
    title: 'کاملاً واکنش‌گرا',
    description:
      'فرم‌ها در تمام دستگاه‌ها از موبایل تا دسکتاپ به بهترین شکل نمایش داده می‌شوند.',
    extraDescription:
      'طراحی واکنش‌گرا با تست روی بیش از ۵۰ دستگاه، پشتیبانی از حالت آفلاین و بهینه‌سازی سرعت بارگذاری.',
    gradient: 'from-rose-500 to-red-600',
    shadowColor: 'shadow-rose-500/25',
  },
];

function FeaturesSection() {
  const features = featuresData;
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-60px' });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      {/* Dot grid background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-1.5 text-xs font-medium bg-violet-100/80 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-700/30"
          >
            ویژگی‌ها
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            همه‌چیز برای ساخت فرم‌های حرفه‌ای
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            با ابزارهای قدرتمند و رابط کاربری ساده، فرم‌هایی بسازید که نرخ مشارکت بالایی دارند.
          </p>
        </FadeInSection>

        {/* Feature Grid */}
        <motion.div
          ref={containerRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={featureCardVariants}
            >
              <FeatureCard feature={feature} index={i} />
            </motion.div>
          ))}
        </motion.div>
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
      gradient: 'from-blue-500 to-indigo-600',
      shadowColor: 'shadow-blue-500/25',
    },
    {
      icon: MessageSquareHeart,
      title: 'رضایت مشتری',
      description: 'سنجش رضایت و بهبود تجربه مشتریان با فرم‌های NPS و CSAT',
      gradient: 'from-pink-500 to-rose-600',
      shadowColor: 'shadow-pink-500/25',
    },
    {
      icon: Users,
      title: 'منابع انسانی',
      description: 'ارزیابی عملکرد، نظرسنجی کارکنان و فرم‌های استخدام',
      gradient: 'from-amber-500 to-orange-600',
      shadowColor: 'shadow-amber-500/25',
    },
    {
      icon: GraduationCap,
      title: 'آموزش و دانشگاه',
      description: 'آزمون‌های آنلاین، فرم‌های ثبت‌نام و ارزیابی دانشجویان',
      gradient: 'from-emerald-500 to-teal-600',
      shadowColor: 'shadow-emerald-500/25',
    },
    {
      icon: CalendarDays,
      title: 'رویدادها',
      description: 'فرم ثبت‌نام رویداد، نظرسنجی حضار و مدیریت شرکت‌کنندگان',
      gradient: 'from-violet-500 to-purple-600',
      shadowColor: 'shadow-violet-500/25',
    },
    {
      icon: HeartPulse,
      title: 'سلامت و درمان',
      description: 'فرم‌های ویزیت آنلاین، پرسشنامه‌های پزشکی و پیگیری بیماران',
      gradient: 'from-cyan-500 to-sky-600',
      shadowColor: 'shadow-cyan-500/25',
    },
  ];

  return (
    <section id="use-cases" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Floating decorative gradient orbs */}
      <motion.div
        className="absolute top-[10%] right-[5%] w-64 h-64 bg-blue-300/20 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[8%] w-72 h-72 bg-violet-300/20 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, -20, 15, 0], y: [0, 10, -20, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-[50%] left-[50%] w-56 h-56 bg-fuchsia-200/15 dark:bg-fuchsia-600/8 rounded-full blur-3xl pointer-events-none"
        animate={{ x: [0, 15, -10, 0], y: [0, -10, 20, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern-sm" />
      {/* Gradient overlay at top for smooth blending */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white dark:from-gray-950 to-transparent z-[1]" />
      {/* Gradient overlay at bottom for smooth blending */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-[1]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-[2]">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-violet-100/80 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200/50 dark:border-violet-700/30"
          >
            محیط‌های کاربردی
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            مناسب برای هر صنعت و نیازی
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            از استارتاپ تا سازمان بزرگ، فرم‌ساز ابزار مناسبی برای همه کاربردهاست.
          </p>
        </FadeInSection>

        {/* Use Case Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="group relative"
            >
              {/* Glow behind card on hover */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-[0.15] blur-2xl transition-opacity duration-500`} />

              {/* Glassmorphism card */}
              <div className="relative h-full rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl cursor-default p-6">
                {/* Gradient border reveal on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${useCase.gradient} p-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className="w-full h-full rounded-[14px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" />
                </div>

                {/* Card content */}
                <div className="relative z-10">
                  {/* Animated icon container */}
                  <div className="relative mb-5">
                    {/* Icon glow ring */}
                    <div className={`absolute inset-[-6px] rounded-2xl bg-gradient-to-br ${useCase.gradient} opacity-[0.1] group-hover:opacity-[0.2] blur-lg transition-all duration-500`} />
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${useCase.gradient} shadow-lg ${useCase.shadowColor} transition-transform duration-300`}
                    >
                      <useCase.icon className="h-6 w-6 text-white" strokeWidth={1.8} />
                    </motion.div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5">{useCase.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{useCase.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ──────────────────────────── Featured Templates Section ──────────────────────────── */

function FeaturedTemplatesSection() {
  const { setCurrentView } = useAppStore();
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const featuredCategories = [
    { name: 'نظرسنجی', icon: ClipboardList, count: 45, gradient: 'from-rose-500 to-orange-500', bg: 'bg-rose-50 dark:bg-rose-950/20' },
    { name: 'ثبت‌نام', icon: FileText, count: 44, gradient: 'from-violet-500 to-purple-500', bg: 'bg-violet-50 dark:bg-violet-950/20' },
    { name: 'بازخورد', icon: MessageSquareHeart, count: 45, gradient: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
    { name: 'ارزیابی', icon: BarChart3, count: 41, gradient: 'from-amber-500 to-yellow-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
    { name: 'سفارش', icon: ShoppingCart, count: 39, gradient: 'from-sky-500 to-blue-500', bg: 'bg-sky-50 dark:bg-sky-950/20' },
    { name: 'آموزش', icon: GraduationCap, count: 43, gradient: 'from-indigo-500 to-blue-500', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
    { name: 'سلامت', icon: HeartPulse, count: 43, gradient: 'from-teal-500 to-emerald-500', bg: 'bg-teal-50 dark:bg-teal-950/20' },
    { name: 'رویداد', icon: CalendarDays, count: 43, gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
    { name: 'منابع انسانی', icon: Users, count: 43, gradient: 'from-pink-500 to-fuchsia-500', bg: 'bg-pink-50 dark:bg-pink-950/20' },
    { name: 'سایر', icon: HelpCircle, count: 33, gradient: 'from-gray-500 to-slate-500', bg: 'bg-gray-50 dark:bg-gray-800/30' },
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/20 to-white dark:from-gray-950 dark:via-purple-950/5 dark:to-gray-950" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, #a855f7 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInSection className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium bg-violet-100/80 text-violet-700 border-violet-200/50 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800/50">
            <Sparkles className="size-3 ml-1 text-violet-500" />
            الگوهای آماده
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            بیش از{' '}
            <span className="bg-gradient-to-l from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
              ۴۰۰
            </span>{' '}
            الگوی حرفه‌ای
          </h2>
          <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            در هر دسته‌بندی، الگوهای متنوعی برای شروع سریع فرم‌هایتان وجود دارد
          </p>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {featuredCategories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={staggerChild}
              whileHover={{ y: -4, scale: 1.02 }}
              className={cn(
                'group relative flex flex-col items-center p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all',
                'bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border-gray-200/60 dark:border-gray-800/60',
                'hover:shadow-xl hover:border-violet-200/60 dark:hover:border-violet-800/40'
              )}
              onClick={() => setCurrentView('templates')}
            >
              <div className={cn(
                'flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl mb-3 shadow-lg transition-transform group-hover:scale-110 bg-gradient-to-br text-white',
                cat.gradient
              )}>
                <cat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{cat.name}</h3>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{cat.count} الگو</span>
            </motion.div>
          ))}
        </StaggerContainer>

        <FadeInSection className="text-center mt-10 sm:mt-12">
          <Button
            size="lg"
            onClick={() => setCurrentView('templates')}
            className="h-12 px-8 rounded-2xl bg-gradient-to-l from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg shadow-violet-500/25 gap-2 font-medium"
          >
            مشاهده همه الگوها
            <ArrowLeft className="size-4" />
          </Button>
        </FadeInSection>
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
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-indigo-50/30 to-white dark:from-gray-950 dark:via-indigo-950/10 dark:to-gray-950" />
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
            {/* Gradient connector line (desktop only) */}
            <div className="hidden md:block absolute top-[44px] right-[20%] left-[20%] z-0">
              <div className="relative h-[3px] rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-indigo-300/40 via-violet-300/50 to-purple-300/40 dark:from-indigo-600/30 dark:via-violet-600/40 dark:to-purple-600/30" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-l from-indigo-500 via-violet-500 to-purple-500"
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                />
              </div>
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
                      {/* Main circle with gradient + pulsing glow on center step */}
                      <motion.div
                        whileHover={{ y: -6, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={`relative inline-flex size-[88px] items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-xl ${step.shadowColor} ring-4 ring-white dark:ring-gray-950 ${step.ringColor} ${i === 1 ? 'breathing-glow' : ''}`}
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-60px' });

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

  const statsData = [
    { label: 'رضایت', value: '۹۸٪', icon: Heart, gradient: 'from-rose-500 to-pink-600' },
    { label: 'پشتیبانی', value: '۲۴/۷', icon: Headphones, gradient: 'from-violet-500 to-purple-600' },
    { label: 'کاربر', value: '۵۰K+', icon: Users, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'پاسخ', value: '۱M+', icon: MessageCircle, gradient: 'from-amber-500 to-orange-600' },
  ];

  const itemsPerView = typeof window !== 'undefined' && window.innerWidth >= 1024 ? 3 : 1;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Auto-advance carousel
  useEffect(() => {
    if (isPaused || !sectionInView) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex, sectionInView]);

  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-gray-50/80 via-white to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 right-[5%] w-64 h-64 bg-indigo-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-[5%] w-80 h-80 bg-violet-100/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-violet-100/20 to-fuchsia-100/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Section Header */}
        <FadeInSection className="text-center mb-12 sm:mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-rose-100/80 text-rose-700 border-rose-200/50"
          >
            <Quote className="h-3 w-3 ml-1" />
            نظرات کاربران
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-l from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              نظر کاربران درباره فرمساز
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            بیش از ۵۰ هزار سازمان از فرمساز استفاده می‌کنند
          </p>
        </FadeInSection>

        {/* Stats Counter Row */}
        <FadeInSection delay={0.15} className="mb-14 sm:mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/40 rounded-2xl p-4 flex flex-col items-center gap-2.5 cursor-default transition-shadow duration-300 hover:shadow-xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5"
              >
                <div className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-2 shadow-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-extrabold bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeInSection>

        {/* Testimonials Carousel */}
        <FadeInSection delay={0.25}>
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-2xl">
              <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {testimonials.map((testimonial, i) => (
                  <motion.div
                    key={i}
                    className="w-full lg:w-1/3 flex-shrink-0 px-2"
                    whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
                  >
                    <div className="group relative h-full bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/40 rounded-2xl hover:shadow-2xl hover:shadow-violet-500/[0.08] transition-all duration-300 overflow-hidden">
                      {/* Gradient border on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-200 via-purple-200 to-pink-200 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-full h-full rounded-[14px] bg-white/70 dark:bg-gray-800/70 backdrop-blur-md" />
                      </div>

                      <div className="p-6 relative z-10">
                        {/* Gradient quote mark */}
                        <div className="flex justify-end mb-3">
                          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl p-2 opacity-80 group-hover:opacity-100 transition-opacity">
                            <Quote className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* Star rating */}
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
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60 dark:border-gray-700/40">
                          {/* Avatar with ring */}
                          <div className="relative">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-full text-white text-sm font-bold shrink-0 shadow-lg ${testimonial.color} ring-2 ring-violet-200 dark:ring-violet-800`}
                            >
                              {testimonial.initials}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                {testimonial.name}
                              </span>
                              <BadgeCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {testimonial.role} · {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/[0.02] to-purple-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`relative rounded-full transition-all duration-300 ${
                    dotIdx === currentIndex
                      ? 'w-8 h-2.5'
                      : 'w-2.5 h-2.5 hover:w-4'
                  }`}
                  aria-label={`اسلاید ${dotIdx + 1}`}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      backgroundColor: dotIdx === currentIndex
                        ? '#8b5cf6'
                        : 'rgba(156, 163, 175, 0.4)',
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ))}
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── FAQ Section ──────────────────────────── */

function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('همه');

  const categories = ['همه', 'عمومی', 'قابلیت‌ها', 'امنیت', 'قیمت‌گذاری'];

  const faqItems = [
    {
      question: 'آیا استفاده از فرم‌ساز رایگان است؟',
      answer:
        'بله! شما می‌توانید به صورت کاملاً رایگان فرم بسازید، مدیریت کنید و نتایج را تحلیل نمایید. پلن رایگان شامل تمام امکانات اصلی است. برای امکانات پیشرفته‌تر، پلن‌های حرفه‌ای نیز موجود است.',
      category: 'قیمت‌گذاری',
    },
    {
      question: 'چه نوع سوالاتی پشتیبانی می‌شود؟',
      answer:
        'فرم‌ساز بیش از ۲۰ نوع سوال شامل متن کوتاه و بلند، چند گزینه‌ای، چک‌باکس، مقیاس امتیازدهی، ماتریسی، دراپ‌داون، آپلود فایل، تاریخ و زمان، شبکه و منوی کشویی را پشتیبانی می‌کند.',
      category: 'قابلیت‌ها',
    },
    {
      question: 'آیا می‌توانم فرم را به زبان فارسی بسازم؟',
      answer:
        'بله! فرم‌ساز به صورت کامل از زبان فارسی و راست‌چین (RTL) پشتیبانی می‌کند. تمام عناصر فرم شامل برچسب‌ها، دکمه‌ها و پیام‌ها به صورت خودکار راست‌چین نمایش داده می‌شوند.',
      category: 'عمومی',
    },
    {
      question: 'محدودیت تعداد پاسخ‌ها چقدر است؟',
      answer:
        'در پلن رایگان، هر فرم می‌تواند تا ۱۰۰ پاسخ دریافت کند. در پلن‌های حرفه‌ای این محدودیت به ۱۰,۰۰۰ و نامحدود افزایش می‌یابد. همچنین می‌توانید در هر لحظه پاسخ‌ها را به صورت اکسل دانلود کنید.',
      category: 'قیمت‌گذاری',
    },
    {
      question: 'آیا امکان منطق شرطی در فرم وجود دارد؟',
      answer:
        'بله! با استفاده از منطق شرطی می‌توانید بر اساس پاسخ کاربر، سوالات خاصی را نمایش یا مخفی کنید، کاربر را به صفحه دیگری هدایت کنید یا فرم را به پایان برسانید.',
      category: 'قابلیت‌ها',
    },
    {
      question: 'اطلاعات کاربران چگونه محافظت می‌شود؟',
      answer:
        'ما امنیت داده‌ها را جدی می‌گیریم. تمام ارتباطات با رمزنگاری SSL محافظت می‌شوند، داده‌ها بر روی سرورهای امن ذخیره می‌گردند و ما در قبال حریم خصوصی شما متعهد هستیم.',
      category: 'امنیت',
    },
  ];

  const filteredFaqs = faqItems.filter((faq) => {
    const matchesCategory = activeCategory === 'همه' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || faq.question.includes(searchQuery) || faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/80 via-white to-gray-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-[10%] w-64 h-64 bg-violet-100/30 dark:bg-violet-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-[10%] w-80 h-80 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-3xl" />
      {/* Animated floating gradient orbs */}
      <motion.div
        className="absolute top-[15%] right-[5%] w-72 h-72 bg-violet-300/20 dark:bg-violet-600/10 rounded-full blur-3xl"
        animate={{ x: [0, 25, -15, 0], y: [0, -18, 12, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[8%] w-80 h-80 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl"
        animate={{ x: [0, -20, 18, 0], y: [0, 15, -20, 0], scale: [1, 0.9, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-[50%] left-[50%] w-56 h-56 bg-fuchsia-200/15 dark:bg-fuchsia-600/8 rounded-full blur-3xl"
        animate={{ x: [0, 15, -25, 0], y: [0, -25, 18, 0], scale: [1, 1.2, 0.85, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-12 sm:mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-amber-100/80 text-amber-700 border-amber-200/50"
          >
            سوالات متداول
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-l from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
              پاسخ سوالات شما
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            اگر سوالی دارید، احتمالاً پاسخ آن را اینجا پیدا خواهید کرد.
          </p>
        </FadeInSection>

        {/* Search Input */}
        <FadeInSection delay={0.1}>
          <div className="relative mb-6">
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Search className="h-4 w-4 text-gray-400" />
            </motion.div>
            <Input
              type="text"
              placeholder="جستجو در سوالات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl text-sm focus-visible:ring-indigo-500/20 shadow-sm"
            />
          </div>
        </FadeInSection>

        {/* Category Tabs */}
        <FadeInSection delay={0.15}>
          <div className="flex flex-wrap gap-2 mb-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                layoutId="faq-tab-indicator"
                className="absolute top-0 h-[30px] rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{ display: 'none' }}
              />
            </AnimatePresence>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {activeCategory === cat && (
                  <motion.div
                    layoutId="faq-active-bg"
                    className="absolute inset-0 rounded-full bg-indigo-100 dark:bg-indigo-900/40 shadow-sm"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>
        </FadeInSection>

        {/* FAQ Accordion */}
        <FadeInSection delay={0.2}>
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                نتیجه‌ای یافت نشد. لطفاً عبارت دیگری جستجو کنید.
              </div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="group border border-gray-200/60 dark:border-gray-800/60 rounded-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-sm hover:shadow-lg data-[state=open]:shadow-lg data-[state=open]:shadow-indigo-500/[0.08] data-[state=open]:border-violet-200/60 dark:data-[state=open]:border-violet-800/60 overflow-hidden transition-all duration-300"
                >
                  <AccordionTrigger className="px-6 py-4 text-right text-base font-semibold text-gray-900 dark:text-gray-100 hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors [&[data-state=open]>svg]:text-indigo-600 [&[data-state=open]>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-300">
                    <span className="flex items-center gap-2">
                      <motion.span
                        className="hidden w-2 h-2 rounded-full bg-violet-500 group-data-[state=open]:block"
                        layoutId="faq-dot-indicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                      {faq.question}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-normal">{faq.category}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                    {/* Helpful rating — visual only */}
                    <div className="mt-4 pt-3 border-t border-gray-100/60 dark:border-gray-800/40 flex items-center gap-4">
                      <span className="text-xs text-gray-400">آیا این پاسخ مفید بود؟</span>
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>بله</span>
                      </button>
                      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                        <ThumbsDown className="h-3.5 w-3.5" />
                        <span>خیر</span>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
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
      {/* Animated floating gradient orbs */}
      <motion.div
        className="absolute top-[10%] right-[8%] w-72 h-72 bg-violet-300/25 dark:bg-violet-600/12 rounded-full blur-3xl"
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[15%] left-[5%] w-80 h-80 bg-fuchsia-200/20 dark:bg-fuchsia-600/10 rounded-full blur-3xl"
        animate={{ x: [0, -25, 20, 0], y: [0, 15, -25, 0], scale: [1, 0.9, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      <motion.div
        className="absolute top-[55%] left-[40%] w-64 h-64 bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-3xl"
        animate={{ x: [0, 15, -30, 0], y: [0, -30, 20, 0], scale: [1, 1.2, 0.85, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-xs font-medium rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800">
              <Sparkles className="size-3 ml-1.5" />
              یکپارچه‌سازی
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
              <span className="bg-gradient-to-l from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                اتصال به ابزارهای مورد علاقه
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              فرمساز با بیش از ۵۰۰۰ ابزار و سرویس محبوب یکپارچه می‌شود
            </p>
          </div>
        </FadeInSection>

        {/* Connecting line pattern between integration icons (desktop) */}
        <div className="hidden lg:block absolute top-[45%] right-[8%] left-[8%] h-[1px] pointer-events-none">
          <div className="gradient-divider opacity-60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
            >
              {/* Gradient border reveal on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-full h-full rounded-[14px] bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl" />
              </div>
              {/* Glassmorphism card */}
              <div className="relative p-5 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 hover:shadow-2xl hover:shadow-violet-100/60 dark:hover:shadow-violet-900/30 transition-all duration-300">
                {/* Hover glow effect */}
                <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${integration.color} opacity-0 group-hover:opacity-[0.15] blur-xl transition-opacity duration-500 pointer-events-none`} />
                {/* Colored icon circle */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`relative flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${integration.color} shadow-lg mb-4 group-hover:shadow-xl transition-all duration-300`}
                >
                  {integration.icon}
                </motion.div>
                {/* Name */}
                <h3 className="relative text-base font-bold text-gray-900 dark:text-white mb-1.5">
                  {integration.name}
                </h3>
                {/* Description */}
                <p className="relative text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {integration.description}
                </p>
              </div>
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
      priceMonthly: '۰',
      priceYearly: '۰',
      priceUnit: 'تومان',
      description: 'مناسب برای شروع و استفاده‌های شخصی',
      features: [
        { text: 'تا ۵ فرم فعال', included: true },
        { text: '۱۰۰ پاسخ در هر فرم', included: true },
        { text: '۱۰ فیلد سوال در هر فرم', included: true },
        { text: 'تم‌های پایه و پیش‌فرض', included: true },
        { text: 'خروجی CSV', included: true },
        { text: 'آمار و گزارش اولیه', included: true },
        { text: 'حذف لوگوی پرسلاین', included: false },
        { text: 'منطق شرطی و شاخه‌ای', included: false },
        { text: 'خروجی اکسل و PDF', included: false },
        { text: 'پشتیبانی اولویت‌دار', included: false },
      ],
      buttonLabel: 'شروع رایگان',
      buttonVariant: 'outline' as const,
      highlight: false,
    },
    {
      name: 'حرفه‌ای',
      icon: Crown,
      priceMonthly: '۴۹,۰۰۰',
      priceYearly: '۳۹,۰۰۰',
      priceUnit: 'تومان / ماه',
      description: 'مناسب برای کسب‌وکارهای در حال رشد',
      features: [
        { text: 'فرم نامحدود', included: true },
        { text: '۱۰,۰۰۰ پاسخ در هر فرم', included: true },
        { text: 'فیلد سوال نامحدود', included: true },
        { text: 'تم‌های سفارشی و برندسازی', included: true },
        { text: 'خروجی CSV، اکسل و PDF', included: true },
        { text: 'آمار پیشرفته و نمودارهای تعاملی', included: true },
        { text: 'منطق شرطی و شاخه‌ای', included: true },
        { text: 'حذف لوگوی پرسلاین', included: true },
        { text: 'پشتیبانی اولویت‌دار ۲۴/۷', included: true },
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
      priceMonthly: '',
      priceYearly: '',
      priceUnit: '',
      description: 'مناسب برای سازمان‌ها و تیم‌های بزرگ',
      features: [
        { text: 'همه امکانات پلن حرفه‌ای', included: true },
        { text: 'پاسخ نامحدود', included: true },
        { text: 'همکاری تیمی با مدیریت نقش‌ها', included: true },
        { text: 'دامنه سفارشی و برندینگ کامل', included: true },
        { text: 'دسترسی API و وب‌هوک', included: true },
        { text: 'ورود یکپارچه (SSO) و SAML', included: true },
        { text: 'حذف کامل محدودیت فیلدها', included: true },
        { text: 'پشتیبانی اختصاصی و مدیر حساب', included: true },
        { text: 'SLA تضمین‌شده ۹۹.۹٪', included: true },
        { text: 'قرارداد سفارشی و فاکتور رسمی', included: true },
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
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(circle, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Decorative glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/30 dark:bg-violet-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-100/20 dark:bg-fuchsia-500/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-1.5 text-xs font-medium bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-800/50"
            >
              <Sparkles className="h-3 w-3 ml-1" />
              قیمت‌گذاری
            </Badge>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            پلن مناسب خود را{' '}
            <span className="bg-gradient-to-l from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              انتخاب کنید
            </span>
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            بدون هزینه پنهان، بدون قرارداد بلندمدت. هر زمان که بخواهید ارتقا یا لغو کنید.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-1.5 border border-gray-200/50 dark:border-gray-700/50">
            <span
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-300 ${
                !isYearly
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
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
              className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-300 ${
                isYearly
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              سالانه
              <Badge className="mr-1.5 px-1.5 py-0 text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50">
                ۲۰٪ تخفیف
              </Badge>
            </span>
          </div>
        </FadeInSection>

        {/* Pricing Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              variants={staggerChild}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="relative"
            >
              {/* Popular badge with glow */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.3 }}
                  >
                    <Badge className="px-5 py-1.5 text-xs font-bold bg-gradient-to-l from-indigo-600 via-violet-600 to-purple-600 text-white border-0 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/50 relative overflow-hidden">
                      {/* Animated shine on badge */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                          backgroundSize: '50% 100%',
                        }}
                      />
                      <span className="relative flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                        {plan.badge}
                      </span>
                    </Badge>
                  </motion.div>
                </div>
              )}

              {/* Gradient border wrapper for highlighted card */}
              {plan.highlight ? (
                <div className="relative p-[2px] rounded-2xl bg-gradient-to-b from-indigo-500 via-violet-500 to-purple-600 shadow-2xl shadow-indigo-500/20 dark:shadow-indigo-500/30">
                  {/* Animated gradient border glow */}
                  <motion.div
                    className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-indigo-400 via-violet-500 to-purple-600 opacity-50 blur-sm"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <Card className="relative h-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border-0 shadow-none">
                    <PricingCardInner plan={plan} isYearly={isYearly} setCurrentView={setCurrentView} />
                  </Card>
                </div>
              ) : (
                <Card className="group relative h-full overflow-hidden border border-gray-200/80 dark:border-gray-800/80 hover:border-indigo-200 dark:hover:border-indigo-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:shadow-xl hover:shadow-indigo-500/[0.08] transition-shadow duration-300 rounded-2xl">
                  {/* Subtle glassmorphism top highlight */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-l from-transparent via-gray-300/50 dark:via-gray-700/50 to-transparent" />
                  <PricingCardInner plan={plan} isYearly={isYearly} setCurrentView={setCurrentView} />
                </Card>
              )}
            </motion.div>
          ))}
        </StaggerContainer>

        {/* Trust indicators */}
        <FadeInSection delay={0.5} className="mt-14">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>رمزنگاری SSL</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>آپتایم ۹۹.۹٪</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MessageSquareHeart className="h-4 w-4 text-emerald-500" />
              <span>پشتیبانی فارسی</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Zap className="h-4 w-4 text-emerald-500" />
              <span>لغو آنی</span>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ── Inner Pricing Card Content ── */

interface PricingPlan {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  priceMonthly: string;
  priceYearly: string;
  priceUnit: string;
  description: string;
  features: { text: string; included: boolean }[];
  buttonLabel: string;
  buttonVariant: 'outline' | 'default';
  highlight: boolean;
  badge?: string;
}

function PricingCardInner({
  plan,
  isYearly,
  setCurrentView,
}: {
  plan: PricingPlan;
  isYearly: boolean;
  setCurrentView: (view: string) => void;
}) {
  return (
    <>
      {/* Shimmer/shine animation for highlighted card */}
      {plan.highlight && (
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <motion.div
            className="absolute inset-0 -translate-x-full"
            animate={{ translateX: ['-100%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
          >
            <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
          </motion.div>
        </div>
      )}

      <CardContent className="relative p-6 lg:p-8 flex flex-col h-full">
        {/* Plan icon + name */}
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/40'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <plan.icon
                className={`h-5 w-5 ${
                  plan.highlight ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </div>
          </motion.div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{plan.description}</p>

        {/* Price */}
        <div className="mb-6">
          {plan.name === 'سازمانی' ? (
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
              تماس بگیرید
            </div>
          ) : plan.name === 'رایگان' ? (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">۰</span>
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">تومان</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {isYearly ? plan.priceYearly : plan.priceMonthly}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {plan.priceUnit}
              </span>
            </div>
          )}
          {isYearly && plan.name === 'حرفه‌ای' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-1.5"
            >
              <Badge className="px-2 py-0.5 text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50">
                صرفه‌جویی سالانه ≈ ۱۲۰,۰۰۰ تومان
              </Badge>
            </motion.div>
          )}
          {plan.name === 'سازمانی' && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              قیمت بر اساس نیاز و مقیاس سازمان شما تعیین می‌شود
            </p>
          )}
        </div>

        <Separator className="mb-6 opacity-60" />

        {/* Features list */}
        <ul className="space-y-3 flex-1 mb-8">
          {plan.features.map((feature, fIdx) => (
            <motion.li
              key={fIdx}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: fIdx * 0.04 }}
              className="flex items-start gap-2.5"
            >
              {feature.included ? (
                <div className="flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
                  <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
                </div>
              ) : (
                <div className="flex h-5 w-5 shrink-0 mt-0.5 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800/60">
                  <X className="h-3 w-3 text-gray-400 dark:text-gray-600" strokeWidth={3} />
                </div>
              )}
              <span
                className={`text-sm leading-relaxed ${
                  feature.included
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-600 line-through'
                }`}
              >
                {feature.text}
              </span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          size="lg"
          variant={plan.buttonVariant}
          onClick={() => setCurrentView('dashboard')}
          className={`w-full rounded-xl font-semibold transition-all duration-300 ${
            plan.highlight
              ? 'bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 dark:shadow-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
              : plan.name === 'سازمانی'
              ? 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 active:translate-y-0'
              : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          {plan.buttonLabel}
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </CardContent>
    </>
  );
}

/* ── CTA Mini Stat Card ── */
function CTAMiniStat({ stat, delay }: {
  stat: { value: number; suffix: string; label: string; icon: React.ElementType };
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  const count = useAnimatedCounter(stat.value >= 100 ? Math.floor(stat.value) : 0, 2, isInView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-white/90"
    >
      <stat.icon className="h-5 w-5 text-white/60" />
      <div className="text-left">
        <div className="text-lg font-bold text-white">
          {stat.value < 100
            ? stat.value.toFixed(1)
            : isInView
              ? count.toLocaleString('fa-IR')
              : '۰'}{stat.suffix}
        </div>
        <div className="text-[11px] text-white/50 font-medium">{stat.label}</div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────── CTA Section ──────────────────────────── */

function CTASection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated gradient background — violet → purple → fuchsia */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ['0% 50%', '50% 100%', '100% 50%', '50% 0%', '0% 50%'],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundSize: '400% 400%',
          backgroundImage:
            'linear-gradient(135deg, oklch(0.55 0.27 293), oklch(0.53 0.25 280), oklch(0.52 0.27 305), oklch(0.50 0.24 293), oklch(0.55 0.27 293))',
        }}
      />
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-[2px]" />
      {/* Dot pattern overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Animated floating shapes */}
      {/* Large circle top-right */}
      <motion.div
        className="absolute top-[8%] right-[5%] w-20 h-20 border-2 border-white/15 rounded-full"
        animate={{ y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Medium square bottom-left */}
      <motion.div
        className="absolute bottom-[15%] left-[7%] w-14 h-14 border-2 border-white/15 rounded-xl"
        animate={{ y: [0, 25, 0], rotate: [0, 45, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      {/* Small filled circle */}
      <motion.div
        className="absolute top-[30%] left-[15%] w-6 h-6 bg-white/10 rounded-full"
        animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      {/* Small filled square */}
      <motion.div
        className="absolute bottom-[35%] right-[12%] w-5 h-5 bg-white/10 rounded-sm"
        animate={{ y: [0, -22, 0], rotate: [0, 90, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      {/* Diamond shape */}
      <motion.div
        className="absolute top-[55%] left-[30%] w-10 h-10 border border-white/10 rotate-45 rounded-sm"
        animate={{ y: [0, 15, 0], rotate: [45, 135, 45] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      {/* Tiny accent circle */}
      <motion.div
        className="absolute top-[10%] left-[45%] w-4 h-4 bg-yellow-300/25 rounded-full"
        animate={{ y: [0, -14, 0], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      {/* Tiny accent rectangle */}
      <motion.div
        className="absolute bottom-[20%] right-[30%] w-5 h-3 bg-pink-300/20 rounded-full"
        animate={{ y: [0, 20, 0], rotate: [0, 60, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Large ring */}
      <motion.div
        className="absolute top-[40%] right-[3%] w-16 h-16 border-2 border-white/[0.08] rounded-full"
        animate={{ y: [0, -20, 0], x: [0, 14, 0], scale: [1, 0.9, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
      />
      {/* Medium filled rounded rect */}
      <motion.div
        className="absolute bottom-[40%] left-[20%] w-8 h-8 bg-cyan-300/15 rounded-lg"
        animate={{ y: [0, -24, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
      />
      {/* Tiny diamond */}
      <motion.div
        className="absolute top-[20%] right-[25%] w-3 h-3 bg-amber-300/15 rotate-45"
        animate={{ y: [0, 12, 0], opacity: [0.15, 0.45, 0.15], rotate: [45, 135, 45] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      {/* Micro particles */}
      <motion.div
        className="absolute top-[68%] right-[42%] w-2 h-2 bg-white/15 rounded-full"
        animate={{ y: [0, -32, 0], opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      <motion.div
        className="absolute top-[24%] left-[58%] w-3 h-3 bg-fuchsia-300/12 rounded-full"
        animate={{ y: [0, -22, 0], scale: [1, 1.5, 1], opacity: [0.12, 0.35, 0.12] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <motion.div
        className="absolute bottom-[48%] right-[58%] w-5 h-5 bg-violet-300/[0.07] rounded-md rotate-45"
        animate={{ y: [0, 14, 0], rotate: [45, 180, 45], opacity: [0.07, 0.22, 0.07] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
      />

      {/* Animated glow orbs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/[0.08] rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-300/15 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-400/[0.06] rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeInSection>
          {/* Heading */}
          <motion.h2
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
          >
            همین حالا شروع کنید!
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 mx-auto max-w-2xl text-base sm:text-lg text-white/85 leading-relaxed"
          >
            هزاران سازمان از فرمساز برای جمع‌آوری داده‌ها استفاده می‌کنند. رایگان شروع کنید و تفاوت را احساس کنید.
          </motion.p>

          {/* No credit card badge */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white/90"
          >
            <CreditCard className="h-4 w-4 text-white/70" />
            بدون نیاز به کارت بانکی
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA — larger pulsing ring animation */}
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute -inset-3 rounded-2xl bg-white/15"
                animate={{ scale: [1, 1.25], opacity: [0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute -inset-1.5 rounded-2xl bg-white/20"
                animate={{ scale: [1, 1.15], opacity: [0.3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
              />
              <Button
                size="lg"
                onClick={() => setCurrentView('dashboard')}
                className="relative w-full sm:w-auto min-w-[200px] h-14 text-base font-bold bg-white text-violet-700 hover:bg-violet-50 shadow-2xl shadow-black/15 hover:shadow-black/25 hover:-translate-y-1 transition-all rounded-2xl px-8 gap-2 group"
              >
                <Rocket className="h-5 w-5" />
                شروع رایگان
              </Button>
            </motion.div>

            {/* Secondary CTA — outline */}
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-w-[200px] h-14 text-base font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all rounded-2xl px-8 gap-2 group"
              onClick={() => setCurrentView('templates')}
            >
              <Play className="h-5 w-5" />
              مشاهده نمونه‌ها
            </Button>
          </motion.div>

          {/* Trust indicators row */}
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-white/70"
          >
            <span className="inline-flex items-center gap-1.5">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                <Check className="h-4 w-4 text-emerald-300" />
              </motion.div>
              بیش از ۵۰,۰۰۰ فرم ساخته شده
            </span>
            <span className="hidden sm:inline-block w-px h-4 bg-white/25" />
            <span className="inline-flex items-center gap-1.5">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}>
                <Check className="h-4 w-4 text-emerald-300" />
              </motion.div>
              ۹۹.۹٪ آپتایم
            </span>
            <span className="hidden sm:inline-block w-px h-4 bg-white/25" />
            <span className="inline-flex items-center gap-1.5">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}>
                <Check className="h-4 w-4 text-emerald-300" />
              </motion.div>
              پشتیبانی ۲۴/۷
            </span>
          </motion.div>

          {/* Animated stat counters */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {[
              { value: 50000, suffix: '+', label: 'فرم', icon: FileText },
              { value: 2000000, suffix: '+', label: 'پاسخ', icon: MessageSquare },
              { value: 99.9, suffix: '%', label: 'آپتایم', icon: Shield },
            ].map((stat, idx) => (
              <CTAMiniStat key={idx} stat={stat} delay={idx * 0.1} />
            ))}
          </motion.div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── Footer ──────────────────────────── */

function Footer() {
  const [showBackTop, setShowBackTop] = React.useState(false);
  const [scrollProgress, setScrollProgress] = React.useState(0);

  const { setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setShowBackTop(scrollY > 400);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const socialLinks = [
    {
      name: 'تلگرام',
      icon: (
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-sky-400 hover:border-sky-400/30 hover:bg-sky-400/10',
    },
    {
      name: 'توییتر',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-gray-200 hover:border-gray-300/20 hover:bg-gray-300/10',
    },
    {
      name: 'اینستاگرام',
      icon: (
        <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-pink-400 hover:border-pink-400/30 hover:bg-pink-400/10',
    },
    {
      name: 'لینکدین',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      href: '#',
      hoverColor: 'hover:text-blue-400 hover:border-blue-400/30 hover:bg-blue-400/10',
    },
  ];

  return (
    <footer className="relative mt-auto">
      {/* Gradient border top separator */}
      <div className="h-px bg-gradient-to-l from-transparent via-violet-500/50 to-transparent" />

      {/* Dark background with subtle gradient + glassmorphism */}
      <div className="relative bg-gray-950 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 20% 0%, oklch(0.35 0.12 293 / 15%) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, oklch(0.30 0.10 270 / 10%) 0%, transparent 60%)',
          }}
        />
        {/* Glassmorphism layer */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        {/* Gradient mesh glow orbs */}
        <motion.div
          className="absolute -top-20 right-[10%] w-[400px] h-[300px] bg-violet-600/10 rounded-full blur-3xl"
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-16 left-[15%] w-[350px] h-[250px] bg-fuchsia-600/8 rounded-full blur-3xl"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
              {/* Column 1 — Brand + description */}
              <div className="sm:col-span-2 lg:col-span-1">
                <motion.div
                  className="flex items-center gap-2.5 mb-4"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
                    <FileText className="h-4.5 w-4.5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-white tracking-tight">فرم‌ساز</span>
                </motion.div>
                <p className="text-sm leading-relaxed text-gray-400 max-w-[260px]">
                  فرمساز آنلاین، ابزار حرفه‌ای ساخت فرم، پرسشنامه و نظرسنجی
                </p>

                {/* Social Media Icons — glassmorphism circular containers with gradient hover glow */}
                <div className="flex items-center gap-2.5 mt-6">
                  {socialLinks.map((social, i) => (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.4 }}
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 border border-white/[0.08] bg-white/[0.04] backdrop-blur-md transition-all duration-300 ${social.hoverColor}`}
                      title={social.name}
                    >
                      {/* Gradient glow on hover */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Column 2 — محصول */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-500" />
                  محصول
                </h4>
                <ul className="space-y-3 text-sm">
                  {[{ label: 'ساخت فرم', href: '#features' }, { label: 'الگوهای آماده', href: '#pricing' }, { label: 'نظرسنجی', href: '#use-cases' }, { label: 'فرم استخدام', href: '#pricing' }].map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="relative text-gray-400 hover:text-violet-300 transition-colors duration-200 inline-block group">
                        {link.label}
                        <span className="absolute bottom-0 right-0 w-0 h-px bg-gradient-to-l from-violet-400 to-fuchsia-400 group-hover:w-full transition-all duration-300" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Column 3 — شرکت */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-500" />
                  شرکت
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      درباره ما
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      بلاگ
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      تماس با ما
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      فرصت‌های شغلی
                    </span>
                  </li>
                </ul>
              </motion.div>

              {/* Column 4 — پشتیبانی */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
                  <span className="inline-block w-1 h-4 rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-500" />
                  پشتیبانی
                </h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      مرکز راهنما
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      مستندات API
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      شرایط استفاده
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-500 hover:text-violet-300 transition-colors duration-200 cursor-default inline-flex items-center gap-1.5">
                      <span className="w-1 h-px bg-gray-700" />
                      حریم خصوصی
                    </span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>

          {/* Newsletter / Email subscription input */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="my-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Send className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید..."
                  className="w-full h-11 pr-10 pl-4 rounded-xl border-white/[0.08] bg-white/[0.04] backdrop-blur-xl text-sm text-white placeholder:text-gray-500 focus-visible:ring-violet-500/30 focus-visible:border-violet-500/30"
                />
              </div>
              <Button className="w-full sm:w-auto h-11 px-6 bg-gradient-to-l from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all">
                عضویت
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-center text-[11px] text-gray-600 mt-2">بدون اسپم. هرگز ایمیل‌های شما را به اشتراک نمی‌گذاریم.</p>
          </motion.div>

          {/* Separator */}
          <div className="gradient-divider my-6" />

          {/* Bottom bar */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            {/* Copyright */}
            <p className="text-xs text-gray-500">
              © ۱۴۰۴ فرمساز. تمامی حقوق محفوظ است.
            </p>

            <div className="flex items-center gap-4">
              {/* Made in Iran */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>ساخته شده با</span>
                <HeartPulse className="h-3 w-3 text-red-400" />
                <span>در ایران</span>
              </div>

              {/* Language toggle */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-gray-400 hover:text-violet-300 hover:border-violet-500/20 hover:bg-violet-500/[0.06] transition-all duration-200">
                <Globe className="h-3.5 w-3.5" />
                فارسی
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating action buttons */}
      <AnimatePresence>
        {showBackTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 left-6 z-40 flex flex-col gap-3"
          >
            {/* Theme toggle button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center justify-center size-11 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 shadow-xl text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              title={resolvedTheme === 'dark' ? 'حالت روشن' : 'حالت تاریک'}
            >
              <AnimatePresence mode="wait">
                {resolvedTheme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="size-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="size-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Scroll-to-top button with progress ring */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="relative flex items-center justify-center size-11 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 shadow-xl hover:border-violet-300/60 dark:hover:border-violet-500/30 transition-colors"
              title="بازگشت به بالا"
            >
              {/* SVG progress ring */}
              <svg className="absolute inset-0 size-11 -rotate-90" viewBox="0 0 44 44">
                {/* Background ring */}
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-gray-200/60 dark:text-gray-700/60"
                />
                {/* Progress ring */}
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - scrollProgress / 100)}`}
                  className="transition-[stroke-dashoffset] duration-150 ease-out"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>
              <ArrowUp className="size-4 text-violet-600 dark:text-violet-400 relative z-10" />
            </motion.button>
          </motion.div>
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
        <FeaturedTemplatesSection />
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
