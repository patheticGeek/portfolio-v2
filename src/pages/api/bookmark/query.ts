import {
  ContentListUnion,
  GenerateContentResponse,
  GoogleGenAI,
  Type
} from '@google/genai'
import { Index } from '@upstash/vector'
import { APIRoute } from 'astro'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import { z } from 'zod'

const queryFunctionDeclaration = {
  name: 'query_vector_db',
  description: 'Queries the vector db in which the bookmarks are stored.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'The string that needs to be queried in db'
      },
      noOfDocuments: {
        type: Type.NUMBER,
        description: 'The number of documents to get (optional, default: 10)'
      }
    },
    required: ['query']
  }
}

const aiConfig = {
  tools: [{ functionDeclarations: [queryFunctionDeclaration] }]
}

const getPrompt = (prompt: string) =>
  `
You are Pathetic Geek's assistant which is built to help people find resources from his bookmarks.
Try to give as many options as possible but try to give only the ones that match the query the most. It is not necessary to return all results asked of you.
If there are less than 2 try to modify query and find more 2 times max.
Do not answer any unrelated query's or vulgar ones.

The user wants a website as follows:
${prompt}

What are the best websites for the user to checkout? Give a list of websites from the above list only. Also give the url and a less than 2 line description:
    `.trim()

const SearchBody = z.object({
  query: z.string()
})

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json()

  const result = SearchBody.safeParse(body)

  if (!result.success) {
    return new Response(JSON.stringify(result.error), { status: 403 })
  }

  const start = performance.now()

  try {
    console.log('query is', result.data.query)

    const ai = new GoogleGenAI({ apiKey: import.meta.env.GEMINI_API_KEY })

    const index = new Index({
      url: import.meta.env.UPSTASH_VECTOR_REST_URL,
      token: import.meta.env.UPSTASH_VECTOR_REST_TOKEN
    })

    const contents: ContentListUnion = [
      { role: 'user', parts: [{ text: getPrompt(result.data.query) }] }
    ]

    let haveAnswer = false
    let response: GenerateContentResponse | undefined

    while (!haveAnswer) {
      response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: contents,
        config: aiConfig
      })

      if (response.functionCalls?.length) {
        console.log('function call in response', response.functionCalls)
        const responses = await Promise.all(
          response.functionCalls.map(async (functionCall) => {
            if (
              functionCall.name === 'query_vector_db' &&
              functionCall.args?.query
            ) {
              const output = await index.query({
                data: functionCall.args?.query as string,
                topK: functionCall.args?.noOfDocuments
                  ? parseInt(functionCall.args.noOfDocuments as string, 10)
                  : 10,
                includeVectors: true,
                includeMetadata: true
              })
              return { name: functionCall.name, response: { output } }
            }
          })
        )

        response.functionCalls.forEach((call, idx) => {
          contents.push({ role: 'model', parts: [{ functionCall: call }] })
          contents.push({
            role: 'user',
            parts: [{ functionResponse: responses[idx]! }]
          })
        })
      } else {
        console.log('text in response', response.text)
        haveAnswer = true
      }
    }

    const renderedMarkdown = (
      await remark()
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(response!.text as string)
    ).value

    return new Response(
      JSON.stringify({
        response: renderedMarkdown,
        timeTaken: performance.now() - start
      })
    )
  } catch (err) {
    console.log('err:', err)
    const isRateLimit = (err as Error)?.message?.includes?.(
      '429 Too Many Requests'
    )
    return new Response(
      JSON.stringify({
        response: isRateLimit
          ? 'People before you have finished the limit for today :('
          : 'A server side error occurred, notify me on text and i will ignore your message',
        timeTaken: performance.now() - start
      }),
      { status: isRateLimit ? 429 : 500 }
    )
  }
}
