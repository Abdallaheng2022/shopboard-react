// ProductCard.tsx: one product: name, category, price and the "Add to cart" button.
// "Add to cart" uses the shared cart directly, so the parents don't pass it down.
// The name links to the product's own page.
import { Link } from "react-router";
import { memo } from "react";
import { useCartActions } from "../../cart/cart.context";
import type { Product } from "../products.types";
import { formatPrice } from "../../../shared/ui/format";

interface ProductCardProps {
  product: Product;
}

// memo: with thousands of products, typing in search re-renders ProductsSection; a card whose
// `product` is the same object is skipped. It reads only the cart's actions (which never
// change), so "Add to cart" doesn't re-render every card either.
export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { add } = useCartActions();
  return (
    <article className="product-card">
      <h3 className="product-name">
        <Link to={`/products/${product.id}`}>{product.name}</Link>
      </h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">{formatPrice(product.price)}</p>
      {product.inStock ? (
        <button
          type="button"
          className="btn btn-primary product-action"
          aria-label={`Add ${product.name} to cart`}
          onClick={() => add(product)}
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
});
