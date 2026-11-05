// Header.tsx: the logo, the "Shop" link, the "Sign up" button and the cart button.
interface HeaderProps {
  itemCount: number;
  onSignUp: () => void;
  onOpenCart: () => void;
}

export function Header({ itemCount, onSignUp, onOpenCart }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="logo" href="/">
        ShopBoard
      </a>
      <nav aria-label="Main">
        <ul className="nav-list">
          <li>
            <a className="nav-link" href="#products">
              Shop
            </a>
          </li>
          <li>
            <button type="button" className="btn btn-ghost" onClick={onSignUp}>
              Sign up
            </button>
          </li>
        </ul>
      </nav>
      <button
        type="button"
        className="cart-badge"
        aria-label={`Open cart, ${itemCount} items`}
        onClick={onOpenCart}
      >
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
      </button>
    </header>
  );
}
