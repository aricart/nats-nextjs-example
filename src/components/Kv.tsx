import { use, useEffect, useState } from "react";
import type { QueuedIterator } from "@nats-io/nats-core";
import type { KvWatchEntry } from "@nats-io/kv";
import { natsKv } from "@/lib/nats";

export default function Kv() {
  const kv = use(natsKv());
  const [value, setValue] = useState<string>("waiting for value to change");

  useEffect(() => {
    let iter: QueuedIterator<KvWatchEntry> | undefined;
    (async () => {
      iter = await kv.watch({ key: "key" });
      for await (const e of iter) {
        if (e.operation === "DEL" || e.operation === "PURGE") {
          setValue("deleted");
        } else {
          setValue(e.string());
        }
      }
    })().catch((err) => {
      console.error("kv watch:", err);
    });
    return () => {
      iter?.stop();
    };
  }, [kv]);

  function updateKv() {
    kv.put("key", "Hello!    " + Date.now()).catch(console.error);
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <h2>NATS Key/Value</h2>
      <p>
        This section shows a simple component that watches a KV for changes
        on the key 'key' that is stored in the bucket 'my_react_kv_example'.
        If the value changes, it will be reflected here:
      </p>

      <p>
        <code>{value}</code>
      </p>
      <button onClick={updateKv}>Update the KV</button>
    </div>
  );
}
