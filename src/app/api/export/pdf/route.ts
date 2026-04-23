import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

const QUESTION_TYPE_LABELS: Record<string, string> = {
  short_text: 'متن کوتاه',
  long_text: 'متن بلند',
  multiple_choice: 'انتخاب از پیش‌فرض',
  multiple_select: 'چند انتخابی',
  dropdown: 'لیست کشویی',
  number: 'عدد',
  email: 'ایمیل',
  phone: 'شماره تلفن',
  date: 'تاریخ',
  scale: 'مقیاس',
  rating: 'امتیازدهی',
  yes_no: 'بله / خیر',
  file_upload: 'آپلود فایل',
  statement: 'بیان',
  section_divider: 'بخش‌بندی',
  matrix: 'ماتریس',
  image_choice: 'انتخاب تصویری',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get('formId');

  if (!formId) {
    return NextResponse.json({ error: 'شناسه فرم الزامی است' }, { status: 400 });
  }

  try {
    const form = await db.form.findUnique({
      where: { id: formId },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'فرم یافت نشد' }, { status: 404 });
    }

    const submissions = await db.submission.findMany({
      where: { formId },
      orderBy: { createdAt: 'desc' },
      include: {
        responses: true,
      },
    });

    const questions = form.questions.filter((q) => q.type !== 'statement' && q.type !== 'section_divider');

    // Calculate date range
    let dateRangeText = 'بدون پاسخ';
    if (submissions.length > 0) {
      const sorted = [...submissions].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      const first = new Date(sorted[0].createdAt);
      const last = new Date(sorted[sorted.length - 1].createdAt);
      const persianFirst = first.toLocaleDateString('fa-IR');
      const persianLast = last.toLocaleDateString('fa-IR');
      dateRangeText = `${persianFirst} تا ${persianLast}`;
    }

    // Build question HTML sections
    const questionSections = questions.map((question, idx) => {
      const config = JSON.parse(question.config || '{}');
      const typeLabel = QUESTION_TYPE_LABELS[question.type] || question.type;

      let questionBodyHtml = '';

      if (['multiple_choice', 'multiple_select', 'dropdown'].includes(question.type)) {
        questionBodyHtml = buildChoiceSection(question, config, submissions);
      } else if (question.type === 'yes_no') {
        questionBodyHtml = buildYesNoSection(question, submissions);
      } else if (question.type === 'rating') {
        questionBodyHtml = buildRatingSection(question, config, submissions);
      } else if (question.type === 'scale') {
        questionBodyHtml = buildScaleSection(question, config, submissions);
      } else {
        questionBodyHtml = buildTextSection(question, submissions);
      }

      const isLast = idx === questions.length - 1;
      return `
        <div class="question-block${isLast ? '' : ' page-break'}">
          <div class="question-header">
            <span class="question-number">${idx + 1}</span>
            <div>
              <h2 class="question-title">${escapeHtml(question.title)}</h2>
              <span class="question-type">${typeLabel}</span>
            </div>
          </div>
          <div class="question-body">
            ${questionBodyHtml}
          </div>
        </div>
      `;
    }).join('\n');

    const generatedAt = new Date().toLocaleString('fa-IR');

    const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>گزارش نتایج - ${escapeHtml(form.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Vazirmatn', 'Tahoma', sans-serif;
      direction: rtl;
      background: #ffffff;
      color: #1f2937;
      line-height: 1.8;
      font-size: 14px;
      padding: 0;
    }

    .container {
      max-width: 210mm;
      margin: 0 auto;
      padding: 24px 32px;
    }

    /* ── Header ──────────────────────────────────────────── */
    .report-header {
      text-align: center;
      padding: 32px 24px 24px;
      border-bottom: 3px solid transparent;
      border-image: linear-gradient(to left, #8b5cf6, #6366f1, #a78bfa) 1;
      margin-bottom: 28px;
    }

    .report-header h1 {
      font-size: 26px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .report-meta {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-top: 16px;
      flex-wrap: wrap;
    }

    .report-meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;
    }

    .report-meta-item .label {
      font-weight: 500;
      color: #4b5563;
    }

    .report-meta-item .value {
      font-weight: 600;
      color: #6366f1;
    }

    /* ── Question Block ──────────────────────────────────── */
    .question-block {
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 20px;
    }

    .question-header {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    .question-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #8b5cf6, #6366f1);
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .question-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 4px;
    }

    .question-type {
      display: inline-block;
      font-size: 11px;
      font-weight: 500;
      color: #8b5cf6;
      background: #ede9fe;
      padding: 2px 10px;
      border-radius: 20px;
    }

    /* ── Choice / Bar Chart ──────────────────────────────── */
    .option-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .option-label {
      min-width: 160px;
      font-size: 13px;
      color: #374151;
      text-align: right;
      flex-shrink: 0;
    }

    .option-bar-container {
      flex: 1;
      height: 24px;
      background: #f3f4f6;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
    }

    .option-bar {
      height: 100%;
      border-radius: 6px;
      transition: width 0.3s ease;
      min-width: 2px;
    }

    .option-stats {
      min-width: 80px;
      text-align: left;
      font-size: 12px;
      color: #6b7280;
      flex-shrink: 0;
    }

    .option-stats .count {
      font-weight: 600;
      color: #374151;
    }

    /* ── Yes/No ──────────────────────────────────────────── */
    .yesno-container {
      display: flex;
      gap: 16px;
    }

    .yesno-card {
      flex: 1;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
    }

    .yesno-card.yes {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
    }

    .yesno-card.no {
      background: #fef2f2;
      border: 1px solid #fecaca;
    }

    .yesno-card .percent {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 4px;
    }

    .yesno-card.yes .percent { color: #059669; }
    .yesno-card.no .percent { color: #dc2626; }

    .yesno-card .label {
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
    }

    /* ── Rating ──────────────────────────────────────────── */
    .rating-summary {
      display: flex;
      align-items: center;
      gap: 24px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 20px;
    }

    .rating-avg {
      text-align: center;
      min-width: 80px;
    }

    .rating-avg .value {
      font-size: 32px;
      font-weight: 700;
      color: #d97706;
    }

    .rating-avg .label {
      font-size: 11px;
      color: #92400e;
      margin-top: 4px;
    }

    .rating-distribution {
      flex: 1;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .rating-row .star-num {
      font-size: 13px;
      color: #6b7280;
      min-width: 18px;
      text-align: center;
    }

    .rating-row .bar-container {
      flex: 1;
      height: 14px;
      background: #f3f4f6;
      border-radius: 4px;
      overflow: hidden;
    }

    .rating-row .bar {
      height: 100%;
      background: #f59e0b;
      border-radius: 4px;
    }

    .rating-row .count {
      font-size: 12px;
      color: #6b7280;
      min-width: 24px;
      text-align: left;
    }

    /* ── Scale ───────────────────────────────────────────── */
    .scale-summary {
      background: #f5f3ff;
      border: 1px solid #ddd6fe;
      border-radius: 10px;
      padding: 20px;
    }

    .scale-avg {
      text-align: center;
      margin-bottom: 16px;
    }

    .scale-avg .value {
      font-size: 28px;
      font-weight: 700;
      color: #7c3aed;
    }

    .scale-avg .label {
      font-size: 12px;
      color: #6d28d9;
    }

    .scale-bars {
      display: flex;
      align-items: flex-end;
      gap: 4px;
      height: 100px;
      padding: 0 8px;
    }

    .scale-bar-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      height: 100%;
      justify-content: flex-end;
    }

    .scale-bar-item .bar {
      width: 100%;
      max-width: 36px;
      border-radius: 4px 4px 0 0;
      min-height: 2px;
    }

    .scale-bar-item .label {
      font-size: 11px;
      color: #6b7280;
    }

    /* ── Text Responses ──────────────────────────────────── */
    .text-response-list {
      list-style: none;
      padding: 0;
    }

    .text-response-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      margin-bottom: 6px;
      background: #ffffff;
      border: 1px solid #f3f4f6;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
    }

    .text-response-item .num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #ede9fe;
      color: #7c3aed;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
    }

    /* ── No Responses ────────────────────────────────────── */
    .no-responses {
      text-align: center;
      padding: 24px;
      color: #9ca3af;
      font-size: 13px;
    }

    /* ── Footer ──────────────────────────────────────────── */
    .report-footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
    }

    /* ── Print Styles ────────────────────────────────────── */
    @media print {
      body {
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .container {
        padding: 16px 24px;
        max-width: 100%;
      }

      .report-header {
        padding: 16px 16px 16px;
      }

      .question-block {
        break-inside: avoid;
        margin-bottom: 12px;
        padding: 16px;
      }

      .page-break {
        page-break-after: always;
      }

      .no-screen {
        display: none;
      }

      .report-footer {
        display: block;
      }
    }

    @page {
      size: A4;
      margin: 15mm;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="report-header">
      <h1>${escapeHtml(form.title)}</h1>
      ${form.description ? `<p style="font-size: 14px; color: #6b7280; margin-top: 4px;">${escapeHtml(form.description)}</p>` : ''}
      <div class="report-meta">
        <div class="report-meta-item">
          <span class="label">تعداد کل پاسخ‌ها:</span>
          <span class="value">${submissions.length}</span>
        </div>
        <div class="report-meta-item">
          <span class="label">بازه زمانی:</span>
          <span class="value">${dateRangeText}</span>
        </div>
        <div class="report-meta-item">
          <span class="label">تعداد سؤالات:</span>
          <span class="value">${questions.length}</span>
        </div>
      </div>
    </div>

    <!-- Questions -->
    ${questionSections}

    <!-- Footer -->
    <div class="report-footer">
      <p>این گزارش در تاریخ ${generatedAt} تولید شده است.</p>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('PDF export error:', error);
    return NextResponse.json({ error: 'خطا در تولید گزارش' }, { status: 500 });
  }
}

// ── Helper: escape HTML ──────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Build Choice Question Section ─────────────────────────────────────────────
function buildChoiceSection(
  question: { id: string; type: string; config: string },
  config: { options?: { id: string; text: string }[] },
  submissions: { responses: { questionId: string; value: string }[] }[]
): string {
  const options = config.options || [];
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

  const totalResponses = Object.values(counts).reduce((a, b) => a + b, 0);

  if (totalResponses === 0) {
    return '<div class="no-responses">هنوز پاسخی ثبت نشده</div>';
  }

  const colors = ['#8b5cf6', '#6366f1', '#a78bfa', '#7c3aed', '#c4b5fd', '#4f46e5', '#6d28d9', '#4338ca'];

  const rows = options.map((opt, idx) => {
    const count = counts[opt.id] || 0;
    const percent = totalResponses > 0 ? Math.round((count / totalResponses) * 100) : 0;
    const color = colors[idx % colors.length];
    return `
      <div class="option-row">
        <span class="option-label">${escapeHtml(opt.text)}</span>
        <div class="option-bar-container">
          <div class="option-bar" style="width: ${percent}%; background: ${color};"></div>
        </div>
        <div class="option-stats">
          <span class="count">${count}</span> &nbsp;(${percent}%)
        </div>
      </div>
    `;
  }).join('\n');

  return `<div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">${totalResponses} پاسخ ثبت شده</div>${rows}`;
}

// ── Build Yes/No Question Section ─────────────────────────────────────────────
function buildYesNoSection(
  question: { id: string },
  submissions: { responses: { questionId: string; value: string }[] }[]
): string {
  let yesCount = 0;
  let noCount = 0;

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value === 'yes') yesCount++;
    if (response?.value === 'no') noCount++;
  });

  const total = yesCount + noCount;

  if (total === 0) {
    return '<div class="no-responses">هنوز پاسخی ثبت نشده</div>';
  }

  const yesPercent = Math.round((yesCount / total) * 100);
  const noPercent = 100 - yesPercent;

  return `
    <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">${total} پاسخ ثبت شده</div>
    <div class="yesno-container">
      <div class="yesno-card yes">
        <div class="percent">${yesPercent}%</div>
        <div class="label">بله (${yesCount})</div>
      </div>
      <div class="yesno-card no">
        <div class="percent">${noPercent}%</div>
        <div class="label">خیر (${noCount})</div>
      </div>
    </div>
  `;
}

