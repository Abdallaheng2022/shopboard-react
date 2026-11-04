# ShopBoard (React)

The React version of ShopBoard. It reuses the Day 3 vanilla TypeScript files for types, API,
logic and cart state, unchanged, and replaces the old `*.ui.ts` files with React components.

## Stack

- Vite, React 19, TypeScript with `"strict": true`
- React Router (`react-router` v7) for pages, React Context for shared state
- No data-fetching or state library: the Day 3 files plus small providers and hooks
- Semantic HTML, design tokens as CSS custom properties, one CSS Module per component
- oxlint, Prettier, husky and lint-staged
- Vitest + React Testing Library + jsdom

## Day 3 files: copied, never edited

These files are copied from the Day 3 repo byte for byte. The only change ever allowed is
turning an import into `import type`. Fix a bug in the Day 3 repo first, then copy the file
again.

| File                                 | What it does                                           |
| ------------------------------------ | ------------------------------------------------------ |
| `modules/products/products.types.ts` | `Product`, `SortOrder`, `Filters`                      |
| `modules/products/products.api.ts`   | `fetchProducts()`: GET, type guard, API → `Product`    |
| `modules/products/products.logic.ts` | search, category filter, price sort, `findProductById` |
| `modules/cart/cart.types.ts`         | `CartItem`, `Cart`, `CartAction`                       |
| `modules/cart/cart.state.ts`         | the cart itself, saved in localStorage                 |
| `modules/cart/cart.logic.ts`         | `getItemCount`, `getTotal`                             |
| `shared/api/client.ts`               | `getJson(url)`: the only `fetch`                       |
| `shared/api/errors.ts`               | `ApiError`, `getErrorMessage`                          |
| `shared/ui/format.ts`                | `formatPrice`                                          |

They keep their Day 3 paths, so their relative imports (`../../shared/api/client`,
`../products/products.logic`) work without changes. Some of their comments still mention
`index.html` or `*.ui.ts`; they stay as they are, like the rest of the file.

New React code never copies logic out of these files: it imports them.

## Structure

```
src/
├── main.tsx                       # Mounts <App /> in StrictMode. Nothing else.
├── app/
│   ├── App.tsx                    # <RouterProvider router={router} /> only
│   ├── router.tsx                 # Every route
│   ├── AppNotices.tsx             # Offline/online toasts and the global error net
│   └── providers/AppProviders.tsx # Toast → Products → Cart providers, around <Outlet />
├── layouts/
│   └── MainLayout/                # MainLayout (Header + <Outlet /> + Footer), Header, Footer
├── pages/                         # One file per route, plus Page.module.css they share
│   ├── HomePage.tsx               # /          hero
│   ├── ProductsPage.tsx           # /products  filters + results
│   ├── CartPage.tsx               # /cart      cart lines + total
│   ├── NotFoundPage.tsx           # *
│   └── ErrorPage.tsx              # shown when a page crashes
├── modules/
│   ├── products/
│   │   ├── products.types.ts      # Day 3
│   │   ├── products.api.ts        # Day 3
│   │   ├── products.logic.ts      # Day 3
│   │   ├── components/            # ProductCard, ProductGrid, GridFrame, ProductFilters,
│   │   │                          # ProductResults, ProductsStatus
│   │   ├── ProductsProvider.tsx   # Loads the products once, shares them
│   │   ├── products.context.ts    # The context object and its value type
│   │   ├── useProducts.ts         # Reads ProductsProvider
│   │   ├── useProductFilters.ts   # Search, category, sort state + the matching products
│   │   └── index.ts               # Public entry
│   ├── cart/
│   │   ├── cart.types.ts          # Day 3
│   │   ├── cart.state.ts          # Day 3
│   │   ├── cart.logic.ts          # Day 3
│   │   ├── cart.store.ts          # Tells React when cart.state.ts changed
│   │   ├── components/            # CartBadge, CartList, CartLine, CartSummary
│   │   ├── CartProvider.tsx       # Reads the cart, checks stock, shares cart + actions
│   │   ├── cart.context.ts        # The context object, CartEntry, the value type
│   │   ├── useCart.ts
│   │   └── index.ts
│   └── register/
│       ├── components/RegisterDialog.tsx
│       └── index.ts
├── components/ui/                 # Generic pieces with no module knowledge
│   ├── Button/                    # Button, ButtonLink, buttonClassName (shared classes)
│   ├── Dialog/                    # Dialog on the native <dialog>
│   ├── Skeleton/                  # SkeletonCard
│   └── Toast/                     # ToastProvider, useToast, toast.context.ts, toast.types.ts
├── shared/
│   ├── api/client.ts              # Day 3
│   ├── api/errors.ts              # Day 3
│   ├── ui/format.ts               # Day 3
│   ├── hooks/useOnlineStatus.ts   # true while online, re-renders on change
│   ├── hooks/useOnReconnect.ts    # runs a callback when the connection returns
│   └── loadState.ts               # LoadState<T>
├── styles/
│   ├── tokens.css                 # Design tokens, light and dark
│   └── global.css                 # Reset and base element styles only
└── test/setup.ts                  # jest-dom matchers, cleanup between tests
```

