export const TRIP_CARD_COPY = {
  memberCount: (count: number) =>
    count === 1 ? "1 member" : `${String(count)} members`,
} as const;
