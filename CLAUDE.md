# ShopBoard (React)

The React version of ShopBoard. It has the same features, rules and API as the vanilla
TypeScript project, rebuilt with components, hooks and routes.

## Stack

- Vite, React 19, TypeScript with `"strict": true`
- React Router (`react-router` v7) for pages, React Context + `useReducer` for shared state
- No data-fetching or state library: custom hooks on top of `shared/api/client.ts`
- Semantic HTML, design tokens as CSS custom properties, one CSS Module per component
- oxlint, Prettier, husky and lint-staged
- Vitest + React Testing Library + jsdom

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
├── features/
│   ├── products/
│   │   ├── components/            # ProductCard, ProductGrid, ProductFilters, ProductResults, ProductsStatus
│   │   ├── ProductsProvider.tsx   # Loads the products once, shares them
│   │   ├── products.context.ts    # The context object and its value type
│   │   ├── useProducts.ts         # Reads ProductsProvider
│   │   ├── useProductFilters.ts   # Search, category, sort state + the matching products
│   │   ├── products.api.ts        # GET /products, type guards, API → Product mapping
│   │   ├── products.logic.ts      # Search, filter, sort, find
│   │   ├── products.types.ts
│   │   └── index.ts               # Public entry
│   ├── cart/
│   │   ├── components/            # CartBadge, CartList, CartLine, CartSummary
│   │   ├── CartProvider.tsx       # useReducer + localStorage sync + stock checks
│   │   ├── cart.context.ts
│   │   ├── useCart.ts
│   │   ├── cart.reducer.ts        # Pure reducer and actions
│   │   ├── cart.storage.ts        # The only file that touches localStorage
│   │   ├── cart.logic.ts          # Count, total, lines
│   │   ├── cart.types.ts
│   │   └── index.ts
│   └── register/
│       ├── components/RegisterDialog.tsx
│       └── index.ts
├── components/ui/                 # Generic pieces with no feature knowledge
│   ├── Button/                    # Button, ButtonLink
│   ├── Dialog/                    # Dialog on the native <dialog>
│   ├── Skeleton/                  # SkeletonCard
│   └── Toast/                     # ToastProvider, useToast, toast.context.ts, toast.types.ts
├── shared/
│   ├── api/client.ts              # The only fetch. API_BASE_URL + createApiClient
│   ├── api/errors.ts              # ApiError, getErrorMessage, isAbortError
│   ├── hooks/useOnlineStatus.ts   # true while online, re-renders on change
│   ├── hooks/useOnReconnect.ts    # runs a callback when the connection returns
│   ├── loadState.ts               # LoadState<T>
│   └── format.ts                  # formatPrice
├── styles/
│   ├── tokens.css                 # Design tokens, light and dark
│   └── global.css                 # Reset and base element styles only
└── test/setup.ts                  # jest-dom matchers, cleanup between tests
```

Imports from another folder use the `@/` alias (`@/features/cart`). Imports inside the same
feature or component folder are relative (`./cart.logic`).

### Which folder a file goes in

| Kind of code                                      | Goes in                                    |
| ------------------------------------------------- | ------------------------------------------ |
| A route                                           | `pages/` + a line in `app/router.tsx`      |
| The frame around every page (header, footer, nav) | `layouts/`                                 |
| UI that belongs to one feature                    | `features/<feature>/components/`           |
| UI with no feature knowledge, reused anywhere     | `components/ui/<Component>/`               |
| Requests to the API                               | `features/<feature>/<feature>.api.ts`      |
| Pure functions (filter, sort, total)              | `features/<feature>/<feature>.logic.ts`    |
| State shared by more than one component           | a Provider + context + hook in the feature |
| App-wide side effects (global toasts)             | `app/`                                     |
| Code used by more than one feature                | `shared/`                                  |

A new feature gets a new folder in `features/` with its own `index.ts`.

## Components

- One main component per file. The file name matches the component: `ProductCard.tsx`.
  Named exports only, no `export default`.
- Props are an `interface <Component>Props` in the same file, above the component.
  Never `React.FC`.
- **Pages** compose: they read hooks and lay out feature components. They hold no
  fetching code and little markup.
- **Layouts** draw the frame and render `<Outlet />`. They never load data.
  `Header` reads `useCart()` for the badge and owns the sign-up dialog's `open` state.
- **Feature components** get data and callbacks as props. Feature hooks are read by
  pages, layouts and providers. The only hook a feature component may read itself is
  `useToast` (like `RegisterDialog`).
- **`components/ui/`** components only get props. They never import from `features/`,
  never call an API and never read a context other than their own.
- A component that grows past about 150 lines, or draws two separate things, is split
  into smaller components.
- Lists use a stable `key` from the data (the product id), never the array index. Even
  the skeleton cards have fixed ids.
- Handlers inside a component are named `handle<Event>`; callback props are `on<Event>`.
- Never touch the DOM directly (`document.querySelector`, `innerHTML`). Use JSX and
  state, and a `ref` only when a browser API needs the element (`dialog.showModal()`).
- Every label/input pair uses `useId()` for its ids, never a hard-coded id.
- Dialogs use `components/ui/Dialog/Dialog.tsx`. The parent owns `open`; Esc, the ×
  button and the backdrop all call `onClose`.

### Features and their public entry

- Each feature exposes only what other code may use through its `index.ts`.
- `pages/`, `layouts/`, `app/` and other features import a feature ONLY through its
  `index.ts`: `import { useProducts } from "@/features/products"`. Never from inner
  files like `@/features/products/products.logic`.
- `cart` depends on `products` (names, prices, stock). `products` never imports `cart`:
  `ProductsPage` passes `onAddToCart` to `ProductResults` as a prop.

| Feature    | Public entry exports                                                                                                                                        | Depends on |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `products` | `ProductsProvider`, `useProducts`, `useProductFilters`, `ProductFilters`, `ProductResults`, types `Product`, `Filters`, `SortOrder`, `ProductsContextValue` | nothing    |
| `cart`     | `CartProvider`, `useCart`, `CartBadge`, `CartList`, `CartSummary`, types `Cart`, `CartItem`, `CartLineData`, `CartContextValue`                             | `products` |
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
- The `errorElement` sits under `MainLayout`, so a crashed page shows `ErrorPage` and
  the header and footer stay.
- Links between pages use `<Link>`, `<NavLink>` or `ButtonLink`, never `<a href>`.
- The cart badge in the header links to `/cart`. "Add to cart" stays on the page and
  shows a toast with a "View cart" link.
- The sign-up dialog opens from the header on every page. It is not a route.

## API

- `API_BASE_URL` in `shared/api/client.ts` is the only place the server URL is written:
  `https://shopboard-api.vercel.app/api`.
