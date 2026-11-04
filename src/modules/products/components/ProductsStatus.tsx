// ProductsStatus.tsx: the message box above the grid for loading, empty and error states.
import { Button } from "@/components/ui/Button/Button";
import styles from "./ProductsStatus.module.css";

interface ProductsStatusProps {
  message: string;
  // Shows a "Try again" button that calls this.
  onRetry?: () => void;
}

export function ProductsStatus({ message, onRetry }: ProductsStatusProps) {
  return (
    <div className={styles.status} role="status">
      <p className={styles.message}>{message}</p>
      {onRetry !== undefined && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
