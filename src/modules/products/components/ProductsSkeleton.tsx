// ProductsSkeleton.tsx: what Suspense shows while the products load: a message and grey
// placeholder cards, the same size as the real ones, so the page doesn't jump.
import { StatusMessage } from "../../../components/ui/StatusMessage";

// One id per placeholder card. Fixed ids, never the index.
const SKELETON_IDS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
];

export function ProductsSkeleton() {
  return (
    <section className="page-section" aria-busy="true">
      <StatusMessage message="Loading products…" />
      <div className="product-grid">
        {SKELETON_IDS.map((id) => (
          <div key={id} className="skeleton-card" aria-hidden="true" />
        ))}
      </div>
    </section>
  );
}
