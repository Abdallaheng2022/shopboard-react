// CartList.tsx: every cart line, one under the other.
import type { CartLineData } from "../cart.types";
import { CartLine } from "./CartLine";
import styles from "./CartList.module.css";

interface CartListProps {
  lines: readonly CartLineData[];
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export function CartList({ lines, onIncrease, onDecrease, onRemove }: CartListProps) {
  return (
    <ul className={styles.list} aria-label="Cart items">
      {lines.map((line) => (
        <CartLine
          key={line.product.id}
          line={line}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
