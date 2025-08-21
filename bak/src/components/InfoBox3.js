'use client'

import { useEffect, useState } from 'react'

import styles from './InfoBox.module.css'
import { locations } from '@/data/locations'

export default function InfoBox({ selectedSection, onClose }) {
  const locationData = locations.find((loc) => loc.name === selectedSection)

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [selectedSection])

  useEffect(() => {
    if (!locationData || locationData.photos.length <= 1) return

    const slideshowInterval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % locationData.photos.length)
    }, 4000)

    return () => clearInterval(slideshowInterval)
  }, [selectedSection, locationData])

  if (!locationData) return null

  return (
    <div className={`${styles.infoBox} ${selectedSection ? styles.visible : ''}`}>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>

      <div className={styles.infoBoxHeader}>
        <h2>{locationData.name}</h2>
        <p>{locationData.subtitle}</p>
      </div>

      <div className={styles.slideshowContainer}>
        {locationData.photos.map((photo, index) => (
          <img key={photo} src={photo} alt={`${locationData.name} photo ${index + 1}`} className={`${styles.slideshowImage} ${index === currentPhotoIndex ? styles.visible : ''}`} />
        ))}
      </div>
    </div>
  )
}
