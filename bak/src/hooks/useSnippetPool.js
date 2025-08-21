import { useCallback, useEffect, useRef, useState } from 'react'

export function useSnippetPool() {
  const poolRef = useRef([])
  const isFetching = useRef(false)
  const [isReady, setIsReady] = useState(false)

  const fetchMoreSnippets = useCallback(async () => {
    if (isFetching.current) return
    isFetching.current = true
    try {
      const response = await fetch('/api/snippets')
      if (!response.ok) throw new Error('API request failed')
      const newSnippets = await response.json()
      poolRef.current = [...poolRef.current, ...newSnippets]

      if (poolRef.current.length > 0) {
        setIsReady(true)
      }
    } catch (error) {
      console.error('Failed to fetch snippets:', error)
    } finally {
      isFetching.current = false
    }
  }, [])

  const getSnippet = useCallback(() => {
    if (poolRef.current.length < 20 && !isFetching.current) {
      fetchMoreSnippets()
    }

    if (poolRef.current.length === 0) {
      return null
    }

    return poolRef.current.pop()
  }, [fetchMoreSnippets])

  useEffect(() => {
    fetchMoreSnippets()
  }, [fetchMoreSnippets])

  return { getSnippet, isReady }
}
