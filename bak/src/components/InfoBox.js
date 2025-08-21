'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import styles from './InfoBox.module.css'
import { locations } from '@/data/locations'

export default function InfoBox({ selectedSection, onClose }) {
  // console.log(`--- InfoBox Render ---`)
  // console.log(`Received selectedSection prop:`, selectedSection)

  const locationData = locations.find((loc) => loc.name === selectedSection)
  // console.log(`Found locationData:`, locationData)
  if (!locationData) {
    return null
  }
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  const { name, subtitle, photos = [] } = locationData

  // console.log(`Found name ..:`, name, subtitle, photos)
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [selectedSection])

  if (!locationData) {
    return null
  }
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
  }

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length)
  }

  const handleDotClick = (index) => {
    setCurrentPhotoIndex(index)
  }
  return (
    <div className={styles.infoBox}>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>

      <div className={styles.infoBoxHeader}>
        <h2>{name}</h2>
        <p>{subtitle}</p>
      </div>

      <div className={styles.slideshowContainer}>
        <AnimatePresence initial={false}>{photos.length > 0 && <motion.img key={currentPhotoIndex} src={photos[currentPhotoIndex]} alt={`${name} photo ${currentPhotoIndex + 1}`} className={styles.slideshowImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: 'easeInOut' }} />}</AnimatePresence>

        {photos.length > 1 && (
          <>
            <button onClick={handlePrevPhoto} className={`${styles.slideArrow} ${styles.prev}`}>
              ‹
            </button>
            <button onClick={handleNextPhoto} className={`${styles.slideArrow} ${styles.next}`}>
              ›
            </button>
            <div className={styles.slideDots}>
              {photos.map((_, index) => (
                <span key={index} className={`${styles.dot} ${index === currentPhotoIndex ? styles.active : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
