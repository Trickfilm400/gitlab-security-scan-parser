import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import stylistic from "@stylistic/eslint-plugin";
export const defaultConfig = tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, {
    ignores: [
        "dist/**/*.ts",
        "dist/**",
        "**/*.mjs",
        "eslint.config.mjs",
        "**/*.js",
    ],
}, {
    files: ["src/**/*.ts"],
    languageOptions: {
        parserOptions: {

            projectService: true,
            tsconfigRootDir: import.meta.dirname,
        },
    },
    plugins: {
        "@stylistic": stylistic,
    },
    rules: {
        "no-var": ["error"],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "prettier/prettier": "error",
        "no-unused-vars": [
            "error",
            {
                vars: "all",
                args: "none",
                ignoreRestSiblings: false,
                argsIgnorePattern: "reject",
            },
        ],
    },
}, {
    files: ["test/**"],
    ...tseslint.configs.disableTypeChecked,
}, eslintPluginPrettierRecommended);
