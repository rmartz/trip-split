# Agent Instructions

## Project Overview

Trip Split is a Next.js web app for splitting trip expenses among friends. See `VISION.md` for full product vision.

## Tech Stack

- **Package manager:** Always use `pnpm`. Never use `npm` or `yarn`.
- **Framework:** Next.js with App Router (not Pages Router).
- **UI components:** ShadCN UI. Do not install other component libraries.
- **Styling:** Tailwind CSS (comes with ShadCN). No CSS modules or styled-components.
- **Database:** Firebase Firestore. Store monetary values as integers (cents), never floats.
- **Auth:** Firebase Authentication.

## Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  api/           # Firebase services and data access functions
  components/    # Reusable React components
  constants/     # Shared constants and copy strings
  types/         # TypeScript type definitions
```

## TypeScript

- Strict mode throughout. No `any` types. No `@ts-ignore`.
- Do not use `null` unless required for API compatibility or when explicitly distinguishing `null` from `undefined`. Prefer `undefined` for absent/optional values.
- Prefer explicit `interface` names scoped to their domain (e.g., `interface OwnerAdvanceCardProps` not `interface Props`).

## File Organization

- Keep files under ~200 lines. Split large files by logical concern.
- **Components**: One component and its props interface per file. Delegate complex logic to utility functions or sub-components.
- **Type files**: Convert large type files into barrel-exported directories with one file per logical domain.
- **Utility files**: Split by the type of operation or domain they serve.
- **Service files**: Extract complex logic into focused utility functions or smaller services.
- **Test files**: When a file is split, create a corresponding test file for each portion.
- Barrel `index.ts` exports for all component/module directories.

## Code Conventions

- Use named exports, not default exports (except for Next.js pages).
- Use `async/await`, not `.then()` chains.
- No spurious variables. Do not assign a value to a variable only to immediately return it on the next line -- return the expression directly.
- Format currency using the `formatCurrency` utility, never manually.

## User-Facing Text

- All user-facing strings must be stored in a constants/copy file (e.g., `copy.ts`) for i18n readiness.
- Do not hardcode display strings inline in components.

## Testing

- Unit test business logic (especially balance calculations) with Vitest.
- Use the Firebase emulator for integration tests.

## Common Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Lint
pnpm format       # Format
pnpm test         # Run tests
pnpm tsc --noEmit # Type check
```
