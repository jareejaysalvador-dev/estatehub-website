import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference-only archived first build, not part of the active app.
    "_archive-first-build/**",
    // Sanity Studio: a separate sub-project with its own eslint.config.mjs,
    // dependencies, and build output - not part of the Next.js app's lint.
    "studio/**",
    // The homepage is a static page served from public/ (see the rewrite in
    // next.config.ts); its scroll-engine scripts are shipped as-is, not app source.
    "public/assets/**",
  ]),
]);

export default eslintConfig;
