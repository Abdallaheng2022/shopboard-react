// AppProviders.tsx: every app-wide provider, mounted once around all pages.
// Order matters: the cart needs the products and the toasts.
import { Outlet } from "react-router";
import { ToastProvider } from "@/components/ui/Toast/ToastProvider";
import { CartProvider } from "@/features/cart";
import { ProductsProvider } from "@/features/products";
import { AppNotices } from "../AppNotices";

export function AppProviders() {
  return (
    <ToastProvider>
      <AppNotices />
      <ProductsProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </ProductsProvider>
    </ToastProvider>
  );
}
