// CartPage.tsx: the page at "/cart": the cart lines, the total and the way to checkout.
import { LoadBoundary } from "../../../components/ui/LoadBoundary";
import { StatusMessage } from "../../../components/ui/StatusMessage";
import { resetProducts } from "../../products/products.cache";
import { CartContent } from "../components/CartContent";

// export default, because lazy() in App.tsx needs it (slide 45).
export default function CartPage() {
  return (
    <section className="page-section" aria-labelledby="cart-page-title">
      <h1 id="cart-page-title" className="page-title">
        Your cart
      </h1>
      <LoadBoundary fallback={<StatusMessage message="Loading cart…" />} onReset={resetProducts}>
        <CartContent />
      </LoadBoundary>
    </section>
  );
}
