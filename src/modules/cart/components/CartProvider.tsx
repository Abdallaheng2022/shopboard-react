// CartProvider.tsx: the one owner of the cart.
// React owns the cart: it is state here, and every change makes a new cart from the last one.
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CartActionsContext, CartContext, type CartActions } from "../cart.context";
import { addItem, decreaseItem, increaseItem, removeItem } from "../cart.logic";
import { loadCart, saveCart } from "../cart.storage";
import type { Cart } from "../cart.types";

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // The cart starts as the one saved in localStorage. loadCart runs once, on the first render.
  const [cart, setCart] = useState<Cart>(loadCart);

  // localStorage is outside React, so keeping it in sync is an effect: after every change of
  // the cart, save it. This is why the cart survives a refresh.
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // The actions are made once and never change: they use only setCart (React keeps it the
  // same forever) and the updater form (they never read `cart`, so they can't hold an old one).
  // Same actions → CartActionsContext never changes → its readers don't re-render on a cart
  // change, and a memo child that gets an action (CartRow's onAction) sees the same prop.
  const actions = useMemo<CartActions>(
    () => ({
      add(product) {
        if (!product.inStock) return;
        setCart((current) => addItem(current, product.id));
      },
      increase(product) {
        if (!product.inStock) return;
        setCart((current) => increaseItem(current, product.id));
      },
      decrease: (productId) => setCart((current) => decreaseItem(current, productId)),
      remove: (productId) => setCart((current) => removeItem(current, productId)),
      clear: () => setCart([]),
    }),
    [],
  );

  return (
    <CartActionsContext value={actions}>
      <CartContext value={cart}>{children}</CartContext>
    </CartActionsContext>
  );
}
