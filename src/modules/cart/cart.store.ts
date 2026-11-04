// cart.store.ts: connects cart.state.ts (Day 3, unchanged) to React.
// cart.state.ts keeps the cart in a module variable that React can't see change. This file runs
// each change, then tells every subscribed component to read the cart again with getCart().
// Used with useSyncExternalStore in CartProvider.
import type { Cart } from "./cart.types";

type Listener = () => void;

const listeners = new Set<Listener>();

// Called by useSyncExternalStore. Returns the function that unsubscribes.
export function subscribeToCart(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Runs one cart.state.ts change, like () => addItem(3), then tells React the cart changed.
// cart.state.ts returns the same cart when nothing changed, so React skips that re-render.
export function changeCart(change: () => Cart): void {
  change();
  listeners.forEach((listener) => listener());
}
