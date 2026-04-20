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
- **Database:** Firebase Realtime Database. Store monetary values as integers (cents), never floats.
- **Auth:** Firebase Authentication (client SDK).
- **Hosting:** Vercel.

### Project Structure

```
src/
  app/           # Next.js App Router pages and layouts
  services/      # Firebase services and data access functions
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
- **Test files**: Keep under ~300 lines (split at ~360). Use `.spec.ts` / `.spec.tsx` extension. When splitting, organize into a `{module}-tests/` directory with domain-specific files.
- **Components**: A component file contains its primary component and props interface. A sub-component may be co-located in the same file if it owns no hooks, state, effects, or context, and is used only by the parent component in that file. A sub-component must be in its own file when any of these are true: it owns hooks, state, effects, or context; it is referenced from multiple parents; or it is substantial enough to warrant its own stories or tests. All component props must be defined as an explicitly named interface (e.g., `interface TripCardProps`), never inline in the function signature.
- **Type files**: Convert large type files into barrel-exported directories with one file per logical domain.
- **Utility files**: Split by the type of operation or domain they serve.
- **Service files**: Extract complex logic areas into focused utility functions or smaller services.
- Add a barrel `index.ts` when a component or module directory exposes a public API or already follows a barrel pattern; do not require one for every directory (e.g. ShadCN-generated `src/components/ui/` has no barrel by convention).
- Use named exports, not default exports (except for Next.js pages and Storybook story files, which require `export default meta`).

## Code Conventions

- **Favor type inference.** Explicit generic type arguments (e.g., `someFn<Foo>(...)`) are a code smell when TypeScript can infer them.
- **No spurious variables.** Do not assign a value to a variable only to immediately return it on the next line — return the expression directly instead.
- **No IIFEs.** Do not use immediately-invoked function expressions. Extract the logic into a named helper function or compute the value with a plain expression instead.
- **No function-style imports.** Do not use inline `import("…").Type` syntax in type annotations. Use module-level `import type { … } from "…"` statements at the top of the file.
- **No unnecessary helpers.** Do not extract logic into a helper function unless it separates significant logic or belongs in a different module.
- **Prefer enums over string literal unions** for any domain concept with two or more named states (e.g., use `enum SplitType { Equal = "equal", Itemized = "itemized" }` rather than `"equal" | "itemized"`). String enum values must match existing serialized literals so Firebase data round-trips without migration.
- **Enums and constant objects** should be kept in alphabetical order to minimize merge conflicts.
- Format currency using the `formatCurrency` utility from `@/lib/format`, never manually.

## Backwards Compatibility

Trip Split stores user data persistently in Firebase. Once the app reaches MVP with real users, schema changes require a migration path.

- Never rename or remove Firebase fields without a migration. Prefer additive changes (new optional fields) over renames or removals.
- String enum values must match existing serialized literals exactly — changing an enum value is a breaking schema change.
- Mark breaking changes with a `feat!:` PR title so they are visible in the squash-merge commit history.

## Naming Conventions

- **Firebase schema conversions**: `{domain}ToFirebase()` / `firebaseTo{Domain}()` (e.g., `tripToFirebase()`, `firebaseToTrip()`).
- **Presentational views**: Components extracted for testability use the `{Component}View` suffix (e.g., `TripDetailView`, `AddExpenseFormView`).

## User-Facing Text

- For any new or modified UI component, store user-facing strings in a co-located copy file (e.g., `ComponentName.copy.ts` or `copy.ts`) for internationalization (i18n) readiness. Do not introduce new hardcoded display strings inline in components you are actively changing.
- Copy files export a single `as const` object named `{SCOPE}_COPY` (e.g., `TRIP_DETAIL_COPY`, `EXPENSE_CARD_COPY`).
- Existing hardcoded strings elsewhere in the codebase are technical debt to be migrated over time; this rule does not require unrelated cleanup.

## React / Next.js Standards

### Framework

- Next.js with App Router (not Pages Router).
- UI components: ShadCN UI. Do not install other component libraries.
- Styling: Tailwind CSS (comes with ShadCN). No CSS modules or styled-components.

### Client Components

- `"use client"` directive required on all React client components (Next.js App Router).
- React hooks must be called unconditionally — hooks before any early returns.

### JSX

- **No imperative logic inside JSX.** Imperative logic means anything that requires a statement rather than an expression: `const`/`let` declarations, `if`/`switch` blocks, loops, or any sequence of statements that produces a result through side effects. All such logic must live in the component body before the `return` statement, or be extracted into a child component. Expressions of any complexity are permitted directly in JSX — ternaries, logical operators (`&&`, `||`, `??`), method chains (`.map()`, `.filter()`, `.find()`), nested function calls, and template literals are all fine as long as they form a single expression with no intermediate bindings. Statement blocks inside callback functions passed as JSX props are allowed (e.g. multi-statement event handlers like `onChange={(e) => { setName(e.target.value); setValidationError(undefined); }}`).

### Component Structure

- Components should have a single JSX return statement. Invalid states should be prevented by the type system or guarded against by the calling component. An early `return null` can be acceptable if the invalid state is infeasible for the parent component to detect, but the component itself should be returned as a single JSX block.

## Storybook

- Story files are co-located with their component: `ComponentName.stories.tsx`.
- When adding or modifying a UI component, add or update its Storybook story to cover key visual states.
- Stories should use mock data fixtures — never import from Firebase or depend on runtime providers (QueryClient, AuthProvider, Next.js router).
- Components that are too hook-dependent to render in isolation should use a presentational split: extract rendering into a `ComponentNameView` that accepts callbacks, and keep the original as a thin wrapper that wires up hooks.

## Component Tests

- Test files are co-located with their component: `ComponentName.spec.tsx`.
- When adding or modifying a UI component, add or update its test to verify rendering behavior and key prop-driven states.
- Use `@testing-library/react` with `vitest`. Cleanup is configured globally in `src/test-setup.ts` — do not add per-file `afterEach(cleanup)` calls.
- Do not use `.toBeInTheDocument()` — use `.toBeDefined()` or check `.textContent` instead.
- Assert against copy constants rather than hardcoded strings.
- Test presentational view components directly; avoid mocking hooks in tests where possible.

## Testing Conventions

- Use `describe`/`it` from Vitest (not `test`).
- Test fixture generators use `make{DomainName}()` pattern.
- When splitting large test files, organize into `{module}-tests/` directories.
- Unit test business logic (especially balance calculations) with Vitest.
- Use the Firebase emulator for integration tests.

### Test Design

- **Control inputs and outputs.** Do not rely on a function's default return values as the assertion of a test unless the purpose of the test is specifically to verify those defaults. Use explicit, non-default values so a passing test proves the value was produced by logic, not inherited from an initializer.
- **One reason to fail per test.** Each test should assert a single logical outcome. If a test invokes two functions from the codebase it should be explicitly testing how those two interact. Incidental coverage of a second function is not a reason to combine assertions.
- **Keep tests simple.** A failing test should make it immediately obvious whether the failure is a bug or an intentional change in behavior. If understanding a failure requires reading more than one layer of test setup or multiple assertions, split the test.
- **Granularity scales with level of abstraction.** Low-level functions (pure utilities, serializers) warrant thorough edge-case coverage. High-level functions (service orchestration, mutations) should have smoke tests that verify they correctly apply the lower-level logic — not re-test every edge case that belongs in the lower-level tests.

## Git Conventions

- Branch names: lowercase with hyphens, prefixed by type and suffixed with issue number: `feat/`, `chore/`, `refactor/`, `fix/`, `docs/` (e.g., `feat/add-expense-15`).
- Commit messages within a branch: imperative verbs, no Conventional Commits prefix (e.g., `Add expense form validation`, `Fix member count display`). Individual commits should read clearly on their own — `feat:` prefixes add noise when reviewing a PR's commit list.
- PR titles must follow Conventional Commits format: `<type>: description` (e.g., `feat: add expense form`). PRs are squash-merged, so the PR title becomes the single commit on main. Valid types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`. Use `feat!:` for breaking schema changes. Enforced by CI.
- PR descriptions must use `Closes #123`, `Fixes #123`, or `Resolves #123` to trigger GitHub's automatic issue close on merge.

## Documentation

- Keep documentation in sync with the code — outdated docs are worse than no docs.
