This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project adds `@nats-io/nats-core`, `@nats-io/kv`, and `@nats-io/obj`,
which provide the basic API for a NATS core client and access to JetStream
KV and ObjectStore. It connects to `wss://demo.nats.io:8443`.

## Pattern

NATS connections, KV buckets, and ObjectStores are async resources. Modern
React already has a primitive for that: Suspense + the `use()` hook.
Components don't manage `nc | undefined` state, don't `useEffect` to
connect, don't lift errors into provider state.

- `src/lib/nats.ts` — module-scope singleton promises for the connection,
  KV, and ObjectStore. Cached on first call, shared by every component.
- `src/components/Nats.tsx` / `Kv.tsx` / `Obj.tsx` — call `use(natsConn())`,
  `use(natsKv())`, `use(natsObj())` and get a ready handle synchronously.
  `useEffect` only runs subscription/watch lifecycles.
- `src/components/NatsApp.tsx` — wraps the three components in `<Suspense>`
  + `<ErrorBoundary>`. The Suspense fallback shows while connecting; the
  ErrorBoundary catches connection failures.
- `src/components/ErrorBoundary.tsx` — small class component (no extra
  dependency).
- `src/components/NatsClient.tsx` — a client component that loads `NatsApp`
  via `next/dynamic` with `ssr: false` (the WebSocket only runs in the
  browser; with the App Router, `ssr: false` needs a client component).
- `src/app/page.tsx` — the generated page, showing the NATS logo and
  `NatsClient`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
