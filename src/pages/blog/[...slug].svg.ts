import satori from "satori";
import { html } from "satori-html";
import type { APIRoute } from "astro";
import * as fs from 'fs/promises';
import { getEntryBySlug } from "astro:content";
import { BLOG } from "src/config";

const fonts = [
  fs.readFile(`${process.cwd()}/public/fira-code-latin-500-normal.woff`),
]

export const GET: APIRoute = async ({ params: { slug } }) => {
  const entry = await getEntryBySlug('blog', slug)

  if(!entry) return new Response(undefined, { status: 404 })

  const markup = html(`
<div style="height: 100%; width: 100%; display: flex; flexDirection: column; alignItems: center; justifyContent: center; backgroundColor: rgb(24, 24, 27); color: #fff; fontWeight: 500;">
  ${entry.data.heroImage ? `<img
    src="${new URL(entry.data.heroImage, import.meta.env.SITE)}"
    style="position: absolute; top: 0; right: 0; bottom: 0; left: 0; objectFit: cover; opacity: 0.25" />`
  : ''}

  <div style="position: absolute; padding: 32px 48px; display: flex; flexDirection: column;">
    <div style="fontSize: 68px; lineClamp: 3; display: block;">${entry?.data.title}</div>
  </div>

  <div style="position: absolute; bottom: 38; right: 38; display: flex; alignItems: center;">
    <img src=${new URL('favicon.png', import.meta.env.SITE)} style="borderRadius: 100%; height: 48; width: 48; margin-right: 8;" />
    <div style="fontSize: 32">${BLOG.author.name}</div>
  </div>
</div>
  `);


  const [firaCode500] = await Promise.all(fonts)
  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Fira Code",
        data: firaCode500,
        weight: 500,
        style: "normal",
      },
    ],
  });

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg",
      "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
    },
  });
};