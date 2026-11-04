// NotFoundPage.tsx: any address that has no page.
import { ButtonLink } from "@/components/ui/Button/ButtonLink";
import styles from "./Page.module.css";

export function NotFoundPage() {
  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <h1 id="not-found-title" className={styles.title}>
        Page not found
      </h1>
      <div className={styles.message}>
        <p>We couldn't find that page.</p>
        <ButtonLink to="/" variant="secondary">
          Go to the home page
        </ButtonLink>
      </div>
    </section>
  );
}
