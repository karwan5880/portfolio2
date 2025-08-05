'use client'

import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useCallback, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'
import InfoBox from '@/components/InfoBox'

import styles from './page.module.css'
import { locations } from '@/data/locations'
import { useAudioStore } from '@/stores/audioStore'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  // loading: () => <p className={styles.loading}>Loading ..</p>,
})

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null)
  const [isInfoBoxVisible, setInfoBoxVisible] = useState(false)
  const grantPermission = useAudioStore((state) => state.grantPermission)

  const [cameraFocusSection, setCameraFocusSection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleMarkerClick = useCallback(
    (sectionName) => {
      if (isAnimating) return

      if (cameraFocusSection === sectionName) {
        setSelectedSection(null) //
      } else {
        setIsAnimating(true) //
        setCameraFocusSection(sectionName) //
        setSelectedSection(sectionName) //
        setInfoBoxVisible(false) //
      }
    },
    [isAnimating, cameraFocusSection]
  )

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false) // Unlock interactions

    if (selectedSection) {
      setInfoBoxVisible(true)
    }
  }, [selectedSection])

  const handleCloseInfoBox = () => {
    setSelectedSection(null)
    setInfoBoxVisible(false)
  }

  return (
    <main className={styles.main}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Relocation Availability</h1>
          <p className={styles.subtitle}>Currently based in Malaysia. Open to opportunities worldwide.</p>
        </div>
        {/* <div className={styles.fallbackNav}>
          <h2>Locations</h2>
          <ul>
            {locations.map((loc) => (
              <li key={loc.name}>
                <button onClick={() => handleMarkerClick(loc.name)} className={cameraFocusSection === loc.name ? styles.activeLocation : ''}>
                  {loc.name}
                </button>{' '}
              </li>
            ))}
          </ul>
        </div> */}
      </div>
      <Scene
        onMarkerClick={handleMarkerClick} //
        cameraFocusSection={cameraFocusSection}
        setCameraFocusSection={setCameraFocusSection}
        onAnimationComplete={handleAnimationComplete}
        isAnimating={isAnimating}
      />

      <AnimatePresence>
        {isInfoBoxVisible && (
          <motion.div
            // These props control the animation
            initial={{ opacity: 0, scale: 0.95 }} // Start transparent and slightly smaller
            animate={{ opacity: 1, scale: 1 }} // Animate to fully visible and normal size
            exit={{ opacity: 0, scale: 0.95 }} // Animate out
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            // Apply positioning styles here
            style={{ position: 'absolute', top: '50%', right: '3rem', transform: 'translateY(-50%)', zIndex: 10 }}
          >
            <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* {isInfoBoxVisible && <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />} */}
      <CornerLink href="/dev-history" position="bottom-left" label="Timeline" />
      <CornerLink href="/finale" position="bottom-right" label="Finale" onNavigateStart={grantPermission} />
    </main>
  )
}
