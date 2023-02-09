export const setCache = (response: ResponseInit & { readonly headers: Headers; }, maxAgeSeconds: number) => {
  response.headers.set('Cache-Control', `public, max-age=${maxAgeSeconds}`)
}