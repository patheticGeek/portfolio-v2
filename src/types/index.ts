export type Project = {
  name: string
  description: string
  language: string
  github_url: string
  website: string
  topics: string[]
}

export type Projects = Array<Project>
