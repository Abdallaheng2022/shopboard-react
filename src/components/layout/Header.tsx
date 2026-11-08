// Header.tsx: the logo, the "Shop" link, the cart link with its count, and sign-up.
// It owns the sign-up form: whether it is open, and the welcome message after it.
// The item count comes from the shared cart.
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { RegisterForm } from "../../modules/auth/components/RegisterForm";
import { useCart } from "../../modules/cart/cart.context";
import { getItemCount } from "../../modules/cart/cart.logic";

export function Header() {
  const cart = useCart();
  // Computed from the cart on every render, never stored.
  const itemCount = getItemCount(cart);
  const [showRegister, setShowRegister] = useState(false);
  // The name of the user who just signed up, for the welcome message. Empty until then.
  const [welcomeName, setWelcomeName] = useState("");

  function handleRegister(name: string): void {
    setWelcomeName(name);
    setShowRegister(false);
  }

  return (
    <>
      <header className="site-header">
        <Link className="logo" to="/">
          ShopBoard
        </Link>
        <nav aria-label="Main">
          <ul className="nav-list">
            <li>
              <NavLink className="nav-link" to="/" end>
                Shop
              </NavLink>
            </li>
            <li>
              <button type="button" className="btn btn-ghost" onClick={() => setShowRegister(true)}>
                Sign up
              </button>
            </li>
          </ul>
        </nav>
        <Link className="cart-badge" to="/cart" aria-label={`Open cart, ${itemCount} items`}>
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L22 7H6" />
          </svg>
          <span className="cart-badge-count" aria-hidden="true">
            {itemCount}
          </span>
        </Link>
      </header>
      {showRegister && (
        <RegisterForm onRegister={handleRegister} onClose={() => setShowRegister(false)} />
      )}
      {welcomeName !== "" && (
        <ul className="toast-region" role="status">
          <li className="toast toast-success">Account created. Welcome, {welcomeName}!</li>
        </ul>
      )}
    </>
  );
}
