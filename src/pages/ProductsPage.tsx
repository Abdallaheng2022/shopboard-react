// ProductsPage.tsx: "/products". Filters in a sidebar, and the products that match.
import { useToast } from "@/components/ui/Toast/useToast";
import { useCart } from "@/modules/cart";
import {
  ProductFilters,
  ProductResults,
  useProductFilters,
  useProducts,
  type Product,
} from "@/modules/products";
import styles from "./Page.module.css";

export function ProductsPage() {
  const { state, products, reload } = useProducts();
  const { filters, updateFilters, categories, visibleProducts } = useProductFilters(products);
  const cart = useCart();
  const { showToast } = useToast();

  function handleAddToCart(product: Product): void {
    if (!cart.add(product.id)) return;
    showToast(`${product.name} added to your cart.`, { link: { to: "/cart", label: "View cart" } });
  }

  return (
    <section className={styles.section} aria-labelledby="products-title">
      <h1 id="products-title" className={styles.title}>
        Products
      </h1>
      <div className={styles.withSidebar}>
        <ProductFilters
          filters={filters}
          categories={categories}
          disabled={products.length === 0}
          onChange={updateFilters}
        />
        <div>
          <ProductResults
            state={state}
            visibleProducts={visibleProducts}
            onRetry={reload}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </section>
  );
}
