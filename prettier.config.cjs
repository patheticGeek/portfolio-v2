/** @type {import("prettier").Config} */
module.exports = {
  ...require('prettier-config-standard'),
  jsxSingleQuote: false,
  tailwindConfig: './tailwind.config.cjs',
  plugins: [
    require.resolve('prettier-plugin-astro'),
    require.resolve('prettier-plugin-tailwindcss')
  ],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}
