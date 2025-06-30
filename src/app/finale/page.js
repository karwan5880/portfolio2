'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'

import { DogEar } from '@/components/DogEar'

import styles from './finale.module.css'
import { finaleStream } from '@/data/finale-stream-data'

const masterPlaylist = [
  '/sound/megamanx5.mp3',
  '/sound/yangguxian.mp3',
  '/sound/cangzoucheng.mp3',
  '/sound/harvestmoon.mp3',
]

const singleLineStream = finaleStream.filter((item) => item.type !== 'multi-column')
const multiColumnStream = finaleStream.filter((item) => item.type === 'multi-column')

const StreamItem = ({ item }) => {
  // Helper for syntax highlighting, now safely inside this component
  const createHighlightedHTML = (content) => {
    const html = content
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(
        /(const|let|class|return|def|function|async|await|if|else|public|static|void|FROM|WORKDIR|COPY|RUN|CMD|SELECT|JOIN|FROM|WHERE)/g,
        '<span class="keyword">$1</span>'
      )
      .replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="string">$1</span>')
      .replace(/(\/\/.*|\#.*|\/\*[\s\S]*?\*\/)/g, '<span class="comment">$1</span>')
    return { __html: html }
  }

  const handleSecretClick = () => {
    console.log('SECRET FOUND!')
    // Here, you would trigger the navigation or animation
    // to your secret 3D scene.
    // For now, we'll just log it.
  }

  // Render logic based on the item's type
  if (item.type === 'multi-column') {
    return (
      <div className={`${styles.streamItem} ${styles.multiColumnContainer}`}>
        {item.columns.map((col, i) => (
          <div key={i} className={styles.codeColumn}>
            <div className={styles.codeTitle}>{col.title}</div>
            <pre dangerouslySetInnerHTML={createHighlightedHTML(col.code)} />
          </div>
        ))}
      </div>
    )
  }

  // Default rendering for all single-line types
  return (
    <div
      className={`${styles.streamItem} ${styles[item.type]} ${item.secret ? styles.secret : ''}`}
      onClick={item.secret ? handleSecretClick : null}
    >
      <span>{item.content}</span>
    </div>
  )
}

// const SyntaxHighlightedCode = ({ content }) => {
//   const html = content
//     .replace(/</g, '<')
//     .replace(/>/g, '>')
//     .replace(/(const|let|class|return|def)/g, '<span class="keyword">$1</span>')
//     .replace(/("[^"]*")/g, '<span class="string">$1</span>')
//   return <pre dangerouslySetInnerHTML={{ __html: html }} />
// }

const finalMessage = '> Status: Still building.'
const initialLinks = [
  { type: 'link', content: '[ GitHub ]', href: 'https://github.com/karwan5880/portfolio2' },
  { type: 'link', content: '[ LinkedIn ]', href: 'https://www.linkedin.com/in/karwanleong' },
]

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export default function FinalePage() {
  const [pageState, setPageState] = useState('TYPING') // TYPING -> STATIC -> SCROLLING
  const [typedText, setTypedText] = useState('')
  const [streamItems, setStreamItems] = useState([])
  const [isExiting, setIsExiting] = useState(false)
  const dataIndex = useRef(0)

  const [text, setText] = useState('')
  const [showLinks, setShowLinks] = useState(false)

  const [isScrolling, setIsScrolling] = useState(false)

  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef(null)

  const shuffledStream = useMemo(() => shuffleArray([...finaleStream]), [])
  const [activeTheme, setActiveTheme] = useState(null) // 'snow', 'thunder', or null

  const initialItems = [
    { type: 'thought', content: '> Status: Still building.' },
    { type: 'link', content: '[ GitHub ]', href: 'https://github.com/karwan5880' },
    { type: 'link', content: '[ LinkedIn ]', href: 'https://www.linkedin.com/in/karwanleong' },
  ]

  useEffect(() => {
    let audio
    const initialPlayTimer = setTimeout(() => {
      audio = new Audio(masterPlaylist[currentSongIndex])
      if (masterPlaylist[currentSongIndex].includes('harvestmoon.mp3')) {
        setActiveTheme('snow')
      } else if (masterPlaylist[currentSongIndex].includes('cangzoucheng.mp3')) {
        setActiveTheme('thunder')
      } else {
        setActiveTheme(null)
      }
      audioRef.current = audio
      audio.volume = 0.2
      audio.play()
      const handleSongEnd = () => {
        setCurrentSongIndex((prevIndex) => {
          if (prevIndex === 0) {
            return 1
          } else {
            const nextIndex = prevIndex + 1
            return nextIndex >= masterPlaylist.length ? 1 : nextIndex
          }
        })
      }
      audio.addEventListener('ended', handleSongEnd)
    }, 4000)
    return () => {
      clearTimeout(initialPlayTimer)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [currentSongIndex])

  // useEffect(() => {
  //   if (pageState === 'SCROLLING' && !audioRef.current) {
  //     const audio = new Audio(playlist[currentSongIndex])
  //     audioRef.current = audio
  //     const playNextSong = () => {
  //       setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length)
  //     }
  //     audio.addEventListener('ended', playNextSong)
  //     audio.play()
  //     return () => {
  //       audio.removeEventListener('ended', playNextSong)
  //       audio.pause()
  //     }
  //   }
  // }, [pageState, currentSongIndex])
  // useEffect(() => {
  //   const audioTimeout = setTimeout(() => {
  //     try {
  //       const audio = new Audio('/sound/megamanx5.mp3')
  //       audio.volume = 0.5
  //       audio.play()
  //     } catch (error) {
  //       console.error('Failed to play finale sound:', error)
  //     }
  //   }, 4000)
  //   return () => clearTimeout(audioTimeout)
  // }, [])

  // Effect for the Escape Hatch
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsExiting(true)
        // Optional: navigate away after fade-out
        // setTimeout(() => window.location.href = '/', 1000);
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // --- Act 1: Typing Animation ---
    if (pageState === 'TYPING') {
      const typeText = (index = 0) => {
        if (index < finalMessage.length) {
          setTypedText(finalMessage.substring(0, index + 1))
          setTimeout(() => typeText(index + 1), 100)
        } else {
          // Typing finished, move to next state
          setTimeout(() => setPageState('STATIC'), 500)
        }
      }
      const startTypingTimer = setTimeout(typeText, 1500) // Initial delay
      return () => clearTimeout(startTypingTimer)
    }

    // --- Act 2: Static Contemplation ---
    if (pageState === 'STATIC') {
      const startScrollingTimer = setTimeout(() => {
        setPageState('SCROLLING')
      }, 15000) // deciding between 15s wait or 16s wait so that the effect to be more EPIC!
      return () => clearTimeout(startScrollingTimer)
    }

    // --- Act 3: Scrolling Stream ---
    if (pageState === 'SCROLLING') {
      const streamInterval = setInterval(() => {
        setStreamItems((prev) => [...prev, finaleStream[dataIndex.current]])
        dataIndex.current = (dataIndex.current + 1) % finaleStream.length
      }, 2500)
      return () => clearInterval(streamInterval)
    }
  }, [pageState])

  useEffect(() => {
    if (!isScrolling) return

    const streamInterval = setInterval(() => {
      // We now pull from the shuffled array instead of the original
      setStreamItems((prev) => [...prev, shuffledStream[dataIndex.current]])
      dataIndex.current = (dataIndex.current + 1) % shuffledStream.length
    }, 2500)

    return () => clearInterval(streamInterval)
  }, [isScrolling, shuffledStream])

  useEffect(() => {
    if (!isScrolling) return

    // This function will fetch data and inject it into the stream
    const fetchAndInjectData = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/karwan5880/portfolio2')
        if (!response.ok) return
        const repoData = await response.json()
        const lastPush = new Date(repoData.pushed_at).toLocaleString()

        const liveDataItem = {
          type: 'live-data', // A new type for special styling
          content: `[LIVE] Last commit to this repository: ${lastPush}`,
        }
        console.log('live data: ', liveDataItem)

        // Inject the live data into the stream
        setStreamItems((prev) => [...prev, liveDataItem])
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error)
      }
    }

    // Fetch data every 30 seconds to keep it fresh
    const fetchDataInterval = setInterval(fetchAndInjectData, 30000)

    return () => clearInterval(fetchDataInterval)
  }, [isScrolling])

  return (
    <div className={`${styles.finaleWrapper} ${isExiting ? styles.exiting : ''}`}>
      {activeTheme === 'snow' && <SnowEffect />}
      {activeTheme === 'thunder' && <ThunderEffect />}
      <div className={styles.staticContainer}>
        <p className={`${styles.streamItem} ${styles.finalMessage}`}>
          {typedText}
          {/* THE FIX: This condition ensures it disappears ONLY when exiting */}
          {!isExiting && <span className={styles.blinkingCursor}></span>}
        </p>

        {/* <p className={`${styles.streamItem} ${styles.finalMessage}`}>
          {typedText} */}
        {/* {(pageState === 'TYPING' || pageState === 'STATIC') && <span className={styles.blinkingCursor}></span>} */}
        {/* <span
            className={`${styles.blinkingCursor} ${pageState === 'TYPING' || pageState === 'STATIC' ? styles.visible : ''}`}
          ></span>
        </p> */}

        <div className={`${styles.linksContainer} ${pageState !== 'TYPING' ? styles.visible : ''}`}>
          {initialLinks.map((item, index) => (
            <a key={index} href={item.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {item.content}
            </a>
          ))}
        </div>
      </div>

      <div className={`${styles.scrollContainer} ${pageState === 'SCROLLING' ? styles.scrolling : ''}`}>
        {/* --- STREAM 1: The Multi-Column Code Blocks --- */}
        <div className={styles.multiColumnMarquee}>
          <div className={styles.streamContent}>
            {multiColumnStream.map((item, index) => (
              <StreamItem key={index} item={item} />
            ))}
          </div>
          <div className={styles.streamContent} aria-hidden="true">
            {multiColumnStream.map((item, index) => (
              <StreamItem key={index} item={item} />
            ))}
          </div>
        </div>

        {/* --- STREAM 2: The Single-Line Thoughts & Comments --- */}
        <div className={styles.singleLineMarquee}>
          <div className={styles.streamContent}>
            {singleLineStream.map((item, index) => (
              <StreamItem key={index} item={item} />
            ))}
          </div>
          <div className={styles.streamContent} aria-hidden="true">
            {singleLineStream.map((item, index) => (
              <StreamItem key={index} item={item} />
            ))}
          </div>
        </div>
      </div>
      <DogEar href="/dev-history" position="bottom-left" aria-label="Return to dev-history" />
      <DogEar href="/" position="bottom-right" aria-label="View main page" />
    </div>
  )

  // return (
  //   <div className={`${styles.finaleWrapper} ${isExiting ? styles.exiting : ''}`}>
  //     <div className={`${styles.streamContainer} ${pageState === 'SCROLLING' ? styles.scrolling : ''}`}>
  //       {/* --- The Header Section (visible in all states, but only moves when scrolling) --- */}
  //       <div className={styles.staticHeader}>
  //         <p className={`${styles.streamItem} ${styles.finalMessage}`}>
  //           {typedText}
  //           {pageState === 'TYPING' && <span className={styles.blinkingCursor}></span>}
  //         </p>
  //         <div className={`${styles.linksContainer} ${pageState !== 'TYPING' ? styles.visible : ''}`}>
  //           {initialLinks.map((item, index) => (
  //             <a
  //               key={index}
  //               href={item.href}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className={`${styles.streamItem} ${styles.link}`}
  //             >
  //               {item.content}
  //             </a>
  //           ))}
  //         </div>
  //       </div>
  //       {/* --- The Credit Scene (only rendered when scrolling starts) --- */}
  //       {pageState === 'SCROLLING' &&
  //         streamItems.map((item, index) => (
  //           <div key={index} className={`${styles.streamItem} ${styles[item.type]}`}>
  //             {item.type === 'multi-column' ? (
  //               <div className={styles.multiColumnContainer}>
  //                 {item.columns.map((col, i) => (
  //                   <div key={i} className={styles.codeColumn}>
  //                     <SyntaxHighlightedCode content={col} />
  //                   </div>
  //                 ))}
  //               </div>
  //             ) : (
  //               <span>{item.content}</span>
  //             )}
  //           </div>
  //         ))}
  //     </div>
  //     <DogEar href="/dev-history" position="bottom-left" aria-label="Return to dev-history" />
  //     <DogEar href="/" position="bottom-right" aria-label="View main page" />
  //   </div>
  // )

  // return (
  //   <div className={`${styles.finaleWrapper} ${isExiting ? styles.exiting : ''}`}>
  //     <div className={`${styles.staticContainer} ${isScrolling ? styles.hidden : ''}`}>
  //       {initialItems.map((item, index) => (
  //         <div key={index} className={`${styles.streamItem} ${styles[item.type]}`}>
  //           {item.type === 'link' ? (
  //             <a href={item.href} target="_blank" rel="noopener noreferrer">
  //               {item.content}
  //             </a>
  //           ) : (
  //             <span>{item.content}</span>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //     <div className={`${styles.streamContainer} ${isScrolling ? styles.scrolling : ''}`}>
  //       {initialItems.map((item, index) => (
  //         <div key={index} className={`${styles.streamItem} ${styles[item.type]}`}>
  //           {item.type === 'link' ? (
  //             <a href={item.href} target="_blank" rel="noopener noreferrer">
  //               {item.content}
  //             </a>
  //           ) : (
  //             <span>{item.content}</span>
  //           )}
  //         </div>
  //       ))}
  //       {streamItems.map((item, index) => (
  //         <div key={index + initialItems.length} className={`${styles.streamItem} ${styles[item.type]}`}>
  //           {item.type === 'multi-column' ? (
  //             <div className={styles.multiColumnContainer}>
  //               {item.columns.map((col, i) => (
  //                 <div key={i} className={styles.codeColumn}>
  //                   <SyntaxHighlightedCode content={col} />
  //                 </div>
  //               ))}
  //             </div>
  //           ) : (
  //             <span>{item.content}</span>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //     <div className={styles.escapeHatch}>[ PRESS ESC TO DISCONNECT ]</div>
  //   </div>
  // )
}

// <div className={styles.finaleWrapper}>
//   <div className={styles.content}>
//     <p className={styles.finalText}>
//       {text}
//       {/* Only show the cursor while typing */}
//       {!showLinks && <span className={styles.blinkingCursor}></span>}
//     </p>
//     {showLinks && (
//       <div className={styles.linksContainer}>
//         <a
//           href="https://github.com/karwan5880/portfolio2"
//           target="_blank"
//           rel="noopener noreferrer"
//           className={styles.link}
//         >
//           [View Source on GitHub]
//         </a>
//         <a
//           href="https://www.linkedin.com/in/karwanleong"
//           target="_blank"
//           rel="noopener noreferrer"
//           className={styles.link}
//         >
//           [Connect on LinkedIn]
//         </a>
//       </div>
//     )}
//     {/* <DogEar direction="previous" aria-label="Go to previous page" /> */}
//     {/* <DogEar href="/dossier/applications" position="bottom-left" aria-label="Return to application logs" /> */}
//     <DogEar href="/dev-history" position="bottom-left" aria-label="Return to dev-history" />
//     <DogEar href="/" position="bottom-right" aria-label="View main page" />
//   </div>
// </div>
