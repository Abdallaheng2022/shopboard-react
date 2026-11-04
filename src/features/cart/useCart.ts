// useCart.ts: the cart and its actions, from any component under CartProvider.
import { useContext } from "react";
import { CartContext, type CartContextValue } from "./cart.context";

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (value === null) throw new Error("useCart must be used inside <CartProvider>");
  return value;
}
