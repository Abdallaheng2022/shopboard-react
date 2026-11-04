// HomePage.tsx: "/". The hero with a link to the shop.
import { ButtonLink } from "@/components/ui/Button/Button";
import styles from "./Page.module.css";

export function HomePage() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <h1 id="hero-title" className={styles.heroTitle}>
        Sell smarter.
      </h1>
      <p className={styles.heroText}>Everything your shop needs, in one board.</p>
      <div>
        <ButtonLink to="/products" size="lg">
          Shop now
        </ButtonLink>
      </div>
    </section>
  );
}
