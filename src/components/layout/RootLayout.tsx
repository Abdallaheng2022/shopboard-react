// RootLayout.tsx: what stays on every page: the header and the footer.
// <Outlet /> is where the current page goes (slide 44).
import { Suspense } from "react";
import { Outlet } from "react-router";
import { StatusMessage } from "../ui/StatusMessage";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function RootLayout() {
  return (
    <>
      <Header />
      <main className="site-main">
        {/* While a lazy page's code downloads, only this part waits: the header stays. */}
        <Suspense fallback={<StatusMessage message="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
