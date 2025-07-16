// components/AudioControl.js
'use client'

import { useEffect } from 'react'

import styles from './AudioControl.module.css'
import { useAudioStore } from '@/stores/audioStore'

// components/AudioControl.js

export function AudioControl() {
  const { isMuted, unmuteAndPlay, muteAudio, initializeAudio } = useAudioStore()

  // On first mount, just arm the system.
  useEffect(() => {
    initializeAudio()
  }, [initializeAudio])

  const handleToggle = () => {
    if (isMuted) {
      unmuteAndPlay() // This function now handles everything
    } else {
      muteAudio()
    }
  }

  return (
    <button className={styles.audioButton} onClick={handleToggle} aria-label="Toggle Audio">
      {isMuted ? '[ Sound OFF ]' : '[ Sound ON ]'}
    </button>
  )
}
