import { Bookmarks, Folders } from '@prisma/client'

export type Project = {
  name: string
  description: string
  language: string
  github_url: string
  website: string
  topics: string[]
}

export type Projects = Array<Project>

export type FolderWithChildren = Folders & {
  children: Folders[]
  bookmarks: Bookmarks[]
}
