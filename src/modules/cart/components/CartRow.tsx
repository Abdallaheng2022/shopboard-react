// CartRow.tsx: one cart row: name, category, price × quantity, then − quantity + and Remove.
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
    <li className="cart-line">
      <div>
        <p className="cart-line-name">{product.name}</p>
        <p className="cart-line-category">{product.category}</p>
        <p className="cart-line-price">
          {formatPrice(product.price)} × {item.quantity} ={" "}
          {formatPrice(product.price * item.quantity)}
        </p>
      </div>
      <div className="cart-line-actions">
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Decrease quantity of ${product.name}`}
          onClick={() => onAction("decrease", product.id)}
        >
          −
        </button>
        <span className="cart-line-quantity">{item.quantity}</span>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Increase quantity of ${product.name}`}
          disabled={!product.inStock}
          onClick={() => onAction("increase", product.id)}
        >
          +
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onAction("remove", product.id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
