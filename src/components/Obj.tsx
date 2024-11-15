import React, { useEffect, useState } from "react";
import { useNATS } from "@/contexts/NatsContext";
import { ObjectStore, Objm } from "@nats-io/obj";

export default function Obj() {
  const { nc } = useNATS();
  const [obj, setObj] = useState<ObjectStore>();
  const [watching, setWatching] = useState(false);
  const [value, setValue] = useState<string>("waiting for value to change");

  useEffect(() => {
    if (nc && !obj) {
      (async () => {
        const objm = new Objm(nc);
        try {
          const o = await objm.create("my_react_obj_example");
          setObj(o);
        } catch (e) {
          console.log("error creating:", (e as Error).message);
        }
      })();
    }

    if (obj && !watching) {
      setWatching(true);
      (async () => {
        const iter = await obj.watch();
        (async () => {
          for await (const e of iter) {
            setValue(`'${e.name}' changed on ${e.mtime}`);
          }
        })().catch(() => {
          setWatching(false);
        });
      })();
    }
  }, [nc, obj]);

  function updateObj() {
    obj?.putBlob({ name: "entry" }, new TextEncoder().encode("Hello!")).catch();
  }

  if (!obj) {
    return (
      <div style={{marginBottom: 30}}>
        <h2>NATS ObjectStore</h2>
        <p className="lead">Opening...</p>
      </div>
    );
  }
  return (
      <div style={{marginBottom: 30}}>
        <h2>NATS ObjectStore</h2>
        <p>
          This section shows a simple component that watches an ObjectStore called
          'my_react_obj_example', and updates when any entry changes. The last change received:
        </p>

        <p><code>{value}</code></p>
        <button onClick={updateObj}>Change Value</button>
      </div>
  );
}
