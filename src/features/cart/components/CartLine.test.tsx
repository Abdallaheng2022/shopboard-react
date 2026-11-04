import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { CartLineData } from "../cart.types";
import { CartLine } from "./CartLine";

const line: CartLineData = {
  item: { productId: 1, quantity: 2 },
  product: { id: 1, name: "Canvas Tote", category: "Bags", price: 89, inStock: true },
};

function renderLine(data: CartLineData = line) {
  const handlers = { onIncrease: vi.fn(), onDecrease: vi.fn(), onRemove: vi.fn() };
  render(
    <ul>
      <CartLine line={data} {...handlers} />
    </ul>,
  );
  return handlers;
}

describe("CartLine", () => {
  it("shows the product, the quantity and price × quantity", () => {
    renderLine();
    expect(screen.getByText("Canvas Tote")).toBeInTheDocument();
    expect(screen.getByLabelText("Quantity of Canvas Tote")).toHaveTextContent("2");
    expect(screen.getByText("$89 × 2 = $178")).toBeInTheDocument();
  });

  it("calls the right handler with the product id for −, + and Remove", async () => {
    const handlers = renderLine();
    await userEvent.click(screen.getByRole("button", { name: "Decrease quantity of Canvas Tote" }));
    await userEvent.click(screen.getByRole("button", { name: "Increase quantity of Canvas Tote" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove Canvas Tote from cart" }));
    expect(handlers.onDecrease).toHaveBeenCalledWith(1);
    expect(handlers.onIncrease).toHaveBeenCalledWith(1);
    expect(handlers.onRemove).toHaveBeenCalledWith(1);
  });

  it("can't be increased when the product is out of stock", () => {
    renderLine({ ...line, product: { ...line.product, inStock: false } });
    expect(screen.getByRole("button", { name: "Increase quantity of Canvas Tote" })).toBeDisabled();
  });
});
