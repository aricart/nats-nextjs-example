"use client";

import dynamic from "next/dynamic";

// the WebSocket only runs in the browser, so the NATS app isn't server
// rendered - with the App Router, ssr: false needs a client component
const NatsApp = dynamic(() => import("@/components/NatsApp"), { ssr: false });

export default function NatsClient() {
  return <NatsApp />;
}
