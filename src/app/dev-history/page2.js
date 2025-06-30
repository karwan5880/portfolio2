'use client'

import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { DogEar } from '@/components/DogEar'

import styles from './dev-history.module.css'
import { devHistoryData } from '@/data/dev-history-data'

gsap.registerPlugin(ScrollToPlugin) // Register the plugin

export default function DevHistoryPage() {
  const [lines, setLines] = useState([])
  const nodeRefs = useRef({}) // To store references to the node elements
  const containerRef = useRef() // To get the container's position
  const scrollTween = useRef(null) // <-- Ref to hold our animation

  useEffect(() => {
    document.body.classList.add('dev-history-active')

    // This is our more robust function to start the scroll
    const startScrolling = () => {
      console.log('Attempting to start scroll...')

      // 1. Manually calculate the maximum scroll position
      const scrollHeight = document.documentElement.scrollHeight
      const innerHeight = window.innerHeight
      const maxScroll = scrollHeight - innerHeight

      console.log(`Page scrollHeight: ${scrollHeight}px`)
      console.log(`Window innerHeight: ${innerHeight}px`)
      console.log(`Calculated maxScroll: ${maxScroll}px`)

      // 2. A crucial guard clause: if there's nowhere to scroll, do nothing.
      if (maxScroll <= 0) {
        console.warn('Page is not scrollable. Aborting auto-scroll.')
        return
      }

      // 3. If we get here, the page is scrollable. Start the animation.
      scrollTween.current = gsap.to(window, {
        scrollTo: {
          y: maxScroll, // Use our calculated value instead of "max"
          autoKill: false,
        },
        duration: 25,
        ease: 'none',
      })
      console.log('GSAP scroll tween successfully created.')
    }

    // We give the browser a full second to finish all rendering and layout calculations
    // before we attempt to measure the page and start the scroll.
    const startTimeout = setTimeout(startScrolling, 1000)

    const handleUserScroll = () => {
      if (scrollTween.current && scrollTween.current.isActive()) {
        console.log('User interaction detected, killing scroll tween.')
        scrollTween.current.kill()
      }
    }

    window.addEventListener('wheel', handleUserScroll, { passive: true })
    window.addEventListener('touchstart', handleUserScroll, { passive: true })

    // The cleanup function
    return () => {
      document.body.classList.remove('dev-history-active')

      clearTimeout(startTimeout)
      if (scrollTween.current) {
        scrollTween.current.kill()
      }
      window.removeEventListener('wheel', handleUserScroll)
      window.removeEventListener('touchstart', handleUserScroll)
    }
  }, []) // Still runs only once on mount

  // This effect calculates the line positions after the component has mounted
  useEffect(() => {
    const calculateLines = () => {
      const newLines = []
      const containerRect = containerRef.current.getBoundingClientRect()
      devHistoryData.forEach((sourceNode) => {
        sourceNode.connectsTo.forEach((targetId) => {
          const targetNode = devHistoryData.find((n) => n.id === targetId)
          if (targetNode) {
            const sourceEl = nodeRefs.current[sourceNode.id]
            const targetEl = nodeRefs.current[targetId]
            if (sourceEl && targetEl) {
              // Get the center point of each node relative to the container
              const sourceRect = sourceEl.getBoundingClientRect()
              const targetRect = targetEl.getBoundingClientRect()
              const sourceX = sourceRect.left + sourceRect.width / 2 - containerRect.left
              const sourceY = sourceRect.top + sourceRect.height / 2 - containerRect.top
              const targetX = targetRect.left + targetRect.width / 2 - containerRect.left
              const targetY = targetRect.top + targetRect.height / 2 - containerRect.top
              newLines.push({ id: `${sourceNode.id}-${targetId}`, x1: sourceX, y1: sourceY, x2: targetX, y2: targetY })
            }
          }
        })
      })
      setLines(newLines)
    }
    calculateLines() // Initial calculation
    window.addEventListener('resize', calculateLines) // Recalculate on resize
    return () => window.removeEventListener('resize', calculateLines) // Cleanup
  }, [])

  // // --- Auto-Scroll Logic ---
  // useEffect(() => {
  //   console.log('Auto-scroll effect is attempting to run.') // <-- ADD THIS LINE
  //   // 1. The Animation Itself
  //   scrollTween.current = gsap.to(window, {
  //     scrollTo: {
  //       y: 'max', // Scroll to the very bottom of the page
  //       autoKill: false, // We will handle killing it manually
  //     },
  //     duration: 25, // The journey will take 25 seconds
  //     ease: 'none', // A smooth, linear scroll
  //   })
  //   // 2. The User Interaction Handler
  //   const handleUserScroll = () => {
  //     // If the user scrolls manually, kill the automatic animation
  //     if (scrollTween.current) {
  //       scrollTween.current.kill()
  //     }
  //   }
  //   // 3. Attach Event Listeners
  //   window.addEventListener('wheel', handleUserScroll, { passive: true })
  //   window.addEventListener('touchstart', handleUserScroll, { passive: true })
  //   // 4. The Cleanup Function
  //   return () => {
  //     // Kill the animation if the component unmounts
  //     if (scrollTween.current) {
  //       scrollTween.current.kill()
  //     }
  //     // Remove event listeners to prevent memory leaks
  //     window.removeEventListener('wheel', handleUserScroll)
  //     window.removeEventListener('touchstart', handleUserScroll)
  //   }
  // }, []) // The empty dependency array ensures this runs only once on mount

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <h1 className={styles.pageTitle}>DEV_HISTORY.LOG</h1>

      {/* SVG canvas for drawing the synapse lines */}
      <svg className={styles.svgCanvas}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(138, 43, 226, 0.8)" />
            <stop offset="100%" stopColor="rgba(0, 255, 0, 0.8)" />
          </linearGradient>
        </defs>
        {lines.map((line) => (
          <line key={line.id} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className={styles.synapseLine} />
        ))}
      </svg>

      {/* Render all the project nodes */}
      {devHistoryData.map((node) => (
        <div
          key={node.id}
          ref={(el) => (nodeRefs.current[node.id] = el)}
          className={styles.node}
          style={{ left: node.position.x, top: node.position.y }}
        >
          <div className={styles.year}>{node.year}</div>
          <h3 className={styles.title}>{node.title}</h3>
          <p className={styles.description}>{node.description}</p>
        </div>
      ))}

      {/* <Link href="/dossier/applications" className={styles.dogEar} aria-label="Go to application list"></Link> */}
      {/* <DogEar href="/dossier/applications" aria-label="Go to application list" /> */}
      {/* <DogEar direction="previous" aria-label="Go to previous page" /> */}
      <DogEar href="/dossier" position="bottom-left" aria-label="Return to dossier" />
      <DogEar href="/job-hunt" position="bottom-right" aria-label="View job-hunt" />
    </div>
  )
}
