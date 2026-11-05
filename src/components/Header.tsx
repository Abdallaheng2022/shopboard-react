// Header.tsx: the shop name and how many items are in the cart.
interface HeaderProps {
  itemCount: number;
}

export function Header({ itemCount }: HeaderProps) {
  return (
    <header className="site-header">
      <a className="logo" href="/">
        ShopBoard
      </a>
      <a className="cart-link" href="#cart" aria-label={`Cart, ${itemCount} items`}>
        Cart <span className="cart-count">{itemCount}</span>
      </a>
    </header>
  );
}
