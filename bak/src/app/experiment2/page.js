'use client'

// This component needs to be a client component to use state
import dynamic from 'next/dynamic'
import { useState } from 'react'

import InfoBox from '@/components/InfoBox'

import styles from './page.module.css'

// Dynamically import the Scene component with SSR disabled
const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => <p style={{ color: 'white', textAlign: 'center' }}>Loading 3D Scene...</p>,
})

export default function Home() {
  const [selectedSection, setSelectedSection] = useState(null)

  const handleMarkerClick = (sectionName) => {
    setSelectedSection(sectionName)
  }

  const handleCloseInfoBox = () => {
    setSelectedSection(null)
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Relocation Availability</h1>
        <p>Currently based in Malaysia. Open to opportunities worldwide.</p>
      </header>

      <Scene onMarkerClick={handleMarkerClick} />

      <InfoBox selectedSection={selectedSection} onClose={handleCloseInfoBox} />
    </main>
  )
}
