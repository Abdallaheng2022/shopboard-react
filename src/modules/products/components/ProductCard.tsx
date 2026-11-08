// ProductCard.tsx: one product: name, category, price and the "Add to cart" button.
import type { Product } from "../modules/products/products.types";
import { formatPrice } from "../shared/ui/format";

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <article className="product-card">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">{formatPrice(product.price)}</p>
      {product.inStock ? (
        <button
          type="button"
          className="btn btn-primary product-action"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAdd(product)}
        >
          Add to cart
        </button>
      ) : (
        <button type="button" className="btn btn-primary product-action" disabled>
          Out of stock
        </button>
      )}
    </article>
  );
}
