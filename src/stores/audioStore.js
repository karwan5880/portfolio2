import { create } from 'zustand'

const shuffleArray = (array) => {
  const newArray = [...array] // Create a copy to avoid mutating the original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Single track for drone show - no playlist needed
// const DRONE_SHOW_TRACK = { path: '/sound/nezuko.mp3', theme: 'epic' }
// Try absolute path for Cloudflare
const DRONE_SHOW_TRACK = {
  path: typeof window !== 'undefined' ? `${window.location.origin}/sound/nezuko_short.mp3` : '/sound/nezuko_short.mp3',
  theme: 'epic',
}

// Debug logging
console.log('Audio track path:', DRONE_SHOW_TRACK.path)
// const DRONE_SHOW_TRACK = { path: '/sound/harvestmoon.mp3', theme: 'epic' }

const sourcePlaylist = [
  DRONE_SHOW_TRACK, // Only play this one track for drone show
]

// --- Construct the Dynamic Playlist ---
// 1. Take the first song, which is always our main theme.
const mainThemeTrack = sourcePlaylist[0]
// 2. Take the rest of the songs.
const thematicTracks = sourcePlaylist.slice(1)
// 3. Shuffle ONLY the thematic songs.
const shuffledThematicTracks = shuffleArray(thematicTracks)
// 4. Combine them back into the final playlist.
export const masterPlaylist = [mainThemeTrack, ...shuffledThematicTracks]

// --- Global Audio Instance ---

// We define the audio instance outside the store so it's a single, persistent element.
const audio = typeof window !== 'undefined' ? new Audio() : null
if (audio) {
  audio.volume = 0.4 // Slightly higher volume for better audibility
  audio.loop = false // Play once, no repeat for drone show
}

const sfxAudio = typeof window !== 'undefined' ? new Audio() : null
if (sfxAudio) {
  sfxAudio.volume = 0.4
}

let audioContext, analyser, source
if (typeof window !== 'undefined') {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 256 // Smaller size for better performance

    // Connect the analyser to the speakers
    analyser.connect(audioContext.destination)

    console.log('Audio context initialized:', {
      state: audioContext.state,
      sampleRate: audioContext.sampleRate,
      destination: audioContext.destination,
    })
  } catch (e) {
    console.error('Failed to initialize audio context:', e)
  }
}