Imports from another folder use the `@/` alias (`@/modules/cart`). Imports inside the same
module or component folder are relative (`./cart.logic`). Day 3 files keep their own imports.

### Which folder a file goes in

| Kind of code                                      | Goes in                                   |
| ------------------------------------------------- | ----------------------------------------- |
| A route                                           | `pages/` + a line in `app/router.tsx`     |
| The frame around every page (header, footer, nav) | `layouts/`                                |
| UI that belongs to one module                     | `modules/<module>/components/`            |
| UI with no module knowledge, reused anywhere      | `components/ui/<Component>/`              |
| Pure functions (filter, sort, total)              | the module's Day 3 `<module>.logic.ts`    |
| State shared by more than one component           | a Provider + context + hook in the module |
| App-wide side effects (global toasts)             | `app/`                                    |
| Code used by more than one module                 | `shared/`                                 |

A new module gets a new folder in `modules/` with its own `index.ts`.

## Components

- One component per file. The file name matches the component: `ProductCard.tsx`.
  Named exports only, no `export default`.
- Props are an `interface <Component>Props` in the same file, above the component.
  Never `React.FC`.
- **Pages** compose: they read hooks and lay out module components. They hold no fetching
  code and little markup.
- **Layouts** draw the frame and render `<Outlet />`. They never load data. `Header` reads
  `useCart()` for the badge and owns the sign-up dialog's `open` state.
- **Module components** get data and callbacks as props. Module hooks are read by pages,
  layouts and providers. The only hook a module component may read itself is `useToast`
  (like `RegisterDialog`).
- **`components/ui/`** components only get props. They never import from `modules/`, never
  call an API and never read a context other than their own.
- A component that grows past about 150 lines, or draws two separate things, is split into
  smaller components.
- Lists use a stable `key` from the data (the product id, the category name), never the
  array index. Even the skeleton cards have fixed ids.
- Handlers inside a component are named `handle<Event>`; callback props are `on<Event>`.
- Never touch the DOM directly (`document.querySelector`, `innerHTML`). Use JSX and state,
  and a `ref` only when a browser API needs the element (`dialog.showModal()`).
- Every label/input pair uses `useId()` for its ids, never a hard-coded id.
- Dialogs use `components/ui/Dialog/Dialog.tsx`. The parent owns `open`; Esc, the × button
  and the backdrop all call `onClose`.

### Modules and their public entry

- Each module exposes only what other code may use through its `index.ts`.
- `pages/`, `layouts/`, `app/` and other modules import a module ONLY through its
  `index.ts`: `import { useProducts } from "@/modules/products"`. Never from inner files
  like `@/modules/products/products.logic`. (The Day 3 file `cart.logic.ts` imports
  `../products/products.logic` directly; it stays that way.)
- `cart` depends on `products` (names, prices, stock). `products` never imports `cart`:
  `ProductsPage` passes `onAddToCart` to `ProductResults` as a prop.

| Module     | Public entry exports                                                                                                                                        | Depends on |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `products` | `ProductsProvider`, `useProducts`, `useProductFilters`, `ProductFilters`, `ProductResults`, types `Product`, `Filters`, `SortOrder`, `ProductsContextValue` | nothing    |
| `cart`     | `CartProvider`, `useCart`, `CartBadge`, `CartList`, `CartSummary`, types `Cart`, `CartItem`, `CartEntry`, `CartContextValue`                                | `products` |
| `register` | `RegisterDialog`                                                                                                                                            | nothing    |

