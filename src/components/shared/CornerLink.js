'use client'

import Link from 'next/link'

import styles from './CornerLink.module.css'
import { useAudioStore } from '@/stores/audioStore'

export function CornerLink({ href, label, position = 'bottom-right', onNavigateStart, ...rest }) {
  const playUISound = useAudioStore((state) => state.playUISound)

  const handleClick = () => {
    playUISound('dogEar') // We can reuse the same sound effect
    if (onNavigateStart) {
      onNavigateStart()
    }
  }

  const positionClass = position === 'bottom-left' ? styles.bottomLeft : styles.bottomRight

  return (
    <Link href={href} onClick={handleClick} className={`${styles.cornerLink} ${positionClass}`} {...rest}>
      {label}
    </Link>
  )
}
