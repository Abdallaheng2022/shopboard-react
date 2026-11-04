// GridFrame.tsx: the grid layout alone, so the loading placeholders take the same shape as the cards.
import type { ReactNode } from "react";
import styles from "./ProductGrid.module.css";

interface GridFrameProps {
  // True while the products load, so screen readers know the grid is still changing.
  busy: boolean;
  children: ReactNode;
}

export function GridFrame({ busy, children }: GridFrameProps) {
  return (
    <div className={styles.grid} aria-busy={busy}>
      {children}
    </div>
  );
}
