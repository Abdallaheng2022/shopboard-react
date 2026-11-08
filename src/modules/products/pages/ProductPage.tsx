// ProductPage.tsx: the page at "/products/:id": one product, loaded from the API by its id.
import { useParams } from "react-router";
import { LoadBoundary } from "../../../components/ui/LoadBoundary";
import { StatusMessage } from "../../../components/ui/StatusMessage";
import { ProductDetails } from "../components/ProductDetails";
import { resetProduct } from "../products.cache";

// export default, because lazy() in App.tsx needs it (slide 45).
export default function ProductPage() {
  // The ":id" part of the URL is always a string. "abc" or "1.5" is not a product id.
  const { id } = useParams();
  const productId = Number(id);

  return (
    <section className="page-section">
      {Number.isInteger(productId) && productId > 0 ? (
        // resetKeys: going to another product clears an old error on this page.
        <LoadBoundary
          fallback={<StatusMessage message="Loading product…" />}
          onReset={resetProduct}
          resetKeys={[productId]}
        >
          <ProductDetails id={productId} />
        </LoadBoundary>
      ) : (
        <StatusMessage message="This product link is not valid." />
      )}
    </section>
  );
}
