'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { CornerLink } from '@/components/CornerLink'
import InfoBox from '@/components/InfoBox'

import styles from './page.module.css'
import { useAudioStore } from '@/stores/audioStore'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>,
})

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null)
  const [isInfoBoxVisible, setInfoBoxVisible] = useState(false)
  const grantPermission = useAudioStore((state) => state.grantPermission)

  const handleMarkerClick = (sectionName) => {
    setSelectedSection(sectionName)

    setInfoBoxVisible(false)

    setTimeout(() => {
      setInfoBoxVisible(true)
    }, 1000)
  }

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
      </div>
      <Scene onMarkerClick={handleMarkerClick} selectedSection={selectedSection} />
      {isInfoBoxVisible && <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />}
      <CornerLink href="/dev-history" position="bottom-left" label="Timeline" />
      <CornerLink href="/finale" position="bottom-right" label="Finale" onNavigateStart={grantPermission} />
    </main>
  )
}
