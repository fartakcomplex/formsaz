'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Search,
  Table2,
  Users,
  BarChart3,
  ListChecks,
  TrendingUp,
  Star,
  PieChart as PieChartIcon,
  AlertCircle,
  Eye,
  Activity,
  FileSpreadsheet,
  FileDown,
  Check,
  Filter,
  Printer,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';
import { useAppStore, type FormQuestion, type Submission } from '@/lib/store';
import { cn } from '@/lib/utils';

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed',
  '#6d28d9', '#4f46e5', '#4338ca', '#3730a3', '#312e81',
];

// Stagger animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

interface AnalyticsData {
  submissionCount: number;
  dailyCounts: { date: string; count: number }[];
  avgResponseTime: number | null;
  totalViews: number;
  completionRate: number;
  avgPerDay: number;
}

function formatPersianDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd MMMM', { locale: faIR });
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy - HH:mm', { locale: faIR });
  } catch {
    return dateStr;
  }
}

// ── Empty State SVG Illustration ──────────────────────────────────────────────
function EmptyStateIllustration() {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-48 sm:w-56 sm:h-56"
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="glow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.75 0.15 293 / 20%)" />
          <stop offset="100%" stopColor="oklch(0.75 0.15 293 / 0%)" />
        </radialGradient>
        <linearGradient id="docGrad" x1="60" y1="40" x2="140" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="oklch(0.92 0.04 293)" />
          <stop offset="100%" stopColor="oklch(0.95 0.02 293)" />
        </linearGradient>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Glow circle */}
      <circle cx="100" cy="100" r="90" fill="url(#glow1)" />

      {/* Document shape */}
      <rect x="55" y="35" width="90" height="120" rx="10" fill="url(#docGrad)" stroke="oklch(0.82 0.08 293 / 40%)" strokeWidth="1.5" />

      {/* Folded corner */}
      <path d="M120 35 L145 35 Q145 35 145 60 L125 60 Q120 60 120 55 Z" fill="oklch(0.88 0.06 293)" stroke="oklch(0.82 0.08 293 / 30%)" strokeWidth="1" />
      <path d="M120 35 L120 55 Q120 60 125 60 L145 60" fill="none" stroke="oklch(0.82 0.08 293 / 40%)" strokeWidth="1.5" />

      {/* Document lines (question marks) */}
      <rect x="72" y="70" width="56" height="4" rx="2" fill="oklch(0.82 0.06 293 / 35%)" />
      <rect x="72" y="82" width="40" height="4" rx="2" fill="oklch(0.82 0.06 293 / 25%)" />
      <rect x="72" y="94" width="50" height="4" rx="2" fill="oklch(0.82 0.06 293 / 35%)" />
      <rect x="72" y="106" width="36" height="4" rx="2" fill="oklch(0.82 0.06 293 / 25%)" />

      {/* Checkbox row */}
      <rect x="72" y="122" width="14" height="14" rx="3" fill="none" stroke="oklch(0.65 0.15 293 / 50%)" strokeWidth="1.5" />
      <rect x="92" y="125" width="30" height="3" rx="1.5" fill="oklch(0.82 0.06 293 / 30%)" />

      {/* Mini bar chart overlay */}
      <rect x="75" y="142" width="8" height="8" rx="2" fill="url(#barGrad)" opacity="0.8" />
      <rect x="88" y="138" width="8" height="12" rx="2" fill="url(#barGrad)" opacity="0.9" />
      <rect x="101" y="135" width="8" height="15" rx="2" fill="url(#barGrad)" />
      <rect x="114" y="140" width="8" height="10" rx="2" fill="url(#barGrad)" opacity="0.7" />

      {/* Floating question mark */}
      <g transform="translate(155, 50)">
        <circle cx="0" cy="0" r="14" fill="#8b5cf6" opacity="0.12" />
        <text x="0" y="5" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#8b5cf6" opacity="0.7">?</text>
      </g>

      {/* Floating star */}
      <g transform="translate(40, 55)">
        <circle cx="0" cy="0" r="10" fill="#f59e0b" opacity="0.1" />
        <path d="M0,-6 L1.5,-2 L6,-2 L2.5,1 L4,5.5 L0,3 L-4,5.5 L-2.5,1 L-6,-2 L-1.5,-2 Z" fill="#f59e0b" opacity="0.4" />
      </g>

      {/* Pulse ring (animated via CSS) */}
      <circle cx="100" cy="165" r="8" fill="#8b5cf6" opacity="0.15">
        <animate attributeName="r" values="6;14;6" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0;0.2" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="165" r="6" fill="#8b5cf6" opacity="0.5">
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="relative flex items-center gap-4 rounded-2xl border bg-gradient-to-bl from-white via-violet-50/20 to-purple-50/10 dark:from-gray-900 dark:via-violet-950/20 dark:to-purple-950/10 p-4 sm:p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 dark:border-gray-800 overflow-hidden"
    >
      <div className={`relative flex size-12 items-center justify-center rounded-xl ${color} dark:opacity-80`}>
        {icon}
      </div>
      <div className="relative flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

