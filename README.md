This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

This project adds `@nats-io/nats-core`, `@nats-io/kv`, and `@nats-io/obj`,
which provide the basic API for a NATS core client and access to JetStream
KV and ObjectStore.

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
- `src/pages/index.tsx` — loads `NatsApp` via `next/dynamic` with
  `ssr: false` (the WebSocket only runs in the browser).

The previous `src/contexts/NatsContext.tsx` provider is gone.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