// ── Build Rating Question Section ─────────────────────────────────────────────
function buildRatingSection(
  question: { id: string; config: string },
  config: { max?: number },
  submissions: { responses: { questionId: string; value: string }[] }[]
): string {
  const maxRating = config.max ?? 5;
  const counts: Record<number, number> = {};
  for (let i = 1; i <= maxRating; i++) counts[i] = 0;

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value) {
      const num = parseInt(response.value, 10);
      if (num >= 1 && num <= maxRating) counts[num]++;
    }
  });

  const totalResponses = Object.values(counts).reduce((a, b) => a + b, 0);

  if (totalResponses === 0) {
    return '<div class="no-responses">هنوز پاسخی ثبت نشده</div>';
  }

  const avgRating = Object.entries(counts).reduce(
    (sum, [rating, count]) => sum + parseInt(rating) * count, 0
  ) / totalResponses;

  const distRows = Object.entries(counts).map(([rating, count]) => {
    const percent = (count / totalResponses) * 100;
    return `
      <div class="rating-row">
        <span class="star-num">${rating}</span>
        <div class="bar-container">
          <div class="bar" style="width: ${percent}%;"></div>
        </div>
        <span class="count">${count}</span>
      </div>
    `;
  }).join('\n');

  return `
    <div class="rating-summary">
      <div class="rating-avg">
        <div class="value">${avgRating.toFixed(1)}</div>
        <div class="label">میانگین از ${maxRating}</div>
      </div>
      <div class="rating-distribution">
        ${distRows}
      </div>
    </div>
  `;
}

