# Task 6: Add Conditional Logic/Branching to Form Builder

## Agent: form-logic

## Summary
Added conditional logic support to the form builder, allowing questions to be shown or hidden based on answers to other questions.

## Changes Made

### 1. Store (`/home/z/my-project/src/lib/store.ts`)
- Added `ConditionRule` interface with fields: `questionId`, `operator` (6 operators: equals, not_equals, contains, not_contains, is_answered, is_not_answered), `value` (optional)
- Added `QuestionLogic` interface with fields: `enabled` (boolean), `action` ('show' | 'hide'), `conditions` (ConditionRule[])
- Added `logic?: QuestionLogic` optional field to `FormQuestion` interface

### 2. Properties Panel (`/home/z/my-project/src/components/form-builder/properties-panel.tsx`)
- Added `GitBranch` and `ChevronDown` icon imports from lucide-react
- Added `QuestionLogic` and `ConditionRule` type imports from store
- Added `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger` imports from shadcn/ui
- Created `ConditionalLogicSection` component with:
  - **Disabled state**: Simple row with "منطق شرطی" label and toggle switch
  - **Enabled state**: Collapsible section with:
    - Toggle switch to disable logic
    - Condition count badge
    - Chevron toggle for expand/collapse
    - Action selector: "نمایش سؤال" (Show) or "مخفی کردن سؤال" (Hide)
    - Condition builder with per-condition rows containing:
      - Question selector dropdown (excludes current question)
      - Operator dropdown (6 operators in Persian)
      - Value input (conditionally shown based on operator)
      - Remove button (X icon)
    - "افزودن شرط" (Add Condition) button
    - Helper text explaining AND logic
- Integrated `ConditionalLogicSection` in the main properties panel between type-specific settings and action buttons

## Design Decisions
- Logic stored as optional `logic` field on `FormQuestion` for clean separation
- When enabling logic for first time, auto-creates one empty condition and auto-expands section
- When switching to `is_answered`/`is_not_answered` operators, value field is automatically cleared
- All UI text is in Persian with RTL styling
- Uses purple accent colors consistent with the app theme
- Condition cards have purple border styling for visual distinction

## Verification
- ESLint: 0 warnings, 0 errors
- Dev server compiles successfully
- Existing functionality preserved (no breaking changes)
