import React, { useEffect, useState } from "react";
import { useNATS } from "@/contexts/NatsContext";
import { KV, Kvm } from "@nats-io/kv";

export default function Kv() {
  const { nc } = useNATS();
  const [kv, setKv] = useState<KV>();
  const [value, setValue] = useState<string>("waiting for value to change");
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    if (nc && !kv) {
      (async () => {
        const kvm = new Kvm(nc);
        try {
          const kv = await kvm.create("my_react_kv_example");
          setKv(kv);
        } catch (e) {
          console.log("error creating:", (e as Error).message);
        }
      })();
    }
    if (kv && !watching) {
      setWatching(true);
      (async () => {
        const iter = await kv.watch({ key: "key" });
        (async () => {
          for await (const e of iter) {
            if (e.operation === "DEL" || e.operation === "PURGE") {
              setValue("deleted");
            } else {
              setValue(e.string());
            }
          }
        })().catch(() => {
          setWatching(false);
        });
      })();
    }
  }, [nc, kv, watching]);

  function updateKv() {
    kv?.put("key", "Hello!    " + Date.now()).catch();
  }

  if (!kv) {
    return (
        <div style={{ marginBottom: 30 }}>
          <h2>NATS Key/Value</h2>
          <p className="lead">Opening...</p>
        </div>
    );
  }
  return (
      <div style={{ marginBottom: 30 }}>
        <h2>NATS Key/Value</h2>
        <p>
          This section shows a simple component that watches a KV for changes on
          the key 'key' that is stored in the bucket 'my_react_kv_example'. If the
          value changes, it will be reflected here:
        </p>

        <p><code>{value}</code></p>
        <button onClick={updateKv}>Update the KV</button>
      </div>
  );
}
