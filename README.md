# ShopBoard (React)

A small online shop built with React, TypeScript and Vite. Users can browse products, search,
filter and sort them, add them to a cart, change quantities and see the total. It is the React
version of the vanilla TypeScript ShopBoard: the types, API, logic and cart-state files are
reused unchanged, and React components replace the old DOM code.

## Features

- Products loaded from the ShopBoard API and checked before use
- Search by name, filter by category and sort by price
- Cart next to the products: add items, change quantity, remove items, clear the cart, see the
  total and the item count in the header
- A quantity of zero removes the product, and out-of-stock products can't be added
- The cart is saved in localStorage, so it survives a page refresh
- A message for each state: loading, error with a "Try again" button, empty store, and no
  search results
- A warning when the cart can't be saved on this device
- Mobile-first layout, light and dark mode

## Tech stack

- [Vite](https://vite.dev/), [React 19](https://react.dev/), TypeScript with `"strict": true`
- React only with `useState`, `useEffect` and props: no router and no state library
- One CSS file with CSS custom properties
- oxlint, Prettier, husky and lint-staged

## Getting started

Requirements: Node.js 20.19+ or 22.12+, and Git.

```bash
npm install
npm run dev
```

## Scripts

| Command                | Description                               |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start the development server              |
| `npm run build`        | Build the production version into `dist/` |
| `npm run typecheck`    | Check types with the TypeScript compiler  |
| `npm run lint`         | Run oxlint; any warning fails             |
| `npm run format`       | Format all files with Prettier            |
| `npm run format:check` | Check formatting without changing files   |

## Project structure

```
src/
├── main.tsx                     # Mounts <App />
├── App.tsx                      # Owns all the state, loads the products, handles the cart
├── style.css                    # All styles
├── components/                  # One React component per file
│   ├── Header.tsx
│   ├── ProductControls.tsx
│   ├── StatusMessage.tsx
│   ├── ProductList.tsx
│   ├── ProductCard.tsx
│   ├── CartPanel.tsx
│   └── CartRow.tsx
├── modules/                     # Reused from the vanilla version, unchanged
│   ├── products/
│   │   ├── products.types.ts    # Product, SortOrder, Filters
│   │   ├── products.api.ts      # fetchProducts(): GET, type guard, API → Product
│   │   └── products.logic.ts    # Search, category filter, price sort, find by id
│   └── cart/
│       ├── cart.types.ts        # CartItem, Cart, CartAction
│       ├── cart.state.ts        # The cart, saved in localStorage
│       └── cart.logic.ts        # Item count and total
└── shared/                      # Reused from the vanilla version, unchanged
    ├── api/client.ts            # getJson(): the only fetch, with a timeout
    ├── api/errors.ts            # ApiError and the message the user sees
    └── ui/format.ts             # formatPrice
```

The files in `src/modules/` and `src/shared/` are copied from the vanilla version and never
edited here.

## Component tree

Every component, as React renders it. Props are in `( )`.

```
App                                         state: products, status, errorMessage, attempt,
│                                                  filters, cart, saveFailed
├── Header (itemCount)
├── ProductControls (filters, categories, disabled, onChange)
├── StatusMessage (message, onRetry?)        one of: loading, error, empty store, no match
├── ProductList (products, onAdd)           when there are products to show
│   └── ProductCard (product, onAdd)        one per product, key = product.id
└── CartPanel (cart, products, saveFailed, onAction, onClear)
    └── CartRow (item, product, onAction)   one per cart line, key = item.productId
```

`StatusMessage` and `ProductList` don't show at the same time: App shows a message, or the
list.

### Who owns each piece of state

All state is in `App`. Every other component gets what it needs as props and reports clicks
back with a callback prop (`onChange`, `onAdd`, `onAction`, `onClear`, `onRetry`).

| State          | What it holds                                    | Changed by                             |
| -------------- | ------------------------------------------------ | -------------------------------------- |
| `products`     | Every product from the API                       | the load in `useEffect`                |
| `status`       | `"loading"`, `"error"` or `"loaded"`             | the load; "Try again" sets `"loading"` |
| `errorMessage` | The message shown when the load fails            | the load                               |
| `attempt`      | A counter; changing it loads the products again  | "Try again"                            |
| `filters`      | The search text, category and sort               | `ProductControls` through `onChange`   |
| `cart`         | The cart lines, as returned by `cart.state.ts`   | add, +, −, Remove, Clear cart          |
| `saveFailed`   | True when the last cart change couldn't be saved | every cart change                      |

Computed on every render, not stored: the products that match the filters, the category list,
the item count and the total.

### Checking it in React DevTools

Open the **Components** tab. It shows the same tree, plus `StrictMode` above `App`. Select
`App` to see its 7 `State` hooks and its `Effect`; select any other component to see its props.

## Code quality

- TypeScript runs in strict mode. The code uses no `any`, no `as` and no `!`.
- A husky pre-commit hook runs lint-staged: oxlint and Prettier on the staged files. A lint
  warning blocks the commit.

The rules for working on this project are in [CLAUDE.md](CLAUDE.md). Two Claude Code skills
from Vercel (React best practices and composition patterns) are in `.claude/skills/`.
