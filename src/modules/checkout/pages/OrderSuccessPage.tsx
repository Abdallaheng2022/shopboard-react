// OrderSuccessPage.tsx: the page at "/checkout/success": the thank-you after an order
// (slide 52: "On success: empty the cart, show a thank-you"). Its own URL means a refresh
// keeps the message, and "Back" doesn't bring back a filled-in form.
import { Link, useLocation } from "react-router";

// The name comes from navigate(…, { state: { name } }) in CheckoutPage. Navigation state can
// be anything (or nothing, when someone opens this URL directly), so it is checked first.
function getOrderName(state: unknown): string | null {
  if (typeof state === "object" && state !== null && "name" in state) {
    return typeof state.name === "string" ? state.name : null;
  }
  return null;
}

// export default, because lazy() in App.tsx needs it (slide 45).
export default function OrderSuccessPage() {
  const name = getOrderName(useLocation().state);

  return (
    <section className="page-section page-message" aria-labelledby="success-title">
      <h1 id="success-title" className="page-title">
        Order placed
      </h1>
      <p>
        {name === null
          ? "Thank you! Your order is placed."
          : `Thank you, ${name}! Your order is placed.`}
      </p>
      <Link className="btn btn-primary" to="/">
        Keep shopping
      </Link>
    </section>
  );
}
