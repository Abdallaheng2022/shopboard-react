# ShopBoard (React)

A small online shop built with React, TypeScript and Vite. Users can browse products, add
them to a cart, change quantities and see the cart total. It is the React version of the
vanilla TypeScript ShopBoard, with the same features and rules.

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
- React Context + `useReducer` for shared state, custom hooks for data loading
- CSS Modules and design tokens (CSS custom properties)
- oxlint, Prettier, husky and lint-staged
- Vitest and React Testing Library

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
| `npm run lint`         | Run oxlint                                |
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
├── features/
│   ├── products/       # Loading, filtering and showing products
│   ├── cart/           # Cart state, storage and components
│   └── register/       # Sign-up dialog
├── components/ui/      # Button, Dialog, Skeleton, Toast
├── shared/             # API client and errors, hooks, formatting
└── styles/             # Design tokens and global styles
```

- Each feature has an `index.ts`; other code imports a feature only through it.
- Every request goes through `createApiClient("/<subpath>")` in `src/shared/api/client.ts`,
  so the API's base URL lives in one place.

The full rules (components, layouts, API, state, tests) are in [CLAUDE.md](CLAUDE.md). The
design tokens are in [src/styles/tokens.css](src/styles/tokens.css).
