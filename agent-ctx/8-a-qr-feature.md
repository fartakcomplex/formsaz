---
Task ID: 8-a
Agent: qr-feature
Task: Implement real QR code generation for form sharing

Work Log:
- Installed `qrcode` package (v1.5.4) and `@types/qrcode` (v1.5.6)
- Created `/api/qr/route.ts` API endpoint:
  - GET handler accepts `data` query parameter (URL to encode)
  - Generates 300x300 PNG QR code with 2 margin and #1e1b4b dark color
  - Returns PNG with `Content-Type: image/png` and 1-hour cache
  - Error handling for missing data and generation failures
- Updated `ShareFormDialog` in dashboard.tsx:
  - Replaced placeholder dot-grid QR with real `<img>` pointing to `/api/qr?data=...`
  - Added `qrLoaded` and `qrError` state for loading/error handling
  - Skeleton loading state while QR code loads
  - Error fallback with QrCode icon and "خطا در بارگذاری" message
  - "دانلود QR" button with Download icon (opens QR PNG in new tab)
  - Uses `key={qrKey}` on img to force reload when form changes
  - Full dark mode support with proper styling
  - Added `Download` icon import from lucide-react
- ESLint passes cleanly with 0 errors, 0 warnings

Stage Summary:
- Files created: `src/app/api/qr/route.ts`
- Files modified: `src/components/dashboard/dashboard.tsx`
- Packages added: `qrcode`, `@types/qrcode`
- Real QR codes now generated for form sharing (was placeholder before)
- Download QR button for saving the QR code image
