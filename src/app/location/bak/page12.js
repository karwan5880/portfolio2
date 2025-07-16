'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'
import InfoBox from '@/components/InfoBox'

import styles from './page.module.css'
import { locations } from '@/data/locations'
import { useAudioStore } from '@/stores/audioStore'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
})

export default function Home() {
  const [isInfoBoxVisible, setInfoBoxVisible] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)
  const grantPermission = useAudioStore((state) => state.grantPermission)

  const [cameraFocusSection, setCameraFocusSection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const containerRef = useRef()

  const handleMarkerClick = useCallback(
    (sectionName) => {
      console.log(`handleMarkerClick received: ${sectionName}`)

      if (isAnimating) {
        console.log('Returning because isAnimating is true.')
        return
      }
      // Logic to DESELECT the current marker
      if (cameraFocusSection === sectionName) {
        setCameraFocusSection(null)
        setSelectedSection(null)
        setInfoBoxVisible(false)
      }
      // Logic to SELECT a new marker
      else {
        setIsAnimating(true)
        setCameraFocusSection(sectionName)
        setSelectedSection(sectionName)
        setInfoBoxVisible(false) // Hide old box immediately
      }
      // console.log(`page.js handleMarkerClick1`)
      // setIsAnimating(true)
      // console.log(`page.js handleMarkerClick2`)
      // setCameraFocusSection(sectionName)
      // console.log(`page.js handleMarkerClick3`)
      // setSelectedSection(sectionName)
      // console.log(`page.js handleMarkerClick4`)
      // setInfoBoxVisible(false) // Hide old box immediately
      // console.log(`page.js handleMarkerClick5`)
    },
    [isAnimating, cameraFocusSection]
    // [isAnimating, cameraFocusSection, setSelectedSection, setCameraFocusSection, setIsAnimating, setInfoBoxVisible]
  )

  const handleAnimationComplete = useCallback(() => {
    // console.log(`page.js handleAnimationComplete`)
    // setInfoBoxVisible(true)
    setIsAnimating(false)
    // if (selectedSection) {
    //   setIsAnimating(false)
    //   setInfoBoxVisible(true)
    // } else {
    //   setIsAnimating(false)
    // }
  }, []) // Also added dependencies here for best practice
  // }, [selectedSection]) // Also added dependencies here for best practice
  // }, [selectedSection, setIsAnimating, setInfoBoxVisible]) // Also added dependencies here for best practice

  // --- A NEW useEffect to handle showing the InfoBox ---
  // This is a much more reliable pattern.
  useEffect(() => {
    // Show the infobox IF a section is selected AND the camera is NOT moving.
    if (selectedSection && !isAnimating) {
      setInfoBoxVisible(true)
    } else {
      // In ALL other cases (no selection, or we are animating), HIDE the box.
      setInfoBoxVisible(false)
    }
  }, [selectedSection, isAnimating]) // This runs whenever the selection or animation state changes

  const handleCloseInfoBox = () => {
    // console.log(`page.js handleCloseInfoBox`)
    // setInfoBoxVisible(false)
    setSelectedSection(null)
    setIsAnimating(true)
    setCameraFocusSection(null)
  }

  return (
    <main ref={containerRef} className={styles.main}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Relocation Availability</h1>
          <p className={styles.subtitle}>Currently based in Malaysia. Open to opportunities worldwide.</p>
        </div>
      </div>
      <Suspense fallback={null}>
        <Scene
          eventSource={containerRef}
          onMarkerClick={handleMarkerClick} //
          cameraFocusSection={cameraFocusSection}
          setCameraFocusSection={setCameraFocusSection}
          onAnimationComplete={handleAnimationComplete}
          isAnimating={isAnimating}
        />
      </Suspense>

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

      {isInfoBoxVisible && (
        <div style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)', zIndex: 10 }}>
          <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />
        </div>
      )}
      <CornerLink href="/dev-history" position="bottom-left" label="Timeline" />
      <CornerLink href="/finale" position="bottom-right" label="Finale" onNavigateStart={grantPermission} />
    </main>
  )
}
