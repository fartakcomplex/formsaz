# Task ID: 4 - results-charts Agent Work Record

## Task
Add pie charts and enhanced visualization to the results/analytics view

## Changes Made

### File Modified: `/home/z/my-project/src/components/dashboard/results-view.tsx`

#### 1. ChoiceQuestionChart - Pie Chart Toggle
- Added `ToggleGroup` (shadcn/ui) with "ستونی" (Bar) and "دایره‌ای" (Pie) toggle buttons
- Added state `chartType` to switch between views
- Implemented `PieChart` view with donut style (innerRadius=45, outerRadius=90) using Recharts `PieChart` + `Pie` + `Cell`
- Pie chart wrapped in `ChartContainer` with proper `ChartConfig`
- Added `ChartLegend` with `ChartLegendContent` for pie chart labels
- Toggle only shows when there are responses (totalResponses > 0)
- Colors from COLORS array used consistently

#### 2. YesNoQuestionChart - Donut/Ring Chart
- Added visual donut chart alongside existing stat cards
- Uses Recharts `PieChart` with `innerRadius={42}` and `outerRadius={70}`
- Center overlay shows yes percentage with absolute positioning
- Donut uses green (#10b981) for yes and red (#ef4444) for no
- Added animated progress bars inside yes/no stat cards using framer-motion
- Layout is responsive: column on mobile, row on desktop

#### 3. Dark Mode Support
- `StatCard`: Added `dark:bg-gray-900`, `dark:border-gray-800`, `dark:text-*` variants
- Stat card icons: `dark:opacity-80`
- All text elements: `dark:text-gray-100`, `dark:text-gray-300`, `dark:text-gray-400`, `dark:text-gray-500`
- Rating chart: `dark:bg-amber-950/30`, `dark:border-amber-900/50`, `dark:text-amber-400`, `dark:bg-gray-700`
- Scale chart badges: `dark:text-indigo-400`, `dark:border-indigo-800`, `dark:bg-indigo-950/30`
- Text summary: `dark:bg-gray-900/50`, `dark:border-gray-800`, `dark:hover:bg-gray-800`
- Yes/No cards: `dark:bg-emerald-950/30`, `dark:bg-red-950/30`, dark border variants
- Individual response: `dark:border-gray-800`, `dark:bg-gray-900/50`
- Main container: `dark:bg-gray-950`
- Tabs: `dark:bg-gray-800`
- Accordion items: `dark:border-gray-800`
- Cards: `dark:border-gray-800`

#### 4. New "نمودار دایره‌ای" Tab
- Added third tab with `PieChartIcon` from lucide-react (aliased to avoid conflict with recharts)
- Creates overview grid of smaller pie cards using new `MiniPieCard` component
- Grid: 1 column on mobile, 2 on tablet, 3 on desktop
- Shows empty state with icon and message when no eligible questions found
- Eligible questions: `multiple_choice`, `multiple_select`, `dropdown`, `yes_no`
- Each card shows donut chart with center total/percentage, colored legend items
- Long option names truncated with ellipsis (max 12 chars)
- Shows "+N مورد" when more than 3 options exist

#### 5. Imports Added
- `PieChart`, `Pie` from recharts (alongside existing recharts imports)
- `PieChartIcon` from lucide-react (aliased: `PieChart as PieChartIcon`)
- `ChartLegend`, `ChartLegendContent` from `@/components/ui/chart`
- `ToggleGroup`, `ToggleGroupItem` from `@/components/ui/toggle-group`

#### 6. Existing Functionality Preserved
- All existing bar charts, rating bars, scale bars, text summaries work unchanged
- CSV export unchanged
- Individual response accordion unchanged
- RTL direction and Persian text maintained throughout

## Verification
- ESLint: 0 errors, 0 warnings
- Dev server: Compiled successfully in 856ms, no errors
- All recharts components (`PieChart`, `Pie`, `Cell`) verified available
- All lucide icons verified available
