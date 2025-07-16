import { useEffect, useState } from 'react'

import styles from './LocationModal.module.css'

export function LocationModal({ isOpen, onClose, country }) {
  const [selectedCity, setSelectedCity] = useState(null)

  // When the modal opens with a new country, reset the selected city
  useEffect(() => {
    if (isOpen) {
      setSelectedCity(null)
    }
  }, [isOpen, country])

  if (!country) return null

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.isOpen : ''}`} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.header}>
          <h2>Dossier: {country.name}</h2>
          {selectedCity && (
            <button className={styles.backButton} onClick={() => setSelectedCity(null)}>
              ← Back to City List
            </button>
          )}
        </div>

        {selectedCity ? (
          // View 2: Show the selected city's image
          <div className={styles.imageViewer}>
            <img src={selectedCity.image} alt={`Night view of ${selectedCity.name}`} />
            <div className={styles.imageCaption}>
              <h3>{selectedCity.name}</h3>
              <p>{selectedCity.status}</p>
            </div>
          </div>
        ) : (
          // View 1: Show the list of cities
          <div className={styles.cityList}>
            {country.cities.map((city) => (
              <div key={city.id} className={styles.cityEntry} onClick={() => setSelectedCity(city)}>
                <span>{city.name}</span>
                <span>›</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
