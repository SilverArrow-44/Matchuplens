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
  ]),
  {
    rules: {
      // We deliberately read client-only values (localStorage theme, browser
      // timezone, IP geo) after mount and setState to avoid SSR hydration
      // mismatches. That's a legitimate "sync with an external system" use of
      // useEffect, so keep this as a warning rather than a hard error.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
