'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// A map defining the narrative order. This is our "source of truth".
const narrativeOrder = {
  '/': 1,
  '/dossier': 2,
  '/dev-history': 3,
  '/job-hunt': 4,
  '/location': 5,
  '/finale': 6,
  '/applications': 7, // Optional/side path
  '/secret-room': 8,
}
// This hook checks if the user has "unlocked" this part of the story.
export function useGatekeeper(currentPagePath) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return // Only run on the client

    // 1. Get how far the user is allowed to go
    const maxUnlockedLevel = parseInt(sessionStorage.getItem('maxUnlockedLevel') || '0', 10)

    // 2. Get the level of the page they are trying to access
    const currentPageLevel = narrativeOrder[currentPagePath] || 0

    // 3. THE CHECK: Is the page they're on a higher level than they've unlocked?
    if (currentPageLevel > maxUnlockedLevel + 1) {
      // They skipped a step. Send them home.
      router.replace('/')
      return // Stop further execution
    }

    // 4. THE UNLOCK: If they passed the check, update their access level.
    // This means they have now officially "unlocked" this page.
    if (currentPageLevel > maxUnlockedLevel) {
      sessionStorage.setItem('maxUnlockedLevel', currentPageLevel.toString())
    }

    // // On the client side, check session storage
    // const unlockedUntil = sessionStorage.getItem('unlockedUntil')
    // if (requiredPath && unlockedUntil !== requiredPath) {
    //   // If they haven't unlocked this path, send them home.
    //   console.log(`havent unlock `, requiredPath)
    //   router.replace('/')
    // }
  }, [currentPagePath, router])
}

// // This is a helper function we'll use in our link components
// export function unlockPath(path) {
//   if (typeof window !== 'undefined') {
//     sessionStorage.setItem('unlockedUntil', path)
//   }
// }
