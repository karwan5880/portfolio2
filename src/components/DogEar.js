'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import styles from './DogEar.module.css'

export function DogEar({ href, 'aria-label': ariaLabel, position = 'bottom-right', direction = 'next', ...props }) {
  const router = useRouter()

  const playSound = () => {
    // const randomNumber = Math.floor(Math.random() * 7) // 7 for 0-6 range
    const randomNumber = Math.floor(Math.random() * 9)
    try {
      console.log(`playing secret${randomNumber}.mp3`)
      const audio = new Audio(`/sound/secret${randomNumber}.mp3`)
      audio.play()
    } catch (error) {
      console.error('Failed to play sound:', error)
    }
  }

  const positionClass = position === 'bottom-left' ? styles.bottomLeft : styles.bottomRight

  //   const handlePreviousClick = () => {
  //     playSound()
  //     router.back()
  //   }
  //   // Conditionally render a 'back' button or a 'next' link
  //   if (direction === 'previous') {
  //     return (
  //       <div
  //         aria-label={ariaLabel || 'Go to previous page'}
  //         onClick={handlePreviousClick}
  //         className={`${styles.dogEar} ${styles.previous}`} // Add the 'previous' class
  //         {...props}
  //       />
  //     )
  //   }

  return (
    <Link
      href={href}
      aria-label={ariaLabel || 'Go to next page'}
      onClick={playSound}
      className={`${styles.dogEar} ${positionClass}`}
      {...props}
    />
  )
}
