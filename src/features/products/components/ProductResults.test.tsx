import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "../products.types";
import { ProductResults } from "./ProductResults";

const products: readonly Product[] = [
  { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true },
  { id: 3, name: "Desk Lamp", category: "Home", price: 45, inStock: true },
];

describe("ProductResults", () => {
  it("loading: shows the status message and no product cards", () => {
    render(
      <ProductResults
        state={{ status: "loading" }}
        visibleProducts={[]}
        onRetry={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading products…");
    expect(screen.queryAllByRole("article")).toHaveLength(0);
  });

  it("error: shows the message and a Try again button that retries", async () => {
    const onRetry = vi.fn();
    render(
      <ProductResults
        state={{ status: "error", message: "We couldn't reach the server." }}
        visibleProducts={[]}
        onRetry={onRetry}
        onAddToCart={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("We couldn't reach the server.");
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("empty store: says no products are available", () => {
    render(
      <ProductResults
        state={{ status: "success", data: [] }}
        visibleProducts={[]}
        onRetry={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No products are available right now");
  });

  it("no search results: says nothing matches, which is a different message", () => {
    render(
      <ProductResults
        state={{ status: "success", data: products }}
        visibleProducts={[]}
        onRetry={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("No products match your search");
  });

  it("loaded: shows a card for every visible product", () => {
    render(
      <ProductResults
        state={{ status: "success", data: products }}
        visibleProducts={products}
        onRetry={vi.fn()}
        onAddToCart={vi.fn()}
      />,
    );
    expect(screen.getAllByRole("article")).toHaveLength(2);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
