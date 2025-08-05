'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'
import InfoBox from '@/components/InfoBox'
import InfoPanel from '@/components/InfoPanel'

import styles from './page.module.css'
import { locations } from '@/data/locations'
import { useAudioStore } from '@/stores/audioStore'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <p className={styles.loading}>Hover on dots to show tooltip </p>,
})

export default function Home() {
  const containerRef = useRef()
  const [selectedLocation, setSelectedLocation] = useState(null)
  const grantPermission = useAudioStore((state) => state.grantPermission)
  // const [isInfoBoxVisible, setInfoBoxVisible] = useState(false)
  // const [selectedSection, setSelectedSection] = useState(null)
  const [cameraFocusSection, setCameraFocusSection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [isSceneLoaded, setIsSceneLoaded] = useState(false)
  const [controls, setControls] = useState(null)
  const [resetTrigger, setResetTrigger] = useState(0)
  const experienceRef = useRef()

  // // This effect now correctly handles the 2-second delay
  // useEffect(() => {
  //   console.log(`page.js, isSceneLoaded: `, isSceneLoaded)
  //   // if (isSceneLoaded) {
  //   //   const timer = setTimeout(() => {
  //   //     // After 2 seconds, we "close" the panel, which will animate it to the bottom.
  //   //     setIsPanelOpen(false)
  //   //   }, 4000)
  //   //   return () => clearTimeout(timer)
  //   // }
  // }, [isSceneLoaded])

  // const handleTogglePanel = () => {
  //   // We only allow toggling after the scene has loaded and the panel has moved down.
  //   if (isSceneLoaded) {
  //     setIsPanelOpen((prev) => !prev)
  //   }
  // }

  // const handleMarkerClick = useCallback(
  //   (sectionName) => {
  //     if (isAnimating) return
  //     setIsAnimating(true)
  //     setCameraFocusSection(sectionName)
  //   },
  //   [isAnimating]
  // )

  // A clear, simple handler for the reset button.
  const handleResetView = () => {
    // // // Setting the selected location to null is the signal for the
    // // // CameraManager to return to its default state.
    // // // setSelectedLocation(null)
    // // if (isAnimating) return
    // // // Set the focus to null and start the animation.
    // // setCameraFocusSection(null)
    // // setIsAnimating(true)
    // if (controls) {
    //   controls.reset(true) // `true` enables a smooth animation
    // }
    console.log(`handleResetView`)
    // setResetTrigger((prev) => prev + 1)
    if (experienceRef.current) {
      experienceRef.current.reset()
    }
    console.log(`handleResetView2`)
  }

  // const handleCloseInfoBox = () => {
  //   setSelectedLocation(null)
  // }

  // const handleMarkerClick = useCallback(
  //   (sectionName) => {
  //     console.log(`handleMarkerClick received: ${sectionName}`)
  //     if (isAnimating) {
  //       console.log('Returning because isAnimating is true.')
  //       return
  //     }
  //     if (cameraFocusSection === sectionName) {
  //       setCameraFocusSection(null)
  //       setSelectedSection(null)
  //       setInfoBoxVisible(false)
  //     } else {
  //       setIsAnimating(true)
  //       setCameraFocusSection(sectionName)
  //       setSelectedSection(sectionName)
  //       setInfoBoxVisible(false) //
  //     }
  //   },
  //   [isAnimating, cameraFocusSection]
  // )

  // const handleAnimationComplete = useCallback(() => {
  //   setIsAnimating(false)
  // }, [])

  // useEffect(() => {
  //   if (selectedSection && !isAnimating) {
  //     setInfoBoxVisible(true)
  //   } else {
  //     setInfoBoxVisible(false)
  //   }
  // }, [selectedSection, isAnimating])

  // const handleCloseInfoBox = () => {
  //   setSelectedSection(null)
  //   setIsAnimating(true)
  //   setCameraFocusSection(null)
  // }

  return (
    <main ref={containerRef} className={styles.main}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Relocation Availability</h1>
          <p className={styles.subtitle}>Currently based in Malaysia. Open to opportunities worldwide.</p>
        </div>
      </div>
      <div className={styles.sceneContainer}>
        <Suspense fallback={null}>
          <Scene
            ref={experienceRef}
            eventSource={containerRef}
            setControls={setControls}
            resetTrigger={resetTrigger}
            controls={controls}
            // onMarkerClick={handleMarkerClick}
            // selectedLocation={selectedLocation}
            //
            // onMarkerClick={handleMarkerClick} //
            // cameraFocusSection={cameraFocusSection}
            // setCameraFocusSection={setCameraFocusSection}
            // onAnimationComplete={handleAnimationComplete}
            // isAnimating={isAnimating}
            // onLoaded={() => setIsSceneLoaded(true)}
          />
        </Suspense>
      </div>

      <button className={styles.resetButton} onClick={handleResetView}>
        Reset View
      </button>

      {/* <InfoPanel
        locations={locations} //
        isOpen={isPanelOpen}
        onToggle={handleTogglePanel}
        isSceneLoaded={isSceneLoaded}
      /> */}
      {/* {selectedLocation && (
        <InfoBox
          selectedSection={selectedLocation.name} //
          onClose={handleCloseInfoBox}
        />
      )} */}
      {/* <AnimatePresence>
        {isInfoBoxVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }} //
            exit={{ opacity: 0, scale: 0.95 }} //
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />
          </motion.div>
        )}
      </AnimatePresence> */}
      {/* {isInfoBoxVisible && (
        <div style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)', zIndex: 10 }}>
          <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />
        </div>
      )} */}
      <CornerLink href="/dev-history" position="bottom-left" label="Timeline" />
      <CornerLink href="/finale" position="bottom-right" label="Finale" onNavigateStart={grantPermission} />
    </main>
  )
}
