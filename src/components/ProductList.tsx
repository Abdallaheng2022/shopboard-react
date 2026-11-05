// ProductList.tsx: the grid of product cards.
import type { Product } from "../modules/products/products.types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: readonly Product[];
  onAdd: (product: Product) => void;
}

export function ProductList({ products, onAdd }: ProductListProps) {
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAdd={onAdd} />
      ))}
    </div>
  );
}
