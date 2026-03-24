# Trip Split

Trip Split is a hosted online service for friends to split the expenses of a trip. Each person can register an expense they paid for, who was involved in that expense, and then the system will calculate each person's portion and whether they are owed money or owe money to settle up.

## Features

- **Trip Management** -- Create trips and add members, even without accounts for each person
- **Invite Links** -- Share a link so friends can join your trip
- **Expense Tracking** -- Submit expenses one-by-one as the trip happens
- **Itemized Splitting** -- Break down receipts by line item with tax and tip splitting
- **Balance Calculation** -- See who owes what and get simplified settlement suggestions

## Tech Stack

- [Next.js](https://nextjs.org/) with App Router
- TypeScript (full strict mode)
- [Firebase](https://firebase.google.com/) for Firestore and Authentication
- [Vercel](https://vercel.com/) for hosting
- [Sentry](https://sentry.io/) for error reporting
- [ShadCN UI](https://ui.shadcn.com/) component library
- pnpm package manager

## Getting Started

### Prerequisites

- Node.js (see `.nvmrc` for version)
- pnpm (`npm install -g pnpm`)
- Firebase project (see [Firebase Setup](#firebase-setup))

### Installation

```bash
pnpm install
```

### Environment Variables

Copy the example env file and fill in your Firebase config:

```bash
cp .env.example .env.local
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore and Authentication (Email/Password)
3. Copy your Firebase config values to `.env.local`

## Scripts

| Command       | Description               |
| ------------- | ------------------------- |
| `pnpm dev`    | Start development server  |
| `pnpm build`  | Production build          |
| `pnpm lint`   | Run ESLint                |
| `pnpm format` | Format code with Prettier |
| `pnpm test`   | Run tests                 |
