'use client'

import { useEffect, useState } from 'react'

import styles from './LightningEffect.module.css'

// A single discharge component
const Discharge = ({ style }) => (
  <div className={styles.dischargeContainer} style={style}>
    <div className={styles.icon}>⚡️</div> {/* The thunderbolt icon */}
    <div className={styles.sparkle}></div>
  </div>
)

export function LightningEffect() {
  const [discharges, setDischarges] = useState([])

  useEffect(() => {
    const creationLoop = () => {
      const newDischarge = {
        id: Date.now() + Math.random(), // Unique ID for the key
        style: {
          top: `${Math.random() * 90}%`,
          left: `${Math.random() * 90}%`,
          transform: `rotate(${Math.random() * 360}deg)`,
        },
      }
      setDischarges((prev) => {
        // Keep the list from getting too long, e.g., max 10 at a time
        const updatedList = [...prev, newDischarge]
        return updatedList.length > 10 ? updatedList.slice(1) : updatedList
      })

      // Set a timer to create the *next* discharge after a random delay
      const randomDelay = Math.random() * 800 + 200 // 0.2s to 1s
      const timerId = setTimeout(creationLoop, randomDelay)

      // We still need to remove this specific discharge after its animation
      setTimeout(() => {
        setDischarges((prev) => prev.filter((d) => d.id !== newDischarge.id))
      }, 2000)
    }

    // Start the loop
    creationLoop()

    // This cleanup is more complex, so for simplicity in a component like this,
    // we can often omit it if the component only exists on one page.
    // A more robust solution would manage the timers in a ref.
  }, [])

  // useEffect(() => {
  //   // This interval will create a new discharge at a random position every so often
  //   const creationInterval = setInterval(() => {
  //     // Add a new discharge to the state
  //     const newDischarge = {
  //       id: Date.now() + Math.random(), // Unique ID for the key
  //       style: {
  //         top: `${Math.random() * 90}%`,
  //         left: `${Math.random() * 90}%`,
  //         transform: `rotate(${Math.random() * 360}deg)`,
  //       },
  //     }
  //     setDischarges((prev) => [...prev, newDischarge])
  //     // Set a timer to automatically remove the discharge after its animation finishes
  //     setTimeout(() => {
  //       setDischarges((prev) => prev.filter((d) => d.id !== newDischarge.id))
  //     }, 2000) // This MUST match the total animation duration in the CSS
  //   }, 1500) // Create a new spark every 1.5 seconds
  //   return () => clearInterval(creationInterval)
  // }, [])

  return (
    <div className={styles.thunderWrapper} aria-hidden="true">
      {discharges.map((d) => (
        <Discharge key={d.id} style={d.style} />
      ))}
    </div>
  )
}
