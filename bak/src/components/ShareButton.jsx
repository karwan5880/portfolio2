'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

import styles from './ShareButton.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { useURLRouting } from '@/hooks/useURLRouting'

/**
 * Share button component for sharing specific sections
 */
export const ShareButton = ({ sectionId = null, className = '', position = 'bottom-left', includeTheme = true, showLabel = true, isMobile = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const { getShareURL, getMetadata, currentSection } = useURLRouting()
  const { animationsEnabled } = useAnimations()

  const targetSection = sectionId || currentSection
  const metadata = getMetadata(targetSection)

  // Share options
  const shareOptions = [
    {
      id: 'copy',
      name: 'Copy Link',
      icon: '🔗',
      action: async () => {
        const url = getShareURL(targetSection, { includeTheme, includeTimestamp: true })

        try {
          await navigator.clipboard.writeText(url)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }

        setIsOpen(false)
      },
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: '🐦',
      action: () => {
        const url = getShareURL(targetSection, { includeTheme })
        const text = `Check out my ${metadata.title.replace('Portfolio - ', '')} section!`
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        window.open(twitterUrl, '_blank', 'width=550,height=420')
        setIsOpen(false)
      },
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      action: () => {
        const url = getShareURL(targetSection, { includeTheme })
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        window.open(linkedinUrl, '_blank', 'width=550,height=420')
        setIsOpen(false)
      },
    },
    {
      id: 'email',
      name: 'Email',
      icon: '📧',
      action: () => {
        const url = getShareURL(targetSection, { includeTheme })
        const subject = encodeURIComponent(metadata.title)
        const body = encodeURIComponent(`Check out this section of my portfolio: ${url}`)
        const emailUrl = `mailto:?subject=${subject}&body=${body}`
        window.location.href = emailUrl
        setIsOpen(false)
      },
    },
  ]

  // Animation variants
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  }

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: position.includes('bottom') ? 10 : -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: position.includes('bottom') ? 10 : -10,
      transition: { duration: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
  }

  return (
    <div className={`${styles.shareButton} ${styles[position]} ${className}`}>
      {/* Share button */}
      <motion.button className={styles.shareToggle} variants={animationsEnabled ? buttonVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false} whileHover={animationsEnabled ? 'hover' : undefined} whileTap={animationsEnabled ? { scale: 0.95 } : undefined} onClick={() => setIsOpen(!isOpen)} aria-label="Share this section" aria-expanded={isOpen}>
        <span className={styles.shareIcon}>{copied ? '✓' : '📤'}</span>
        {showLabel && <span className={styles.shareLabel}>{copied ? 'Copied!' : 'Share'}</span>}
      </motion.button>

      {/* Share menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className={styles.backdrop} onClick={() => setIsOpen(false)} />

          {/* Share options */}
          <motion.div className={styles.shareMenu} variants={animationsEnabled ? menuVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false} exit={animationsEnabled ? 'exit' : false}>
            <div className={styles.menuHeader}>
              <span>Share {metadata.title.replace('Portfolio - ', '')}</span>
            </div>

            <div className={styles.menuItems}>
              {shareOptions.map((option) => (
                <motion.button key={option.id} className={styles.shareOption} variants={animationsEnabled ? itemVariants : undefined} whileHover={animationsEnabled ? { scale: 1.05, x: 5 } : undefined} whileTap={animationsEnabled ? { scale: 0.95 } : undefined} onClick={option.action}>
                  <span className={styles.optionIcon}>{option.icon}</span>
                  <span className={styles.optionName}>{option.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Current URL preview */}
            <div className={styles.urlPreview}>
              <span className={styles.urlLabel}>URL:</span>
              <span className={styles.urlText}>{getShareURL(targetSection, { includeTheme }).replace(/^https?:\/\//, '')}</span>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
