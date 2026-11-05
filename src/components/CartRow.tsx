// CartRow.tsx: one cart row: name, price × quantity, then − quantity + and Remove.
import type { CartAction, CartItem } from "../modules/cart/cart.types";
import type { Product } from "../modules/products/products.types";
import { formatPrice } from "../shared/ui/format";

interface CartRowProps {
  item: CartItem;
  product: Product;
  onAction: (action: CartAction, productId: number) => void;
}

export function CartRow({ item, product, onAction }: CartRowProps) {
  return (
    <li className="cart-row">
      <div>
        <p className="cart-row-name">{product.name}</p>
        <p className="cart-row-price">
          {formatPrice(product.price)} × {item.quantity} ={" "}
          {formatPrice(product.price * item.quantity)}
        </p>
      </div>
      <div className="cart-row-actions">
        <button
          type="button"
          className="button-secondary"
          aria-label={`Decrease quantity of ${product.name}`}
          onClick={() => onAction("decrease", product.id)}
        >
          −
        </button>
        <span className="quantity">{item.quantity}</span>
        <button
          type="button"
          className="button-secondary"
          aria-label={`Increase quantity of ${product.name}`}
          disabled={!product.inStock}
          onClick={() => onAction("increase", product.id)}
        >
          +
        </button>
        <button
          type="button"
          className="button-secondary"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onAction("remove", product.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
