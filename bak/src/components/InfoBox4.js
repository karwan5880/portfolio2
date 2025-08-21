'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import styles from './InfoBox.module.css'
import { locations } from '@/data/locations'

export default function InfoBox({ selectedSection, onClose }) {
  // Find the location data based on the selected section name

  //const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  console.log(`--- InfoBox Render ---`)
  console.log(`Received selectedSection prop:`, selectedSection)

  const locationData = locations.find((loc) => loc.name === selectedSection)
  console.log(`Found locationData:`, locationData)
  if (!locationData) {
    return null
  }

  // --- STEP 3: Now that we know locationData exists, we can safely run hooks and
  // destructure. ---
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)

  // Destructure with a default value for photos for extra safety.
  const { name, subtitle, photos = [] } = locationData

  console.log(`Found name ..:`, name, subtitle, photos)
  // // This effect safely handles the slideshow functionality
  // useEffect(() => {
  //   // --- Safety Check ---
  //   // If there's no location data, or no photos, or only one photo, do nothing.
  //   if (!locationData || !locationData.photos || locationData.photos.length <= 1) {
  //     return
  //   }
  //   const slideshowInterval = setInterval(() => {
  //     setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % locationData.photos.length)
  //   }, 4000) // Change photo every 4 seconds
  //   // Cleanup function to stop the interval when the component unmounts
  //   return () => clearInterval(slideshowInterval)
  // }, [locationData]) // Re-run this effect only when the location data changes

  // When a new section is selected, reset the photo index to the beginning
  useEffect(() => {
    setCurrentPhotoIndex(0)
  }, [selectedSection])

  // --- Master Safety Check ---
  // If no location data is found for the selected section, render nothing.
  if (!locationData) {
    return null
  }

  // Destructure for cleaner access, providing a default empty array for photos
  //const { name, subtitle, photos = [] } = locationData
  // In components/InfoBox.js
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
        {/* AnimatePresence will manage the fade in/out of the images */}
        <AnimatePresence initial={false}>
          {photos.length > 0 && (
            <motion.img
              // The key is crucial. It tells AnimatePresence that this is a new element.
              key={currentPhotoIndex}
              src={photos[currentPhotoIndex]}
              alt={`${name} photo ${currentPhotoIndex + 1}`}
              className={styles.slideshowImage}
              // Framer Motion animation props
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          )}
        </AnimatePresence>

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
