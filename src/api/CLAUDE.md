# API & Data Access Directives

Rules specific to Firebase services, Firestore queries, and data access functions.

## Data Access

- All Firestore reads and writes must go through functions in this directory.
- Components must never import `firebase` or `firebase/firestore` directly.
- Each domain gets its own service file (e.g., `trips.ts`, `members.ts`, `expenses.ts`).

## Monetary Values

- Store all monetary values as integers (cents). Never use floats for money.
- Conversion to display format happens only at the UI layer via `formatCurrency`.

## Types

- Service functions must accept and return typed interfaces from `src/types/`, never raw Firestore documents.
- Timestamps should be converted to `Date` objects at the service boundary.
