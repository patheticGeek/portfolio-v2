import ms from 'ms'
import {
  FormEvent,
  Fragment,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import useHydrated from 'src/lib/hooks/useHydrated'
import useQuery from 'src/lib/hooks/useQuery'
import { getRandoms } from './utils'

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

const EXAMPLE_QUERIES = [
  'react interview practice',
  'resume building websites',
  'job portals',
  'interview dsa prep',
  'design systems',
  'icon packs',
  'react design libraries',
  'ui/ux practice',
  'svg tools',
  'color picker tools',
  'css resources'
]

const TryOutExamples = ({ onSelect }: { onSelect: MouseEventHandler }) => {
  const hydrated = useHydrated()
  const randoms = useMemo(() => getRandoms(EXAMPLE_QUERIES.length), [])
  if (!hydrated) return false

  return (
    <p>
      Or, try out one of these{' '}
      {randoms.map((qIdx, idx) => (
        <Fragment key={idx}>
          <a href="#" onClick={onSelect}>
            {EXAMPLE_QUERIES[qIdx]}
          </a>
          {idx < randoms.length - 1 && <span>, </span>}
        </Fragment>
      ))}
    </p>
  )
}

const ResourcesQuery = () => {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
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
    [query]
  )

  const onSelect: MouseEventHandler = useCallback((event) => {
    event.preventDefault()
    if (inputRef.current) {
      inputRef.current.value = (event.currentTarget as HTMLElement).innerText
      formRef.current?.requestSubmit()
    }
  }, [])

  return (
    <>
      <form ref={formRef} onSubmit={onSubmit} className="my-4">
        <div className="query query-input">
          <input
            ref={inputRef}
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
        <p className="query query-error">
          {data
            ? data.response
            : 'Network error occurred, please refresh and try again'}
        </p>
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
      ) : (
        <>
          <TryOutExamples onSelect={onSelect} />
          <p>
            Want to see how this works?{' '}
            <a
              href="https://github.com/patheticGeek/explore-llms"
              target="_blank"
            >
              Checkout this repo
            </a>
          </p>
        </>
      )}
    </>
  )
}

export default ResourcesQuery
