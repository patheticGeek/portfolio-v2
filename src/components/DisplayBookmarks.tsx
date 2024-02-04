import { Bookmarks, Folders } from '@prisma/client'
import { Fragment, useMemo } from 'react'
import { useState } from 'react'

type Props = {
  initialFolder: string
  folders: Record<string, Folders>
  foldersByParent: Record<string, string[]>
  bookmarksByFolder: Record<string, Bookmarks[]>
}

export default function DisplayBookmarks({
  initialFolder,
  folders,
  foldersByParent,
  bookmarksByFolder
}: Props) {
  const [currentFolder, setCurrentFolder] = useState(initialFolder)

  const contents = useMemo(() => {
    const foldersHere =
      foldersByParent[currentFolder]?.map((id) => folders[id]) || []
    const bookmarks = bookmarksByFolder[currentFolder] || []
    return { folders: foldersHere, bookmarks }
  }, [currentFolder])

  const parentFolder = folders[currentFolder].parentId

  const breadcrumbs = useMemo(() => {
    const breadcrumbs = []
    let current: string | null = parentFolder
    while (current) {
      breadcrumbs.push(current)
      current = folders[current].parentId
    }
    return breadcrumbs.reverse()
  }, [parentFolder])

  return (
    <>
      <h3>
        {breadcrumbs.length
          ? breadcrumbs.map((breadcrumb) => (
              <Fragment key={breadcrumb}>
                <button
                  onClick={() => setCurrentFolder(breadcrumb)}
                  className="text-zinc-400 underline decoration-transparent underline-offset-4 transition hover:text-white hover:decoration-slate-300"
                >
                  {folders[breadcrumb].name}
                </button>
                <span>{' > '}</span>
              </Fragment>
            ))
          : undefined}
        <span>{folders[currentFolder].name}</span>
      </h3>

      <ul>
        {contents.folders.map((folder) => (
          <li key={folder.id} className="before:content-['📦']">
            <button
              className="text-zinc-400 underline decoration-transparent underline-offset-4 transition hover:text-white hover:decoration-slate-300"
              onClick={() => {
                setCurrentFolder(folder.id)
              }}
            >
              {folder.name}
            </button>
          </li>
        ))}
      </ul>

      <ul>
        {contents.bookmarks.map((bookmark) => (
          <li key={bookmark.id} className="before:content-['↗️']">
            <a href={bookmark.url}>{bookmark.name}</a>
          </li>
        ))}
      </ul>
    </>
  )
}
