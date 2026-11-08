// HomePage.tsx: the page at "/": the hero, then the products with their filters.
// The products part has its own LoadBoundary, so the hero shows while they load or fail.
import { LoadBoundary } from "../../../components/ui/LoadBoundary";
import { Hero } from "../components/Hero";
import { ProductsSection } from "../components/ProductsSection";
import { ProductsSkeleton } from "../components/ProductsSkeleton";
import { resetProducts } from "../products.cache";

// export default, because lazy() in App.tsx needs it (slide 45).
export default function HomePage() {
  return (
    <>
      <Hero />
      <LoadBoundary fallback={<ProductsSkeleton />} onReset={resetProducts}>
        <ProductsSection />
      </LoadBoundary>
    </>
  );
}
