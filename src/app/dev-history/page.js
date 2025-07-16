'use client'

import { Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'

import { CornerLink } from '@/components/CornerLink'
import { DogEar } from '@/components/DogEar'

import styles from './page.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useGatekeeper } from '@/hooks/useGatekeeper'
// We keep the import but won't use it yet. This makes it easy to add back.
import { useAudioStore } from '@/stores/audioStore'

/**
 * A simple R3F component to render a starfield background.
 */
function StarfieldBackground() {
  useFrame((state) => {
    state.camera.position.x = MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.02)
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.02)
  })
  return <Stars count={5000} factor={4} saturation={0} fade speed={1} />
}

/**
 * A component to render a single event on the timeline.
 * It receives the data for one event and which side to display it on.
 */
function TimelineItem({ node, side }) {
  const alignmentClass = side === 'left' ? styles.alignLeft : styles.alignRight
  return (
    <div className={`${styles.timelineItem} ${alignmentClass}`}>
      <div className={styles.timelineDot}></div>
      <div className={styles.timelineContent}>
        <h3>{node.title}</h3>
        <span className={styles.year}>{node.year}</span>
        <p>{node.description}</p>
      </div>
    </div>
  )
}

/**
 * The main page component for the Development History experience.
 */
export default function DevHistoryPage() {
  useGatekeeper('/dev-history')
  const grantPermission = useAudioStore((state) => state.grantPermission)

  return (
    <div className={styles.pageContainer}>
      {/* <div className={styles.wrapper}> */}
      {/* 3D background canvas */}
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
          <StarfieldBackground />
        </Canvas>
      </div>

      {/* 2D timeline content */}
      <main className={styles.scrollWrapper}>
        <div className={styles.content}>
          <div className={styles.intro}>
            <h1>My Development Journey</h1>
            <p>A timeline of key projects and milestones.</p>
          </div>
          <div className={styles.timelineContainer}>
            {devHistoryData.map((node, index) => (
              <TimelineItem
                key={node.id}
                node={node}
                side={index % 2 === 0 ? 'left' : 'right'} // Alternate sides
              />
            ))}
          </div>
        </div>
      </main>

      {/* Corner navigation links */}
      {/* <DogEar href="/applications" position="bottom-left" aria-label="Return to applications" />
      <DogEar href="/finale" position="bottom-right" aria-label="View finale" onNavigateStart={grantPermission} /> */}
      <CornerLink href="/applications" position="bottom-left" label="Applications" aria-label="Return to applications" />
      <CornerLink href="/location" position="bottom-right" label="World" aria-label="Go to finale" onNavigateStart={grantPermission} />
    </div>
  )
}
