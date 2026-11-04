// CartProvider.tsx: holds the cart, saves it in localStorage, and checks stock with the products.
// Must sit inside ProductsProvider and ToastProvider.
import { useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { useToast } from "@/components/ui/Toast/useToast";
import { useProducts } from "@/features/products";
import { CartContext, type CartContextValue } from "./cart.context";
import { getCartLines, getItemCount, getTotal } from "./cart.logic";
import { cartReducer } from "./cart.reducer";
import { loadCart, saveCart } from "./cart.storage";
import type { Cart } from "./cart.types";

const SAVE_FAILED_MESSAGE =
  "Your cart can't be saved on this device. It will reset when you leave.";

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const { state: productsState, products, findById } = useProducts();
  const productsLoaded = productsState.status === "success";
  const { showToast } = useToast();

  // The cart as last saved (or loaded), so an unchanged cart is never written again.
  const savedCart = useRef<Cart>(cart);
  const warnedAboutSaving = useRef(false);

  // Saves after every change. If saving fails, the user is told once; the cart still works.
  useEffect(() => {
    if (cart === savedCart.current) return;
    savedCart.current = cart;
    if (!saveCart(cart) && !warnedAboutSaving.current) {
      warnedAboutSaving.current = true;
      showToast(SAVE_FAILED_MESSAGE, { kind: "error" });
    }
  }, [cart, showToast]);

  // Once the products are known, drop saved lines for products the store no longer has.
  useEffect(() => {
    if (!productsLoaded) return;
    dispatch({ type: "removeUnknown", knownIds: products.map((product) => product.id) });
  }, [productsLoaded, products]);

  const value = useMemo<CartContextValue>(() => {
    // Only products that exist and are in stock can be added or increased.
    const canAdd = (productId: number): boolean => findById(productId)?.inStock === true;

    return {
      cart,
      lines: getCartLines(cart, findById),
      itemCount: getItemCount(cart),
      total: getTotal(cart, findById),
      add: (productId) => {
        if (!canAdd(productId)) return false;
        dispatch({ type: "add", productId });
        return true;
      },
      increase: (productId) => {
        if (!canAdd(productId)) return false;
        dispatch({ type: "increase", productId });
        return true;
      },
      decrease: (productId) => dispatch({ type: "decrease", productId }),
      remove: (productId) => dispatch({ type: "remove", productId }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [cart, findById]);

  return <CartContext value={value}>{children}</CartContext>;
}