function ChoiceQuestionChart({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');

  const options = question.config.options || [];
  const counts: Record<string, number> = {};

  options.forEach((opt) => {
    counts[opt.id] = 0;
  });

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value) {
      if (question.type === 'multiple_select') {
        const selectedIds = response.value.split(',').filter(Boolean);
        selectedIds.forEach((id) => {
          if (counts[id] !== undefined) {
            counts[id]++;
          }
        });
      } else {
        if (counts[response.value] !== undefined) {
          counts[response.value]++;
        }
      }
    }
  });

  const chartData = options.map((opt, idx) => ({
    name: opt.text,
    count: counts[opt.id] || 0,
    fill: COLORS[idx % COLORS.length],
  }));

  const totalResponses = Object.values(counts).reduce((a, b) => a + b, 0);

  const chartConfig: ChartConfig = {};
  options.forEach((opt, idx) => {
    chartConfig[opt.id] = {
      label: opt.text,
      color: COLORS[idx % COLORS.length],
    };
  });

  // Pie chart data with nameKey matching config keys
  const pieData = options.map((opt, idx) => ({
    name: opt.id,
    value: counts[opt.id] || 0,
    fill: COLORS[idx % COLORS.length],
    label: opt.text,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{question.title}</h4>
        <div className="flex items-center gap-3">
          {totalResponses > 0 && (
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={(v) => v && setChartType(v as 'bar' | 'pie')}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 h-7"
            >
              <ToggleGroupItem
                value="bar"
                className="rounded-md px-2 h-6 text-xs data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:shadow-sm"
              >
                <BarChart3 className="size-3 ml-1" />
                ستونی
              </ToggleGroupItem>
              <ToggleGroupItem
                value="pie"
                className="rounded-md px-2 h-6 text-xs data-[state=on]:bg-white dark:data-[state=on]:bg-gray-700 data-[state=on]:shadow-sm"
              >
                <PieChartIcon className="size-3 ml-1" />
                دایره‌ای
              </ToggleGroupItem>
            </ToggleGroup>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">{totalResponses} پاسخ</span>
        </div>
      </div>
      {totalResponses === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          هنوز پاسخی ثبت نشده
        </div>
      ) : chartType === 'pie' ? (
        <>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={45}
                paddingAngle={2}
                strokeWidth={2}
                stroke="white"
                className="dark:stroke-gray-900"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-3">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-gray-600 dark:text-gray-400">{entry.name}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {totalResponses > 0
                    ? Math.round((entry.count / totalResponses) * 100)
                    : 0}
                  %
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <ChartContainer config={chartConfig} className="h-56 w-full">
            <BarChart data={chartData} layout="vertical" margin={{ right: 0, left: 0, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="name"
                type="category"
                width={120}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-3">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div
                  className="size-3 rounded-sm"
                  style={{ backgroundColor: entry.fill }}
                />
                <span className="text-gray-600 dark:text-gray-400">{entry.name}</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {totalResponses > 0
                    ? Math.round((entry.count / totalResponses) * 100)
                    : 0}
                  %
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RatingQuestionChart({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const maxRating = question.config.max ?? 5;
  const counts: Record<number, number> = {};
  for (let i = 1; i <= maxRating; i++) counts[i] = 0;

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value) {
      const num = parseInt(response.value, 10);
      if (num >= 1 && num <= maxRating) {
        counts[num]++;
      }
    }
  });

  const totalResponses = Object.values(counts).reduce((a, b) => a + b, 0);
  const avgRating =
    totalResponses > 0
      ? Object.entries(counts).reduce(
          (sum, [rating, count]) => sum + parseInt(rating) * count,
          0
        ) / totalResponses
      : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{question.title}</h4>
        <span className="text-xs text-gray-400 dark:text-gray-500">{totalResponses} پاسخ</span>
      </div>
      <div className="flex items-center gap-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 border border-amber-100 dark:border-amber-900/50">
        <div className="text-center">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{avgRating.toFixed(1)}</div>
          <div className="flex items-center gap-0.5 mt-1 justify-center">
            {Array.from({ length: maxRating }, (_, i) => (
              <Star
                key={i}
                className={`size-4 ${
                  i < Math.round(avgRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-amber-500 dark:text-amber-400 mt-1">میانگین امتیاز</div>
        </div>
        <div className="flex-1 space-y-1.5">
          {Object.entries(counts).map(([rating, count]) => {
            const percent = totalResponses > 0 ? (count / totalResponses) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-4">{rating}</span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 w-6 text-left">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScaleQuestionChart({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const min = question.config.scaleMin ?? 1;
  const max = question.config.scaleMax ?? 10;
  const counts: Record<number, number> = {};
  for (let i = min; i <= max; i++) counts[i] = 0;

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value) {
      const num = parseInt(response.value, 10);
      if (num >= min && num <= max) {
        counts[num]++;
      }
    }
  });

  const totalResponses = Object.values(counts).reduce((a, b) => a + b, 0);
  const avgValue =
    totalResponses > 0
      ? Object.entries(counts).reduce(
          (sum, [val, count]) => sum + parseInt(val) * count,
          0
        ) / totalResponses
      : 0;

  const chartData = Object.entries(counts).map(([val, count], idx) => ({
    name: val,
    count,
    fill: COLORS[idx % COLORS.length],
  }));

  const chartConfig: ChartConfig = {
    count: { label: 'تعداد', color: '#6366f1' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{question.title}</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">{totalResponses} پاسخ</span>
          <Badge variant="outline" className="text-xs font-medium text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30">
            میانگین: {avgValue.toFixed(1)}
          </Badge>
        </div>
      </div>
      {totalResponses === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          هنوز پاسخی ثبت نشده
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={chartData} margin={{ right: 0, left: 0, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
}

function TextQuestionSummary({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const responses = submissions
    .map((sub) => {
      const response = sub.responses.find((r) => r.questionId === question.id);
      return response?.value;
    })
    .filter(Boolean);

  if (responses.length === 0) {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{question.title}</h4>
        <p className="text-sm text-gray-400 dark:text-gray-500 py-4 text-center">هنوز پاسخی ثبت نشده</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{question.title}</h4>
        <span className="text-xs text-gray-400 dark:text-gray-500">{responses.length} پاسخ</span>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 p-3 dark:border-gray-800">
        {responses.map((response, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-[10px] font-bold shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{response}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function YesNoQuestionChart({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  let yesCount = 0;
  let noCount = 0;

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value === 'yes') yesCount++;
    if (response?.value === 'no') noCount++;
  });

  const total = yesCount + noCount;
  const yesPercent = total > 0 ? Math.round((yesCount / total) * 100) : 0;
  const noPercent = total > 0 ? 100 - yesPercent : 0;

  const donutData = total > 0
    ? [
        { name: 'yes', value: yesCount, fill: '#10b981' },
        { name: 'no', value: noCount, fill: '#ef4444' },
      ]
    : [];

  const donutConfig: ChartConfig = {
    yes: { label: 'بله', color: '#10b981' },
    no: { label: 'خیر', color: '#ef4444' },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{question.title}</h4>
        <span className="text-xs text-gray-400 dark:text-gray-500">{total} پاسخ</span>
      </div>
      {total === 0 ? (
        <div className="flex items-center justify-center py-8 text-gray-400 dark:text-gray-500 text-sm">
          هنوز پاسخی ثبت نشده
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Donut Chart */}
          <div className="relative flex-shrink-0">
            <ChartContainer config={donutConfig} className="h-40 w-40">
              <PieChart>
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={42}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={2}
                  stroke="white"
                  className="dark:stroke-gray-900"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{yesPercent}%</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">بله</span>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="flex-1 w-full grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 p-4 text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{yesPercent}%</div>
              <div className="text-sm text-emerald-500 dark:text-emerald-400 mt-1">بله ({yesCount})</div>
              <div className="mt-2 h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${yesPercent}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 p-4 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{noPercent}%</div>
              <div className="text-sm text-red-500 dark:text-red-400 mt-1">خیر ({noCount})</div>
              <div className="mt-2 h-1.5 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${noPercent}%` }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="h-full bg-red-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helper: Resolve question response value for display ─────────────────────
function resolveResponseValue(question: FormQuestion, value: string): string {
  if (!value) return '';
  const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown'];
  if (choiceTypes.includes(question.type)) {
    if (question.type === 'multiple_select') {
      const ids = value.split(',').filter(Boolean);
      const texts = ids.map((id) => {
        const opt = question.config.options?.find((o) => o.id === id);
        return opt ? opt.text : id;
      });
      return texts.join(' | ');
    }
    const opt = question.config.options?.find((o) => o.id === value);
    return opt ? opt.text : value;
  }
  if (question.type === 'yes_no') {
    return value === 'yes' ? 'بله' : value === 'no' ? 'خیر' : value;
  }
  if (question.type === 'rating') {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      return '★'.repeat(num);
    }
    return value;
  }
  const textTypes = ['short_text', 'long_text', 'email', 'phone'];
  if (textTypes.includes(question.type)) {
    return value.length > 50 ? value.slice(0, 50) + '...' : value;
  }
  return value;
}

function QuestionResponseList({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const responses = useMemo(() => {
    return submissions
      .map((sub) => {
        const response = sub.responses.find((r) => r.questionId === question.id);
        if (!response?.value) return null;
        return {
          id: sub.id,
          date: sub.createdAt,
          value: resolveResponseValue(question, response.value),
        };
      })
      .filter(Boolean);
  }, [submissions, question]);

  const handleCopy = async () => {
    const text = responses
      .map((r, idx) => `${idx + 1}. ${formatDate(r.date)}\n${r.value}`)
      .join('\n─────────\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
      >
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
        مشاهده همه پاسخ‌ها ({responses.length})
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">لیست پاسخ‌های ثبت شده</span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[10px] font-medium text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                کپی پاسخ‌ها
              </button>
            </div>
            <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 p-3 dark:border-gray-800 space-y-2">
              {responses.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">بدون پاسخ</p>
              ) : (
                responses.map((r, idx) => (
                  <div
                    key={r.id}
                    className="flex flex-col gap-0.5 text-sm p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">پاسخ‌دهنده {idx + 1}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{formatDate(r.date)}</span>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{r.value}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionSummary({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown'];
  const textTypes = ['short_text', 'long_text', 'email', 'phone', 'file_upload'];
  const otherTypes = ['statement', 'number', 'date', 'section_divider'];

  // Count responses for this question
  const responseCount = useMemo(() => {
    return submissions.filter((sub) => {
      const r = sub.responses.find((resp) => resp.questionId === question.id);
      return r?.value && r.value.trim() !== '';
    }).length;
  }, [submissions, question.id]);

  if (choiceTypes.includes(question.type)) {
    return <ChoiceQuestionChart question={question} submissions={submissions} />;
  }
  if (question.type === 'rating') {
    return <RatingQuestionChart question={question} submissions={submissions} />;
  }
  if (question.type === 'scale') {
    return <ScaleQuestionChart question={question} submissions={submissions} />;
  }
  if (question.type === 'yes_no') {
    return <YesNoQuestionChart question={question} submissions={submissions} />;
  }
  if (textTypes.includes(question.type) || otherTypes.includes(question.type)) {
    return <TextQuestionSummary question={question} submissions={submissions} />;
  }
  return null;
}

// ── Mini Pie Card for the overview tab ──────────────────────────────────────
function MiniPieCard({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown'];

  if (!choiceTypes.includes(question.type) && question.type !== 'yes_no') {
    return null;
  }

  if (question.type === 'yes_no') {
    let yesCount = 0;
    let noCount = 0;
    submissions.forEach((sub) => {
      const response = sub.responses.find((r) => r.questionId === question.id);
      if (response?.value === 'yes') yesCount++;
      if (response?.value === 'no') noCount++;
    });
    const total = yesCount + noCount;
    if (total === 0) {
      return (
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{question.title}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">بدون پاسخ</p>
          </CardContent>
        </Card>
      );
    }
    const data = [
      { name: 'yes', value: yesCount, fill: '#10b981' },
      { name: 'no', value: noCount, fill: '#ef4444' },
    ];
    const config: ChartConfig = {
      yes: { label: 'بله', color: '#10b981' },
      no: { label: 'خیر', color: '#ef4444' },
    };
    return (
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{question.title}</p>
          <div className="relative">
            <ChartContainer config={config} className="h-28 w-28 mx-auto">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  innerRadius={28}
                  startAngle={90}
                  endAngle={-270}
                  strokeWidth={2}
                  stroke="white"
                  className="dark:stroke-gray-900"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((yesCount / total) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>بله: {yesCount}</span>
            <span>خیر: {noCount}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Choice question pie
  const options = question.config.options || [];
  const counts: Record<string, number> = {};
  options.forEach((opt) => { counts[opt.id] = 0; });
  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value) {
      if (question.type === 'multiple_select') {
        response.value.split(',').filter(Boolean).forEach((id) => {
          if (counts[id] !== undefined) counts[id]++;
        });
      } else {
        if (counts[response.value] !== undefined) counts[response.value]++;
      }
    }
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) {
    return (
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">{question.title}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-6">بدون پاسخ</p>
        </CardContent>
      </Card>
    );
  }

  const pieData = options.map((opt, idx) => ({
    name: opt.id,
    value: counts[opt.id] || 0,
    fill: COLORS[idx % COLORS.length],
  }));
  const config: ChartConfig = {};
  options.forEach((opt, idx) => {
    config[opt.id] = { label: opt.text, color: COLORS[idx % COLORS.length] };
  });

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-4 space-y-3">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">{question.title}</p>
        <div className="relative">
          <ChartContainer config={config} className="h-28 w-28 mx-auto">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={50}
                innerRadius={28}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                strokeWidth={2}
                stroke="white"
                className="dark:stroke-gray-900"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-gray-900 dark:text-gray-100">{total}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {options.slice(0, 3).map((opt, idx) => {
            const pct = total > 0 ? Math.round(((counts[opt.id] || 0) / total) * 100) : 0;
            return (
              <div key={opt.id} className="flex items-center gap-1 text-[10px]">
                <div className="size-2 rounded-sm" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-gray-500 dark:text-gray-400">{opt.text.length > 12 ? opt.text.slice(0, 12) + '…' : opt.text}</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">{pct}%</span>
              </div>
            );
          })}
          {options.length > 3 && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500">+{options.length - 3} مورد</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function IndividualResponse({
  submission,
  questions,
  index,
}: {
  submission: Submission;
  questions: FormQuestion[];
  index: number;
}) {
  return (
    <AccordionItem value={submission.id} className="border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden transition-shadow duration-200 hover:shadow-sm">
      <AccordionTrigger className="hover:bg-violet-50/50 dark:hover:bg-violet-950/20 rounded-lg px-4 transition-colors duration-200">
        <div className="flex items-center gap-3 text-right">
          <div className="flex size-8 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-xs font-bold shrink-0">
            {index + 1}
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              پاسخ‌دهنده {index + 1}
            </span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {formatDate(submission.createdAt)}
            </p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3 rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 p-4 dark:border-gray-800 hover:border-violet-200 dark:hover:border-violet-800/50 transition-colors duration-200">
          {questions.map((q) => {
            const response = submission.responses.find((r) => r.questionId === q.id);
            return (
              <div key={q.id} className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{q.title}</span>
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  {response?.value || '—'}
                </span>
                {q !== questions[questions.length - 1] && (
                  <Separator className="mt-2 bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-2xl" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

// ── Helper: Convert digits to Persian numerals ─────────────────────────────
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
function toPersianDigits(num: number): string {
  return num.toString().replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

// ── Helper: Format response time (seconds) to Persian string ────────────────
function formatResponseTime(seconds: number): string {
  if (seconds < 60) {
    return `${toPersianDigits(Math.round(seconds))} ثانیه`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) {
    if (remainingSeconds === 0) {
      return `${toPersianDigits(minutes)} دقیقه`;
    }
    return `${toPersianDigits(minutes)} دقیقه و ${toPersianDigits(remainingSeconds)} ثانیه`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${toPersianDigits(hours)} ساعت`;
  }
  return `${toPersianDigits(hours)} ساعت و ${toPersianDigits(remainingMinutes)} دقیقه`;
}

// ── Helper: Format cell value for table display ─────────────────────────────
function formatCellDisplay(question: FormQuestion, rawValue: string | null | undefined): string {
  if (!rawValue) return '—';
  const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown'];
  if (choiceTypes.includes(question.type)) {
    if (question.type === 'multiple_select') {
      const ids = rawValue.split(',').filter(Boolean);
      const texts = ids.map((id) => {
        const opt = question.config.options?.find((o) => o.id === id);
        return opt ? opt.text : id;
      });
      return texts.join(' | ');
    }
    const opt = question.config.options?.find((o) => o.id === rawValue);
    return opt ? opt.text : rawValue;
  }
  if (question.type === 'yes_no') {
    return rawValue === 'yes' ? 'بله' : rawValue === 'no' ? 'خیر' : rawValue;
  }
  if (question.type === 'rating') {
    const num = parseInt(rawValue, 10);
    if (!isNaN(num) && num > 0) {
      return `${toPersianDigits(num)} ستاره`;
    }
    return rawValue;
  }
  const textTypes = ['short_text', 'long_text', 'email', 'phone'];
  if (textTypes.includes(question.type)) {
    return rawValue.length > 50 ? rawValue.slice(0, 50) + '...' : rawValue;
  }
  return rawValue;
}

// ── Responses Data Table Component ──────────────────────────────────────────
function ResponsesDataTable({
  questions,
  submissions,
}: {
  questions: FormQuestion[];
  submissions: Submission[];
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showDateFilter, setShowDateFilter] = useState(false);

  const filteredSubmissions = useMemo(() => {
    let result = submissions;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((sub) => {
        return sub.responses.some((r) => {
          if (!r.value) return false;
          const question = questions.find((q) => q.id === r.questionId);
          if (!question) return false;
          const displayValue = formatCellDisplay(question, r.value).toLowerCase();
          return displayValue.includes(query);
        });
      });
    }
    if (dateFrom) {
      result = result.filter((sub) => sub.createdAt >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((sub) => sub.createdAt <= dateTo + 'T23:59:59');
    }
    return result;
  }, [submissions, searchQuery, questions, dateFrom, dateTo]);

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Table2 className="size-4 text-violet-500" />
              جدول پاسخ‌ها
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredSubmissions.length} پاسخ
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <Input
                placeholder="جستجو در پاسخ‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pr-9 pl-3 text-sm rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                dir="rtl"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDateFilter(!showDateFilter)}
              className={cn(
                'h-9 gap-1.5 text-xs rounded-lg transition-all duration-200',
                showDateFilter
                  ? 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950/30 dark:border-violet-800 dark:text-violet-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              <Filter className="size-3.5" />
              فیلتر تاریخ
            </Button>
          </div>
          {showDateFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 mt-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">از:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-8 text-xs rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 focus-visible:ring-violet-500/40"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">تا:</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-8 text-xs rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 focus-visible:ring-violet-500/40"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearDateFilter}
                className="h-8 text-xs text-gray-500 hover:text-red-500 px-2"
              >
                پاک کردن
              </Button>
            </motion.div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <th className="sticky right-0 z-10 bg-zinc-100 dark:bg-zinc-900 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 px-4 py-3 min-w-[140px] whitespace-nowrap shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3 text-violet-500" />
                    تاریخ ثبت
                  </div>
                </th>
                {questions.map((q) => (
                  <th
                    key={q.id}
                    className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400 px-4 py-3 min-w-[150px] max-w-[200px]"
                  >
                    <span className="truncate block max-w-[180px]" title={q.title}>{q.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={questions.length + 1} className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
                    {searchQuery ? 'پاسخی با این مشخصات یافت نشد' : 'بدون پاسخ'}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition-colors duration-150"
                  >
                    <td className="sticky right-0 z-10 bg-white dark:bg-zinc-900 text-xs text-gray-600 dark:text-gray-400 px-4 py-3 whitespace-nowrap font-medium shadow-[2px_0_4px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_4px_-2px_rgba(0,0,0,0.3)] hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition-colors duration-150">
                      {formatDate(sub.createdAt)}
                    </td>
                    {questions.map((q) => {
                      const response = sub.responses.find((r) => r.questionId === q.id);
                      const displayValue = formatCellDisplay(q, response?.value);
                      return (
                        <td key={q.id} className="text-xs text-gray-700 dark:text-gray-300 px-4 py-3 max-w-[200px]">
                          <span className="truncate block max-w-[180px]" title={displayValue}>
                            {displayValue}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResultsView() {
  const {
    currentForm,
    setCurrentView,
    submissions,
    setSubmissions,
  } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const questions = useMemo(() => {
    if (!currentForm?.questions) return [];
    return [...currentForm.questions].sort((a, b) => a.order - b.order);
  }, [currentForm]);

  const inputQuestions = useMemo(
    () => questions.filter((q) => q.type !== 'statement'),
    [questions]
  );

  const fetchSubmissions = useCallback(async () => {
    if (!currentForm?.id) return;
    try {
      setLoading(true);
      const [subRes, analyticsRes] = await Promise.all([
        fetch(`/api/forms/${currentForm.id}/submissions`),
        fetch(`/api/forms/${currentForm.id}/analytics`),
      ]);
      if (subRes.ok) {
        const data = await subRes.json();
        setSubmissions(data);
      }
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [currentForm?.id, setSubmissions]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const completionRate = useMemo(() => {
    if (submissions.length === 0) return 0;
    const completed = submissions.filter((sub) => {
      return inputQuestions.every((q) =>
        sub.responses.find((r) => r.questionId === q.id && r.value)
      );
    });
    return Math.round((completed.length / submissions.length) * 100);
  }, [submissions, inputQuestions]);

  // Questions that can show pie charts (choice + yes_no)
  const pieEligibleQuestions = useMemo(
    () => inputQuestions.filter((q) => {
      const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown'];
      return choiceTypes.includes(q.type) || q.type === 'yes_no';
    }),
    [inputQuestions]
  );

  const handleExport = () => {
    const csvRows: string[] = [];

    // Helper: escape CSV value (handle quotes, commas, newlines)
    const escapeCsv = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };

    // Row 1: Form title
    csvRows.push(`${escapeCsv(currentForm?.title || 'فرم')}`);

    // Row 2: Download date
    csvRows.push(`تاریخ دانلود,${escapeCsv(format(new Date(), 'yyyy-MM-dd HH:mm:ss'))}`);

    // Row 3: Date range of submissions
    if (submissions.length > 0) {
      const sorted = [...submissions].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const firstDate = format(new Date(sorted[0].createdAt), 'yyyy-MM-dd HH:mm');
      const lastDate = format(new Date(sorted[sorted.length - 1].createdAt), 'yyyy-MM-dd HH:mm');
      csvRows.push(`بازه زمانی پاسخ‌ها,${firstDate} تا ${lastDate}`);
    } else {
      csvRows.push('بازه زمانی پاسخ‌ها,بدون پاسخ');
    }

    // Empty separator row
    csvRows.push('');

    // Column headers: question titles
    const headers = [
      'شماره',
      'تاریخ ثبت',
      ...inputQuestions.map((q) => escapeCsv(q.title)),
    ];
    csvRows.push(headers.join(','));

    // Data rows: one per submission
    submissions.forEach((sub, idx) => {
      const row = [
        (idx + 1).toString(),
        escapeCsv(format(new Date(sub.createdAt), 'yyyy-MM-dd HH:mm')),
        ...inputQuestions.map((q) => {
          const response = sub.responses.find((r) => r.questionId === q.id);
          let value = response?.value || '';
          // Resolve option text for choice questions
          if (value && (q.type === 'multiple_choice' || q.type === 'dropdown')) {
            const option = q.config.options?.find((opt) => opt.id === value);
            if (option) value = option.text;
          } else if (value && q.type === 'multiple_select') {
            const selectedIds = value.split(',').filter(Boolean);
            const texts = selectedIds.map((sid) => {
              const opt = q.config.options?.find((o) => o.id === sid);
              return opt ? opt.text : sid;
            });
            value = texts.join(' | ');
          } else if (q.type === 'yes_no') {
            value = value === 'yes' ? 'بله' : value === 'no' ? 'خیر' : value;
          }
          return escapeCsv(value);
        }),
      ];
      csvRows.push(row.join(','));
    });

    // Empty separator row
    csvRows.push('');

    // Summary statistics
    csvRows.push('خلاصه آمار');
    csvRows.push(`تعداد کل پاسخ‌ها,${submissions.length}`);
    csvRows.push(`نرخ تکمیل,${completionRate}%`);
    csvRows.push(`تعداد سؤالات,${inputQuestions.length}`);

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentForm?.title || 'form'}_responses.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!currentForm) {
    return (
      <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-500">فرمی انتخاب نشده</p>
      </div>
    );
  }

  const isExpired = currentForm.expiresAt && new Date(currentForm.expiresAt) < new Date();

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Gradient accent bar at top */}
        <div
          className="h-1 rounded-full mb-6 sm:mb-8"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #a78bfa, #7c3aed, #8b5cf6)',
            backgroundSize: '200% 100%',
          }}
        />

        {/* Expiration Warning */}
        {isExpired && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 mb-6"
          >
            <AlertCircle className="size-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                این فرم منقضی شده است
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                مهلت پاسخگویی به این فرم به پایان رسیده و پاسخ‌های جدیدی ثبت نخواهد شد.
              </p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentView('dashboard')}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowRight className="size-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BarChart3 className="size-6 text-violet-500" />
                نتایج فرم
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{currentForm.title}</p>
              {currentForm.description && (
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                  {currentForm.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/api/export/pdf?formId=${currentForm.id}`, '_blank')}
              className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:border-violet-800 transition-colors duration-200"
              disabled={submissions.length === 0}
            >
              <FileDown className="size-4 ml-2" />
              خروجی PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:border-violet-800 transition-colors duration-200"
              disabled={submissions.length === 0}
            >
              <FileSpreadsheet className="size-4 ml-2" />
              خروجی CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:border-violet-800 transition-colors duration-200 sm:hidden"
              disabled={submissions.length === 0}
            >
              <Download className="size-4 ml-2" />
              CSV
            </Button>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 sm:py-24"
          >
            {/* SVG Illustration */}
            <div className="relative mb-6">
              <EmptyStateIllustration />
            </div>
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">هنوز پاسخی ثبت نشده</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm text-center leading-relaxed">
              با به اشتراک‌گذاری لینک فرم، پاسخ‌دهندگان می‌توانند فرم شما را پر کنند.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <div className="size-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span>منتظر اولین پاسخ باشید</span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {/* Analytics Overview Cards */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <StatCard
                icon={<Users className="size-5 text-white" />}
                label="کل پاسخ‌ها"
                value={analytics?.submissionCount ?? submissions.length}
                color="bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700"
                delay={0}
              />
              <StatCard
                icon={<Eye className="size-5 text-white" />}
                label="کل بازدیدها"
                value={analytics?.totalViews ?? 0}
                color="bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700"
                delay={0.05}
              />
              <StatCard
                icon={<TrendingUp className="size-5 text-white" />}
                label="نرخ تکمیل"
                value={`${analytics?.completionRate ?? completionRate}%`}
                color="bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700"
                delay={0.1}
              />
              <StatCard
                icon={<Activity className="size-5 text-white" />}
                label="میانگین روزانه"
                value={analytics?.avgPerDay ?? 0}
                color="bg-gradient-to-br from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700"
                delay={0.15}
              />
              <StatCard
                icon={<Clock className="size-5 text-white" />}
                label="میانگین زمان پاسخ‌دهی"
                value={analytics?.avgResponseTime ? formatResponseTime(analytics.avgResponseTime) : 'بدون داده'}
                subtitle={analytics?.avgResponseTime ? undefined : 'هنوز پاسخی ثبت نشده'}
                color="bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700"
                delay={0.2}
              />
            </motion.div>

            {/* Submission Timeline Chart */}
            {analytics?.dailyCounts && analytics.dailyCounts.length > 0 && (
              <motion.div
                variants={staggerItem}
                className="mb-6 sm:mb-8 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-bl from-white via-violet-50/10 to-purple-50/5 dark:from-gray-900 dark:via-violet-950/10 dark:to-purple-950/5 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/40">
                    <BarChart3 className="size-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">آمار پاسخ‌ها</h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mr-auto">۳۰ روز گذشته</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={analytics.dailyCounts} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="timelineGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickFormatter={(val: string) => formatPersianDate(val)}
                      tickLine={false}
                      axisLine={{ stroke: '#e5e7eb' }}
                      className="dark:[&]:stroke-gray-700"
                      interval={4}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-lg border bg-white dark:bg-gray-900 shadow-lg p-3 text-right" dir="rtl">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                              {formatPersianDate(label as string)}
                            </p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                              {payload[0].value} پاسخ
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      fill="url(#timelineGradient)"
                      dot={false}
                      activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 h-10 mb-6">
                <TabsTrigger value="summary" className="rounded-lg text-sm font-medium">
                  <BarChart3 className="size-4 ml-1.5" />
                  خلاصه سؤالات
                </TabsTrigger>
                <TabsTrigger value="pie-overview" className="rounded-lg text-sm font-medium">
                  <PieChartIcon className="size-4 ml-1.5" />
                  نمودار دایره‌ای
                </TabsTrigger>
                <TabsTrigger value="responses-table" className="rounded-lg text-sm font-medium">
                  <Table2 className="size-4 ml-1.5" />
                  جدول پاسخ‌ها
                </TabsTrigger>
                <TabsTrigger value="individual" className="rounded-lg text-sm font-medium">
                  <Users className="size-4 ml-1.5" />
                  پاسخ‌های فردی
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-4"
                >
                  {questions
                    .filter((q) => q.type !== 'statement')
                    .map((question) => {
                      const qResponseCount = submissions.filter((sub) => {
                        const r = sub.responses.find((resp) => resp.questionId === question.id);
                        return r?.value && r.value.trim() !== '';
                      }).length;
                      return (
                        <motion.div
                          key={question.id}
                          variants={staggerItem}
                        >
                          <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <CardContent className="p-5 sm:p-6">
                              <QuestionSummary
                                question={question}
                                submissions={submissions}
                              />
                              <QuestionResponseList
                                question={question}
                                submissions={submissions}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                </motion.div>
              </TabsContent>

              <TabsContent value="pie-overview">
                {pieEligibleQuestions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                      <PieChartIcon className="size-8 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      سؤالی با گزینه‌های انتخابی یا بله/خیر یافت نشد
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {pieEligibleQuestions.map((question) => (
                      <motion.div
                        key={question.id}
                        variants={staggerItem}
                      >
                        <MiniPieCard question={question} submissions={submissions} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="responses-table">
                <ResponsesDataTable
                  questions={inputQuestions}
                  submissions={submissions}
                />
              </TabsContent>

              <TabsContent value="individual">
                {/* Response statistics summary row */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-violet-50/80 to-purple-50/60 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-100 dark:border-violet-900/50 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                    <Users className="size-4 text-violet-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">مجموع:</span>
                    <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 border-0 text-xs font-semibold">
                      {toPersianDigits(submissions.length)} پاسخ
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-50/80 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-100 dark:border-amber-900/50 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                    <Clock className="size-4 text-amber-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">میانگین زمان تکمیل:</span>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-0 text-xs font-semibold">
                      {analytics?.avgResponseTime ? formatResponseTime(analytics.avgResponseTime) : 'بدون داده'}
                    </Badge>
                  </div>
                </div>

                {/* Export options row */}
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:border-violet-800 transition-colors duration-200"
                    disabled={submissions.length === 0}
                    onClick={handleExport}
                    title="خروجی CSV"
                  >
                    <FileSpreadsheet className="size-4 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:border-violet-800 transition-colors duration-200"
                    disabled={submissions.length === 0}
                    onClick={() => toast.info('خروجی PDF')}
                    title="خروجی PDF"
                  >
                    <FileDown className="size-4 text-red-600 dark:text-red-400" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-lg border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:border-violet-800 transition-colors duration-200"
                    onClick={() => window.print()}
                    title="چاپ"
                  >
                    <Printer className="size-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                </div>

                <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-gray-900 dark:text-gray-100">
                      لیست پاسخ‌ها ({submissions.length})
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      برای مشاهده جزئیات هر پاسخ روی آن کلیک کنید
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {submissions.map((sub, idx) => (
                        <IndividualResponse
                          key={sub.id}
                          submission={sub}
                          questions={questions}
                          index={idx}
                        />
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
