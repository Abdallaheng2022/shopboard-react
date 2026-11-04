// main.tsx: mounts the app. Nothing else goes here.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/global.css";

const root = document.getElementById("root");
if (root === null) throw new Error("Element not found in index.html: #root");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
