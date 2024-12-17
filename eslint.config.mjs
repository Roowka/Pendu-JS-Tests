import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      "coverage/**",
      "playwright-report/**",
      "node_modules/**",
      "dist/**",
    ],
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.browser, ...globals.jest },
    },
  },
  pluginJs.configs.recommended,
];
