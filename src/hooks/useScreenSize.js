'use client'

import { useEffect, useState } from 'react'

export function useScreenSize() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsLoading(false)
    }

    // Check on mount
    checkScreenSize()

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize)

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return { isMobile, isLoading }
}
