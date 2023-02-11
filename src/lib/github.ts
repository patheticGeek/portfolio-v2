import type { Projects } from 'src/types'
import { Octokit } from '@octokit/rest'
import { GITHUB_TOPIC, GITHUB_USERNAME } from 'src/config'

const octokit = new Octokit({ auth: import.meta.env.GITHUB_PAT })

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

export const getPinnedProjects = async (limit: number) => {
  try {
    const res = await fetch('https://api.github.com/graphql', {
      headers: {
        authorization: `Bearer ${import.meta.env.GITHUB_PAT}`
      },
      method: 'POST',
      body: JSON.stringify({
        query: `query {
        user(login: "${GITHUB_USERNAME}") {
          pinnedItems(first: ${limit}, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name,
                description,
                url,
                primaryLanguage {
                  name
                },
                createdAt,
                repositoryTopics(first: 6) {
                  edges {
                    node {
                      topic {
                        name
                      }
                    }
                  }
                },
                homepageUrl
              }
            }
          }
        }
      }`,
        variables: {}
      })
    })

    const json = await res.json()

    const pinnedItems = json.data.user.pinnedItems.nodes
    const projects = pinnedItems.map(
      ({
        name,
        description,
        url,
        primaryLanguage,
        createdAt,
        repositoryTopics,
        homepageUrl
      }: any) => ({
        name,
        description,
        created_at: createdAt,
        language: primaryLanguage.name,
        github_url: url,
        website: homepageUrl,
        // filter the topic which is used for labeling which repos to show
        topics:
          repositoryTopics.edges
            .map((item: any) => item.node.topic.name)
            .filter((topic: string) => topic !== GITHUB_TOPIC) || []
      })
    )

    return projects as Projects
  } catch (err) {
    console.log('Error getPinnedProjects', err)
    return null
  }
}
