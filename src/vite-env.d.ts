// vite-env.d.ts: the types of our variables in .env, so they are not `any`.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
}
