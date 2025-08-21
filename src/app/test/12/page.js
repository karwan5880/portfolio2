'use client'

import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    fetch('/animations/demo2.json')
      .then((res) => res.json())
      .then(setAnimationData)
  }, [])

  if (!animationData) return <p>Loading animation...</p>

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96">
        <Lottie animationData={animationData} loop autoplay />
        <h1 className="text-center text-xl font-bold mt-4">Welcome to Lottie + Next.js 🎉</h1>
      </div>
    </main>
  )
}