// ── Build Scale Question Section ──────────────────────────────────────────────
function buildScaleSection(
  question: { id: string; config: string },
  config: { scaleMin?: number; scaleMax?: number },
  submissions: { responses: { questionId: string; value: string }[] }[]
): string {
  const min = config.scaleMin ?? 1;
  const max = config.scaleMax ?? 10;
  const counts: Record<number, number> = {};
  for (let i = min; i <= max; i++) counts[i] = 0;

  submissions.forEach((sub) => {
    const response = sub.responses.find((r) => r.questionId === question.id);
    if (response?.value) {
      const num = parseInt(response.value, 10);
      if (num >= min && num <= max) counts[num]++;
    }
  });

  const totalResponses = Object.values(counts).reduce((a, b) => a + b, 0);

  if (totalResponses === 0) {
    return '<div class="no-responses">هنوز پاسخی ثبت نشده</div>';
  }

  const avgValue = Object.entries(counts).reduce(
    (sum, [val, count]) => sum + parseInt(val) * count, 0
  ) / totalResponses;

  const maxCount = Math.max(...Object.values(counts), 1);

  const colors = ['#8b5cf6', '#6366f1', '#a78bfa', '#7c3aed', '#c4b5fd', '#4f46e5', '#6d28d9', '#4338ca', '#312e81', '#3730a3'];

  const bars = Object.entries(counts).map(([val, count], idx) => {
    const height = maxCount > 0 ? (count / maxCount) * 80 : 0;
    const color = colors[idx % colors.length];
    return `
      <div class="scale-bar-item">
        <div class="bar" style="height: ${height}px; background: ${color};"></div>
        <span class="label">${val}</span>
      </div>
    `;
  }).join('\n');

  return `
    <div class="scale-summary">
      <div class="scale-avg">
        <div class="value">${avgValue.toFixed(1)}</div>
        <div class="label">میانگین (مقیاس ${min} تا ${max})</div>
      </div>
      <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">${totalResponses} پاسخ ثبت شده</div>
      <div class="scale-bars">
        ${bars}
      </div>
    </div>
  `;
}

// ── Build Text Question Section ───────────────────────────────────────────────
function buildTextSection(
  question: { id: string },
  submissions: { responses: { questionId: string; value: string }[] }[]
): string {
  const responses = submissions
    .map((sub) => sub.responses.find((r) => r.questionId === question.id)?.value)
    .filter(Boolean);

  if (responses.length === 0) {
    return '<div class="no-responses">هنوز پاسخی ثبت نشده</div>';
  }

  const items = responses.map((response, idx) => `
    <li class="text-response-item">
      <span class="num">${idx + 1}</span>
      <span>${escapeHtml(response)}</span>
    </li>
  `).join('\n');

  return `
    <div style="margin-bottom: 8px; font-size: 12px; color: #6b7280;">${responses.length} پاسخ ثبت شده</div>
    <ul class="text-response-list">
      ${items}
    </ul>
  `;
}