- `shared/api/client.ts` is the only file that calls `fetch`. Components and hooks never
  call `fetch` and never build a URL.
- Each feature makes its own client for its subpath in `<feature>.api.ts`:

  ```ts
  const productsApi = createApiClient("/products");

  export async function fetchProducts(signal?: AbortSignal): Promise<readonly Product[]> {
    return parseProducts(await productsApi.get("", { signal })); // GET {API_BASE_URL}/products
  }
  ```

- `ApiClient` has `get(path?, options?)`, `post(path, body, options?)`, `put`, `patch`
  and `delete`. `options` takes `query` and `signal`. Bodies are sent as JSON. Every
  method returns `Promise<unknown>`.
- `<feature>.api.ts` checks the response with a type guard and maps the API's names to
  ours (`title` → `name`, `price_cents` → `price` in dollars). Components only ever see
  our types. The guard and the parser are exported so they can be tested.
- The client throws only `ApiError` with a kind: `offline`, `network`, `timeout`, `http`,
  `invalid-response`. A request cancelled by the caller's `AbortSignal` re-throws the
  original `AbortError`; check it with `isAbortError` and never show it.
- Every request has a 10 s timeout, combined with the caller's signal by `AbortSignal.any`.

### Endpoints in use

Add a row when a feature starts using a new endpoint, and the same line as a comment at
the top of its `<feature>.api.ts`.

