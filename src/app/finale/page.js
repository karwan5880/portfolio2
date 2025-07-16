'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { StaticHeader } from '@/components/drone/StaticHeader'

import { NewBeginningDemo } from './NewBeginningDemo'

export default function FinalePage() {
  const [pageState, setPageState] = useState('IDLE')

  useEffect(() => {
    let timer
    if (pageState === 'IDLE') {
      timer = setTimeout(() => {
        setPageState('TYPING')
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000' }}>
      <NewBeginningDemo />
    </div>
  )
}
