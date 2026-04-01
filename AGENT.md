# Agent Instructions

## Project Overview

Trip Split is a Next.js web app for splitting trip expenses among friends.

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
  types/         # TypeScript type definitions
```

## TypeScript

- Strict mode throughout. No `any` types. No `@ts-ignore`.
- Do not use `null` unless required for API compatibility or when explicitly distinguishing `null` from `undefined`. Prefer `undefined` for absent/optional values.
- Prefer explicit `interface` names scoped to their domain (e.g., `interface OwnerAdvanceCardProps` not `interface Props`).

## File Organization

- **Source files**: Keep under ~200 lines (split at ~240). Split large files by logical concern.
- **Test files**: Keep under ~300 lines (split at ~360). When splitting, organize into a `{module}-tests/` directory with domain-specific files.
- **Components**: One component and its props interface per file. Delegate complex logic to utility functions or sub-components.
- **Type files**: Convert large type files into barrel-exported directories with one file per logical domain.
- **Utility files**: Split by the type of operation or domain they serve.
- **Service files**: Extract complex logic into focused utility functions or smaller services.
- Barrel `index.ts` exports for all component/module directories.

## Code Conventions

- Use named exports, not default exports (except for Next.js pages).
- Use `async/await`, not `.then()` chains.
- No spurious variables. Do not assign a value to a variable only to immediately return it on the next line -- return the expression directly.
- Format currency using the `formatCurrency` utility, never manually.

## User-Facing Text

- All user-facing strings must be stored in a co-located copy file (e.g., `ComponentName.copy.ts` or `copy.ts`) for i18n readiness.
- Do not hardcode display strings inline in components.

## Testing

- Unit test business logic (especially balance calculations) with Vitest.
- Use the Firebase emulator for integration tests.

### Component Tests

- Test files are co-located with their component: `ComponentName.test.tsx`.
- When adding or modifying a UI component, add or update its test to verify rendering behavior and key prop-driven states.
- Use `@testing-library/react` with `vitest`. Always call `afterEach(cleanup)`.
- Do not use `.toBeInTheDocument()` -- use `.toBeDefined()` or check `.textContent` instead.
- Assert against copy constants (e.g., `AUTH_COPY`) rather than hardcoded strings.
- Test presentational view components directly; avoid mocking hooks in tests where possible.

## Storybook

- Story files are co-located with their component: `ComponentName.stories.tsx`.
- When adding or modifying a UI component, add or update its Storybook story to cover key visual states.
- Stories should use mock data fixtures -- never import from Firebase or depend on runtime providers (QueryClient, AuthProvider, Next.js router).
- Components that are too hook-dependent to render in isolation should use a presentational split: extract rendering into a `ComponentNameView` that accepts callbacks, and keep the original as a thin wrapper that wires up hooks.

## Common Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Lint
pnpm format           # Format
pnpm test             # Run tests
pnpm typecheck        # Type check
pnpm storybook        # Start Storybook dev server (port 6006)
pnpm build-storybook  # Build static Storybook
```
