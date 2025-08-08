/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ["next/core-web-vitals", "next", "plugin:@typescript-eslint/recommended"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "@typescript-eslint/no-require-imports": "off"
    }
  };
  