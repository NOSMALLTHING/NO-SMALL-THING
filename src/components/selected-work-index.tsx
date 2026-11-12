import Image from "next/image";
import Link from "next/link";
import { selectedWorkItems, type SelectedWorkItem } from "@/lib/selected-work-list";
import { SelectedWorkIconMark } from "./selected-work-icons";
import styles from "./selected-work-index.module.css";

function Thumb({ item }: { item: SelectedWorkItem }) {
  if (item.image) {
    return <Image src={item.image.src} alt={item.image.alt} width={160} height={160} className={styles.thumb} />;
  }
  return <span className={`${styles.thumb} ${styles.swatch}`} style={{ background: item.swatch }} />;
}

export function SelectedWorkIndex() {
  return (
    <section id="selected-work" className={styles.section} aria-labelledby="selected-work-title">
      <div className={styles.stack}>
        <h2 id="selected-work-title" className={styles.label}>SELECTED WORK.</h2>
        <ol className={styles.list}>
          {selectedWorkItems.map((item, index) => (
            <li key={item.id}>
              <Link
                href={item.link}
                className={styles.row}
                aria-label={`${item.title}, ${item.category}`}
              >
                {index % 2 === 1 ? <Thumb item={item} /> : null}
                <span className={styles.mark}>
                  <SelectedWorkIconMark name={item.icon} />
                </span>
                <span className={styles.title}>{item.title}</span>
                {index % 2 === 0 ? <Thumb item={item} /> : null}
                <span className={styles.count}>({item.count})</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
