'use client'

import { useMemo } from 'react'

import { useFinaleData } from './FinaleDataProvider'
import styles from './finale.module.css'

// import { useStreamData } from './useStreamData'

// This helper can live here as it's only used by this component.
const SyntaxHighlightedCode = ({ content }) => {
  if (typeof content !== 'string') return null
  const html = content
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/(const|let|class|return|def|fn|public|static|void)/g, '<span class="keyword">$1</span>')
    .replace(/("[^"]*")/g, '<span class="string">$1</span>')
    .replace(/(\/\/.*|\#.*|\/\*.*\*\/)/g, '<span class="comment">$1</span>')
  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}

export function CodeStream({ columns = [] }) {
  const animationClass = col.direction === 'down' ? styles.scrollingDown : styles.scrolling

  return (
    <div className={styles.codeWall}>
      {columns.map((col, index) => (
        <div
          key={index}
          className={`${styles.columnWrapper} ${animationClass} ${col.isDistant ? styles.distant : ''}`}
          style={{
            '--scroll-duration': `${col.speed || 120}s`,
            opacity: col.opacity || 1,
            animationDelay: `-${Math.random() * (col.speed || 120)}s`,
          }}
        >
          <CodeColumn data={col.data} />
        </div>
      ))}
    </div>
  )
}

// export function CodeStream1({ columnSpeeds = [180, 90, 120], opacity = 1, theme, isScrolling }) {
//   const { multiStream } = useFinaleData() // <-- Get the pre-processed data

//   // This component fetches its own 'multiColumn' data.
//   // const multiColumnData = useStreamData(theme, 'multi', isScrolling)
//   // console.log(`multiColumnData`, multiColumnData)
//   // useMemo is used here as a performance optimization. This logic only re-runs
//   // when the actual multiColumnData array changes.
//   const { left, middle, right } = useMemo(() => {
//     const left = multiStream.filter((_, i) => i % 3 === 0)
//     const middle = multiStream.filter((_, i) => i % 3 === 1)
//     const right = multiStream.filter((_, i) => i % 3 === 2)
//     return { left, middle, right }
//   }, [multiStream])

//   if (!isScrolling) {
//     return null
//   }

//   const CodeColumn = ({ data }) => (
//     <div className={styles.codeColumn}>
//       {data.map((snip, i) => (
//         <div key={i} className={styles.codeBlock}>
//           <div className={styles.codeTitle}>{snip.title}</div>
//           <SyntaxHighlightedCode content={snip.code} />
//         </div>
//       ))}
//     </div>
//   )

//   // console.log(`left: `, left.columns)
//   // console.log(`middle: `, middle)
//   // console.log(`right: `, right)

//   return (
//     <div className={styles.codeWall} style={{ opacity: opacity }}>
//       <div className={`${styles.columnWrapper} ${styles.scrolling}`} style={{ '--scroll-duration': `${columnSpeeds[0]}s` }}>
//         <CodeColumn data={left} />
//       </div>
//       <div className={`${styles.columnWrapper} ${styles.scrolling}`} style={{ '--scroll-duration': `${columnSpeeds[1]}s` }}>
//         <CodeColumn data={middle} />
//       </div>
//       <div className={`${styles.columnWrapper} ${styles.scrolling}`} style={{ '--scroll-duration': `${columnSpeeds[2]}s` }}>
//         <CodeColumn data={right} />
//       </div>
//     </div>
//   )
// }
