// ProductGrid.tsx: the grid of product cards.
import type { Product } from "../products.types";
import { GridFrame } from "./GridFrame";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: readonly Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <GridFrame busy={false}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
      ))}
    </GridFrame>
  );
}
