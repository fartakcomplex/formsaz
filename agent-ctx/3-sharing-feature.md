# Task ID: 3 - Sharing Feature Agent

## Agent: sharing-feature
## Task: Add form sharing/copy link dialog to the dashboard

### Work Log
- Read worklog.md to understand project structure, tech stack, and existing code patterns
- Read existing dashboard.tsx to understand FormCard component, dropdown menu structure, and form actions
- Verified Dialog, Button, Badge, sonner, and framer-motion dependencies are all available
- Added new lucide-react icon imports: Share2, Link2, Check, QrCode, Mail
- Added Dialog component imports from @/components/ui/dialog
- Added `toast` import from sonner
- Created ShareFormDialog component with:
  - Gradient header with Share2 icon and form title
  - Status badge showing published (green) / draft (yellow) / closed (gray)
  - Draft warning banner with amber styling and "انتشار فرم" (Publish) button
  - Link display field with Link2 icon, simulated URL (formsaz.ir/f/{form.id}), LTR dir
  - Copy link button with animated success state (green checkmark + "لینک کپی شد!")
  - Clipboard copy via navigator.clipboard.writeText()
  - Sonner toast.success notification on copy
  - QR code placeholder with 7x7 animated grid pattern and QrCode icon
  - Social sharing section with 3 branded buttons:
    - تلگرام (Telegram) - blue, with Telegram SVG icon, opens t.me/share/url
    - واتساپ (WhatsApp) - green, with WhatsApp SVG icon, opens wa.me
    - ایمیل (Email) - indigo, with Mail icon, opens mailto:
  - QR and social sections hidden for draft forms (only shown for published/closed)
  - Framer-motion animations throughout (AnimatePresence for copy state, staggered reveals)
  - Full RTL support with dir="rtl"
  - Dark mode compatible styling
- Added "اشتراک‌گذاری" dropdown menu item with Share2 icon (purple color) before "کپی فرم"
- Added onShare prop to FormCard component
- Added shareForm state and shareDialogOpen state to Dashboard component
- Added handleShare and handlePublishFromShare handlers
- handlePublishFromShare calls PUT /api/forms/{id} with status:'published', updates store, shows toast

### Verification
- ESLint: 0 warnings, 0 errors
- Dev server: ✓ Compiled successfully, all pages render without errors
- No existing functionality broken (edit, preview, results, duplicate, delete all preserved)
- API calls verified: GET /api/forms 200, GET / 200

### Files Modified
- `/home/z/my-project/src/components/dashboard/dashboard.tsx` - Added ShareFormDialog component, share menu item, share/publish handlers
