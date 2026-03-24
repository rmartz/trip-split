# Overview

Trip Split is a hosted online service for friends to use to split the expenses of a trip. Each person can register an expense they paid for, who was involved in that expense, and then the system will calculate each person's portion of the expense and if they are owed money or owe money to "the pot".

## Technical Stack

Trip Split will be:

- NextJS React app
- TypeScript full strict mode
- Firebase for storage and basic auth
- Vercel hosting
- Sentry.io error reporting
- ShadCN UI components
- pnpm (never npm or yarn)

## Functionality

- Users can create a trip and define people for that trip, even without accounts for each person on the trip
- Users can be invited and join a trip made by someone else
- Users can have multiple trips in their dashboard
- Users can submit expenses they paid for on the trip and who is a part of that expense
- Expenses can be subdivided by itemization, for example a restaurant receipt. Tax and tip split
- Users can submit expenses one-by-one as the trip happens
