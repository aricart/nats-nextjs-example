import React, { useEffect, useState } from "react";
import { useNATS } from "@/contexts/NatsContext";
import { KV, Kvm } from "@nats-io/kv";

export default function Kv() {
  const { nc, ncErr } = useNATS();
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
        const iter = await kv.watch({ key: "my_key" });
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

  if (!kv) {
    return <p>Opening KV....</p>;
  }
  return (
    <>
      <p>Change KV `my_react_kv_example[my_key]` to see updates</p>
      <p>KV value: {value}</p>
    </>
  );
}
