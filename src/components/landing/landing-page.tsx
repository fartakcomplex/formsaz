'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.04] border-b border-gray-100'
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
                className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50/60"
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
              onClick={() => setCurrentView('builder')}
              className="bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
            >
              ثبت‌نام رایگان
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Separator className="my-3" />
            <div className="flex flex-col gap-2 px-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentView('dashboard')}
              >
                ورود
              </Button>
              <Button
                className="w-full bg-gradient-to-l from-indigo-600 to-violet-600 text-white"
                onClick={() => setCurrentView('builder')}
              >
                ثبت‌نام رایگان
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

/* ──────────────────────────── Hero Section ──────────────────────────── */

function HeroSection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  const stats = [
    { value: '۵۰,۰۰۰+', label: 'کاربر فعال' },
    { value: '۱+ میلیون', label: 'پاسخ ثبت‌شده' },
    { value: '۹۹.۹٪', label: 'آپتایم' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/80 via-violet-50/50 to-white" />
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200/10 to-violet-200/10 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
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
            className="mb-6 px-4 py-1.5 text-sm font-medium bg-indigo-100/80 text-indigo-700 border-indigo-200/50 cursor-default"
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
          <span className="text-gray-900">فرم‌ساز آنلاین</span>
          <br />
          <span className="bg-gradient-to-l from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            حرفه‌ای و هوشمند
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-gray-500 leading-relaxed"
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
            onClick={() => setCurrentView('builder')}
            className="w-full sm:w-auto min-w-[200px] h-13 text-base font-semibold bg-gradient-to-l from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all rounded-xl px-8"
          >
            شروع رایگان
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto min-w-[200px] h-13 text-base font-semibold rounded-xl px-8 border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all"
          >
            مشاهده نمونه‌ها
            <ChevronDown className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 mx-auto max-w-2xl"
        >
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-l from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Illustration / Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 relative"
        >
          <div className="relative mx-auto max-w-4xl">
            {/* Glow behind */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

            {/* Browser chrome mockup */}
            <div className="relative rounded-2xl border border-gray-200/60 bg-white shadow-2xl shadow-indigo-500/10 overflow-hidden">
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-gray-100 rounded-lg max-w-sm mx-auto flex items-center justify-center text-[10px] text-gray-400">
                    formsaz.ir/builder
                  </div>
                </div>
              </div>

              {/* Form preview content */}
              <div className="p-6 sm:p-10 bg-gradient-to-b from-white to-gray-50/50">
                <div className="max-w-lg mx-auto space-y-6">
                  {/* Fake form header */}
                  <div className="text-center space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-48 mx-auto" />
                    <div className="h-3 bg-gray-100 rounded w-72 mx-auto" />
                  </div>

                  {/* Fake form fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32" />
                      <div className="h-10 bg-gray-50 rounded-lg border border-gray-100" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-28" />
                      <div className="flex gap-3">
                        <div className="h-5 bg-gray-100 rounded w-24" />
                        <div className="h-5 bg-gray-100 rounded w-20" />
                        <div className="h-5 bg-gray-100 rounded w-16" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-36" />
                      <div className="h-24 bg-gray-50 rounded-lg border border-gray-100" />
                    </div>
                    <div className="pt-2">
                      <div className="h-11 bg-gradient-to-l from-indigo-500 to-violet-500 rounded-lg w-32 mx-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
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
    <section id="features" className="relative py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInSection className="text-center mb-16 sm:mb-20">
          <Badge
            variant="secondary"
            className="mb-4 px-3 py-1 text-xs font-medium bg-indigo-100/80 text-indigo-700 border-indigo-200/50"
          >
            ویژگی‌ها
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
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
              <Card className="group relative h-full border-gray-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/[0.06] transition-all duration-300 hover:-translate-y-1 cursor-default overflow-hidden">
                <CardContent className="p-6">
                  <div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg ${feature.shadowColor} mb-5`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
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
    },
    {
      number: '۲',
      icon: Share2,
      title: 'با مخاطبان به اشتراک بگذارید',
      description:
        'لینک فرم را از طریق ایمیل، شبکه‌های اجتماعی یا کد QR با مخاطبان به اشتراک بگذارید.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      number: '۳',
      icon: TrendingUp,
      title: 'نتایج را تحلیل کنید',
      description:
        'با داشبورد تحلیلی قدرتمند، نتایج را به صورت لحظه‌ای بررسی و گزارش بگیرید.',
      gradient: 'from-purple-500 to-fuchsia-500',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-white overflow-hidden">
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            چگونه کار می‌کند؟
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-500 leading-relaxed">
            تنها در سه مرحله ساده فرم خود را بسازید و نتایج را دریافت کنید.
          </p>
        </FadeInSection>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-20 right-[16%] left-[16%] h-0.5 bg-gradient-to-l from-indigo-200 via-violet-200 to-purple-200" />

          {steps.map((step, i) => (
            <FadeInSection key={i} delay={i * 0.15} className="relative">
              <div className="text-center">
                {/* Step number circle */}
                <div className="relative mx-auto mb-6">
                  <div
                    className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-xl shadow-indigo-500/20`}
                  >
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-2 -left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md border border-gray-100">
                    <span className="text-xs font-extrabold text-indigo-600">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </FadeInSection>
          ))}
        </div>
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
                className="border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow data-[state=open]:shadow-lg data-[state=open]:shadow-indigo-500/[0.05] data-[state=open]:border-indigo-100 overflow-hidden"
              >
                <AccordionTrigger className="px-6 py-4 text-right text-base font-semibold text-gray-900 hover:no-underline hover:text-indigo-600 transition-colors [&[data-state=open]>svg]:text-indigo-600">
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

/* ──────────────────────────── CTA Section ──────────────────────────── */

function CTASection() {
  const setCurrentView = useAppStore((s) => s.setCurrentView);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />

      {/* Glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <FadeInSection>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm">
            <Star className="h-4 w-4 text-yellow-300" />
            عضو بیش از ۵۰,۰۰۰ کاربر خوشحال شوید
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            همین حالا شروع کنید!
          </h2>
          <p className="mt-6 mx-auto max-w-xl text-lg text-indigo-100 leading-relaxed">
            ثبت‌نام در کمتر از ۳۰ ثانیه. بدون نیاز به کارت بانکی.
            <br />
            اولین فرم خود را همین امروز بسازید.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setCurrentView('builder')}
              className="w-full sm:w-auto min-w-[220px] h-14 text-base font-bold bg-white text-indigo-600 hover:bg-indigo-50 shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 transition-all rounded-xl px-10"
            >
              شروع رایگان
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Shield className="h-4 w-4" />
              بدون نیاز به کارت بانکی
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* ──────────────────────────── Footer ──────────────────────────── */

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
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
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">محصول</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">ویژگی‌ها</a></li>
              <li><a href="#use-cases" className="hover:text-white transition-colors">محیط‌های کاربردی</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">قیمت‌گذاری</a></li>
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
    </footer>
  );
}

/* ──────────────────────────── Main Landing Page ──────────────────────────── */

export default function LandingPage() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-white font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <UseCasesSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
