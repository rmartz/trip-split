# Service Layer Directives

Rules specific to Firebase services, Realtime Database queries, and data access functions.

## Data Access

- All Firebase RTDB reads and writes must go through functions in this directory.
- Components must never import `firebase` or `firebase/database` directly. All access goes through this directory.
- Each domain gets its own service file (e.g., `trips.ts`, `members.ts`, `expenses.ts`).

## Database Schema

RTDB is a flat JSON tree. Data is organized at top-level paths to avoid deep nesting:

```
trips/{tripId}           # Trip data
members/{tripId}/{id}    # Members per trip
userTrips/{userId}/{id}  # Denormalized index for user trip lookup
```

## Monetary Values

- Store all monetary values as integers (cents). Never use floats for money.
- Conversion to display format happens only at the UI layer via `formatCurrency`.

## Types

- Service functions must accept and return typed interfaces from `src/types/`, never raw Firebase data.
- Timestamps are stored as ISO 8601 strings and converted to `Date` objects at the service boundary.
