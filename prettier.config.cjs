module.exports = {
  ...require('prettier-config-standard'),
  tailwindConfig: './tailwind.config.cjs',
  pluginSearchDirs: [__dirname],
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
