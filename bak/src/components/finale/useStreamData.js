import { useMemo } from 'react'

import { finaleStream } from '@/data/finale-stream-data'

// A simple shuffle function to make the stream different on each load
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function useStreamData(theme, streamType, isEnabled) {
  const data = useMemo(() => {
    // If the hook is disabled (e.g., isScrolling is false), return empty array.
    if (!isEnabled) {
      return []
    }

    // Get the data for the current theme, or default if the theme doesn't exist
    const themeData = finaleStream[theme] || finaleStream.default_theme

    // --- THIS IS THE KEY CHANGE ---
    // Instead of filtering by `type`, we filter by our new `stream` property.
    const filteredData = themeData.filter((item) => item.stream === streamType)

    // Shuffle the results for a dynamic feel
    return shuffleArray(filteredData)
  }, [theme, streamType, isEnabled])

  return data
}
