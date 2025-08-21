'use client'

import { useEffect, useState } from 'react'

import styles from './post-scene.module.css'

// const messages = ['> Thank you for your time.', '> Your feedback is invaluable.']
const messages = ['if you are still here ', 'can help me fill in this form ', 'to let me know what you think of my portfolio ', 'thank you. ']

const GOOGLE_FORM_URL = 'https://your-google-form-link-here.com'

export default function PostScenePage() {
  const [typedMessages, setTypedMessages] = useState([])
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    setTypedMessages(Array(messages.length).fill(''))
    let charIndex = 0
    let msgIndex = 0

    const type = () => {
      if (msgIndex >= messages.length) {
        setIsTyping(false)
        return
      }

      const currentMessage = messages[msgIndex]
      setTypedMessages((prev) => {
        const newMessages = [...prev]
        newMessages[msgIndex] = currentMessage.substring(0, charIndex + 1)
        return newMessages
      })

      if (charIndex < currentMessage.length - 1) {
        charIndex++
      } else {
        charIndex = 0
        msgIndex++
      }
    }

    const typingInterval = setInterval(type, 80) // Adjust typing speed here

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className={styles.postSceneWrapper}>
      <div className={styles.contentContainer}>
        {typedMessages.map((msg, index) => (
          <span key={index} className={styles.typedText}>
            {msg}
          </span>
        ))}
        {!isTyping && (
          <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
            [ Provide Feedback ]
          </a>
        )}
      </div>
    </div>
  )
}
