import { use, useEffect, useState } from "react";
import type { QueuedIterator } from "@nats-io/nats-core";
import type { ObjectInfo } from "@nats-io/obj";
import { natsObj } from "@/lib/nats";

export default function Obj() {
  const obj = use(natsObj());
  const [value, setValue] = useState<string>("waiting for value to change");

  useEffect(() => {
    let iter: QueuedIterator<ObjectInfo | null> | undefined;
    (async () => {
      iter = await obj.watch();
      for await (const e of iter) {
        if (e) setValue(`'${e.name}' changed on ${e.mtime}`);
      }
    })().catch((err) => {
      console.error("obj watch:", err);
    });
    return () => {
      iter?.stop();
    };
  }, [obj]);

  function updateObj() {
    obj.putBlob({ name: "entry" }, new TextEncoder().encode("Hello!"))
      .catch(console.error);
  }

  return (
    <div style={{ marginBottom: 30 }}>
      <h2>NATS ObjectStore</h2>
      <p>
        This section shows a simple component that watches an ObjectStore
        called 'my_react_obj_example', and updates when any entry changes.
        The last change received:
      </p>

      <p>
        <code>{value}</code>
      </p>
      <button onClick={updateObj}>Change Value</button>
    </div>
  );
}
