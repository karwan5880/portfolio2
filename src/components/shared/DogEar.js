'use client'

import Link from 'next/link'

// Import our global store
import styles from './DogEar.module.css'
import { useAudioStore } from '@/stores/audioStore'

export function DogEar({ href, 'aria-label': ariaLabel, position = 'bottom-right', onNavigateStart, ...rest }) {
  // Get the sound-playing action from our store
  const playUISound = useAudioStore((state) => state.playUISound)

  const handleClick = (e) => {
    // 1. Trigger the global sound effect
    playUISound('dogEar')

    // 2. Call the optional callback if it exists
    if (onNavigateStart) {
      onNavigateStart()
      // onNavigateStart(e)
    }

    // // 3. If the callback prevented default, don't navigate
    // if (e && e.defaultPrevented) {
    //   return
    // }

    // 4. Otherwise, let Next.js <Link> handle the navigation
  }

  const positionClass = position === 'bottom-left' ? styles.bottomLeft : styles.bottomRight

  return <Link href={href} aria-label={ariaLabel || `Navigate to ${href}`} onClick={handleClick} className={`${styles.dogEar} ${positionClass}`} {...rest} />
}