## Routing and layouts

- Every route is in `app/router.tsx`, made with `createBrowserRouter`:

  ```
  AppProviders (providers around <Outlet />)
  └── MainLayout (Header, <Outlet />, Footer)
      └── pathless route with errorElement: <ErrorPage />
          ├── index        → HomePage
          ├── "products"   → ProductsPage
          ├── "cart"       → CartPage
          └── "*"          → NotFoundPage
  ```

- The providers are a route, not a wrapper around `RouterProvider`, because the toasts
  render `<Link>` and need the router.
- The `errorElement` sits under `MainLayout`, so a crashed page shows `ErrorPage` and the
  header and footer stay.
- Links between pages use `<Link>`, `<NavLink>` or `ButtonLink`, never `<a href>`.
- The cart badge in the header links to `/cart`. "Add to cart" stays on the page and shows a
  toast with a "View cart" link.
- The sign-up dialog opens from the header on every page. It is not a route.

## API

- Every request goes through `getJson(url)` in `shared/api/client.ts` (Day 3). Never call
  `fetch` anywhere else.
- `getJson` throws only `ApiError`, with a kind: `offline`, `network`, `timeout`, `http` or
  `invalid-response`. Every request has a 10 s timeout.
- `products.api.ts` (Day 3) checks the response with a type guard and maps the API's names
  to ours (`title` → `name`, `price_cents` → `price` in dollars). Components only ever see
  our types.

### Endpoints in use

| Module     | Method | URL                                             | Function          | Response                                                  |
| ---------- | ------ | ----------------------------------------------- | ----------------- | --------------------------------------------------------- |
| `products` | GET    | `https://shopboard-api.vercel.app/api/products` | `fetchProducts()` | `{ items: ApiProduct[], total: number }`, prices in cents |
| `cart`     | none   |                                                 |                   | The cart lives in localStorage only.                      |
| `register` | none   |                                                 |                   | No sign-up endpoint is used yet.                          |

## Loading data

- Data is loaded in a provider or a custom hook, never inside a page or a component body.
- The result is a `LoadState<T>` union, so a component can't read data that isn't there:

  ```ts
  type LoadState<T> =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: T };
  ```

