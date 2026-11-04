// loadState.ts: where a request stands. A union, so a component can't read data that isn't there.
export type LoadState<T> =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "success"; readonly data: T };
