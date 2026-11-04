// App.tsx: the whole app is the router. Providers and the layout are routes in router.tsx.
import { RouterProvider } from "react-router";
import { router } from "./router";

export function App() {
  return <RouterProvider router={router} />;
}
