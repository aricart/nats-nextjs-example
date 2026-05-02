import { use, useEffect, useState } from "react";
import {
  createInbox,
  type Msg,
  type QueuedIterator,
  type Status,
} from "@nats-io/nats-core";
import { natsConn, NATS_URL } from "@/lib/nats";

export type MsgEvent = {
  id: number;
  msg: Msg;
};

function Msgs({ msgs }: { msgs: MsgEvent[] }) {
  if (msgs.length === 0) return <div className="codebox" />;
  return (
    <div className="codebox">
      {msgs.map((d) => (
        <pre key={d.id}>
          <strong>{d.id}</strong>&nbsp;{d.msg.subject}
        </pre>
      ))}
    </div>
  );
}

export default function Nats() {
  const nc = use(natsConn());
  const [status, setStatus] = useState(`connected to ${nc.getServer()}`);
  const [messages, setMessages] = useState<MsgEvent[]>([]);
  const [err, setErr] = useState<Error | null>(null);
  const [inbox] = useState(() => {
    const i = createInbox("hello");
    return i.slice(0, i.length - 1);
  });

  useEffect(() => {
    let stopped = false;
    let id = 0;
    const statusIter = nc.status() as QueuedIterator<Status>;

    nc.closed().then(() => {
      if (!stopped) setStatus("NATS connection closed - reload the page");
    });

    (async () => {
      for await (const s of statusIter) {
        if (s.type === "disconnect") {
          setStatus(`disconnected from ${nc.getServer()}`);
        } else if (s.type === "reconnect") {
          setStatus(`connected to ${nc.getServer()}`);
        }
      }
    })().catch((err) => {
      console.error("status:", err);
    });

    const sub = nc.subscribe(inbox, {
      callback: (e, msg) => {
        if (e) {
          setErr(e);
          return;
        }
        const next = { id: ++id, msg };
        setMessages((prev) => [...prev, next].slice(-5));
      },
    });

    return () => {
      stopped = true;
      statusIter.stop();
      sub.unsubscribe();
    };
  }, [nc, inbox]);

  function pub() {
    nc.publish(inbox, "Hello from Next.js");
  }

  return (
    <div>
      <p>
        This is a trivial NATS Next.js application that hints on how you can
        integrate a NATS connection into a Next.js generated sample.
      </p>
      <p>
        The connection is to <code>{NATS_URL}</code> and has the current
        status: <em>{status}</em>
      </p>

      <h2>Pub/Sub</h2>

      <p>
        The application is subscribed to <code>'{inbox}'</code>, and it
        receives all messages published to the server on that subject. The
        application prints the subject the message was received on. If
        nothing is printing, connect to the server at {NATS_URL} and publish
        a message with a tool such as the 'nats' CLI, or click the button
        below to publish a random message on <code>'{inbox}'</code>.
      </p>

      <Msgs msgs={messages} />

      <button onClick={pub}>Publish Message</button>

      <p>{err?.message}</p>
    </div>
  );
}
