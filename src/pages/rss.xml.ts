import rss, { pagesGlobToRssItems } from '@astrojs/rss'

export const get = async () => {
  return rss({
    title: `Geek's blog`,
    description: `Every sentence is just a remix of the dictionary, and here are my remixes`,
    site: import.meta.env.SITE,
    items: await pagesGlobToRssItems(import.meta.glob('./blog/*.md*')),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl'
  })
}
