// CartSummary.tsx: the cart total and the "Clear cart" button.
import { Button } from "@/components/ui/Button/Button";
import { formatPrice } from "@/shared/format";
import styles from "./CartSummary.module.css";

interface CartSummaryProps {
  total: number;
  canClear: boolean;
  onClear: () => void;
}

export function CartSummary({ total, canClear, onClear }: CartSummaryProps) {
  return (
    <div className={styles.summary}>
      <p className={styles.total}>Total: {formatPrice(total)}</p>
      <Button variant="secondary" disabled={!canClear} onClick={onClear}>
        Clear cart
      </Button>
    </div>
  );
}
