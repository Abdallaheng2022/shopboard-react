// ProductResults.tsx: the four states of the product list: loading, error, empty and loaded.
// An empty store and a search with no results get different messages.
import { SkeletonCard } from "@/components/ui/Skeleton/SkeletonCard";
import type { LoadState } from "@/shared/loadState";
import type { Product } from "../products.types";
import { GridFrame, ProductGrid } from "./ProductGrid";
import { ProductsStatus } from "./ProductsStatus";

// One id per placeholder card shown while the products load. Fixed ids, so no list uses the index as key.
const SKELETON_IDS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
];

interface ProductResultsProps {
  state: LoadState<readonly Product[]>;
  // The products that match the filters. Only used once the state is "success".
  visibleProducts: readonly Product[];
  onRetry: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductResults({
  state,
  visibleProducts,
  onRetry,
  onAddToCart,
}: ProductResultsProps) {
  switch (state.status) {
    case "loading":
      return (
        <>
          <ProductsStatus message="Loading products…" />
          <GridFrame busy>
            {SKELETON_IDS.map((id) => (
              <SkeletonCard key={id} />
            ))}
          </GridFrame>
        </>
      );
    case "error":
      // The error shows here, with a retry button. No toast, so it isn't shown twice.
      return <ProductsStatus message={state.message} onRetry={onRetry} />;
    case "success":
      if (state.data.length === 0) {
        return (
          <ProductsStatus message="No products are available right now. Please check back later." />
        );
      }
      if (visibleProducts.length === 0) {
        return (
          <ProductsStatus message="No products match your search. Try another name or category." />
        );
      }
      return <ProductGrid products={visibleProducts} onAddToCart={onAddToCart} />;
  }
}
