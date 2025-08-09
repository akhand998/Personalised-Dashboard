import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["server/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...compat.globals("node"),
      },
    },
    rules: {
      // Add any specific rules for server-side JS here if needed
      // For example, if you want to allow console.log in server files:
      // "no-console": "off",
    },
  },
];

export default eslintConfig;
