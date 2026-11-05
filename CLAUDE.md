# ShopBoard (React)

The React version of ShopBoard. It reuses the vanilla TypeScript files for types, API, logic and
cart state, unchanged, and replaces the old `*.ui.ts` DOM code with React components.

## Stack

- Vite, React 19, TypeScript with `"strict": true`
- One CSS file: `src/style.css`, with CSS custom properties
- oxlint, Prettier, husky and lint-staged

## Keep it simple

Use only what the course covered: components, props, `useState`, `useEffect`, lists with
`.map()` and `key`, and events. No React Router, no Context, no `useReducer`, no `useMemo` or
`useCallback`, no custom hooks, no state or data-fetching library. If something seems to need
more, ask first.

## Reused files: copied, never edited

These files are copied from the vanilla repo byte for byte. The only change ever allowed is
turning an import into `import type`. To fix one, fix it in the vanilla repo, then copy it
again.

| File                                 | What it does                                             |
| ------------------------------------ | -------------------------------------------------------- |
| `modules/products/products.types.ts` | `Product`, `SortOrder`, `Filters`                        |
| `modules/products/products.api.ts`   | `fetchProducts()`: GET, type guard, API → `Product`      |
| `modules/products/products.logic.ts` | search, filter, sort, `getCategories`, `findProductById` |
| `modules/cart/cart.types.ts`         | `CartItem`, `Cart`, `CartAction`                         |
| `modules/cart/cart.state.ts`         | the cart, saved in localStorage inside try/catch         |
| `modules/cart/cart.logic.ts`         | `getItemCount`, `getTotal`                               |
| `shared/api/client.ts`               | `getJson(url)`: the only `fetch`                         |
| `shared/api/errors.ts`               | `ApiError`, `getErrorMessage`                            |
| `shared/ui/format.ts`                | `formatPrice`                                            |

They keep their vanilla paths, so their relative imports work unchanged. Some of their comments
still mention `index.html` or `*.ui.ts`; they stay as they are. React code imports these
functions; it never copies their logic.

## Structure

- `src/main.tsx`: mounts `<App />` in `StrictMode`. Nothing else.
- `src/App.tsx`: owns all the state, loads the products, and handles every cart change.
- `src/components/`: one component per file. Each takes everything it needs as props.
- `src/style.css`: all styles, with plain class names: design tokens first, then base styles,
  then one block per component.

## Components

- One component per file. The file name matches the component. Named exports only, no
  `export default`.
- Props are an `interface <Component>Props` in the same file, above the component.
- Components below `App` hold no shared state. They show their props and call a callback prop
  (`onAdd`, `onAction`, `onChange`) when the user clicks or types. The one exception is
  `RegisterForm`, which keeps its own field values: nothing else needs them.
- Lists use a `key` from the data: `product.id`, `item.productId`, the category name. Never the
  index, never `Math.random()`.
- Conditions in JSX use real booleans: `cart.length === 0 && …`, never `cart.length && …`
  (a `0` would show on the page).
- Never change a prop or state value in place (`item.quantity++`, `products.sort()`). Make a new
  value. The reused files already return a new cart or a sorted copy.

## State

- All shared state lives in `App` (`useState`): products, load status, error message, retry
  counter, filters, cart, save warning, cart open, sign-up open, welcome name.
- Never store what can be computed: the matching products, the categories, the item count and
  the total are computed on every render.
- The cart starts as `useState(getCart)`. Every change calls a `cart.state.ts` function and
  stores what it returns: `updateCart(addItem(id))`. `updateCart` also sets `saveFailed`
  from `didLastSaveFail()`.
- Before `add` and `increase`, check the product is in stock with `findProductById`.

## Loading data and errors

- The products load in one `useEffect` that depends on `attempt`. "Try again" sets
  `status` to `"loading"` and adds 1 to `attempt`.
- A second `useEffect` listens for the browser's `online` event. If the last load failed, it
  does the same as "Try again". Its cleanup removes the listener.
