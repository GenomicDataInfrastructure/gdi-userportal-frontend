// SPDX-FileCopyrightText: 2025 PNED G.I.E.
//
// SPDX-License-Identifier: Apache-2.0
import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules } from "@eslint/compat";
import * as espree from "espree";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments";

const eslintConfig = defineConfig([
  ...fixupConfigRules(nextVitals),
  {
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: espree,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    // eslint-config-next already registers the jsx-a11y plugin, so only the
    // rules from the "strict" preset are applied here to avoid redefining
    // the plugin.
    rules: jsxA11y.flatConfigs.strict.rules,
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    // Component-to-element mapping is scoped to the app source: the
    // documentation site (Docusaurus) uses its own unrelated "Link"
    // component with a different API ("to" vs "href").
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    settings: {
      "jsx-a11y": {
        // Shared components that render a native interactive element and
        // forward its props, so jsx-a11y rules apply to them as if they were
        // the underlying tag. `Button` is deliberately not mapped: the app's
        // Button uses `type` for its visual variant, takes its label via a
        // `text` prop and renders a link when given `href`, so native
        // <button> rules would not describe it accurately. Rendered buttons
        // are covered by the axe-core Playwright suite instead.
        components: {
          Link: "a",
          Input: "input",
        },
      },
    },
  },
  {
    // Every eslint-disable must be targeted, still needed, and justified
    // with a "-- reason" description (see CONTRIBUTING.md).
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    plugins: {
      "@eslint-community/eslint-comments": eslintComments,
    },
    rules: {
      "@eslint-community/eslint-comments/require-description": "error",
      "@eslint-community/eslint-comments/no-unlimited-disable": "error",
      "@eslint-community/eslint-comments/disable-enable-pair": "error",
      "@eslint-community/eslint-comments/no-unused-enable": "error",
    },
  },
  prettier,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  {
    files: ["documentation/**/*.js", "documentation/**/*.jsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["src/app/layout.tsx"],
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-e2e/**",
    "playwright-report/**",
    "test-results/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
