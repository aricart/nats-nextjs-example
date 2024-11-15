import React, { useEffect, useState } from "react";
import { useNATS } from "@/contexts/NatsContext";
import { Msg, createInbox } from "@nats-io/nats-core";

export type MsgEvent = {
  id: number;
  msg: Msg;
};

function Msgs({ msgs }: { msgs: MsgEvent[] }) {
  const list = msgs?.map((d) => (
    <pre key={d.id}>
      <strong>{d.id}</strong>&nbsp;{d.msg.subject}
    </pre>
  ));

  if (!list) {
    return <></>;
  }
  return <div className="codebox">{list}</div>;
}


export default function Nats() {
  const { nc, ncErr, url } = useNATS();
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<MsgEvent[] | null>();
  const [err, setErr] = useState<Error | null>(null);
  const [inbox, setInbox] = useState(() => {
    let inbox = createInbox("hello");
    inbox = inbox.slice(0, inbox.length - 1);
    return inbox;
  });

  let a: MsgEvent[] = [];
  let i = 1;
  function callback(err: Error | null, msg: Msg) {
    if (err) {
      console.log(err);
      setErr(err);
    } else {
      const m = {
        id: i++,
        msg: msg,
      };
      a.push(m);
      a = a.slice(-5);
      setMessages(a.slice());
    }
  }

  useEffect(() => {
    if (nc) {
      setStatus(`connected to ${nc.getServer()}`);
      (async () => {
        nc.closed().then(() => {
          setStatus("NATS connection closed - reload the page");
        });
        for await (const s of nc.status()) {
          switch (s.type) {
            case "disconnect":
              setStatus(`disconnected from ${nc.getServer()}`);
              break;
            case "reconnect":
              setStatus(`connected to ${nc.getServer()}`);
              break;
          }
        }
      })();

      nc.subscribe(inbox, { callback });
    }
  }, [nc, status]);

  function pub() {
    nc?.publish(inbox, "Hello from Next.js");
  }

  if (ncErr) {
    return (
      <>
        <h3>Error Connecting to NATS</h3>
        <p>{ncErr.message}</p>
      </>
    );
  }

  if (!nc) {
    return (
      <>
        <h3>Connecting To NATS...</h3>
      </>
    );
  }
  return (
    <>
      <div>
        <p>
          This is a trivial NATS React Native Application that hints on how you
          can integrate a NATS connection into a Next.js generated sample.
        </p>
        <p>
          The connection created a connection to <code>{url}</code> and has the current status:
          {" "}
          <em>{status}</em>
        </p>

        <h2>Pub/Sub</h2>

        <p>
          The application is subscribed to <code>'{inbox}'</code>, and it is receiving all
          messages published to the server on that subject. The application is
          prints the subject the message was received on. If nothing is printing,
          connect to the server at {url}{"  "}
          and publish a message with a tool such as 'nats' cli or by clicking the
          button below to publish a random message on <code>'{inbox}'</code>.
        </p>

        <Msgs msgs={messages ?? []} />

        <button onClick={pub}>Publish Message</button>

        <p>{err?.message}</p>
      </div>
    </>
  );
}
