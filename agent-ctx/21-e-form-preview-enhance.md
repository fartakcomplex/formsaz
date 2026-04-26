# Task 21-e: Form Preview Question List Visual Enhancement

## Status: Completed

## Summary
Enhanced the form builder's question list in the form preview area with visual question numbering badges, improved question cards with better styling, and drag handle indicators.

## Changes Made

### File Modified: `src/components/form-builder/form-preview.tsx`

1. **Drag Handle Enhancement**
   - Moved drag handle from a separate flex-gap area to be absolutely positioned inside the card wrapper
   - Positioned at `left-2 top-1/2` with `opacity-0 group-hover/card:opacity-100` for smooth hover reveal
   - Uses violet color scheme when dragging (`bg-violet-100 text-violet-600`)
   - Subtle gray color when idle (`text-gray-300`)

2. **Question Number Badge**
   - Moved from left-side floating circle to right-side positioned badge (`-top-2.5 right-4`)
   - Changed shape from `rounded-full` to `rounded-lg`
   - Conditional styling: gradient (`from-violet-500 to-purple-600`) when selected, white/bordered when not
   - Hover state transitions border to violet tones
   - Wrapped in a container div for proper positioning

3. **Question Card Styling**
   - Changed from `border-2` with transparent default to `border` with `border-gray-200` default
   - Added `rounded-xl` for softer card corners
   - Selection state: violet border, violet background tint, violet shadow, ring-1 accent
   - Hover state: border-color transition, shadow-md, subtle `-translate-y-px` lift effect
   - Changed padding from `pl-7 pr-5` to `p-4 pl-10` (accommodating absolute drag handle)

4. **Question Type Pill**
   - Moved type label from a separate line above the title to an inline pill after the title
   - Uses subtle gray background: `bg-gray-100 dark:bg-gray-800`
   - Small text size: `text-[10px]` with `rounded-md` shape
   - Removed the separate inline number badge (now replaced by the top-right badge)

5. **Selected Indicator**
   - Removed inline `style={{ backgroundColor: primaryColor }}` from selected border accent
   - Now uses pure CSS gradient classes consistently

6. **Drag Overlay Card**
   - Updated to match new card styling: `rounded-xl`, `p-4 pl-10`, violet border/ring
   - Number badge repositioned to top-right with gradient styling
   - Type pill added inline with question title

7. **Empty State Enhancement**
   - Added a third floating decoration circle (emerald, with scale animation)
   - Added rotation to existing floating circles
   - Added a tips section with 3 quick-start hints:
     - 16 question types available
     - Drag-and-drop reordering
     - Theme customization
   - Changed CTA button text from "افزودن اولین سؤال" to "شروع ساخت فرم"
   - Added `px-6` to button for wider appearance
   - Staggered tip section animation (delay 0.65s)

### Incidental Fix: `src/components/user-panel/user-panel.tsx`
- Fixed unclosed JSX comment on line 1019 (`{/* Gradient accent */` → `{/* Gradient accent */}`)

## Build Verification
- Build completed successfully with no errors
