import { useCallback, useState } from 'react'

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
        setData(undefined)
        setError(true)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  return { data, error, loading, query }
}

export default useQuery
