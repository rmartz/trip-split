# Code Standards

## Package Manager

- Always use `pnpm`. Never `npm` or `yarn`.

## Common Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # Lint
pnpm format           # Format
pnpm test             # Run tests with Vitest
pnpm typecheck        # Type check
pnpm storybook        # Start Storybook dev server (port 6006)
pnpm build-storybook  # Build static Storybook
```

## Project Overview

Trip Split is a Next.js web app for splitting trip expenses among friends.

### Tech Stack

- **Framework:** Next.js with App Router (not Pages Router).
- **UI components:** ShadCN UI. Do not install other component libraries.
- **Styling:** Tailwind CSS (comes with ShadCN). No CSS modules or styled-components.
- **State (server):** TanStack Query for async mutations and server state.
- **Database:** Firebase Firestore. Store monetary values as integers (cents), never floats.
- **Auth:** Firebase Authentication (client SDK).
- **Hosting:** Vercel.

### Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  api/           # Firebase services and data access functions
  components/    # Reusable React components with co-located stories and tests
  lib/           # Firebase SDK wrappers, auth, hooks, and utilities
  types/         # TypeScript type definitions (barrel-exported)
```

## TypeScript

- Strict mode throughout. No `any` types. No `@ts-ignore`.
- Do not use `null` unless required for API compatibility or when explicitly distinguishing `null` from `undefined`. Prefer `undefined` for absent/optional values throughout the codebase.
- Prefer explicit `interface` names scoped to their component (e.g., `interface OwnerAdvanceCardProps` not `interface Props`).
- Use `async/await`, not `.then()` chains.

## File Organization

- **Source files**: Keep under ~200 lines (split at ~240). Large files should be split by logical concern.
- **Test files**: Keep under ~300 lines (split at ~360). When splitting, organize into a `{module}-tests/` directory with domain-specific files.
- **Components**: Each component file must contain exactly one component and its associated props interface. Delegate complex logic to utility functions or sub-components.
- **Type files**: Convert large type files into barrel-exported directories with one file per logical domain.
- **Utility files**: Split by the type of operation or domain they serve.
- **Service files**: Extract complex logic areas into focused utility functions or smaller services.
- Barrel `index.ts` exports for all component/module directories.
- Use named exports, not default exports (except for Next.js pages).

## Code Conventions

- **No spurious variables.** Do not assign a value to a variable only to immediately return it on the next line -- return the expression directly instead.
- **Enums and constant objects** should be kept in alphabetical order to minimize merge conflicts.
- Format currency using the `formatCurrency` utility, never manually.

## Naming Conventions

- **Firebase schema conversions**: `{domain}ToFirebase()` / `firebaseTo{Domain}()`.
- **Presentational views**: Components extracted for testability use the `{Component}View` suffix.

## User-Facing Text

- All user-facing strings must be stored in a co-located copy file (e.g., `ComponentName.copy.ts` or `copy.ts`) for internationalization (i18n) readiness.
- Do not hardcode display strings inline in components.
- Copy files export a single `as const` object named `{SCOPE}_COPY`.

## React / Next.js Standards

### Framework

- Next.js with App Router (not Pages Router).
- UI components: ShadCN UI. Do not install other component libraries.
- Styling: Tailwind CSS (comes with ShadCN). No CSS modules or styled-components.

### Client Components

- `"use client"` directive required on all React client components (Next.js App Router).
- React hooks must be called unconditionally -- hooks before any early returns.

### JSX

- **No imperative logic inside JSX.** All conditional logic and variable declarations must be computed in the component body before the `return` statement, or extracted into a dedicated child component. Simple functional expressions are fine in JSX -- inline arrow functions, ternaries, and `.map()` calls that return JSX directly are all permitted. What is prohibited is multi-statement blocks: declaring intermediate variables and then returning a value inside JSX.
- JSX should only contain simple functional expressions: `items.map(item => <Item key={item.id} {...item} />)`.

### Component Structure

- Components should have a single JSX return statement. Invalid states should be prevented by the type system or guarded against by the calling component. An early `return null` can be acceptable if the invalid state is infeasible for the parent component to detect, but the component itself should be returned as a single JSX block.

## Storybook

- Story files are co-located with their component: `ComponentName.stories.tsx`.
- When adding or modifying a UI component, add or update its Storybook story to cover key visual states.
- Stories should use mock data fixtures -- never import from Firebase or depend on runtime providers (QueryClient, AuthProvider, Next.js router).
- Components that are too hook-dependent to render in isolation should use a presentational split: extract rendering into a `ComponentNameView` that accepts callbacks, and keep the original as a thin wrapper that wires up hooks.

## Component Tests

- Test files are co-located with their component: `ComponentName.test.tsx`.
- When adding or modifying a UI component, add or update its test to verify rendering behavior and key prop-driven states.
- Use `@testing-library/react` with `vitest`. Always call `afterEach(cleanup)`.
- Do not use `.toBeInTheDocument()` -- use `.toBeDefined()` or check `.textContent` instead.
- Assert against copy constants rather than hardcoded strings.
- Test presentational view components directly; avoid mocking hooks in tests where possible.

## Testing Conventions

- Use `describe`/`it` from Vitest (not `test`).
- Test fixture generators use `make{DomainName}()` pattern.
- When splitting large test files, organize into `{module}-tests/` directories.
- Unit test business logic (especially balance calculations) with Vitest.
- Use the Firebase emulator for integration tests.

## Git Conventions

- Branch names: lowercase with hyphens, prefixed by type: `feat/`, `chore/`, `refactor/`, `fix/`, `docs/`.
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`).

## Documentation

- Keep documentation in sync with the code -- outdated docs are worse than no docs.