export const useAudioStore = create((set, get) => ({
  // --- State ---
  playlist: [],
  currentTrackIndex: -1,
  isPlaying: false,
  activeTheme: 'main_theme',
  isInitialized: false,
  hasPermission: false,
  listenersAttached: false,
  volume: 0.4, // Current volume level
  analyser: analyser, // Expose the analyser instance

  // --- Actions ---

  playUISound: (type) => {
    if (!sfxAudio) return

    if (type === 'dogEar') {
      const randomNumber = Math.floor(Math.random() * 0)
      sfxAudio.src = `/sound/secret${randomNumber}.mp3`
      sfxAudio.play().catch((e) => console.error('SFX playback failed:', e))
    }
    // We could add other types later, e.g., 'hover', 'success'
  },

  /**
   * Grants permission for the finale page. Called from the DogEar link.
   * Also ensures audio context is ready for iOS Safari.
   */
  grantPermission: async () => {
    set({ hasPermission: true })

    // Resume audio context immediately on user interaction (required for iOS)
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
        console.log('Audio context resumed on user interaction')
      } catch (e) {
        console.error('Failed to resume audio context:', e)
      }
    }

    // Pre-load and prepare audio for iOS
    if (audio && !audio.src) {
      try {
        audio.src = DRONE_SHOW_TRACK.path
        audio.load()
        console.log('Audio pre-loaded for iOS compatibility')
      } catch (e) {
        console.error('Failed to pre-load audio:', e)
      }
    }
  },

  setupAudioAnalysis: () => {
    if (audioContext && audio && !source) {
      // Check if not already set up
      try {
        source = audioContext.createMediaElementSource(audio)
        source.connect(analyser)
        console.log('Audio analysis pipeline connected.')
      } catch (e) {
        console.error('Could not connect audio source for analysis:', e)
      }
    }
  },
  /**
   * Initializes the audio experience for drone show.
   * Sets up the playlist but waits for user interaction to play.
   */
  startExperience: () => {
    // Prevent re-initialization
    if (get().isInitialized || !audio) return

    // Resume audio context if suspended
    if (audioContext && audioContext.state === 'suspended') {
      console.log('Resuming suspended audio context...')
      audioContext
        .resume()
        .then(() => {
          console.log('Audio context resumed successfully')
        })
        .catch((e) => {
          console.error('Failed to resume audio context:', e)
        })
    }

    if (audioContext && !source) {
      try {
        source = audioContext.createMediaElementSource(audio)
        source.connect(analyser)
        console.log('Audio source connected to analyser')
      } catch (e) {
        console.error('Error connecting audio source:', e)
      }
    }

    // For drone show, we only want to play the specific track once
    // No need for playlist shuffling or multiple tracks
    set({
      playlist: [DRONE_SHOW_TRACK], // Only one track
      currentTrackIndex: -1,
      isInitialized: true,
    })

    // Don't auto-play - wait for user interaction
    console.log('Audio experience initialized. Waiting for user interaction to play.')
  },

  startPlayback: async () => {
    const { isInitialized, isPlaying, hasPermission, currentTrackIndex } = get()

    if (!hasPermission) {
      console.warn('Audio playback blocked - no permission granted')
      return
    }

    if (isInitialized && !isPlaying) {
      console.log('Playback started by user interaction.')

      // Ensure audio context is ready (critical for iOS)
      if (audioContext && audioContext.state === 'suspended') {
        try {
          await audioContext.resume()
          console.log('Audio context resumed for playback')
        } catch (e) {
          console.error('Failed to resume audio context for playback:', e)
        }
      }

      // If track has already been loaded (resume case), just play it
      if (currentTrackIndex >= 0 && audio && audio.src) {
        console.log('Resuming existing track')
        try {
          await audio.play()
          set({ isPlaying: true })
        } catch (e) {
          console.error('Failed to resume audio:', e)
        }
      } else {
        // First time play - load and play the track
        get().playNextTrack()
      }
    }
  },

  startPlaybackAtTime: async (offsetSeconds) => {
    const { isInitialized, isPlaying, hasPermission, playlist } = get()

    console.log('🎵 startPlaybackAtTime called with:', {
      offsetSeconds,
      isInitialized,
      isPlaying,
      hasPermission,
      playlistLength: playlist.length,
    })

    if (!hasPermission) {
      console.warn('Audio playback blocked - no permission granted')
      return
    }

    if (isInitialized && !isPlaying && playlist.length > 0) {
      console.log(`🎵 Starting playback at ${offsetSeconds.toFixed(1)}s offset`)

      // Ensure audio context is ready (critical for iOS)
      if (audioContext && audioContext.state === 'suspended') {
        try {
          await audioContext.resume()
          console.log('Audio context resumed for playback')
        } catch (e) {
          console.error('Failed to resume audio context for playback:', e)
        }
      }

      const track = playlist[0] // Always use the first (and only) track
      console.log('🎵 Track to play:', track.path)

      // Always ensure the track is loaded fresh
      audio.src = track.path
      console.log('🎵 Audio src set to:', audio.src)

      // Create a promise that resolves when audio is ready
      const waitForAudioReady = () => {
        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Audio loading timeout'))
          }, 10000) // 10 second timeout

          const onCanPlay = () => {
            clearTimeout(timeout)
            audio.removeEventListener('canplaythrough', onCanPlay)
            audio.removeEventListener('error', onError)
            console.log('🎵 Audio is ready, duration:', audio.duration)
            resolve()
          }

          const onError = (e) => {
            clearTimeout(timeout)
            audio.removeEventListener('canplaythrough', onCanPlay)
            audio.removeEventListener('error', onError)
            reject(e)
          }

          audio.addEventListener('canplaythrough', onCanPlay)
          audio.addEventListener('error', onError)

          // If already ready, resolve immediately
          if (audio.readyState >= 2) {
            clearTimeout(timeout)
            console.log('🎵 Audio already ready')
            resolve()
          } else {
            console.log('🎵 Loading audio...')
            audio.load()
          }
        })
      }

      try {
        await waitForAudioReady()

        // Now set the time AFTER the audio is fully loaded
        const clampedOffset = Math.max(0, Math.min(offsetSeconds, audio.duration || offsetSeconds))
        console.log(`🎵 Setting currentTime to ${clampedOffset.toFixed(1)}s (duration: ${audio.duration?.toFixed(1)}s)`)

        audio.currentTime = clampedOffset

        // Verify the time was set correctly
        console.log(`🎵 Audio currentTime after setting: ${audio.currentTime.toFixed(1)}s`)

        await audio.play()

        set({
          isPlaying: true,
          currentTrackIndex: 0,
          activeTheme: track.theme,
        })

        console.log('🎵 Synced audio playback started successfully at', audio.currentTime.toFixed(1), 's')
      } catch (e) {
        console.error('🎵 Failed to start synced audio playback:', e)
        // Fallback to regular playback
        console.log('🎵 Falling back to regular playback')
        get().startPlayback()
      }
    }
  },

  //   // This is the NEW function that the finale page will call
  //   startPlayback: () => {
  //     const { audio, isArmed, currentSongIndex, isPlaying } = get()
  //     if (audio && isArmed && !isPlaying) {
  //       console.log('Playback started by finale page.')
  //       const currentTrack = masterPlaylist[currentSongIndex]
  //       audio.src = currentTrack.path
  //       audio.play().catch((e) => console.error('Playback error:', e))
  //       set({ isPlaying: true, activeTheme: currentTrack.theme })
  //     }
  //   },

  /**
   * Plays the drone show track once.
   * No playlist cycling - just plays the single track.
   */
  playNextTrack: () => {
    if (!audio) return
    const { playlist, currentTrackIndex } = get()
    const nextIndex = currentTrackIndex + 1

    if (nextIndex >= playlist.length) {
      // End of playlist - stop playing (no loop for drone show)
      set({ isPlaying: false, activeTheme: 'epic' })
      audio.src = ''
      return
    }

    const track = playlist[nextIndex]
    console.log('Attempting to load track:', track.path) // <-- ADD THIS LOG

    const onCanPlay = () => {
      console.log('Track is ready! Calling audio.play()') // <-- ADD THIS LOG
      console.log('Audio element state:', {
        volume: audio.volume,
        muted: audio.muted,
        paused: audio.paused,
        currentTime: audio.currentTime,
        duration: audio.duration,
        readyState: audio.readyState,
      })

      // 3. Now that it's loaded, we can safely play it.
      // This should work now because it's triggered by user interaction
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio playback started successfully!')
            console.log('Playing state:', {
              playing: !audio.paused,
              volume: audio.volume,
              currentTime: audio.currentTime,
            })
          })
          .catch((e) => {
            console.error('Playback failed after load:', e)
            console.log('Audio blocked - user interaction required')
          })
      }
      // 4. IMPORTANT: Remove the listener so it doesn't fire again for the same track.
      audio.removeEventListener('canplaythrough', onCanPlay)
    }
    audio.addEventListener('canplaythrough', onCanPlay)
    audio.src = track.path
    audio.load()
    // // This returns a Promise that can reject if autoplay is blocked.
    // const playPromise = audio.play()
    // if (playPromise !== undefined) {
    //   playPromise.catch((e) => {
    //     console.error('Audio playback was blocked by the browser:', e)
    //     // You might want to show a "Click to play" button here.
    //   })
    // }
    // // audio.play().catch((e) => console.error('Audio playback failed:', e))
    set({
      isPlaying: true,
      currentTrackIndex: nextIndex,
      activeTheme: track.theme,
    })
  },

  /**
   * Toggles the audio between play and pause.
   */
  togglePlayback: () => {
    if (!audio || !get().isInitialized) return
    const { isPlaying } = get()

    console.log('Toggle playback - Current state:', {
      isPlaying,
      audioPaused: audio.paused,
      audioCurrentTime: audio.currentTime,
      audioSrc: audio.src,
    })

    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
      console.log('Audio paused')
    } else {
      // Resume audio context if suspended
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
          console.log('Audio context resumed for playback')
        })
      }

      audio
        .play()
        .then(() => {
          console.log('Audio resumed successfully')
          set({ isPlaying: true })
        })
        .catch((e) => {
          console.error('Audio playback failed:', e)
          // Don't set isPlaying to true if play failed
        })
    }
  },

  /**
   * Sets the audio volume (0.0 to 1.0)
   */
  setVolume: (volume) => {
    if (!audio) return
    const clampedVolume = Math.max(0, Math.min(1, volume))
    audio.volume = clampedVolume
    set({ volume: clampedVolume })
  },

  /**
   * Gets the current volume
   */
  getVolume: () => {
    return audio ? audio.volume : 0
  },

  /**
   * A full cleanup function to be called when the component unmounts.
   * Resets the entire audio state.
   */
  cleanup: () => {
    if (audio) {
      audio.pause()
      audio.src = ''
      // NOTE: We are intentionally NOT removing the event listener here,
      // as the audio store is meant to persist across page navigations.
      // If you needed to fully tear down the audio system, you would add that here.
    }
    set({
      playlist: [],
      currentTrackIndex: -1,
      isPlaying: false,
      isInitialized: false,
      activeTheme: 'main_theme',
      // We keep hasPermission as it's part of the user's journey progression.
    })
  },
}))
