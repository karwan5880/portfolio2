'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { StaticHeader } from '@/components/drone/StaticHeader'

// import { DroneShowDemo } from './DroneShowDemo'
import { NewBeginningDemo } from './NewBeginningDemo'

// import { GpgpuBoidsDemo } from './BoidGpuDemo'
// import { DynamicColorDemo } from './DynamicColorDemo'
// import { GpgpuBoidsDemo } from './GpgpuBoidsDemo'
// import { ParticleChainDemo } from './ParticleChainDemo'

// const GpgpuBoidsDemo = dynamic(() => import('./GpgpuBoidsDemo').then((mod) => mod.GpgpuBoidsDemo), {
//   ssr: false,
// })

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
      {/* <GpgpuBoidsDemo /> */}
      {/* <DynamicColorDemo /> */}
      {/* <ParticleChainDemo /> */}
      {/* <DroneShowDemo /> */}
      <NewBeginningDemo />
      {/* <StaticHeader pageState={pageState} onTypingComplete={() => setPageState('SCROLLING')} /> */}
    </div>
  )
}
