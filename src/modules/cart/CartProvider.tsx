// CartProvider.tsx: shares the cart with every page and checks stock with the products.
// The cart itself lives in cart.state.ts (Day 3): it changes the cart and saves it in localStorage.
// Must sit inside ProductsProvider and ToastProvider.
import { useEffect, useMemo, useRef, useSyncExternalStore, type ReactNode } from "react";
import { useToast } from "@/components/ui/Toast/useToast";
import { useProducts } from "@/modules/products";
import { CartContext, type CartContextValue, type CartEntry } from "./cart.context";
import { getItemCount, getTotal } from "./cart.logic";
import {
  addItem,
  clearCart,
  decreaseItem,
  didLastSaveFail,
  getCart,
  increaseItem,
  removeItem,
  removeUnknownItems,
} from "./cart.state";
import { changeCart, subscribeToCart } from "./cart.store";
import type { Cart } from "./cart.types";

const SAVE_FAILED_MESSAGE =
  "Your cart can't be saved on this device. It will reset when you leave.";

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  // Re-renders whenever changeCart runs. getCart returns the same array until the cart changes.
  const cart = useSyncExternalStore(subscribeToCart, getCart);
  const { state: productsState, products, findById } = useProducts();
  const { showToast } = useToast();
  const warnedAboutSaving = useRef(false);
  const productsLoaded = productsState.status === "success";

  // Once the products are known, drop saved lines for products the store no longer has.
  // cart.state.ts lives outside React, so keeping it in sync with the products is an effect.
  useEffect(() => {
    if (!productsLoaded) return;
    const knownIds = products.map((product) => product.id);
    changeCart(() => removeUnknownItems(knownIds));
  }, [productsLoaded, products]);

  const value = useMemo<CartContextValue>(() => {
    // Runs one change, then warns once if cart.state.ts couldn't save it on this device.
    const change = (run: () => Cart): void => {
      changeCart(run);
      if (didLastSaveFail() && !warnedAboutSaving.current) {
        warnedAboutSaving.current = true;
        showToast(SAVE_FAILED_MESSAGE, { kind: "error" });
      }
    };
    // Only products that exist and are in stock can be added or increased.
    const canAdd = (productId: number): boolean => findById(productId)?.inStock === true;

    const lines = cart.flatMap((item): CartEntry[] => {
      const product = findById(item.productId);
      return product === undefined ? [] : [{ item, product }];
    });

    return {
      cart,
      lines,
      itemCount: getItemCount(cart),
      total: getTotal(cart, products),
      add: (productId) => {
        if (!canAdd(productId)) return false;
        change(() => addItem(productId));
        return true;
      },
      increase: (productId) => {
        if (!canAdd(productId)) return false;
        change(() => increaseItem(productId));
        return true;
      },
      decrease: (productId) => change(() => decreaseItem(productId)),
      remove: (productId) => change(() => removeItem(productId)),
      clear: () => change(clearCart),
    };
  }, [cart, products, findById, showToast]);

  return <CartContext value={value}>{children}</CartContext>;
}
