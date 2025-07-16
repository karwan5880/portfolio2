import { create } from 'zustand'

const shuffleArray = (array) => {
  const newArray = [...array] // Create a copy to avoid mutating the original
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const sourcePlaylist = [
  // { path: '/sound/megamanx5.mp3', theme: 'main_theme' },
  // { path: '/sound/harvestmoon.mp3', theme: 'snow' },
  // { path: '/sound/yangguxian.mp3', theme: 'thunder' },
  // { path: '/sound/cangzoucheng.mp3', theme: 'lightning' },
  { path: '/sound/nezuko.mp3', theme: 'snow' },
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
  audio.volume = 0.3
  audio.loop = true
}

const sfxAudio = typeof window !== 'undefined' ? new Audio() : null
if (sfxAudio) {
  sfxAudio.volume = 0.4
}

let audioContext, analyser, source
if (typeof window !== 'undefined') {
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256 // Smaller size for better performance

  // Connect the analyser to the speakers
  analyser.connect(audioContext.destination)
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
   */
  grantPermission: () => {
    set({ hasPermission: true })
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
   * Initializes the audio experience. Called by the "Begin" button.
   * Sets up the playlist and plays the first track.
   */
  startExperience: () => {
    // Prevent re-initialization
    if (get().isInitialized || !audio) return
    // if (audioContext && audio.src && !source) {
    //   source = audioContext.createMediaElementSource(audio)
    //   source.connect(analyser)
    // }
    // This block is the potential issue.
    if (audioContext && !source) {
      // It might be better to create the source *after* setting the audio.src
      // For now, let's ensure it's robust.
      try {
        source = audioContext.createMediaElementSource(audio)
        source.connect(analyser)
      } catch (e) {
        // This error can happen if audio.src isn't set yet.
        console.error('Error connecting audio source:', e)
      }
    }
    const mainThemeTrack = sourcePlaylist[0]
    const thematicTracks = sourcePlaylist.slice(1)
    // const newPlaylist = [mainThemeTrack, ...shuffleArray(thematicTracks)]

    // Attach the 'ended' event listener only once
    if (!get().listenersAttached) {
      const handleSongEnd = () => get().playNextTrack()
      audio.addEventListener('ended', handleSongEnd)
      set({ listenersAttached: true })
    }

    const newPlaylist = shuffleArray(sourcePlaylist)
    set({
      playlist: newPlaylist,
      currentTrackIndex: -1,
      isInitialized: true,
    })
    get().playNextTrack()

    // Start playback
    get().playNextTrack()
  },

  startPlayback: () => {
    const { isArmed, isPlaying, playTrack } = get()
    if (isArmed && !isPlaying) {
      console.log('Playback started by finale page.')
      playTrack(0) // Start with the first track
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
   * Plays the next track in the playlist. Handles playlist end.
   * This is the primary method for changing tracks.
   */
  playNextTrack: () => {
    if (!audio) return
    const { playlist, currentTrackIndex } = get()
    const nextIndex = currentTrackIndex + 1

    if (nextIndex >= playlist.length) {
      set({ isPlaying: false, activeTheme: 'main_theme' }) // Reset theme at the end
      audio.src = ''
      return
    }

    const track = playlist[nextIndex]
    console.log('Attempting to load track:', track.path) // <-- ADD THIS LOG

    const onCanPlay = () => {
      console.log('Track is ready! Calling audio.play()') // <-- ADD THIS LOG

      // 3. Now that it's loaded, we can safely play it.
      audio.play().catch((e) => console.error('Playback failed after load:', e))
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
    if (isPlaying) {
      audio.pause()
      set({ isPlaying: false })
    } else {
      audio.play().catch((e) => console.error('Audio playback failed:', e))
      set({ isPlaying: true })
    }
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
