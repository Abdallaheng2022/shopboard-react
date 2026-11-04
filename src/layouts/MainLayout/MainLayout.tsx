// MainLayout.tsx: the frame around every page: header, the page itself, and footer.
// It never loads data.
import { Outlet } from "react-router";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./MainLayout.module.css";

export function MainLayout() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
