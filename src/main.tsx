// main.tsx: mounts the app inside the providers every page needs. Nothing else goes here.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./App";
import { CartProvider } from "./modules/cart/components/CartProvider";
// shadcn.css first, so style.css (the app design) wins where both style the same thing.
import "./shadcn.css";
import "./style.css";

const root = document.getElementById("root");
if (root === null) throw new Error("Element not found in index.html: #root");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
);
