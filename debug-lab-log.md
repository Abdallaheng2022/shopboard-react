ر# Debug lab log
# Debug lab log

The five planted bugs in the shop at `shopboard-api.vercel.app/debug-lab`, found with the
Console and React DevTools.

## Bug 1

- **What I saw:** A warning in the Console: `Each child in a list should have a unique "key"
prop. Check the render method of CategoryChips.` The three category chips (Bags, Shoes,
  Accessories) are rendered without a key.
- **Component:** CategoryChips
- **How I found it:** The Console warning named the component, so I opened
  `CategoryChips.tsx` in Sources.
- **Cause:** Line 9 maps the categories without a `key`:
  `{categories.map((category) => <span className="chip">{category}</span>)}`
  React needs a key to tell the chips apart from one render to the next.
- **Fix:** Use the category name as the key. Each category appears once and never changes,
  so it is unique and stable:
  `{categories.map((category) => <span className="chip" key={category}>{category}</span>)}`
  Not the index, because it changes when the order changes. Not `Math.random()`, because it
  changes on every render, so React would rebuild every chip each time.

## Bug 2

- **What I saw:** In-stock cards show "Only 3 left" or "Only 12 left", but sold-out cards show
  a stray `0` in the same place.
- **Component:** StockNote (inside each ProductCard)
- **How I found it:** I compared a sold-out card with an in-stock card, then opened
  `StockNote.tsx` in Sources and found the `&&`.
- **Cause:** `<p className="stock">{stock && <span>Only {stock} left</span>}</p>`
  `&&` returns its left side when that side is falsy. When `stock` is `0`, the whole
  expression is `0`, and React renders numbers, so `0` appears on the page. (`false`,
  `null` and `undefined` render nothing, but `0` does.)
- **Fix:** Make the condition a real boolean:
  `<p className="stock">{stock > 0 ? <span>Only {stock} left</span> : null}</p>`

## Bug 3

- **What I saw:** I saved the Leather Tote Bag (heart), then sorted by price, low to high.
  The heart stayed on the first card, which is now a different product, instead of moving
  with the Leather Tote Bag.
- **Component:** ProductList (the key) and ProductCard (where the heart is stored)
- **How I found it:** I saved a product, changed the sort and watched the heart. In the
  Components tab, the ProductCards had `key="0"`, `key="1"` and so on, in the same order
  before and after sorting.
- **Cause:** Line 18 of ProductList: `<ProductCard key={index} product={product} onAdd={onAdd} />`
  The heart is state inside ProductCard, and React keeps state by key. After sorting, the
  card with `key="0"` gets a new product but keeps its old state, so the heart stays in that
  position.
- **Fix:** Use the product's id as the key:
  `<ProductCard key={product.id} product={product} onAdd={onAdd} />`
  Now each card, with its heart, moves with its product when the order changes.

## Bug 4

- **What I saw:** I sorted by price, low to high, then switched back to Featured. The list
  stayed in price order instead of going back to the order of the first page load.
- **Component:** ProductList
- **How I found it:** I switched the sort back and forth and compared the order. Then I
  opened `ProductList.tsx` in Sources and found the sort line.
- **Cause:** `const shown = sort === "price-asc" ? products.sort((a, b) => a.price - b.price) : products;`
  `.sort()` changes the array it is called on. It sorted the `products` prop itself, so the
  original order was lost, and Featured showed the already-sorted array.
- **Fix:** Sort a copy:
  `const shown = sort === "price-asc" ? [...products].sort((a, b) => a.price - b.price) : products;`
  The `products` prop never changes, so Featured shows the original order again.

## Bug 5

- **What I saw:** I added the Canvas Backpack and clicked + twice. The quantity and the total
  on screen didn't change. They only updated after I added another product.
- **Component:** App (the `onChange` it passes to CartPanel) and CartRow
- **How I found it:** I clicked + and watched the quantity, then added another product and
  saw the old clicks appear at once.
- **Cause:** App passes a function that calls `setCart` with the same cart:
  `<CartPanel cart={cart} products={PRODUCTS} onChange={() => setCart(cart)} />`
  And CartRow changes the item in place before calling it: `item.qty = item.qty + 1;`
  React sees the same array, so it doesn't re-render.
- **Fix:** Pass `setCart` itself:
  `<CartPanel cart={cart} products={PRODUCTS} onChange={setCart} />`
  Then send a new copy inside `onChange` instead of changing the item:
  CartRow: `onChange({ ...item, qty: item.qty + 1 });`
  CartPanel: `onChange={(updatedItem) => onChange(cart.map((cartItem) => (cartItem.id === updatedItem.id ? updatedItem : cartItem)))}`
