# Debug lab log

The five planted bugs in the shop at `shopboard-api.vercel.app/debug-lab`, found with the
Console and React DevTools.

## Bug 1

- **What I saw:** A warning in the Console: `Each child in a list should have a unique "key"
prop. Check the render method of CategoryChips.` The three category chips (Bags, Shoes,
  Accessories) render without a key.
- **Component:** CategoryChips
- **How I found it:** Console warning. It named the component, so I opened
  `CategoryChips.tsx` in Sources.
- **Cause:** Line 9 maps the categories with no `key`:
  `{categories.map((category) => <span className="chip">{category}</span>)}`
  React needs a key to know which chip is which from one render to the next.
- **Fix:** Use the category name as the key. Each category appears once and never changes,
  so it is unique and stable:
  `{categories.map((category) => <span className="chip" key={category}>{category}</span>)}`
  Not the index: it changes when the order changes. Not `Math.random()`: it changes on every
  render, so React would rebuild every chip each time.

## Bug 2

- **What I saw:** In-stock cards show "Only 3 left" or "Only 5 left", but sold-out cards show
  a stray `0` in the same place.
- **Component:** ProductCard
- **How I found it:** I compared a sold-out card with an in-stock card, then opened the
  card's file in Sources and found the `&&`.
- **Cause:** `<p className="stock">{stock && <span>Only {stock} left</span>}</p>`
  `&&` returns its left side when that side is falsy. When `stock` is `0`, the whole
  expression is `0`, and React renders numbers, so `0` appears on the page. (`false`,
  `null` and `undefined` render nothing, but `0` does.)
- **Fix:** Make the condition a real boolean:
  `<p className="stock">{stock > 0 ? <span>Only {stock} left</span> : null}</p>`

## Bug 3

- **What I saw:** I saved the Leather Tote Bag (heart), then sorted by price low to high.
  The heart stayed on the first card, which is now a different product, instead of moving
  with the Leather Tote Bag.
- **Component:** ProductList (the key) and ProductCard (where the heart is stored)
- **How I found it:** I saved a product, changed the sort and watched the heart. In the
  Components tab, each ProductCard had `key="0"`, `key="1"` and so on, in the same order
  before and after sorting.
- **Cause:** Line 18 of ProductList: `<ProductCard key={index} product={product} onAdd={onAdd} />`
  The heart is state inside ProductCard, and React keeps state by key. After sorting, the
  card with `key="0"` gets a new product but keeps its old state, so the heart stays at
  that position.
- **Fix:** Use the product's id as the key:
  `<ProductCard key={product.name} product={product} onAdd={onAdd} />`
  Now the card, and its heart, move with their product when the order changes.

## Bug 4

- **What I saw:** I sorted by price low to high, then back to Featured. The list stayed in
  price order instead of going back to the order of the first page load.
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
- **Component:** App (the `onChange` it passes to CartPanel)
- **How I found it:** I clicked + and watched the quantity, then added another product and
  saw the old clicks appear at once.
- **Cause:** App passes a function that calls `setCart()` with nothing:
  `<CartPanel cart={cart} products={PRODUCTS} onChange={() => setCart()} />`
- **Fix:** Pass `setCart` itself:
  `<CartPanel cart={cart} products={PRODUCTS} onChange={setCart} />`
