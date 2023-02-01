import type { APIRoute } from 'astro';

export const get: APIRoute = async function get ({redirect}) {
  return redirect('/ShivamNagiResume.pdf', 301)
}
