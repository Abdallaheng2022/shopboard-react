// CartLine.tsx: one cart line: name, category, price × quantity, then − quantity + and Remove.
import { Button } from "@/components/ui/Button/Button";
import { formatPrice } from "@/shared/format";
import type { CartLineData } from "../cart.types";
import styles from "./CartLine.module.css";

interface CartLineProps {
  line: CartLineData;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
}

export function CartLine({ line, onIncrease, onDecrease, onRemove }: CartLineProps) {
  const { item, product } = line;

  return (
    <li className={styles.line}>
      <div>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>
          {formatPrice(product.price)} × {item.quantity} ={" "}
          {formatPrice(product.price * item.quantity)}
        </p>
      </div>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          aria-label={`Decrease quantity of ${product.name}`}
          onClick={() => onDecrease(product.id)}
        >
          −
        </Button>
        <span className={styles.quantity} aria-label={`Quantity of ${product.name}`}>
          {item.quantity}
        </span>
        <Button
          variant="secondary"
          aria-label={`Increase quantity of ${product.name}`}
          disabled={!product.inStock}
          onClick={() => onIncrease(product.id)}
        >
          +
        </Button>
        <Button
          variant="secondary"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onRemove(product.id)}
        >
          Remove
        </Button>
      </div>
    </li>
  );
}
