// ProductsContent.tsx: shows one of the three screens of the loaded products: empty store,
// no match, or the product grid. It holds no state: ProductsSection picks the view.
import { StatusMessage } from "../../../components/ui/StatusMessage";
import type { ProductsView } from "../products.state";
import type { Product } from "../products.types";
import { ProductCard } from "./ProductCard";

interface ProductsContentProps {
  view: ProductsView;
  // The products that match the filters.
  products: readonly Product[];
}

export function ProductsContent({ view, products }: ProductsContentProps) {
  switch (view) {
    case "empty-store":
      return (
        <StatusMessage message="No products are available right now. Please check back later." />
      );
    case "no-match":
      return (
        <StatusMessage message="No products match your search. Try another name or category." />
      );
    case "list":
      return (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      );
  }
}
