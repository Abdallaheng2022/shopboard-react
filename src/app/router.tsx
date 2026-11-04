// router.tsx: every route. All pages render inside MainLayout, under the app providers.
import { createBrowserRouter } from "react-router";
import { MainLayout } from "@/layouts/MainLayout/MainLayout";
import { CartPage } from "@/pages/CartPage";
import { ErrorPage } from "@/pages/ErrorPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { AppProviders } from "./providers/AppProviders";

export const router = createBrowserRouter([
  {
    element: <AppProviders />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            // A page that crashes shows ErrorPage in its place; the header and footer stay.
            errorElement: <ErrorPage />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "products", element: <ProductsPage /> },
              { path: "cart", element: <CartPage /> },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
