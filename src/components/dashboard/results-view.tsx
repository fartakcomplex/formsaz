'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { faIR } from 'date-fns/locale';
import {
  ArrowRight,
  Download,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  FileText,
  ListChecks,
  TrendingUp,
  Star,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
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
import { useAppStore, type FormQuestion, type Submission } from '@/lib/store';

const COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed',
  '#6d28d9', '#4f46e5', '#4338ca', '#3730a3', '#312e81',
];

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'dd MMMM yyyy - HH:mm', { locale: faIR });
  } catch {
    return dateStr;
  }
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 rounded-2xl border bg-white dark:bg-gray-900 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow dark:border-gray-800"
    >
      <div className={`flex size-12 items-center justify-center rounded-xl ${color} dark:opacity-80`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
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
          <Badge variant="outline" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30">
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
            <div className="flex size-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold shrink-0 mt-0.5">
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

function QuestionSummary({
  question,
  submissions,
}: {
  question: FormQuestion;
  submissions: Submission[];
}) {
  const choiceTypes = ['multiple_choice', 'multiple_select', 'dropdown'];
  const textTypes = ['short_text', 'long_text', 'email', 'phone', 'file_upload'];
  const otherTypes = ['statement', 'number', 'date'];

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
        <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
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
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
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
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
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
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
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
    <AccordionItem value={submission.id} className="border-gray-200 dark:border-gray-800">
      <AccordionTrigger className="hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg px-4">
        <div className="flex items-center gap-3 text-right">
          <div className="flex size-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold shrink-0">
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
      <AccordionContent className="px-4">
        <div className="space-y-3 rounded-xl border bg-gray-50/50 dark:bg-gray-900/50 p-4 dark:border-gray-800">
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-12 w-80 rounded-xl" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-2xl" />
        ))}
      </div>
    </div>
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
      const res = await fetch(`/api/forms/${currentForm.id}/submissions`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
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
    // Placeholder for export functionality
    const csvRows: string[] = [];
    const headers = questions.map((q) => `"${q.title}"`);
    csvRows.push(headers.join(','));

    submissions.forEach((sub) => {
      const row = questions.map((q) => {
        const response = sub.responses.find((r) => r.questionId === q.id);
        return `"${response?.value || ''}"`;
      });
      csvRows.push(row.join(','));
    });

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

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
                <BarChart3 className="size-6 text-indigo-500" />
                نتایج فرم
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{currentForm.title}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-indigo-50 hover:border-indigo-200 dark:hover:bg-indigo-950/30 dark:hover:border-indigo-800"
            disabled={submissions.length === 0}
          >
            <Download className="size-4 ml-2" />
            دانلود CSV
          </Button>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : submissions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="flex size-20 items-center justify-center rounded-3xl bg-gray-100 dark:bg-gray-800 mb-6">
              <ListChecks className="size-10 text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">هنوز پاسخی ثبت نشده</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm text-center">
              با به اشتراک‌گذاری لینک فرم، پاسخ‌دهندگان می‌توانند فرم شما را پر کنند.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <StatCard
                icon={<Users className="size-6 text-indigo-600 dark:text-indigo-400" />}
                label="کل پاسخ‌ها"
                value={submissions.length}
                color="bg-indigo-100 dark:bg-indigo-900/50"
              />
              <StatCard
                icon={<TrendingUp className="size-6 text-emerald-600 dark:text-emerald-400" />}
                label="نرخ تکمیل"
                value={`${completionRate}%`}
                subtitle={`${submissions.length} پاسخ‌دهنده`}
                color="bg-emerald-100 dark:bg-emerald-900/50"
              />
              <StatCard
                icon={<Clock className="size-6 text-purple-600 dark:text-purple-400" />}
                label="آخرین پاسخ"
                value={
                  submissions.length > 0
                    ? format(
                        new Date(
                          Math.max(
                            ...submissions.map((s) => new Date(s.createdAt).getTime())
                          )
                        ),
                        'HH:mm - dd MMMM',
                        { locale: faIR }
                      )
                    : '—'
                }
                color="bg-purple-100 dark:bg-purple-900/50"
              />
            </div>

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
                <TabsTrigger value="individual" className="rounded-lg text-sm font-medium">
                  <Users className="size-4 ml-1.5" />
                  پاسخ‌های فردی
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <div className="space-y-4">
                  {questions
                    .filter((q) => q.type !== 'statement')
                    .map((question) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                          <CardContent className="p-5 sm:p-6">
                            <QuestionSummary
                              question={question}
                              submissions={submissions}
                            />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pieEligibleQuestions.map((question, idx) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <MiniPieCard question={question} submissions={submissions} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="individual">
                <Card className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
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
          </>
        )}
      </div>
    </div>
  );
}
