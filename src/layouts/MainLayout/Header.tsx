// Header.tsx: logo, navigation, the Sign up button and the cart badge. Shown on every page.
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Button } from "@/components/ui/Button/Button";
import { CartBadge, useCart } from "@/modules/cart";
import { RegisterDialog } from "@/modules/register";
import styles from "./MainLayout.module.css";

function getNavLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}

export function Header() {
  const { itemCount } = useCart();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/">
        ShopBoard
      </Link>
      <nav aria-label="Main">
        <ul className={styles.navList}>
          <li>
            <NavLink className={getNavLinkClass} to="/products">
              Shop
            </NavLink>
          </li>
          <li>
            <Button variant="ghost" onClick={() => setIsRegisterOpen(true)}>
              Sign up
            </Button>
          </li>
        </ul>
      </nav>
      <CartBadge itemCount={itemCount} />
      <RegisterDialog open={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
    </header>
  );
}
