import type { APIRoute } from 'astro'
import { EPK_LINK } from 'src/config'

export const GET: APIRoute = async function get({ redirect }) {
  return redirect(EPK_LINK, 301)
}
