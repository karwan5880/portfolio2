'use client'

import { useMemo } from 'react'

import styles from './finale.module.css'

// This is our default renderer for the original single-line stream.
const defaultRenderItem = (item, key) => (
  <div key={key} className={`${styles.streamItem} ${styles[item.type]}`}>
    <span>{item.content}</span>
  </div>
)

export function SingleLineStream({
  data = [],
  speed = 70,
  isEnding = false,
  // We accept a custom renderItem function, but provide a default.
  renderItem = defaultRenderItem,
}) {
  // This logic duplicates the content to create a seamless CSS loop. It's correct.
  const duplicatedData = useMemo(() => {
    if (data.length === 0) return []
    const secondCopy = data.map((item) => ({ ...item, keyPrefix: 'copy-2-' }))
    return [...data, ...secondCopy]
  }, [data])

  return (
    // The main container for a stream. The styles.scrolling class applies the CSS animation.
    <div className={`${styles.singleLineStream} ${styles.scrolling} ${isEnding ? styles.ending : ''}`} style={{ '--scroll-duration': `${speed}s` }}>
      {duplicatedData.map((item, index) => {
        // --- THIS IS THE FIX FOR THE CRASH ---
        // We create a robust key that checks for item.id, then item.title, and finally item.content.
        // This prevents the '.slice of undefined' error because it will always find something to use.
        const key = `${item.keyPrefix || ''}${item.id || item.title || item.content.slice(0, 10)}-${index}`

        // The component will now use the provided renderItem function to display each item.
        return renderItem(item, key)
      })}
    </div>
  )
}
