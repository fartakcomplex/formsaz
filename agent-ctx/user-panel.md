# Task ID: user-panel
Agent: main
Task: Create User Panel (پنل کاربری) component with sidebar navigation and 6 sections

Work Log:
- Read worklog.md to understand project context (Persian form builder, RTL, violet/purple theme, dark mode, framer-motion)
- Read store.ts to understand useAppStore and ViewType (already has 'user-panel' type)
- Read page.tsx to confirm UserPanel is already imported and rendered at / route
- Read existing dashboard.tsx to match code patterns (card styles, animation patterns, badge colors)
- Read shadcn/ui components: Card, Badge, Progress, Switch, Table, Button, Input, Textarea, Label, Select, AlertDialog, Separator, Skeleton
- Created /home/z/my-project/src/components/user-panel/user-panel.tsx (single comprehensive file)

Component Structure:
- UserPanel: Main component with sidebar + content area, state management for activeTab and sidebarOpen
- ProfileSection: Gradient banner, avatar with camera overlay, user info, role badge, quick stats, edit form with save/cancel
- MyFormsSection: Stats row (4 cards), form grid (6 mock forms) with status badges and action buttons
- ActivitySection: Timeline with colored icons, filter dropdown, 10 mock activities with relative timestamps
- NotificationsSection: 8 mock notifications (4 types), read/unread states, mark all read, delete, border accents
- SettingsSection: Password change, delete account (AlertDialog), notification toggles (4 Switch), display settings with preview card
- SubscriptionSection: Current plan card, usage progress bars (animated), upgrade CTA with gradient, plan comparison table (11 features x 3 plans), plan selection cards

Design Features:
- Fixed right sidebar (RTL) with user avatar, navigation, notification badge, back button
- Mobile-responsive: sidebar collapses with overlay, hamburger menu in top bar
- Full dark mode support with dark: classes throughout
- Framer-motion: AnimatePresence tab transitions, stagger animations, hover effects, layout animations
- Violet/purple color scheme matching existing app
- All text in Persian
- Uses setCurrentView('dashboard') for back navigation via useAppStore

Verification:
- ESLint: 0 errors, 0 warnings
- TypeScript: no compilation errors
- Dev server compiles successfully (pre-existing admin-panel import error unrelated to this work)
