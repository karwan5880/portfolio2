'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// 1. Create the context
const FinaleDataContext = createContext(null)

// 2. Create the Provider component
export function FinaleDataProvider({ theme, children }) {
  const [data, setData] = useState({ singleStream: [], multiStream: [] }) // Start with empty data
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // Fetch from our new, theme-aware API endpoint
        const response = await fetch(`/api/finale-data?theme=${theme}`)
        if (!response.ok) throw new Error('Failed to fetch finale data')
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error(error)
        setData({ singleStream: [], multiStream: [] }) // Provide empty data on error
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [theme])

  // Render a loading state or the children with the data
  if (isLoading) {
    return null // Or a loading spinner
  }

  const value = { data, isLoading }

  return <FinaleDataContext.Provider value={value}>{children}</FinaleDataContext.Provider>
}

// 3. Create a custom hook for easy access
export const useFinaleData = () => {
  const context = useContext(FinaleDataContext)
  if (context === null) {
    throw new Error('useFinaleData must be used within a FinaleDataProvider')
  }
  return context
}
