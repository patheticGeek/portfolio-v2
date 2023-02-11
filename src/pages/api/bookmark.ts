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

export const post: APIRoute = async ({ request }) => {
  const key = new URLSearchParams(request.url).get('key')
  if (key !== process.env.BOOKMARKS_API_KEY) {
    return new Response(undefined, { status: 401 })
  }

  const body = await request.json()

  const result = CreateBookmarkData.safeParse(body)

  if (!result.success) {
    return new Response(JSON.stringify(result.error))
  }

  await prisma.folders.createMany({
    data: result.data.folders
  })
  await prisma.bookmarks.createMany({
    data: result.data.bookmarks.map((val) => ({
      ...val,
      createdAt: new Date(val.createdAt)
    }))
  })

  return new Response(JSON.stringify({ success: true }))
}

export const get: APIRoute = async () => {
  const bookmarks = await prisma.bookmarks.findMany({
    include: { folder: true }
  })

  return new Response(JSON.stringify(bookmarks), { status: 200 })
}
