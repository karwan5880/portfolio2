import { NextResponse } from 'next/server'

import { finaleStream } from '@/data/finale-stream-data'

// This function can live here, it's a great server-side utility
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get('theme') || 'main_theme' // Default to main_theme

    const themeData = finaleStream[theme] || finaleStream.default_theme
    if (!themeData) {
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 })
    }

    // Pre-process the data on the server!
    const singleStream = themeData.filter((item) => item.stream === 'single')

    // // Unpack the multi-column data so components don't have to
    // const multiStream = themeData.filter((item) => item.stream === 'multi').flatMap((block) => block.columns) // <-- We do the flatMap here

    const multiStream = themeData
      .filter((item) => item.stream === 'multi')
      .flatMap((block) => block.columns)
      .map((item) => ({
        // <-- Add this .map() call
        ...item,
        // Randomly make ~20% of the blocks distant
        isDistant: Math.random() < 0.2,
      }))

    const responseData = {
      singleStream: shuffleArray(singleStream),
      multiStream: shuffleArray(multiStream),
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('API Error in finale-data:', error)
    return NextResponse.json({ error: 'Failed to fetch finale data' }, { status: 500 })
  }
}
