'use client'

import Link from 'next/link'

// Import our global store
import styles from './DogEar.module.css'
import { useAudioStore } from '@/stores/audioStore'

export function DogEar({ href, 'aria-label': ariaLabel, position = 'bottom-right', onNavigateStart, ...rest }) {
  // Get the sound-playing action from our store
  const playUISound = useAudioStore((state) => state.playUISound)

  const handleClick = () => {
    // 1. Trigger the global sound effect
    playUISound('dogEar')

    // 2. Call the optional callback if it exists
    if (onNavigateStart) {
      onNavigateStart()
    }

    // 3. That's it! We DO NOT call e.preventDefault().
    // The Next.js <Link> will now handle the navigation instantly.
  }

  const positionClass = position === 'bottom-left' ? styles.bottomLeft : styles.bottomRight

  return <Link href={href} aria-label={ariaLabel || `Navigate to ${href}`} onClick={handleClick} className={`${styles.dogEar} ${positionClass}`} {...rest} />
}
