// ProductGrid.tsx: the grid of product cards. Also used for the loading placeholders.
import type { ReactNode } from "react";
import type { Product } from "../products.types";
import { ProductCard } from "./ProductCard";
import styles from "./ProductGrid.module.css";

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

interface GridFrameProps {
  busy: boolean;
  children: ReactNode;
}

// The grid layout alone, so the loading placeholders take the same shape as the cards.
export function GridFrame({ busy, children }: GridFrameProps) {
  return (
    <div className={styles.grid} aria-busy={busy}>
      {children}
    </div>
  );
}
