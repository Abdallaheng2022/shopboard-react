import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Product } from "../products.types";
import { ProductCard } from "./ProductCard";

const tote: Product = { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true };

describe("ProductCard", () => {
  it("shows the name, category and price", () => {
    render(<ProductCard product={tote} onAddToCart={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Canvas Tote" })).toBeInTheDocument();
    expect(screen.getByText("Bags")).toBeInTheDocument();
    expect(screen.getByText("$89")).toBeInTheDocument();
  });

  it("calls onAddToCart with the product when the button is clicked", async () => {
    const onAddToCart = vi.fn();
    render(<ProductCard product={tote} onAddToCart={onAddToCart} />);
    await userEvent.click(screen.getByRole("button", { name: "Add Canvas Tote to cart" }));
    expect(onAddToCart).toHaveBeenCalledWith(tote);
  });

  it("can't be added when it is out of stock", () => {
    render(<ProductCard product={{ ...tote, inStock: false }} onAddToCart={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Out of stock" })).toBeDisabled();
  });
});
