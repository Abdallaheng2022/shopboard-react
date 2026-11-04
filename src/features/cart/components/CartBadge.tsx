// CartBadge.tsx: the cart icon in the header, with the number of items. Links to the cart page.
import { Link } from "react-router";
import styles from "./CartBadge.module.css";

interface CartBadgeProps {
  itemCount: number;
}

export function CartBadge({ itemCount }: CartBadgeProps) {
  return (
    <Link to="/cart" className={styles.badgeLink} aria-label={`Cart, ${itemCount} items`}>
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
      <span className={styles.count} aria-hidden="true">
        {itemCount}
      </span>
    </Link>
  );
}
