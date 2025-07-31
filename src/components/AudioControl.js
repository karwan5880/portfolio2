// components/AudioControl.js
'use client'

import { useEffect } from 'react'

import styles from './AudioControl.module.css'
import { useAudioStore } from '@/stores/audioStore'

// components/AudioControl.js

// components/AudioControl.js

export function AudioControl() {
  const { isMuted, unmuteAndPlay, muteAudio, initializeAudio, isInitialized, isPlaying, startPlayback, startExperience } = useAudioStore()

  // On first mount, just arm the system.
  useEffect(() => {
    initializeAudio()
  }, [initializeAudio])

  const handleToggle = () => {
    if (isMuted) {
      unmuteAndPlay() // This function now handles everything

      // If we're on the finale page and audio is initialized but not playing, start it
      if (typeof window !== 'undefined' && window.location.pathname === '/finale') {
        if (isInitialized && !isPlaying) {
          startPlayback()
        } else if (!isInitialized) {
          startExperience()
          // Small delay to ensure initialization completes
          setTimeout(() => startPlayback(), 100)
        }
      }
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
