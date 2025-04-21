import ms from 'ms'
import { FormEvent, useCallback, useEffect, useState } from 'react'

const useQuery = () => {
  const [data, setData] = useState<any>(undefined)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const query = useCallback(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      setLoading(true)
      try {
        const result = await fetch(input, init)
        setData(await result.json())
        setError(false)
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { data, error, loading, query }
}

const LoadingDots = ({ count = 3, interval = 500 }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % (count + 1))
    }, interval)
    return () => clearInterval(id)
  }, [count, interval])

  return <span>{new Array(current).fill('.').join('')}</span>
}

const ResourcesQuery = () => {
  const { data, error, loading, query } = useQuery()

  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget as any)

      query('/api/bookmark/query', {
        method: 'POST',
        body: JSON.stringify({ query: formData.get('query') })
      })
    },
    [loading, query]
  )

  return (
    <>
      <form onSubmit={onSubmit} className="my-4">
        <div className="query query-input">
          <input
            id="query"
            name="query"
            placeholder="What are you lookin for today?"
            className="query w-full rounded px-2 py-1 outline-none transition focus:ring-2 focus:ring-slate-200"
            type="search"
            required
            disabled={loading}
            autoFocus
          />
        </div>
      </form>

      {loading ? (
        <p className="query query-loading">
          Geek is thinking very hard
          <LoadingDots />
        </p>
      ) : error ? (
        <p className="query query-error">A server side error occurred</p>
      ) : data ? (
        <>
          <p
            className="query query-response"
            dangerouslySetInnerHTML={{ __html: data.response }}
          />
          <p className="query query-time text-xs">
            Responded in {ms(data.timeTaken)}
          </p>
        </>
      ) : null}
    </>
  )
}

export default ResourcesQuery
