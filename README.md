This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

This project adds an additional library `@nats-io/nats-core` which provides
the basic API for a NATS core client and includes the `wsconnect` function
used for establishing a connection to the NATS server.

This project edits the `src/pages/index.js` and adds a simple component that
connects to NATS using NATS WebSockets via the `wsconnect` function. It connects
to the server configured in the `url` property of the `Nats` component, and then
creates a wildcard subscription to all messages. The last 10 messages and their
subjects and their string payloads.

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
