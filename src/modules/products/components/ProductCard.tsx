// ProductCard.tsx: one product: name, category, price and the "Add to cart" button.
import { Button } from "@/components/ui/Button/Button";
import { formatPrice } from "@/shared/ui/format";
import type { Product } from "../products.types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.category}>{product.category}</p>
      <p className={styles.price}>{formatPrice(product.price)}</p>
      {product.inStock ? (
        <Button
          className={styles.action}
          aria-label={`Add ${product.name} to cart`}
          onClick={() => onAddToCart(product)}
        >
          Add to cart
        </Button>
      ) : (
        <Button className={styles.action} disabled>
          Out of stock
        </Button>
      )}
    </article>
  );
}
