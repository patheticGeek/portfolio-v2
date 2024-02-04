import { APIRoute } from 'astro'
import prisma from 'src/lib/prisma'
import { z } from 'zod'

const BookmarkData = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  folderId: z.string().optional(),
  createdAt: z.number()
})

const FolderData = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().optional(),
  level: z.number()
})

const CreateBookmarkData = z.object({
  folders: z.array(FolderData),
  bookmarks: z.array(BookmarkData)
})

export const POST: APIRoute = async ({ request }) => {
  const key = request.headers.get('x-api-key')
  if (key !== import.meta.env.BOOKMARKS_API_KEY) {
    return new Response(undefined, { status: 401 })
  }

  const body = await request.json()

  const result = CreateBookmarkData.safeParse(body)

  if (!result.success) {
    return new Response(JSON.stringify(result.error))
  }

  try {
    await prisma.folders.createMany({
      data: result.data.folders
    })
    await prisma.bookmarks.createMany({
      data: result.data.bookmarks.map((val) => ({
        ...val,
        createdAt: new Date(val.createdAt)
      }))
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ success: false }))
  }

  return new Response(JSON.stringify({ success: true }))
}
