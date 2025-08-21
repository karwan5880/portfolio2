'use client'

import { motion } from 'framer-motion'

import styles from './InfoPanel.module.css'

// The component now needs to know if the scene has loaded
export default function InfoPanel({ locations, isOpen, onToggle, isSceneLoaded }) {
  const panelVariants = {
    // State 1: In the center of the screen (while loading)
    center: {
      y: '-50%',
      x: '-50%',
      top: '50%',
      bottom: 'auto',
    },
    // State 2: At the bottom of the screen (after loading, when closed)
    bottom: {
      y: 'calc(100% - 60px)',
      x: '-50%',
      top: 'auto',
      bottom: '0%',
    },
    // State 3: Open and visible (when user clicks the handle)
    open: {
      y: '0%',
      x: '-50%',
      top: 'auto',
      bottom: '0%',
    },
  }

  // This function determines the current state
  const getAnimationState = () => {
    if (!isSceneLoaded) return 'center'
    return isOpen ? 'open' : 'bottom'
  }

  return (
    <motion.div
      className={styles.infoPanel}
      variants={panelVariants}
      // Start in the center
      initial="center"
      // Animate to the correct state based on our logic
      animate={getAnimationState()}
      transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 1.2 }}
    >
      <div className={styles.header} onClick={onToggle}>
        <h3>Relocation Availability</h3>
        <div className={styles.dragHandle}></div>
      </div>
      <div className={styles.content}>
        <ul>
          {locations.map((loc) => (
            <li key={loc.name}>
              <strong>{loc.name}</strong> - <span>{loc.subtitle}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
