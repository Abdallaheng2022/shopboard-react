// App.tsx: the map of the app: which URL shows which page. Every page is loaded with lazy(),
// so its code downloads only when someone opens it. RootLayout is around every page.
import { lazy } from "react";
import { Route, Routes } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";

const HomePage = lazy(() => import("./modules/products/pages/HomePage"));
const ProductPage = lazy(() => import("./modules/products/pages/ProductPage"));
const CartPage = lazy(() => import("./modules/cart/pages/CartPage"));
const CheckoutPage = lazy(() => import("./modules/checkout/pages/CheckoutPage"));
const OrderSuccessPage = lazy(() => import("./modules/checkout/pages/OrderSuccessPage"));
const NotFoundPage = lazy(() => import("./components/layout/NotFoundPage"));

export function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="checkout/success" element={<OrderSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
