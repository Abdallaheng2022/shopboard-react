// ProductCard.tsx: one product: name, category, price and the "Add to cart" button.
import type { Product } from "../modules/products/products.types";
import { formatPrice } from "../shared/ui/format";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="card">
      <h3>{product.name}</h3>
      <p className="category">{product.category}</p>
      <p className="price">{formatPrice(product.price)}</p>
      {product.inStock ? (
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAdd(product)}
        >
          Add to cart
        </button>
      ) : (
        <button type="button" disabled>
          Out of stock
        </button>
      )}
    </article>
  );
}
