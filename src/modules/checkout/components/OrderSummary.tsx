// OrderSummary.tsx: what the user is ordering, next to the checkout form: each line with its
// quantity and price, the number of items, the total, and a link back to the cart to change
// it. It needs the products for the names and prices; the LoadBoundary in CheckoutPage shows
// the loading and error states, so the form stays usable while this part loads or fails.
import { use } from "react";
import { Link } from "react-router";
import { useCart } from "../../cart/cart.context";
import { getItemCount, getTotal } from "../../cart/cart.logic";
import { getProducts } from "../../products/products.cache";
import { findProductById } from "../../products/products.logic";
import { formatPrice } from "../../../shared/ui/format";

export function OrderSummary() {
  // The same cached request as the product list and the cart page: no second download.
  const products = use(getProducts());
  const cart = useCart();
  // The lines we can show: a saved line whose product isn't in the store any more is left out,
  // like on the cart page. The count and the total come from these lines only, so the summary
  // never says "3 items" above two lines. Computed on every render, never stored.
  const lines = cart.flatMap((item) => {
    const product = findProductById(products, item.productId);
    return product === undefined ? [] : [{ item, product }];
  });
  const itemCount = getItemCount(lines.map((line) => line.item));

  return (
    <aside className="order-summary" aria-labelledby="order-summary-title">
      <h2 id="order-summary-title" className="order-summary-title">
        Your order ({itemCount} {itemCount === 1 ? "item" : "items"})
      </h2>
      <ul className="order-summary-list">
        {lines.map(({ item, product }) => (
          <li key={item.productId} className="order-summary-line">
            <span>
              {product.name} × {item.quantity}
            </span>
            <span className="order-summary-price">
              {formatPrice(product.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <p className="order-summary-total">
        <span>Total</span>
        <span>{formatPrice(getTotal(cart, products))}</span>
      </p>
      <Link className="btn btn-secondary" to="/cart">
        Edit cart
      </Link>
    </aside>
  );
}
