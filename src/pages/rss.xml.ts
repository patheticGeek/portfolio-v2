import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { desc, title } from './blog/index.astro'

export const GET: APIRoute = async () => {
  const blog = (await getCollection('blog')).filter((item) => !item.data.draft)

  return rss({
    title: title,
    description: desc,
    site: import.meta.env.SITE,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}`
    })),
    customData: `<language>en-us</language>`,
    stylesheet: '/rss/styles.xsl'
  })
}
