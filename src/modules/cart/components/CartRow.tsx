// CartRow.tsx: one cart row: name, category, price × quantity, then − quantity + and Remove.
import { memo } from "react";
import type { CartAction, CartItem } from "../cart.types";
import type { Product } from "../../products/products.types";
import { formatPrice } from "../../../shared/ui/format";

interface CartRowProps {
  item: CartItem;
  product: Product;
  onAction: (action: CartAction, product: Product) => void;
}

// memo: in a long cart, a click on one line re-renders CartContent; the other lines get the
// same `item`, `product` and `onAction`, so they are skipped.
export const CartRow = memo(function CartRow({ item, product, onAction }: CartRowProps) {
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
          onClick={() => onAction("decrease", product)}
        >
          −
        </button>
        <span className="cart-line-quantity">{item.quantity}</span>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Increase quantity of ${product.name}`}
          disabled={!product.inStock}
          onClick={() => onAction("increase", product)}
        >
          +
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onAction("remove", product)}
        >
          Remove
        </button>
      </div>
    </li>
  );
});
