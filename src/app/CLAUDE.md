# Front-End Directives

Rules specific to React components, pages, and layouts in the Next.js App Router.

## React / Next.js

- `"use client"` directive required on all React client components.
- Prefer server components where possible.
- React hooks must be called unconditionally -- hooks before any early returns.
- Components should have a single JSX return statement. Invalid states should be prevented by the type system or guarded by the calling component. An early `return null` is acceptable only if the invalid state is infeasible for the parent to detect.

## JSX

- **No imperative logic inside JSX.** All conditional logic and variable declarations must be computed in the component body before the `return` statement, or extracted into a dedicated child component.
- Simple functional expressions are permitted in JSX: inline arrow functions, ternaries, and `.map()` calls that return JSX directly.
- What is prohibited is multi-statement blocks: declaring intermediate variables and then returning a value inside JSX.

## User-Facing Text

- Copy strings may be co-located with their component (`ComponentName.copy.ts`) or placed in `src/constants/copy.ts` for shared strings.
- Prefer co-located copy for component-specific strings; use `constants/copy.ts` for strings shared across multiple components.

## Firestore Access

- Never access Firestore directly in components. Use service functions from `src/api/`.
