// SkeletonCard.tsx: a grey placeholder the size of a card, shown while data loads.
// Screen readers skip it and hear the status message instead.
import styles from "./Skeleton.module.css";

export function SkeletonCard() {
  return <div className={styles.card} aria-hidden="true" />;
}
