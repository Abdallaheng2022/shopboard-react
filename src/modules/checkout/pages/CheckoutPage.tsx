// CheckoutPage.tsx: the page at "/checkout": the form, or a message when the cart is empty (an
// empty cart can't check out, slide 52). After the order it goes to "/checkout/success".
import { Link, useNavigate } from "react-router";
import { useCart, useCartActions } from "../../cart/cart.context";
import type { Checkout } from "../checkout.schema";
import { CheckoutForm } from "../components/CheckoutForm";

// export default, because lazy() in App.tsx needs it (slide 45).
export default function CheckoutPage() {
  const cart = useCart();
  const { clear } = useCartActions();
  const navigate = useNavigate();

  // No order endpoint exists yet, so placing the order empties the cart and opens the
  // thank-you page. `replace`: "Back" from there skips this page, so the form isn't shown again.
  function handlePlaceOrder(order: Checkout): void {
    clear();
    navigate("/checkout/success", { replace: true, state: { name: order.name } });
  }

  return (
    <section className="page-section" aria-labelledby="checkout-title">
      <h1 id="checkout-title" className="page-title">
        Checkout
      </h1>
      {cart.length === 0 ? (
        <div className="page-message" role="status">
          <p>Your cart is empty, so there is nothing to check out.</p>
          <Link className="btn btn-secondary" to="/">
            Browse products
          </Link>
        </div>
      ) : (
        <CheckoutForm onPlaceOrder={handlePlaceOrder} />
      )}
    </section>
  );
}
