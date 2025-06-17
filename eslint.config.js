import eslint from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import tseslint from "typescript-eslint";

export default tseslint.config(
  gitignore(),
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
