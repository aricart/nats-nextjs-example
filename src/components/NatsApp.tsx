import { Suspense } from "react";
import Nats from "@/components/Nats";
import Kv from "@/components/Kv";
import Obj from "@/components/Obj";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { natsConn, natsKv, natsObj } from "@/lib/nats";

export default function NatsApp() {
  // prime all three resources so Suspense doesn't waterfall their fetches.
  natsConn();
  natsKv();
  natsObj();

  return (
    <ErrorBoundary
      fallback={(err) => (
        <div>
          <h3>Error Connecting to NATS</h3>
          <p>{err.message}</p>
        </div>
      )}
    >
      <Suspense fallback={<h3>Connecting to NATS...</h3>}>
        <Nats />
        <Kv />
        <Obj />
      </Suspense>
    </ErrorBoundary>
  );
}
