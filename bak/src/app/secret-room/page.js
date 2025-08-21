'use client'

import { useEffect, useState } from 'react'

import styles from './secret.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'

const thankYouMessage =
  "You found it. \n\nThis whole journey—the code, the design, the story—it's all built from a love for creation. The fact that you had the curiosity to look closer and find this hidden place means more than you know. \n\nIt tells me you're not just an observer. You're an explorer. And those are the people who truly change the world. \n\nThank you for seeing it. \n\n- Kar Wan\n"

export default function SecretRoom() {
  useGatekeeper('/finale')
  const [text, setText] = useState('')
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      setText((prev) => prev + thankYouMessage[index])
      index++
      if (index === thankYouMessage.length) {
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <pre className={styles.heart}>
          {`      ███╗   ███╗███████╗██████╗ \n      ████╗ ████║██╔════╝██╔══██╗\n      ██╔████╔██║█████╗  ██████╔╝\n      ██║╚██╔╝██║██╔══╝  ██╔══██╗\n      ██║ ╚═╝ ██║███████╗██║  ██║\n      ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝`}
        </pre>
        <pre className={styles.message}>{text}</pre>
      </div>
    </div>
  )
}
