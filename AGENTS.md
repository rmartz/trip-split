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

## TypeScript

- Strict mode throughout. No `any` types. No `@ts-ignore`.
- Prefer `undefined` for absent/optional values. Use `null` only for API compatibility or when explicitly distinguishing `null` from `undefined`.
- All component props must be defined as an explicitly named interface (e.g., `interface TripCardProps`), never inline in the function signature or as an anonymous type.
- Use `async/await`, not `.then()` chains.

## File Organization

- **Source files**: Keep under ~200 lines (split at ~240). Large files should be split by logical concern.
- **Test files**: Keep under ~300 lines (split at ~360). Use `.spec.ts` / `.spec.tsx` extension (not `.test.ts`). When splitting, organize into a `{module}-tests/` directory with domain-specific files.
- **Components**: One component per file with its props interface. A sub-component may be co-located in the same file only if it has no hooks, state, effects, or context and is used only by the parent component in that file. A sub-component must be in its own file when any of these are true: it owns hooks, state, effects, or context; it is referenced from multiple parents; or it is substantial enough to warrant its own stories or tests.
- **Type files**: Convert large type files into barrel-exported directories with one file per logical domain.
- Barrel `index.ts` exports for all component/module directories.
- Use named exports, not default exports (except for Next.js pages).

## Code Conventions

- **Favor type inference.** Explicit generic type arguments are a code smell when TypeScript can infer them.
- **No spurious variables.** Do not assign a value to a variable only to immediately return it — return the expression directly.
- **No IIFEs.** Extract logic into a named helper or compute with a plain expression.
- **No inline dynamic type imports.** Do not use `import("…").Type` syntax in type annotations. Use module-level `import type { … } from "…"` statements.
- **No unnecessary helpers.** Do not extract logic into a helper unless it separates significant logic or belongs in a different module.
- **Alphabetical order.** Enums and constant objects must be kept in alphabetical order to minimize merge conflicts.
- **Monetary values as integers.** Store all currency amounts as integer cents, never floats.
- **Format currency with `formatCurrency`.** Always use the `formatCurrency` utility from `@/lib/format`. Never format currency amounts manually.

## User-Facing Text

- All user-facing strings must be stored in a co-located copy file (e.g., `ComponentName.copy.ts`).
- Copy files export a single `as const` object named `{SCOPE}_COPY` (e.g., `TRIP_DETAIL_COPY`, `EXPENSE_CARD_COPY`).
- Do not hardcode display strings inline in components.

## React / Next.js Standards

### Client Components

- `"use client"` directive required on all React client components (Next.js App Router).
- React hooks must be called unconditionally — hooks before any early returns.

### JSX

- **No imperative logic inside JSX.** Imperative logic means anything that requires a statement: `const`/`let` declarations, `if`/`switch` blocks, loops, or any sequence of statements that produces a result through side effects. All such logic must live in the component body before the `return` statement, or be extracted into a child component. Expressions of any complexity are permitted directly in JSX — ternaries, logical operators (`&&`, `||`, `??`), method chains (`.map()`, `.filter()`, `.find()`), nested function calls, and template literals are all fine as long as they form a single expression with no intermediate bindings.

### Component Structure

- Components should have a single JSX return statement. Invalid states should be prevented by the type system or guarded against by the calling component. An early `return null` is acceptable if the invalid state is infeasible for the parent to detect, but the component itself should be returned as a single JSX block.

## Naming Conventions

- **Firebase schema conversions**: `{domain}ToFirebase()` / `firebaseTo{Domain}()` (e.g., `tripToFirebase()`, `firebaseToTrip()`).
- **Presentational views**: Components extracted for testability use the `{Component}View` suffix (e.g., `TripDetailView`, `AddExpenseFormView`).

## Storybook

- Story files are co-located with their component: `ComponentName.stories.tsx`.
- When adding or modifying a UI component, add or update its Storybook story to cover key visual states.
- Stories must use mock data fixtures — never import from Firebase or depend on runtime providers (QueryClient, AuthProvider, Next.js router).
- Components that are too hook-dependent to render in isolation should use a presentational split: extract rendering into a `ComponentNameView` that accepts callbacks, and keep the original as a thin wrapper that wires up hooks.

## Component Tests

- Test files are co-located with their component: `ComponentName.spec.tsx`.
- When adding or modifying a UI component, add or update its test to verify rendering behavior and key prop-driven states.
- Use `@testing-library/react` with vitest. Always call `afterEach(cleanup)`.
- Do not use `.toBeInTheDocument()` — use `.toBeDefined()` or check `.textContent` instead.
- Assert against copy constants rather than hardcoded strings.
- Test presentational view components directly; avoid mocking hooks in tests where possible.

## Testing Conventions

- Use `describe`/`it` from Vitest (not `test`).
- Test fixture generators use the `make{DomainName}()` pattern (e.g., `makeTrip()`, `makeTripMember()`, `makeExpense()`).
- When splitting large test files, organize into `{module}-tests/` directories.

## Git Conventions

- Branch names: lowercase with hyphens, type-prefixed: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`.
- PR titles must follow Conventional Commits format: `<type>: description` or `<type>(<scope>): description`. Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`. A `!` suffix denotes breaking changes (e.g., `feat!: remove legacy auth`). Enforced by CI.
- PR descriptions must use `Closes #123`, `Fixes #123`, or `Resolves #123` to trigger GitHub's automatic issue close on merge. Phrases like "Addresses #123" do not trigger auto-close.
