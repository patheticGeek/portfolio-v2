---
title: 'Get VSCode, eslint & prettier working with Astro'
description: 'Auto formatting astro project as easy as 1..2..3..'
pubDate: 'Feb 11 2023'
---

Have you tried getting format on save in vs code working with astro? It can be quite a mess and lead you to jump between github issues.

Here's a simple guide to get that working:

## 0. Install dependencies

Use the package manager of your choice, I'm using `pnpm`

```bash
pnpm i -D eslint eslint-plugin-astro eslint-plugin-jsx-a11y @typescript-eslint/parser prettier prettier-config-standard prettier-plugin-astro
```

## 1. Setting up prettier

1. Specify the absolute dir in which to search for plugins using `pluginSearchDirs`, prettier is dumb af with this.
2. Use `require.resolve` to specify absolutely where the plugin is.
3. Set the override and parser for .astro files.

`prettier.config.cjs`:

```js
/** @type {import("prettier").Config} */
module.exports = {
  // i am just using the standard config, change if you need something else
  ...require('prettier-config-standard'),
  pluginSearchDirs: [__dirname],
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}
```

## 2. Setting up eslint

1. The extension cant find `@typescript-eslint/parser`, so set the parser explicitly.
2. Set the `ecmaVersion` & `sourceType`, for error "The keyword import/export is reserved".
3. Add the override for .astro files.

`.eslintrc.cjs`:

```js
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:astro/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        // override/add rules settings here, such as:
        // "astro/no-set-html-directive": "error"
      }
    }
  ]
}
```

## 3. Setting up Prettier ESLint extension

The issue with this extension is that it doesn't know its own abilities, so lets fix that.

1. Set `eslint.validate` to include astro, to tell eslint to validate astro files.
2. Set `prettier.documentSelectors`, to tell prettier to format astro files.
3. Set the default formatter for `astro` files.

In your VSCode's `setting.json` file add the following:

```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "astro",
    "typescript",
    "typescriptreact"
  ],
  "prettier.documentSelectors": ["**/*.astro"],
  "[astro]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 4. Add the script in package.json

Add the script in `package.json` to lint all files

```json
{
  "script": {
    "lint": "prettier --write  \"**/*.{js,jsx,ts,tsx,md,mdx,astro}\" && eslint --fix \"src/**/*.{js,ts,jsx,tsx,astro}\""
  }
}
```
