'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function AsteroidBelt() {
  const instancedMeshRef = useRef()

  const asteroids = useMemo(() => {
    const temp = []
    const count = 1000
    const radiusMin = 6
    const radiusMax = 8
    const height = 0.5
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * (radiusMax - radiusMin) + radiusMin
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * height
      const size = Math.random() * 0.1 + 0.05
      const rotationX = Math.random() * Math.PI * 2
      const rotationY = Math.random() * Math.PI * 2
      const rotationZ = Math.random() * Math.PI * 2
      temp.push({ x, y, z, size, rotationX, rotationY, rotationZ })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    if (instancedMeshRef.current) {
      instancedMeshRef.current.rotation.y += delta * 0.02
    }
  })

  const dummy = useMemo(() => new THREE.Object3D(), [])

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, asteroids.length]}>
      <icosahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color="#555555" roughness={0.8} />
      {asteroids.map((asteroid, i) => {
        dummy.position.set(asteroid.x, asteroid.y, asteroid.z)
        dummy.rotation.set(asteroid.rotationX, asteroid.rotationY, asteroid.rotationZ)
        dummy.scale.set(asteroid.size, asteroid.size, asteroid.size)
        dummy.updateMatrix()
        return <object3D key={i} matrix={dummy.matrix} />
      })}
    </instancedMesh>
  )
}
