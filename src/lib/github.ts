import type { Projects } from 'src/types'
import { Octokit } from '@octokit/rest'
import { GITHUB_TOPIC, GITHUB_USERNAME } from 'src/config'

const octokit = new Octokit()

export const getProjects = async (limit = 20) => {
  // get the projects which has this topic and are of the user specified ordered by recently updated
  const { data } = await octokit.rest.search.repos({
    q: `${GITHUB_TOPIC} in:topics user:${GITHUB_USERNAME}`,
    sort: 'updated',
    order: 'desc',
    per_page: limit
  })

  const projects = data.items
    .map(
      ({
        name,
        description,
        homepage,
        language,
        html_url,
        topics,
        created_at
      }) => ({
        name,
        description,
        created_at,
        language,
        github_url: html_url,
        website: homepage,
        // filter the topic which is used for labeling which repos to show
        topics: topics?.filter((topic) => topic !== GITHUB_TOPIC) || []
      })
    )
    .sort((a, b) => (b.created_at < a.created_at ? -1 : 1))

  return projects as Projects
}
