# ShopBoard (React)

A small online shop built with React, TypeScript and Vite. Users can browse products, add
them to a cart, change quantities and see the cart total. It is the React version of the
vanilla TypeScript ShopBoard: the types, API, logic and cart-state files are reused
unchanged, and React components replace the old DOM code.

## Features

- Products loaded from the ShopBoard API and validated before use
- Search by name, filter by category and sort by price
- Pages: home, products, cart, and a "page not found" page
- Cart badge in the header with the number of items, linking to the cart page
- Cart: add items, change quantity, remove items, clear the cart and see the total
- A quantity of zero removes the product, and out-of-stock products can't be added
- The cart is saved in localStorage, so it survives a page refresh
- Loading placeholders, empty states, and error messages with a "Try again" button
- Clear messages for offline, network, timeout, HTTP and invalid-data errors; products
  reload when the connection returns
- Toast notifications, a sign-up dialog with native browser validation
- Mobile-first, responsive layout with light and dark mode

## Tech stack

- [Vite](https://vite.dev/), [React 19](https://react.dev/), TypeScript with `"strict": true`
- [React Router](https://reactrouter.com/) for pages
- React Context for shared state; `useSyncExternalStore` connects the reused cart state to React
- CSS Modules and design tokens (CSS custom properties)
- oxlint, Prettier, husky and lint-staged
- Vitest and React Testing Library

## Component tree

Every component in `src/`, as React renders it. Props are in `( )`; a Button's text is its
`children` and isn't listed. `state:` is what the component owns. `uses` means it reads a context through its hook (`useCart()`,
`useProducts()`, `useToast()`).

```
App
└── AppProviders                          route element, renders the providers around <Outlet />
    └── ToastProvider (children)          state: toasts
        ├── AppNotices                    uses toast · ref: previousOnline
        ├── ProductsProvider (children)   state: state (loading/error/success), attempt
        │   └── CartProvider (children)   reads the cart from cart.state.ts · uses products, toast
        │       └── MainLayout
        │           ├── Header            state: isRegisterOpen · uses cart
        │           │   ├── Button (variant, onClick)                       "Sign up"
        │           │   ├── CartBadge (itemCount)
        │           │   └── RegisterDialog (open, onClose)                  uses toast
        │           │       └── Dialog (open, title, onClose, children)
        │           │           ├── Button (variant, aria-label, onClick)   "×"
        │           │           └── Button (type)                           "Create account"
        │           ├── <Outlet />: the page for the current URL
        │           │   ├── HomePage                      /
        │           │   │   └── ButtonLink (to, size)
        │           │   ├── ProductsPage                  /products · state: filters · uses products, cart, toast
        │           │   │   ├── ProductFilters (filters, categories, disabled, onChange)
        │           │   │   └── ProductResults (state, visibleProducts, onRetry, onAddToCart)
        │           │   │       ├── ProductsStatus (message, onRetry?)        loading, error, empty, no match
        │           │   │       │   └── Button (variant, onClick)             "Try again", only on error
        │           │   │       ├── GridFrame (busy, children)                loading only
        │           │   │       │   └── SkeletonCard × 6
        │           │   │       └── ProductGrid (products, onAddToCart)       loaded only
        │           │   │           └── GridFrame (busy, children)
        │           │   │               └── ProductCard (product, onAddToCart) × each product
        │           │   │                   └── Button (className, aria-label, onClick | disabled)
        │           │   ├── CartPage                      /cart · uses cart, products, toast
        │           │   │   ├── ButtonLink (to, variant)                  empty cart
        │           │   │   ├── Button (variant, onClick)                 "Try again", products failed
        │           │   │   ├── CartList (lines, onIncrease, onDecrease, onRemove)
        │           │   │   │   └── CartLine (line, onIncrease, onDecrease, onRemove) × each line
        │           │   │   │       └── Button (variant, aria-label, onClick) × 3   − + Remove; + also gets disabled
        │           │   │   └── CartSummary (total, canClear, onClear)
        │           │   │       └── Button (variant, disabled, onClick)   "Clear cart"
        │           │   ├── NotFoundPage                  any other URL
        │           │   │   └── ButtonLink (to, variant)
        │           │   └── ErrorPage                     replaces the page if it crashes
        │           │       └── Button (variant, onClick)                 "Reload"
        │           └── Footer
        └── (toast list: <li> items drawn by ToastProvider, not components)
```

The page under `<Outlet />` is one of HomePage, ProductsPage, CartPage, NotFoundPage or
ErrorPage, never two at once. `ProductResults` shows one branch at a time, the same way.

### Who owns each piece of state

| State                         | Owner                                                  | How others get it                                                           |
| ----------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| Products and their load state | `ProductsProvider` (`useState`: `state`, `attempt`)    | `useProducts()`; `reload()` for "Try again"                                 |
| Cart lines                    | `cart.state.ts` (outside React, saved in localStorage) | `CartProvider` reads it with `useSyncExternalStore`; others use `useCart()` |
| Search text, category, sort   | `ProductsPage` (`useState` inside `useProductFilters`) | props to `ProductFilters`                                                   |
| Sign-up dialog open or closed | `Header` (`useState`: `isRegisterOpen`)                | props `open` and `onClose` to `RegisterDialog`                              |
| Toasts on screen              | `ToastProvider` (`useState`: `toasts`)                 | `useToast().showToast()`                                                    |
| Online or offline             | the browser (`navigator.onLine`)                       | `useOnlineStatus()` in `AppNotices`                                         |
| Sign-up form fields           | the browser (an uncontrolled `<form>`)                 | read on submit, then `form.reset()`                                         |

Computed, not stored: the item count, total and cart entries (`CartProvider`), the
categories and the matching products (`useProductFilters`).

### Checking it in React DevTools

Open the **Components** tab. The tree above matches it, with three kinds of extra entries
that come from libraries, not from `src/`:

- React Router: `RouterProvider`, `DataRoutes`, `RenderedRoute`, `Outlet`, `Link`, `NavLink`.
- Context providers: `ToastContext.Provider`, `ProductsContext.Provider`,
  `CartContext.Provider`.
- `StrictMode`, above `App`, from `main.tsx`.

Select a component to see its props on the right. State from a hook shows under **hooks**:
`ProductsPage` lists the `State` from `useProductFilters`, and `CartProvider` lists
`SyncExternalStore` for the cart.

## Getting started

Requirements: Node.js (LTS) and Git.

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
| `npm test`             | Run the tests once                        |
| `npm run test:watch`   | Run the tests on every change             |
| `npm run format`       | Format all files with Prettier            |
| `npm run format:check` | Check formatting without changing files   |

## Project structure

```
src/
├── main.tsx            # Mounts the app
├── app/                # Router, providers, app-wide notices
├── layouts/            # MainLayout: header, page, footer
├── pages/              # One component per route
├── modules/
│   ├── products/       # Loading, filtering and showing products
│   ├── cart/           # Cart state, storage and components
│   └── register/       # Sign-up dialog
├── components/ui/      # Button, Dialog, Skeleton, Toast
├── shared/             # API client and errors, hooks, formatting
└── styles/             # Design tokens and global styles
```

- Each module has an `index.ts`; other code imports a module only through it.
- Every request goes through `getJson` in `src/shared/api/client.ts`.
- The reused vanilla files (`*.types.ts`, `*.api.ts`, `*.logic.ts`, `cart.state.ts`) are never
  edited in this repo.

The full rules (components, layouts, API, state, tests) are in [CLAUDE.md](CLAUDE.md). Two
Claude Code skills from Vercel (React best practices and composition patterns) are in
`.claude/skills/`. The
design tokens are in [src/styles/tokens.css](src/styles/tokens.css).
