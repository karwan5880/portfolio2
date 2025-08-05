'use client'

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'

import { DogEar } from '@/components/DogEar'
import { LightningEffect } from '@/components/LightningEffect'
import { SnowEffect } from '@/components/SnowEffect'
import { ThunderEffect } from '@/components/ThunderEffect'
import { CodeStream } from '@/components/finale/CodeStream'
import { DataStorm } from '@/components/finale/DataStorm'
import { GlitchOverlay } from '@/components/finale/GlitchOverlay'
import { SingleLineStream } from '@/components/finale/SingleLineStream'
import { StaticHeader } from '@/components/finale/StaticHeader'

import styles from './finale.module.css'
import { finaleStream } from '@/data/finale-stream-data'
import { useAudioStore } from '@/stores/audioStore'

function waitForAudioChannel(timeout = 5000, interval = 100) {
  return new Promise((resolve) => {
    const startTime = Date.now()
    const check = () => {
      // Find all audio elements on the page
      const allAudio = document.querySelectorAll('audio')
      let isAnotherAudioPlaying = false
      allAudio.forEach((audio) => {
        // Is there another audio element that isn't our main one, and is it currently playing?
        // (This check can be made more robust if you assign IDs to your audio elements)
        if (!audio.paused) {
          isAnotherAudioPlaying = true
        }
      })
      const elapsedTime = Date.now() - startTime
      if (!isAnotherAudioPlaying) {
        console.log('Audio channel is clear. Proceeding.')
        resolve() // Success!
      } else if (elapsedTime > timeout) {
        console.warn('Audio channel did not clear in time. Forcing playback.')
        resolve() // Timed out, proceed anyway to avoid getting stuck.
      } else {
        setTimeout(check, interval) // Check again shortly.
      }
    }
    check()
  })
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const initialState = {
  pageState: 'DORMANT', // DORMANT -> IDLE -> PRE_TYPE -> TYPING -> STATIC -> SCROLLING
  isExiting: false,
} // Start typing immediately
function finaleReducer(state, action) {
  switch (action.type) {
    case 'SHOW_CURSOR':
      return { ...state, pageState: 'IDLE' }
    case 'HIDE_CURSOR': // <-- NEW ACTION
      return { ...state, pageState: 'PRE_TYPE' }
    case 'START_TYPING':
      return { ...state, pageState: 'TYPING' }
    case 'FINISH_TYPING':
      return { ...state, pageState: 'STATIC' }
    case 'START_SCROLLING':
      return { ...state, pageState: 'SCROLLING' }
    case 'EXIT':
      return { ...state, isExiting: true }
    default:
      throw new Error()
  }
}

export default function FinalePage() {
  const [state, dispatch] = useReducer(finaleReducer, initialState)
  const [typedText, setTypedText] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const hasInitialized = useRef(false)
  const [showDataStorm, setShowDataStorm] = useState(false)

  // const { startPlayback, playNextTrack, activeTheme, isPlaying, isArmed, armAudio, currentSongIndex, playlistEnded } = useAudioStore()
  // const { initializeAndPlayMuted, unmuteAudio, activeTheme, playlistEnded } = useAudioStore()
  // const { startPlaylist, cleanupAudio, activeTheme, isPlaying, playlistEnded } = useAudioStore()
  // const { activeTheme, startPlaylist, cleanupAudio, hasPlaybackPermission } = useAudioStore()
  // const { activeTheme, initializeAndPlay, isAutoplayAuthorized, cleanupAudio } = useAudioStore()
  // const { hasPermission, initializeAndPlay, cleanupAudio, activeTheme } = useAudioStore()
  // const { hasPermission, initializeAudio, cleanupAudio, playPlaylist, activeTheme } = useAudioStore()
  // const { hasPermission } = useAudioStore((state) => ({ hasPermission: state.hasPermission }))
  // const { initializeAudio, cleanupAudio, playPlaylist } = useAudioStore((state) => state.actions) // Assuming actions are grouped
  //
  // const hasPermission = useAudioStore((s) => s.hasPermission)
  // const activeTheme = useAudioStore((s) => s.activeTheme)
  // const playlistEnded = useAudioStore((s) => s.playlistEnded)
  const { hasPermission, grantPermission, startExperience, cleanupAudio, activeTheme, playlistEnded } = useAudioStore()
  // const { initializeAudio, cleanupAudio, playPlaylist } = useAudioStore()
  // const { hasPermission, grantPermission } = useAudioStore((state) => ({
  //   hasPermission: state.hasPermission,
  //   grantPermission: state.grantPermission,
  // }))
  // const { startPlaylist, cleanupAudio } = useAudioStore.getState() // Get actions directly
  const { startPlaylist } = useAudioStore.getState() // Get actions directly
  const { fullReset } = useAudioStore.getState()

  // Data processing runs once and is stable
  // const { singleLineData, leftColumnData, middleColumnData, rightColumnData, glitchData } = useMemo(() => {
  const { singleLineData } = useMemo(() => {
    const stream = finaleStream[activeTheme] || []
    const singleLines = shuffleArray(stream.filter((item) => item.type !== 'multi-column'))
    // const multiCol = stream.filter((item) => item.type === 'multi-column')
    // const allCode = multiCol.flatMap((b) => b.columns)
    // const left = [],
    //   middle = [],
    //   right = [],
    //   glitches = []
    // allCode.forEach((snip, i) => {
    //   const lane = i % 4
    //   if (lane === 0) left.push(snip)
    //   else if (lane === 1) middle.push(snip)
    //   else if (lane === 2) right.push(snip)
    //   else glitches.push(snip)
    // })
    return {
      singleLineData: [...singleLines, ...singleLines],
      // leftColumnData: [...left, ...left],
      // middleColumnData: [...middle, ...middle],
      // rightColumnData: [...right, ...right],
      // // glitchData: [...glitches, ...glitches],
      // glitchData: shuffleArray(glitches),
    }
  }, [activeTheme])

  // // Hook 1: Initialize Audio and Listen for Unmute Interaction
  // useEffect(() => {
  //   console.log('Finale page mounted. Starting 4-second delay for audio initialization.')
  //   const audioInitTimer = setTimeout(() => {
  //     console.log('4-second delay finished. Initializing and playing muted audio.')
  //     initializeAndPlayMuted()
  //   }, 4000) // 4000 milliseconds = 4 seconds
  //   if (isArmed) return
  //   const handleFirstInteraction = () => {
  //     console.log('User interaction detected. Arming audio system.')
  //     unmuteAudio() // We now call the dedicated unmute function
  //   }
  //   window.addEventListener('click', unmuteAudio, { once: true })
  //   window.addEventListener('keydown', unmuteAudio, { once: true })
  //   window.addEventListener('touchstart', handleFirstInteraction, { once: true }) // <-- THE NEW LINE
  //   return () => {
  //     console.log('Cleaning up finale page listeners and timers.')
  //     clearTimeout(audioInitTimer)
  //     window.removeEventListener('click', unmuteAudio, { once: true })
  //     window.removeEventListener('keydown', unmuteAudio, { once: true })
  //     window.removeEventListener('touchstart', handleFirstInteraction, { once: true })
  //   }
  // }, [initializeAndPlayMuted, unmuteAudio])
  // // This single, powerful useEffect now manages the entire lifecycle
  // useEffect(() => {
  //   // --- On Mount: Create the audio and wait for interaction ---
  //   console.log('Finale page mounted. Creating audio element.')
  //   const audio = new Audio()
  //   audio.volume = 0.3
  //   audio.loop = false
  //   const handleFirstInteraction = () => {
  //     console.log('User interaction detected. Starting playlist.')
  //     // When the user clicks, start the entire playlist logic
  //     startPlaylist(audio)
  //   }
  //   // Listen for the first interaction
  //   window.addEventListener('click', handleFirstInteraction, { once: true })
  //   window.addEventListener('keydown', handleFirstInteraction, { once: true })
  //   // --- On Unmount: The Cleanup ---
  //   return () => {
  //     console.log('Finale page unmounted. Cleaning up audio.')
  //     window.removeEventListener('click', handleFirstInteraction, { once: true })
  //     window.removeEventListener('keydown', handleFirstInteraction, { once: true })
  //     cleanupAudio() // Call the store's cleanup function
  //   }
  // }, [startPlaylist, cleanupAudio]) // Stable dependencies
  // // --- THE FINAL, PERFECT useEffect ---
  // useEffect(() => {
  //   // Check for the permission slip.
  //   if (hasPlaybackPermission) {
  //     console.log('Permission granted. Creating audio and starting playlist.')
  //     const audio = new Audio()
  //     audio.volume = 0.3
  //     startPlaylist(audio)
  //   } else {
  //     console.log('No playback permission. Finale will be silent.')
  //   }
  //   // The cleanup function is now more important than ever.
  //   return () => {
  //     console.log('Finale page unmounted. Cleaning up audio.')
  //     cleanupAudio()
  //   }
  // }, [hasPlaybackPermission, startPlaylist, cleanupAudio]) // React to permission changes
  // // another one
  // useEffect(() => {
  //   console.log('Finale page mounted. Initializing audio element.')
  //   const audio = new Audio()
  //   audio.volume = 0.3
  //   audio.loop = false
  //   // Call the main initialization function. It will check the ticket internally.
  //   initializeAndPlay(audio)
  //   // If autoplay was NOT authorized, we still need a way to start the music.
  //   // The "click to start" is now the fallback for direct navigators.
  //   if (!isAutoplayAuthorized) {
  //     const handleFirstInteraction = () => {
  //       console.log('User interaction detected. Starting playlist manually.')
  //       // We need a way to start playback on an already initialized element.
  //       // Let's add a `playTrack(0)` call here for simplicity, or add a new store action.
  //       useAudioStore.getState().playTrack(0)
  //     }
  //     window.addEventListener('click', handleFirstInteraction, { once: true })
  //     return () => window.removeEventListener('click', handleFirstInteraction, { once: true })
  //   }
  //   // On Unmount: The Cleanup
  //   return () => {
  //     console.log('Finale page unmounted. Cleaning up audio.')
  //     cleanupAudio()
  //   }
  // }, [initializeAndPlay, cleanupAudio, isAutoplayAuthorized])
  // useEffect(() => {
  //   console.log('Finale page mounted. Initializing audio element.')
  //   const audio = new Audio()
  //   audio.volume = 0.3
  //   audio.loop = false
  //   // --- THE FIX: A flag to prevent cleanup from interrupting a valid play request ---
  //   let isPlayingOrIntendingToPlay = false
  //   // The function that starts playback
  //   const startAudio = () => {
  //     if (!isPlayingOrIntendingToPlay) {
  //       isPlayingOrIntendingToPlay = true
  //       initializeAndPlay(audio)
  //     }
  //   }
  //   // The function for the fallback manual start
  //   const handleFirstInteraction = () => {
  //     console.log('User interaction detected. Starting playlist manually.')
  //     startAudio()
  //   }
  //   // --- Main Logic ---
  //   if (isAutoplayAuthorized) {
  //     // If we have the golden ticket, start immediately.
  //     startAudio()
  //   } else {
  //     // Otherwise, wait for the user's click.
  //     window.addEventListener('click', handleFirstInteraction, { once: true })
  //   }
  //   // --- The Cleanup ---
  //   return () => {
  //     console.log('Finale page unmounted. Cleaning up audio.')
  //     window.removeEventListener('click', handleFirstInteraction, { once: true })
  //     // We only call cleanup if audio was actually playing or about to play.
  //     // This prevents the race condition.
  //     if (isPlayingOrIntendingToPlay) {
  //       cleanupAudio()
  //     }
  //   }
  // }, [initializeAndPlay, cleanupAudio, isAutoplayAuthorized])
  // // --- The Master useEffect Hook ---
  // useEffect(() => {
  //   // Check for permission right at the start
  //   if (hasPermission) {
  //     console.log('Finale page mounted with permission. Starting audio.')
  //     initializeAndPlay()
  //   } else {
  //     console.log('Finale page mounted WITHOUT permission. Audio will remain silent.')
  //   }
  //   // The cleanup function is crucial for when the user leaves the page
  //   return () => {
  //     cleanupAudio()
  //   }
  // }, [hasPermission, initializeAndPlay, cleanupAudio]) // It runs only when these change
  // useEffect(() => {
  //   console.log('enter useeffect.')
  //   const startSequence = async () => {
  //     if (hasPermission) {
  //       console.log('Finale page has permission. Waiting for a clear audio channel...')
  //       console.log('custom delay timer: 4000.')
  //       await new Promise((resolve) => setTimeout(resolve, 4000))
  //       console.log('Waiting for a clear audio channel...')
  //       await waitForAudioChannel()
  //       console.log('Channel is clear. Starting playlist.')
  //       playPlaylist()
  //     } else {
  //       console.log('Finale page mounted WITHOUT permission. Audio will remain silent.')
  //     }
  //   }
  //   initializeAudio()
  //   startSequence()
  //   return () => {
  //     console.log('Finale page unmounted. Cleaning up audio.')
  //     cleanupAudio()
  //   }
  // }, [hasPermission, initializeAudio, cleanupAudio, playPlaylist])
  // // This is now the ONLY useEffect needed for audio. It's incredibly clean.
  // useEffect(() => {
  //   console.log(`useeffect`)
  //   const startSequence = async () => {
  //     // If we don't have permission, we need it.
  //     if (!hasPermission) {
  //       console.log(`!hasPermission`)
  //       // const handleInteraction = () => {
  //       //   grantPermission()
  //       //   // Now that permission is granted, we can proceed.
  //       //   // We call startPlaylist directly.
  //       //   startPlaylistWithDelay()
  //       // }
  //       // window.addEventListener('click', handleInteraction, { once: true })
  //       return // Stop here and wait for the click
  //     }
  //     // If we already have permission, start immediately.
  //     console.log(`hasPermission`)
  //     startPlaylistWithDelay()
  //   }
  //   const startPlaylistWithDelay = async () => {
  //     await new Promise((resolve) => setTimeout(resolve, 4000)) // 1s grace period
  //     console.log('Checks passed. Starting playlist.')
  //     startPlaylist()
  //   }
  //   console.log(`startSequence`)
  //   startSequence()
  //   return () => {
  //     console.log(`cleanupAudio`)
  //     cleanupAudio()
  //   }
  // }, [hasPermission, startPlaylist, cleanupAudio])
  // // }, [hasPermission, grantPermission, startPlaylist, cleanupAudio])
  // // --- THE FINAL, MASTER LIFECYCLE HOOK ---
  useEffect(() => {
    console.log(`useeffect`)
    // --- THE FIX: The Idempotency Check ---
    // If our flag is true, it means the logic has already run for this mount.
    // We do nothing and exit immediately.
    if (hasInitialized.current) {
      console.log(`useref hasInitialized`)
      return
    }
    // Mark the flag as true immediately. Any subsequent calls from Strict Mode
    // will be ignored by the check above.
    hasInitialized.current = true
    // --- END OF FIX ---
    const startSequence = async () => {
      // This entire block of logic will now only ever execute ONCE per true mount.
      if (hasPermission) {
        console.log('Finale has permission. Starting sequence...')
        await new Promise((resolve) => setTimeout(resolve, 7000))
        console.log('Starting playlist.')
        startExperience()
        // startPlaylist()
      } else {
        console.log('Finale mounted WITHOUT permission. ')
        // console.log('Finale mounted WITHOUT permission. Awaiting user interaction.')
        // const handleInteraction = () => {
        //   // grantPermission()
        //   startPlaylistWithDelay()
        // }
        // window.addEventListener('click', handleInteraction, { once: true })
      }
    }
    // const startPlaylistWithDelay = async () => {
    //   await new Promise((resolve) => setTimeout(resolve, 1000))
    //   console.log('Checks passed. Starting playlist.')
    //   startPlaylist()
    // }
    console.log(`startSequence`)
    startSequence()
    // The cleanup function remains crucial. It will still be called on unmount.
    return () => {
      console.log('Finale page unmounted. Cleaning up audio.')
      cleanupAudio()
      // We could reset the flag here if needed, but for a finale page,
      // it's often better to let it stay true, assuming it won't be re-mounted again.
    }
    // The dependency array is now much cleaner, as we handle the logic internally.
  }, [hasPermission, startExperience, cleanupAudio])
  // // // }, [hasPermission, startPlaylist, cleanupAudio])
  // // --- The Final, Master Lifecycle Hook ---
  // useEffect(() => {
  //   console.log(`useeffect`)
  //   if (hasInitialized.current) {
  //     console.log(`useref hasInitialized`)
  //     return
  //   }
  //   hasInitialized.current = true
  //   // Get the actions once. Zustand ensures they are stable.
  //   const { hasPermission, grantPermission, startExperience, fullReset } = useAudioStore.getState()
  //   const sequence = () => {
  //     if (hasPermission) {
  //       startExperience()
  //     } else {
  //       // const handleInteraction = () => {
  //       //   grantPermission()
  //       //   startExperience()
  //       // }
  //       // window.addEventListener('click', handleInteraction, { once: true })
  //     }
  //   }
  //   sequence()
  //   // The cleanup function now calls the full, hard reset.
  //   return () => {
  //     console.log('Finale page unmounted. Performing full audio reset.')
  //     fullReset()
  //   }
  // }, []) // <-- IMPORTANT: Empty dependency array. This logic should only ever run ONCE.

  // Hook 2: The Page State Machine
  useEffect(() => {
    if (state.pageState === 'STATIC') {
      const timer = setTimeout(() => dispatch({ type: 'START_SCROLLING' }), 14000)
      return () => clearTimeout(timer)
    }
  }, [state.pageState])

  // --- The NEW Master "Conductor" useEffect ---
  useEffect(() => {
    console.log(`useeffect3`)
    if (state.pageState === 'DORMANT') {
      console.log(`useeffect3DORMANT`)
      const timer = setTimeout(() => dispatch({ type: 'SHOW_CURSOR' }), 1000) // 1s blank screen
      return () => clearTimeout(timer)
    }
    if (state.pageState === 'IDLE') {
      console.log(`useeffect3IDLE`)
      const timer = setTimeout(() => dispatch({ type: 'HIDE_CURSOR' }), 3000) // 3s idle cursor
      return () => clearTimeout(timer)
    }
    if (state.pageState === 'PRE_TYPE') {
      console.log(`useeffect3PRE_TYPE`)
      const timer = setTimeout(() => dispatch({ type: 'START_TYPING' }), 500) // 0.5s pause
      return () => clearTimeout(timer)
    }
    if (state.pageState === 'STATIC') {
      console.log(`useeffect3STATIC`)
      const timer = setTimeout(() => dispatch({ type: 'START_SCROLLING' }), 33000) // 30s wait
      return () => clearTimeout(timer)
    }
    if (state.pageState === 'SCROLLING') {
      setShowDataStorm(true)
      const stormTimer = setTimeout(() => {
        setShowDataStorm(false)
      }, 4000)
      return () => clearTimeout(stormTimer)
    }
  }, [state.pageState]) // This hook re-runs only when the state changes

  // // Hook 3: Handling the End of the Playlist
  // useEffect(() => {
  //   if (playlistEnded) {
  //     dispatch({ type: 'EXIT' })
  //   }
  // }, [playlistEnded])

  // // --- HOOK 1: User Interaction & Audio Arming ---
  // // This hook's only job is to wait for the first user click to get browser
  // // permission to play audio. It runs only once.
  // useEffect(() => {
  //   // If audio is already armed (e.g., from a previous page), do nothing.
  //   if (isArmed) return
  //   const handleFirstInteraction = () => {
  //     console.log('User interaction detected. Arming audio system.')
  //     armAudio()
  //     dispatch({ type: 'BEGIN_SEQUENCE' }) // <-- Dispatch the new action
  //   }
  //   // Use { once: true } for efficiency. The listener removes itself after the first click.
  //   window.addEventListener('click', handleFirstInteraction, { once: true })
  //   return () => {
  //     // Just in case the component unmounts before a click, clean up the listener.
  //     window.removeEventListener('click', handleFirstInteraction, { once: true })
  //   }
  // }, [isArmed, armAudio]) // Dependencies ensure this hook is stable.

  // // --- HOOK 2: The Master State Machine (The Conductor) ---
  // // This hook is responsible for the main TYPING -> STATIC -> SCROLLING flow.
  // useEffect(() => {
  //   // if (state.pageState === 'TYPING') {
  //   //   const typeText = (index = 0) => {
  //   //     if (index < finalMessage.length) {
  //   //       setTypedText(finalMessage.substring(0, index + 1))
  //   //       setTimeout(() => typeText(index + 1), 100)
  //   //     } else {
  //   //       // Typing is done, transition to the STATIC state.
  //   //       setTimeout(() => setPageState('STATIC'), 500)
  //   //     }
  //   //   }
  //   //   const startTypingTimer = setTimeout(typeText, 1500)
  //   //   return () => clearTimeout(startTypingTimer)
  //   // }
  //   if (state.pageState === 'STATIC') {
  //     // We are in the 30-second waiting period.
  //     const startScrollingTimer = setTimeout(() => {
  //       dispatch({ type: 'START_SCROLLING' })
  //     }, 10000)
  //     return () => clearTimeout(startScrollingTimer)
  //   }
  // }, [state.pageState]) // This hook only re-runs when the pageState itself changes.

  // // --- HOOK 3: Starting the Music and Handling the End ---
  // // This hook's only job is to manage the audio playback lifecycle.
  // useEffect(() => {
  //   if (state.pageState === 'SCROLLING') {
  //     // If we are scrolling and music isn't playing yet, start it.
  //     if (!isPlaying && !playlistEnded) {
  //       console.log('SCROLLING state detected. Requesting playback start.')
  //       startPlayback()
  //     }
  //     // If the playlist has ended, we trigger the final fade out of the whole page.
  //     else if (playlistEnded) {
  //       console.log('Playlist has ended. Fading out.')
  //       // setIsExiting(true)
  //       dispatch({ type: 'EXIT' })
  //     }
  //   }
  // }, [state.pageState, isPlaying, playlistEnded, startPlayback])

  // --- HOOK 4: The Escape Hatch ---
  // This hook's only job is to listen for the Escape key.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed. Disconnecting.')
        // setIsExiting(true)
        dispatch({ type: 'EXIT' })
        // Here you could also add a call to pause the audio if you wish.
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, []) // Empty array means it sets up the listener only once.

  // useEffect(() => {
  //   // // Arm the audio on first user interaction
  //   // if (!isArmed) {
  //   //   const handleFirstInteraction = () => armAudio()
  //   //   window.addEventListener('click', handleFirstInteraction, { once: true })
  //   //   return () => window.removeEventListener('click', handleFirstInteraction)
  //   // }
  //   // Handle the page state machine
  //   if (state.pageState === 'STATIC') {
  //     const timer = setTimeout(() => dispatch({ type: 'START_SCROLLING' }), 15000)
  //     return () => clearTimeout(timer)
  //   }
  //   // Handle the audio playback logic
  //   if (state.pageState === 'SCROLLING') {
  //     if (!isPlaying && !playlistEnded) {
  //       startPlayback()
  //     } else if (playlistEnded) {
  //       dispatch({ type: 'EXIT' }) // Trigger the final fade out
  //     }
  //   }
  // }, [state.pageState, isArmed, isPlaying, playlistEnded, armAudio, startPlayback])

  // // Effect to handle the smooth fade between songs/themes
  // useEffect(() => {
  //   if (state.pageState !== 'SCROLLING') return
  //   setIsTransitioning(true)
  //   const timer = setTimeout(() => setIsTransitioning(false), 1000) // Duration of the fade
  //   return () => clearTimeout(timer)
  // }, [activeTheme, state.pageState])

  // // Escape hatch
  // useEffect(() => {
  //   const handleKeyDown = (e) => {
  //     if (e.key === 'Escape') dispatch({ type: 'EXIT' })
  //   }
  //   window.addEventListener('keydown', handleKeyDown)
  //   return () => window.removeEventListener('keydown', handleKeyDown)
  // }, [])

  return (
    <div className={`${styles.finaleWrapper} ${styles[activeTheme] || ''} ${state.isExiting ? styles.exiting : ''}`}>
      {state.pageState === 'SCROLLING' && (activeTheme === 'snow' || activeTheme === 'main_theme') && <SnowEffect />}
      {state.pageState === 'SCROLLING' && (activeTheme === 'thunder' || activeTheme === 'main_theme') && <ThunderEffect />}
      {state.pageState === 'SCROLLING' && (activeTheme === 'lightning' || activeTheme === 'main_theme') && <LightningEffect />}
      <StaticHeader pageState={state.pageState} onTypingComplete={() => dispatch({ type: 'FINISH_TYPING' })} />
      {/* {showDataStorm && <DataStorm stormData={glitchData} particleLifetime={100} />} */}
      {state.pageState === 'SCROLLING' && <DataStorm />}
      <div className={`${styles.contentWrapper} ${isTransitioning ? styles.transitioning : ''}`}>
        <SingleLineStream theme={activeTheme} isScrolling={state.pageState === 'SCROLLING'} />
        <CodeStream theme={activeTheme} isScrolling={state.pageState === 'SCROLLING'} />
        <GlitchOverlay theme={activeTheme} isScrolling={state.pageState === 'SCROLLING'} />
        {/* <SingleLineStream items={singleLineData} isScrolling={state.pageState === 'SCROLLING'} /> */}
        {/* <CodeStream left={leftColumnData} middle={middleColumnData} right={rightColumnData} isScrolling={state.pageState === 'SCROLLING'} /> */}
        {/* <GlitchOverlay glitchData={glitchData} isScrolling={state.pageState === 'SCROLLING'} /> */}
      </div>
      {/* <CodeStream left={leftColumnData} middle={middleColumnData} right={rightColumnData} isScrolling={state.pageState === 'SCROLLING'} /> */}
      {/* <GlitchOverlay glitchData={glitchData} isScrolling={state.pageState === 'SCROLLING'} /> */}
      {/* <div className={styles.escapeHatch}>[ PRESS ESC TO DISCONNECT ]</div> */}
      {/* <div className={`${styles.scrollContainer} ${state.pageState === 'SCROLLING' ? styles.scrolling : ''}`}>
        <div className={styles.dataBurstContainer}>{githubBurst && <StreamItem key={githubBurst.id} item={githubBurst} />}</div>
        <div className={styles.dataBurstContainer}>{musicBurst && <StreamItem key={musicBurst.id} item={musicBurst} />}</div>
      </div> */}
      <DogEar href="/dev-history" position="bottom-left" aria-label="Return to dev-history" />
      <DogEar href="/" position="bottom-right" aria-label="View main page" />
    </div>
  )
}
