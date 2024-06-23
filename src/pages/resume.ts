import type { APIRoute } from 'astro'
import { RESUME_LINK } from 'src/config'

export const get: APIRoute = async function get({ redirect }) {
  return redirect(RESUME_LINK, 301)
}
