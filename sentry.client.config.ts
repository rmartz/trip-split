import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Replay may only be enabled for the client-side rendering.
  integrations: [Sentry.replayIntegration()],

  // Set tracesSampleRate to 1.0 in development; use a lower rate in production
  // to avoid exhausting quota with high traffic.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Setting this option to true will print useful information to the console
  // while you're setting up Sentry.
  debug: false,
});
