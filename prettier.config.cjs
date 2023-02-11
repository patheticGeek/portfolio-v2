module.exports = {
  ...require('prettier-config-standard'),
  tailwindConfig: './tailwind.config.cjs',
  pluginSearchDirs: ['.'],
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro'
      }
    }
  ]
}
