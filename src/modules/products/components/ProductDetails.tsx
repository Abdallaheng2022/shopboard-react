// ProductDetails.tsx: one product, read from the API by its id: name, category, price and
// "Add to cart". While it loads or fails, the LoadBoundary in ProductPage shows instead.
import { use } from "react";
import { Link } from "react-router";
import { useCartActions } from "../../cart/cart.context";
import { formatPrice } from "../../../shared/ui/format";
import { getProduct } from "../products.cache";

interface ProductDetailsProps {
  id: number;
}

export function ProductDetails({ id }: ProductDetailsProps) {
  const product = use(getProduct(id));
  const { add } = useCartActions();

  // The API has no product with this id (for example /products/99999).
  if (product === null) {
    return (
      <div className="page-message" role="status">
        <p>We couldn't find this product.</p>
        <Link className="btn btn-secondary" to="/">
          Back to all products
        </Link>
      </div>
    );
  }

  return (
    <article className="product-card">
      <h1 className="product-name">{product.name}</h1>
      <p className="product-category">{product.category}</p>
      <p className="product-price">{formatPrice(product.price)}</p>
      <button
        type="button"
        className="btn btn-primary product-action"
        disabled={!product.inStock}
        onClick={() => add(product)}
      >
        {product.inStock ? "Add to cart" : "Out of stock"}
      </button>
    </article>
  );
}