- The load runs in `useEffect` with an `ignore` flag set in the cleanup, so a late answer
  from an old request never overwrites the state. This also makes the double effect of
  `StrictMode` safe. (`fetchProducts()` takes no `AbortSignal`, so the request itself
  isn't cancelled.)
- Never call `setState` directly in an effect body. `reload()` sets `"loading"` and bumps a
  counter (`attempt`) that the load effect depends on. A retry never adds listeners.
- A failed load tries again by itself when the browser comes back online
  (`useOnReconnect`). Only the offline → online change counts, so a server error never
  loops.
- The products are loaded once, in `ProductsProvider`, and shared with `useProducts()`.
  Pages never load them again.

## State

- State lives in the lowest component that needs it. Move it up only when a second
  component needs it.
- State used across pages (products, cart, toasts) lives in a Provider, mounted once in
  `app/providers/AppProviders.tsx`. Order: `ToastProvider` → `ProductsProvider` →
  `CartProvider`.
- The context object lives in its own `<name>.context.ts` file, so provider files export
  only components (fast refresh needs this).
- Every context has a hook (`useCart`) that throws a clear error when it is used outside its
  Provider. Components never call `useContext` directly.
- Never store what can be computed. The item count, the total, the cart entries and the
  filtered list are computed from state, with `useMemo` where the value is passed down.

### Cart

- The cart lives in `cart.state.ts` (Day 3), outside React. It is the only code that changes
  the cart, and it saves every change in localStorage inside try/catch.
- Every change goes through `changeCart(() => addItem(id))` in `cart.store.ts`. It runs the
  `cart.state.ts` function, then tells React. Never call a `cart.state.ts` function that
  changes the cart without `changeCart`: the page would not update.
- `CartProvider` reads the cart with `useSyncExternalStore(subscribeToCart, getCart)`.
  `getCart()` returns the same array until the cart changes, so nothing re-renders for
  nothing.
- `CartProvider` checks stock with `useProducts().findById` before `add` and `increase`.
  Both return `false` when the product is unknown or out of stock.
- After a change, if `didLastSaveFail()` is true, the user gets one toast. The cart still
  works for this visit.
- The cart shows every product line by line with its details and quantity. The user can add
  more than one of a product, up to what the store has. When the quantity reaches zero, the
  line is removed. A product that is out of stock can't be added.
- When the products load, saved lines for products the store no longer has are removed
  (`removeUnknownItems`).

## Errors, loading and empty states

- Every screen that loads data has four states: loading (skeleton cards), error with a
  "Try again" button, empty, and loaded. An empty store and a search with no results get
  different messages. The cart page also waits for the products before it draws lines.
- The user never sees a raw error. Show `getErrorMessage(error)`, and send the technical
  details to `console.error`.
- Show an error once: in the page when it has a place there, otherwise as a toast. Never
  both.
- `ErrorPage` (the route `errorElement`) catches render errors. `AppNotices` catches
  everything else that escaped (`error`, `unhandledrejection`) and shows one toast.
- Never leave a promise floating. Use `await` inside try/catch, `.then().catch()`, or `void`
  only when the function handles its own errors.
- The Console shows no React warnings. Check it after every change.

## TypeScript rules

- `"strict": true`. No `any`, no `as` (not even `import { A as B }` to dodge a name clash:
  rename instead), no `!` non-null assertions. Narrow with a type guard (`value is T`),
  `instanceof` or a check. `main.tsx` checks that `#root` exists and throws a clear error if
  it doesn't.
- Data from outside (API, localStorage, URL params) is `unknown` until a type guard checks it.
- Use `readonly` for data that is never changed in place.

## Styling and accessibility

- Design tokens (colors, radius, spacing, fonts) live in `styles/tokens.css`, with a
  dark-mode block. `--accent` marks actions; `--second` only decorates.
- Each component with styles has a `<Component>.module.css` next to it. `global.css` holds
  only the reset and base element styles. No `!important` and no id selectors.
- Semantic HTML first: `<header>`, `<main>`, `<nav>`, `<button>` for actions, `<Link>` for
  navigation, a `<label>` for every input.
- Icon-only buttons and links have an `aria-label`. Status messages use `role="status"`.
- Tap targets are at least 44px (`var(--tap)`). Animations stop under
  `prefers-reduced-motion`.

## Tests

- Vitest with jsdom and React Testing Library. Test files sit next to the file they test:
  `cart.logic.test.ts`, `ProductCard.test.tsx`. Import `describe`, `it`, `expect`, `vi` from
  `vitest`.
- Tests: `products.logic`, `cart.logic`, `cart.store`, `getJson` with a mocked `fetch` (each
  error kind), and the components `ProductCard`, `CartLine` and the four states in
  `ProductResults`.
- Component tests check what the user sees and does (`getByRole`, `userEvent`), not inner
  state.
- Tests never call the real API.

## Commands

- `npm run dev`: start the dev server
- `npm run typecheck`: `tsc -b`
- `npm run lint`: `oxlint --deny-warnings` (a warning fails the run, like an error)
- `npm run format`: `prettier --write .`
- `npm test`: `vitest run` (`npm run test:watch` while working)
- `npm run build`: build for production

The pre-commit hook runs only `npx lint-staged` (oxlint and Prettier on staged files), so a
commit with a lint warning is blocked.

## Skills

`.claude/skills/` holds two skills from
[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT), copied
unchanged:

- `vercel-react-best-practices`: performance rules (re-renders, effects, data fetching).
- `vercel-composition-patterns`: component API rules (composition over boolean props,
  context interfaces, React 19 APIs).

Use them when writing or reviewing components. The Next.js and server rules in
`vercel-react-best-practices` don't apply here: this is a client-only Vite app.

## Before you finish

- Run `npm run typecheck`, `npm run lint` and `npm test`. All must pass.
- Open the app and check the Console: no errors and no React warnings.
- Delete files that are no longer used, and keep this file and README.md in sync with the
  code.
- Write all code, comments and commit messages in English.
