// NotFoundPage.tsx: the page for every URL that has no route (path="*").
import { Link } from "react-router";

// export default, because lazy() in App.tsx needs it (slide 45).
export default function NotFoundPage() {
  return (
    <section className="page-section page-message" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="page-title">
        Page not found
      </h1>
      <p>There is no page at this address.</p>
      <Link className="btn btn-primary" to="/">
        Back to the shop
      </Link>
    </section>
  );
}
