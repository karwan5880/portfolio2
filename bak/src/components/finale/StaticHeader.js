'use client'

import styles from './finale.module.css'

const initialLinks = [
  { content: '[ GitHub ]', href: 'https://github.com/karwan5880/portfolio2' },
  { content: '[ LinkedIn ]', href: 'https://www.linkedin.com/in/karwanleong' },
]

export function StaticHeader({ pageState, onTypingComplete }) {
  // Simple booleans derived from the pageState prop.
  const isScrolledUp = pageState === 'SCROLLING'
  const areLinksVisible = pageState === 'STATIC' || pageState === 'SCROLLING'

  return (
    <div className={`${styles.staticContainer} ${isScrolledUp ? styles.scrollingUp : ''}`}>
      {pageState === 'IDLE' && (
        <div className={styles.idlePrompt}>
          <span className={styles.blinkingCursor}></span>
        </div>
      )}

      {(pageState === 'TYPING' || areLinksVisible) && (
        <div className={styles.typingContainer}>
          <div className={styles.finalMessageContainer}>
            {/* The typing animation is active ONLY when state is 'TYPING' */}
            <span className={`${styles.finalMessage} ${pageState === 'TYPING' ? styles.active : ''}`} onAnimationEnd={onTypingComplete}>
              {`> Status: Still building.`}
            </span>
          </div>
          <div className={`${styles.linksContainer} ${areLinksVisible ? styles.visible : ''}`}>
            {initialLinks.map((item, index) => (
              <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                {item.content}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
