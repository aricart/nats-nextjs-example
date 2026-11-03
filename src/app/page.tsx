import Image from "next/image";
import NatsClient from "@/components/NatsClient";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          src="/nats.png"
          alt="NATS logo"
          width={360}
          height={96}
          priority
        />
        <NatsClient />
      </main>
    </div>
  );
}