| Feature    | Subpath     | Method | Endpoint    | Function          | Response                                                  |
| ---------- | ----------- | ------ | ----------- | ----------------- | --------------------------------------------------------- |
| `products` | `/products` | GET    | `/products` | `fetchProducts()` | `{ items: ApiProduct[], total: number }`, prices in cents |
| `cart`     | none        |        |             |                   | The cart lives in localStorage only.                      |
| `register` | none        |        |             |                   | No sign-up endpoint is used yet.                          |

## Loading data

- Data is loaded in a provider or a custom hook, never inside a page or a component body.
- The result is a `LoadState<T>` union, so a component can't read data that isn't there:

  ```ts
  type LoadState<T> =
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: T };
  ```

- The load runs in `useEffect` with an `AbortController` that is aborted in the cleanup.
  This also makes the double effect of `StrictMode` safe.
- A retry bumps a counter in state (`attempt`) that the load effect depends on. A retry
  never adds listeners.
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
- Every context has a hook (`useCart`) that throws a clear error when it is used outside
  its Provider. Components never call `useContext` directly.
- Never store what can be computed. The item count, the total, the cart lines and the
  filtered list are computed from state, with `useMemo` where the value is passed down.

### Cart

- `CartProvider` uses `useReducer(cartReducer, undefined, loadCart)`. Actions are a typed
  union: `add`, `increase`, `decrease`, `remove`, `clear`, `removeUnknown`.
- `cart.reducer.ts` is pure: no localStorage, no toasts, no DOM. Each action returns a new
  cart, or the same cart when nothing changed.
- `CartProvider` checks stock with `useProducts().findById` before `add` and `increase`.
  Both return `false` when the product is unknown or out of stock.
- `cart.storage.ts` is the only file that reads and writes localStorage, always in
  try/catch, with a type guard on what it reads. The provider saves after every change.
  If saving fails, the cart still works for this visit and the user gets one toast.
- The cart shows every product line by line with its details and quantity. The user can
  add more than one of a product, up to what the store has. When the quantity reaches
  zero, the line is removed. A product that is out of stock can't be added.
- When the products load, saved lines for products the store no longer has are removed
  (`removeUnknown`).

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
- Never leave a promise floating. Use `await` inside try/catch, `.then().catch()`, or
  `void` only when the function handles its own errors.

## TypeScript rules

- `"strict": true`. No `any`, no `as`, no `!` non-null assertions. Narrow with a type guard
  (`value is T`), `instanceof` or a check. `main.tsx` checks that `#root` exists and
  throws a clear error if it doesn't.
- Data from outside (API, localStorage, URL params) is `unknown` until a type guard checks
  it.
- Types for a feature live in `<feature>.types.ts`. Use `readonly` for data that is never
  changed in place.

## Styling and accessibility

- Design tokens (colors, radius, spacing, fonts) live in `styles/tokens.css`, with a
  dark-mode block. `--accent` marks actions; `--second` only decorates. Components use `var(--token)`, never hard-coded
  colors.
- Each component with styles has a `<Component>.module.css` next to it. `global.css` holds
  only the reset and base element styles. No `!important` and no id selectors.
- Semantic HTML first: `<header>`, `<main>`, `<nav>`, `<button>` for actions, `<Link>`
  for navigation, a `<label>` for every input.
- Icon-only buttons and links have an `aria-label`. Status messages use `role="status"`.
- Tap targets are at least 44px (`var(--tap)`). Animations stop under
  `prefers-reduced-motion`.

## Tests

- Vitest with jsdom and React Testing Library. Test files sit next to the file they test:
  `cart.reducer.test.ts`, `ProductCard.test.tsx`. Import `describe`, `it`, `expect`, `vi`
  from `vitest`.
- Required tests: every `*.logic.ts`, `cart.reducer.ts`, `cart.storage.ts` (including a
  storage that throws), the guard and parser in `*.api.ts`, and `shared/api/client.ts`
  with a mocked `fetch` (each error kind, and a cancelled request).
- Component tests check what the user sees and does (`getByRole`, `userEvent`), not inner
  state: `ProductCard`, `CartLine`, and the four states in `ProductResults`.
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


## Before you finish

- Run `npm run typecheck`, `npm run lint` and `npm test`. All must pass.
- Delete files that are no longer used, and keep this file, README.md and the endpoints
  table in sync with the code.
- Write all code, comments and commit messages in English.