- The effect uses an `ignore` flag set in its cleanup, so an old answer never overwrites the
  state. In development `StrictMode` runs the effect twice; the first answer is ignored.
- Never call `setState` directly in the effect body. Set state only inside `.then()` and
  `.catch()`, or in event handlers.
- Every request goes through `getJson` (inside `fetchProducts`). Never call `fetch` anywhere
  else.
- The user never sees a raw error: show `getErrorMessage(error)` and send the details to
  `console.error`.
- Every state has its own message: loading, error with "Try again", empty store, and no
  search results.
- After the products load, drop saved cart lines for products the store no longer has
  (`removeUnknownItems`).

## TypeScript

- `"strict": true`. No `any`, no `as` (not even `import { A as B }`: rename instead), no `!`.
  Narrow with a check or a type guard.
- Data from outside (API, localStorage) is `unknown` until a type guard checks it. The reused
  files already do this.

## Design

The look is fixed: design tokens at the top of `style.css`, the Bento style (big radius, tinted
cards, gradient background), the hero, the filters sidebar, the cart drawer that slides in
from the right, light and dark mode. Changing the
code must never change the look. Never rewrite `style.css` unless asked.

## Rules from mistakes made while building this project

Each rule comes from a real mistake. The note under it says what happened.

1. **`vite.config.ts` imports only `vite` and its plugins.**
   It imported `defineConfig` from `vitest/config`, so `npm run dev` crashed with
   `Cannot find package 'vitest'` before anything else ran.

2. **Run every `npm` command from the project root, and check the result with
   `npm ls <package>` before going on.**
   `npm install` ran in the home folder, so Vite was found in `~/node_modules` and other
   packages were missing. A later half-finished install left a broken `package-lock.json`
   (`Cannot read properties of null (reading 'edgesOut')`). If an install fails: delete
   `node_modules` and `package-lock.json`, then install again.

3. **Never call `setState` directly in an effect body.**
   The load effect set `"loading"` at its top. oxlint flagged it
   (`react(set-state-in-effect)`): it starts an extra render. "Try again" sets it now.

4. **Copy reused files; never rewrite them.**
   `cart.state.ts` and `products.api.ts` were first rewritten. The task allows no change except
   `import type`.

5. **Keep the code at the level of the course.**
   The first version used React Router, Context providers, `useSyncExternalStore`, custom
   hooks and a test setup. It worked, but it was too hard to read and explain. It was rebuilt
   with `useState`, `useEffect` and props only.

6. **One component per file, and no name clashes.**
   Two files held two components each, and a type shared its name with a component, which
   needed `as` to import.

7. **Check the README against the running app, not against memory.**
   The component tree once listed four buttons in a cart row; React DevTools showed three.
   Compare with the Components tab before committing.

8. **Never add a package version you haven't checked.**
   Versions in `package.json` were once guessed. Run `npm view <package> version` first.

9. **Simplifying the code never changes the design.**
   While simplifying the code, `style.css` was rewritten from scratch and the hero, gradient,
   card art and sidebar were lost. Only the code was meant to change. Keep the CSS and the
   class names, and check the page against a screenshot.

## Commands

- `npm run dev`: start the dev server
- `npm run typecheck`: `tsc -b`
- `npm run lint`: `oxlint --deny-warnings` (a warning fails the run, like an error)
- `npm run format`: `prettier --write .`
- `npm run build`: build for production

The pre-commit hook runs only `npx lint-staged` (oxlint and Prettier on staged files).

## Skills

`.claude/skills/` holds two skills from
[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) (MIT), copied
unchanged: `vercel-react-best-practices` and `vercel-composition-patterns`. Use them when
writing or reviewing components, within the "Keep it simple" rule above. Their Next.js and
server rules don't apply: this is a client-only Vite app.

## Before you finish

- Run `npm run typecheck`, `npm run lint` and `npm run build`. All must pass.
- Open the app and check the Console: no errors and no React warnings.
- Delete files that are no longer used. Keep this file and README.md in sync with the code.
- Write all code, comments and commit messages in English.
