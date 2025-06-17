import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/lib/**", "**/dist/**", "**/.turbo/**", "coverage/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
