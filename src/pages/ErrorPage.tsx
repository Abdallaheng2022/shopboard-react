// ErrorPage.tsx: shown in place of a page that crashed while rendering. The header stays.
// The technical error goes to the console; the user sees a plain message.
import { useEffect } from "react";
import { useRouteError } from "react-router";
import { Button } from "@/components/ui/Button/Button";
import styles from "./Page.module.css";

export function ErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className={styles.section} aria-labelledby="error-title">
      <h1 id="error-title" className={styles.title}>
        Something went wrong
      </h1>
      <div className={styles.message} role="alert">
        <p>Please reload the page and try again.</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </div>
    </section>
  );
}
