import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "e2e/screenshots/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["e2e/**/*.ts", "playwright.config.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
