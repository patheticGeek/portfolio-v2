import satori from 'satori'
import { html } from 'satori-html'
import type { APIRoute } from 'astro'
import * as fs from 'fs/promises'
import { getEntryBySlug } from 'astro:content'
import { BLOG } from 'src/config'
import { ReactNode } from 'react'
import Sharp from 'sharp'

const url = new URL(
  '../../assets/fira-code-latin-500-normal.woff',
  import.meta.url
)
const fonts = [fs.readFile(url)]

export const GET: APIRoute = async ({ params: { slug } }) => {
  const entry = await getEntryBySlug('blog', slug || '')

  if (!entry) return new Response(undefined, { status: 404 })

  const markup = html(`
    <div 
      style="height: 100%; width: 100%; display: flex; flexDirection: column; alignItems: center; justifyContent: center; backgroundColor: rgb(24, 24, 27); color: #fff; fontWeight: 500;"
    >
      ${
        entry.data.heroImage
          ? `<img
        src="${new URL(entry.data.heroImage, import.meta.env.SITE)}"
        style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; objectFit: cover; opacity: 0.25" />`
          : ''
      }

      <div style="position: absolute; padding: 32px 48px; display: flex; flexDirection: column;">
        <div style="fontSize: 68px; lineClamp: 3; display: block;">${entry?.data.title}</div>
      </div>

      <div style="position: absolute; bottom: 38; right: 38; display: flex; alignItems: center;">
        <img src=${new URL('favicon.png', import.meta.env.SITE)} style="borderRadius: 100%; height: 48; width: 48; margin-right: 8;" />
        <div style="fontSize: 32">${BLOG.author.name}</div>
      </div>
    </div>
  `) as ReactNode

  const [firaCode500] = await Promise.all(fonts)
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Fira Code',
        data: firaCode500,
        weight: 500,
        style: 'normal'
      }
    ]
  })

  const png = new Sharp(Buffer.from(svg)).png()
  const resp = await png.toBuffer()

  return new Response(resp, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, maxage=0, s-maxage=86400'
    }
  })
}
