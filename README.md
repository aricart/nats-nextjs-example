This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

This project adds additional libraries `@nats-io/nats-core` and `@nats-io/kv`
which provides the basic API for a NATS core client and includes the `wsconnect`
function used for establishing a connection to the NATS server as well as
accessing JetStream data stored in a KV.

This project adds:

- `src/contexts/NatsContext` to track/create a connection on which other NATS
  components can depend.
- `src/components/Nats` which displays a logo, and connection status for the
  client, and creates a subscrption that lists all the subjects that are flying
  through the system.
- `src/components/Kv` which monitors a KV for changes

This project edits the `src/pages/index.js` to use the above components

## Getting Started

```bash
# rebuild the node_modules directory by installing all Next.js dependencies
# and the NATS dependencies.
npm install

# start the NextJs development server

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

/ Open [http://localhost:3000](http://localhost:3000) with your browser to see
the result.
