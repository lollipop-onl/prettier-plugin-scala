import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import gitignore from "eslint-config-flat-gitignore";
import tseslint from "typescript-eslint";

export default tseslint.config(
  gitignore(),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.test.ts", "**/*.spec.ts", "**/test/**/*.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
);
