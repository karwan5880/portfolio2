'use client'

import React, { useEffect, useRef, useState } from 'react'

import styles from './ScrambledText.module.css'

export function ScrambledText({ targetText }) {
  const [text, setText] = useState(targetText)
  const [hasMounted, setHasMounted] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const scramble = () => {
    let iteration = 0
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    clearInterval(intervalRef.current)

    intervalRef.current = setInterval(() => {
      const newText = targetText
        .split('')
        .map((char, index) => {
          if (index < iteration) return targetText[index]
          if (char === ' ') return ' '
          return letters[Math.floor(Math.random() * 26)]
        })
        .join('')
      setText(newText)
      if (iteration >= targetText.length) {
        clearInterval(intervalRef.current)
      }
      iteration += 1 / 3
    }, 30)
  }

  useEffect(() => {
    if (hasMounted) {
      const timeoutId = setTimeout(scramble, 0)
      return () => clearTimeout(timeoutId)
    }
    return () => clearInterval(intervalRef.current)
  }, [hasMounted])

  return (
    <h1 className={styles.name} onMouseEnter={scramble}>
      {text}
    </h1>
  )
}
