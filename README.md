# ShopBoard (React)

A small online shop built with React, TypeScript and Vite. Users can browse products, search,
filter and sort them, add them to a cart, change quantities and see the total. It is the React
version of the vanilla TypeScript ShopBoard: the types, API, logic and cart-state files are
reused unchanged, and React components replace the old DOM code.

## Features

- Products loaded from the ShopBoard API and checked before use
- Search by name, filter by category and sort by price
- One page: a hero, then the products with the filters in a sidebar
- Cart drawer that slides in from the right: open it with the cart icon; it also opens when a
  product is added
- Cart: add items, change quantity, remove items, clear the cart, see the total, and the item
  count on the cart icon in the header
- A quantity of zero removes the product, and out-of-stock products can't be added
- The cart is saved in localStorage, so it survives a page refresh
- A message for each state: loading (with placeholder cards), error with a "Try again" button,
  empty store, and no search results; a failed load tries again when the connection returns
- A warning when the cart can't be saved on this device
- Sign-up form over the page, checked by the browser (required fields, email, 8+ characters)
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
├── App.tsx                      # Puts the page together; holds only the shared state
├── style.css                    # All styles
├── components/                  # One React component per file
│   ├── Header.tsx               # Logo, nav, cart button; owns sign-up
│   ├── RegisterForm.tsx
│   ├── Hero.tsx
│   ├── ProductsSection.tsx      # Loads the products; owns the states and the filters
│   ├── ProductControls.tsx
│   ├── StatusMessage.tsx
│   ├── ProductList.tsx
│   ├── ProductCard.tsx
│   ├── CartDrawer.tsx           # The cart drawer; handles every cart change
│   ├── CartRow.tsx
│   └── Footer.tsx
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

Every component, as React renders it. Props are in `( )`; `state:` is what the component owns.

```
App                                              state: products, cart, showCart
├── Header (itemCount, onOpenCart)               state: showRegister, welcomeName
│   └── RegisterForm (onRegister, onClose)       only while open · state: name, email, password, agreed
├── Hero
├── ProductsSection (products, onLoaded, onCartChange, onAdd)
│   │                                            state: status, errorMessage, attempt, filters
│   ├── ProductControls (filters, categories, disabled, onChange)
│   ├── StatusMessage (message, onRetry?)        one of: loading, error, empty store, no match
│   └── ProductList (products, onAdd)            when there are products to show
│       └── ProductCard (product, onAdd)         one per product, key = product.id
├── Footer
└── CartDrawer (cart, products, onCartChange, onClose)   only while open
    └── CartRow (item, product, onAction)        one per cart line, key = item.productId
```

`StatusMessage` and `ProductList` don't show at the same time: `ProductsSection` shows a
message, or the list. While loading, it also shows six placeholder cards (plain `<div>`s, keys
`skeleton-1` to `skeleton-6`). The welcome message after sign-up is plain markup in `Header`.

### Who owns each piece of state

`App` holds only what more than one part needs. Each part owns the rest itself.

| State                                 | Owner             | What it holds                                   | Changed by                                       |
| ------------------------------------- | ----------------- | ----------------------------------------------- | ------------------------------------------------ |
| `products`                            | `App`             | Every product from the API                      | `ProductsSection` through `onLoaded`             |
| `cart`                                | `App`             | The cart lines, as returned by `cart.state.ts`  | "Add to cart"; the drawer through `onCartChange` |
| `showCart`                            | `App`             | True while the cart drawer is open              | the cart icon, "Add to cart", ×, a click outside |
| `status`                              | `ProductsSection` | `"loading"`, `"error"` or `"loaded"`            | the load; "Try again"; the connection returning  |
| `errorMessage`                        | `ProductsSection` | The message shown when the load fails           | the load                                         |
| `attempt`                             | `ProductsSection` | A counter; changing it loads the products again | "Try again", or the connection coming back       |
| `filters`                             | `ProductsSection` | The search text, category and sort              | `ProductControls` through `onChange`             |
| `showRegister`                        | `Header`          | True while the sign-up form is open             | "Sign up", ×, a click outside, submitting        |
| `welcomeName`                         | `Header`          | The name of the user who just signed up         | submitting the form                              |
| `name`, `email`, `password`, `agreed` | `RegisterForm`    | The sign-up fields                              | typing in the form                               |

Computed on every render, not stored: the products that match the filters, the category list,
the item count, the total, and whether the last cart change failed to save (read from
`cart.state.ts`).

### Checking it in React DevTools

Open the **Components** tab. It shows the same tree, plus `StrictMode` above `App`. Select a
component to see its props, and its state under **hooks**: `App` has 3 `State` hooks,
`Header` 2, `RegisterForm` 4, and `ProductsSection` 4 `State` hooks and 2 `Effect`s (load the
products, reload when back online).

## Code quality

- TypeScript runs in strict mode. The code uses no `any`, no `as` and no `!`.
- A husky pre-commit hook runs lint-staged: oxlint and Prettier on the staged files. A lint
  warning blocks the commit.

The rules for working on this project are in [CLAUDE.md](CLAUDE.md). Two Claude Code skills
from Vercel (React best practices and composition patterns) are in `.claude/skills/`.
