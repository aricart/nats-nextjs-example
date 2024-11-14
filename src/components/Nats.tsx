import React, { useEffect, useState } from "react";
import { useNATS } from "@/contexts/NatsContext";
import Image from "next/image";
import { Msg } from "@nats-io/nats-core";

export type MsgEvent = {
  id: number;
  msg: Msg;
};

function Msgs({ msgs }: { msgs: MsgEvent[] }) {
  const list = msgs?.map((d) => (
    <li key={d.id}>
      <strong>{d.id}</strong>&nbsp;
      {d.msg.subject}
    </li>
  ));

  if (!list) {
    return <></>;
  }
  return <ul>{list}</ul>;
}

export default function Nats() {
  const { nc, ncErr } = useNATS();
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState<MsgEvent[] | null>();
  const [err, setErr] = useState<Error | null>(null);

  const a: MsgEvent[] = [];

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

      setMessages(a.slice(-10));
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

      nc.subscribe(">", { callback });
    }
  }, [nc, status]);

  if (ncErr) {
    return (
      <>
        <Image
          src="/nats.png"
          alt="NATS logo"
          width={180}
          height={38}
          priority
        />
        <h3>Error Connecting to NATS</h3>
        <p>{ncErr.message}</p>
      </>
    );
  }

  if (!nc) {
    return (
      <>
        <Image
          src="/nats.png"
          alt="NATS logo"
          width={180}
          height={38}
          priority
        />
        <h3>Connecting To NATS...</h3>
      </>
    );
  }
  return (
    <>
      <Image
        src="/nats.png"
        alt="NATS logo"
        width={180}
        height={38}
        priority
      />
      <h3>{status}</h3>
      <Msgs msgs={messages ?? []} />
      <p>{err?.message}</p>
    </>
  );
}
