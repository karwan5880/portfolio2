'use client'

import dynamic from 'next/dynamic'

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
  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000' }}>
      {/* <GpgpuBoidsDemo /> */}
      {/* <DynamicColorDemo /> */}
      {/* <ParticleChainDemo /> */}
      {/* <DroneShowDemo /> */}
      <NewBeginningDemo />
    </div>
  )
}
