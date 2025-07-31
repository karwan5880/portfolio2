'use client'

import dynamic from 'next/dynamic'
import { Suspense, useRef, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { useAudioStore } from '@/stores/audioStore'

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div>
      <p className={styles.loading}>
        Hover on dots to show tooltip
        <br />
        Mouse scroll to zoom in
      </p>
      {/* <p className={styles.loading}>Mouse scroll to zoom in </p> */}
    </div>
  ),
})

export default function Home() {
  const containerRef = useRef()
  const grantPermission = useAudioStore((state) => state.grantPermission)
  const [controls, setControls] = useState(null)
  const [resetTrigger, setResetTrigger] = useState(0)
  const experienceRef = useRef()

  const handleResetView = () => {
    console.log(`handleResetView`)
    if (experienceRef.current) {
      experienceRef.current.reset()
    }
    console.log(`handleResetView2`)
  }

  return (
    <main ref={containerRef} className={styles.main}>
      <div className={styles.overlay}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Relocation Availability</h1>
          <p className={styles.subtitle}>
            Currently based in <span className={styles.highlight}>Malaysia</span>. Open to opportunities worldwide.
          </p>
        </div>
      </div>
      <div className={styles.sceneContainer}>
        <Suspense fallback={null}>
          <Scene
            ref={experienceRef} //
            eventSource={containerRef}
            setControls={setControls}
            resetTrigger={resetTrigger}
            controls={controls}
          />
        </Suspense>
      </div>
      <button className={styles.resetButton} onClick={handleResetView}>
        Reset View
      </button>
      <CornerLink href="/job-hunt" position="bottom-left" label="Job Hunt" aria-label="Return to job-hunt" />
      {/* <CornerLink href="/applications" position="bottom-left" label="Applications" /> */}
      <CornerLink href="/finale" position="bottom-right" label="Finale" onNavigateStart={grantPermission} />
    </main>
  )
}
