'use client'

import { useEffect, useState } from 'react'

import styles from './SkipLinks.module.css'
import { useTheme } from '@/contexts/ThemeContext'
import { getAccessibleColors, getSkipLinkAttributes, handleKeyboardNavigation } from '@/utils/accessibility'

/**
 * Skip Links component for accessibility
 * Provides keyboard users with quick navigation to main content areas
 */
export const SkipLinks = ({ sections = [], onSkipToSection }) => {
  const { currentTheme } = useTheme()
  const [isVisible, setIsVisible] = useState(false)
  const accessibleColors = getAccessibleColors(currentTheme)

  // Show skip links when Tab is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Tab') {
        setIsVisible(true)
      }
    }

    const handleClick = () => {
      setIsVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('click', handleClick)
    }
  }, [])

  const handleSkipClick = (sectionId, event) => {
    event.preventDefault()
    setIsVisible(false)

    if (onSkipToSection) {
      onSkipToSection(sectionId)
    } else {
      // Fallback: scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        element.focus({ preventScroll: true })
      }
    }
  }

  const skipLinkStyle = {
    '--focus-color': accessibleColors.focus,
    '--bg-color': accessibleColors.background,
    '--text-color': accessibleColors.text,
  }

  return (
    <div className={`${styles.skipLinks} ${isVisible ? styles.visible : ''}`} style={skipLinkStyle} role="navigation" aria-label="Skip navigation links">
      <div className={styles.skipLinksContainer}>
        {/* Skip to main content */}
        <a {...getSkipLinkAttributes('main', 'Skip to main content')} className={styles.skipLink} onClick={(e) => handleSkipClick('main', e)} onKeyDown={(e) => handleKeyboardNavigation(e, () => handleSkipClick('main', e))}>
          Skip to main content
        </a>

        {/* Skip to navigation */}
        <a
          {...getSkipLinkAttributes('navigation', 'Skip to navigation')}
          className={styles.skipLink}
          onClick={(e) => {
            e.preventDefault()
            setIsVisible(false)
            const navElement = document.querySelector('[role="navigation"]') || document.querySelector('.navigationDots') || document.querySelector('.mobileNavigation')
            if (navElement) {
              navElement.focus()
            }
          }}
          onKeyDown={(e) =>
            handleKeyboardNavigation(e, () => {
              const navElement = document.querySelector('[role="navigation"]')
              if (navElement) navElement.focus()
            })
          }
        >
          Skip to navigation
        </a>

        {/* Skip links for each section */}
        {sections.map((section) => (
          <a key={section.id} {...getSkipLinkAttributes(section.id, `Skip to ${section.title} section`)} className={styles.skipLink} onClick={(e) => handleSkipClick(section.id, e)} onKeyDown={(e) => handleKeyboardNavigation(e, () => handleSkipClick(section.id, e))}>
            Skip to {section.title}
          </a>
        ))}

        {/* Skip to theme selector */}
        <a
          {...getSkipLinkAttributes('theme-selector', 'Skip to theme selector')}
          className={styles.skipLink}
          onClick={(e) => {
            e.preventDefault()
            setIsVisible(false)
            const themeSelector = document.querySelector('.themeSelector button') || document.querySelector('[aria-label*="theme"]')
            if (themeSelector) {
              themeSelector.focus()
            }
          }}
          onKeyDown={(e) =>
            handleKeyboardNavigation(e, () => {
              const themeSelector = document.querySelector('.themeSelector button')
              if (themeSelector) themeSelector.focus()
            })
          }
        >
          Skip to theme selector
        </a>
      </div>
    </div>
  )
}
