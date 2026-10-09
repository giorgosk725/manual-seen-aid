// Configuración ESLint (flat). Reglas de corrección como error; estilo lo gestiona Prettier.
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist/**", "dist-revision/**", "node_modules/**", "**/*.bak", "_*.mjs"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // tsc ya cubre variables no usadas; aquí como aviso, no bloqueante.
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    // Los specs de Playwright no son React: `use` ahí es el «fixture» de Playwright, no un
    // hook, y la regla de hooks lo confunde con uno.
    files: ["e2e/**/*.ts"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
  prettier,
);
