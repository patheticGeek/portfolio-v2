import type { APIRoute } from 'astro'

export const get: APIRoute = async function get() {
  return new Response(undefined, { status: 410 })
}
