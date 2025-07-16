'use client'

import { Html, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import './page.css'

// Utility function from before
const remap = (value, low1, high1, low2, high2) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1)
}

export function Marker({
  name, //
  position,
  onClick,
  // isAnimating,
  // isSelected,
}) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef()
  const htmlRef = useRef()
  const glowRef = useRef()
  const rippleRef = useRef()
  const { camera } = useThree()

  const glowTexture = useTexture('/textures/glow.svg')
  // const glowTexture = useTexture('/textures/glow.png')

  const activeRippleRef = useRef()

  const markerColor = useMemo(() => new THREE.Color(), [])
  const initialColor = '#a770ef'
  const highlightColor = '#ffdd00'

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'pointer' : 'auto'
  }, [isHovered])

  // useEffect(() => {
  //   const targetColor = isSelected || isHovered ? highlightColor : initialColor
  //   gsap.to(markerColor, {
  //     r: new THREE.Color(targetColor).r,
  //     g: new THREE.Color(targetColor).g,
  //     b: new THREE.Color(targetColor).b,
  //     duration: 0.4, // A quick but smooth transition
  //     ease: 'power2.out',
  //   })
  // }, [isSelected, isHovered, markerColor])

  useFrame(({ clock }) => {
    if (!groupRef.current || !glowRef.current || !rippleRef.current) return

    const groupWorldPosition = groupRef.current.getWorldPosition(new THREE.Vector3())
    const directionToCamera = camera.position.clone().sub(groupWorldPosition).normalize()
    const planetNormal = groupWorldPosition.clone().normalize()
    const dot = planetNormal.dot(directionToCamera)
    const clampedOpacity = Math.max(0, Math.min(1, Math.pow(dot, 2.0))) // Smoother fade

    // const opacity = remap(dot, 0.2, 0.1, 1.0, 0.0)
    // const clampedOpacity = Math.max(0, Math.min(1, opacity))

    glowRef.current.material.opacity = clampedOpacity
    rippleRef.current.material.opacity = clampedOpacity

    if (htmlRef.current) {
      // htmlRef.current.style.opacity = isHovered || isSelected ? clampedOpacity : 0
      htmlRef.current.style.opacity = isHovered ? clampedOpacity : 0
    }

    // --- Simplified Animations ---
    // The main glow pulse is now only affected by hover
    const scale = isHovered ? 1.2 : 1
    const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1
    glowRef.current.scale.setScalar(scale + pulse)

    // The idle ripple animation is the same
    const rippleElapsedTime = clock.getElapsedTime() % 2
    const rippleScale = rippleElapsedTime * 1.5
    rippleRef.current.material.opacity = (1.0 - rippleElapsedTime / 2) * clampedOpacity
    rippleRef.current.scale.setScalar(rippleScale)

    // The "active" ripple is GONE, as it's no longer needed.

    // const scale = isSelected ? 1.5 : isHovered ? 1.2 : 1
    // const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1
    // glowRef.current.scale.setScalar(scale + pulse)

    // const rippleElapsedTime = clock.getElapsedTime() % 2 //
    // const rippleScale = rippleElapsedTime * 1.5 //
    // const rippleOpacity = 1.0 - rippleElapsedTime / 2 //

    // rippleRef.current.scale.setScalar(rippleScale)
    // rippleRef.current.material.opacity = rippleOpacity * clampedOpacity

    // if (glowRef.current && rippleRef.current && activeRippleRef.current) {
    //   glowRef.current.material.color = markerColor
    //   rippleRef.current.material.color = markerColor
    //   activeRippleRef.current.material.color = markerColor // Add this line
    // }

    // if (isSelected) {
    //   if (activeRippleRef.current) {
    //     activeRippleRef.current.visible = true
    //     const activeTime = clock.getElapsedTime() % 2.5 //
    //     const activeScale = activeTime * 0.5 //
    //     const activeOpacity = Math.sin(activeTime * Math.PI) * 0.5 //

    //     activeRippleRef.current.scale.setScalar(activeScale)
    //     activeRippleRef.current.material.opacity = activeOpacity * clampedOpacity
    //   }
    // } else {
    //   // Hide the active ripple if not selected
    //   if (activeRippleRef.current) {
    //     activeRippleRef.current.visible = false
    //   }
    // }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      lookAt={(0, 0, 0)}
      onClick={(e) => {
        if (glowRef.current.material.opacity < 0.5) return
        // if (isAnimating || glowRef.current.material.opacity < 0.5) return
        console.log(`marker onClick`)
        e.stopPropagation()
        onClick()
      }}
      onPointerEnter={(e) => {
        console.log(`marker onPointerEnter`)
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerLeave={(e) => {
        console.log(`marker onPointerLeave`)
        e.stopPropagation()
        setIsHovered(false)
      }}
    >
      {/* <mesh
        onClick={(e) => {
          console.log(`CLICKED on marker: ${name}`)
          if (isAnimating || glowRef.current.material.opacity < 0.5) return
          e.stopPropagation()
          console.log(`Calling onClick prop for ${name}`)
          onClick(name)
        }}
        onPointerEnter={(e) => {
          e.stopPropagation()
          setIsHovered(true)
        }}
        onPointerLeave={(e) => {
          e.stopPropagation()
          setIsHovered(false)
        }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh> */}
      <sprite ref={glowRef} scale={0.3}>
        <spriteMaterial
          map={glowTexture}
          // color={highlightColor}
          color={isHovered ? '#ffdd00' : '#a770ef'}
          blending={THREE.AdditiveBlending} // This makes it glow nicely
          depthTest={false}
          transparent
        />
      </sprite>

      <sprite ref={rippleRef} scale={0.3}>
        <spriteMaterial
          map={glowTexture} //
          color={isHovered ? '#ffdd00' : '#a770ef'}
          blending={THREE.AdditiveBlending}
          depthTest={false}
          transparent
        />
      </sprite>

      {/* <sprite ref={activeRippleRef} scale={0.3} visible={false}> */}
      <sprite ref={rippleRef} scale={0.3}>
        <spriteMaterial map={glowTexture} color={isHovered ? '#ffdd00' : '#a770ef'} blending={THREE.AdditiveBlending} depthTest={false} transparent />
      </sprite>

      <Html ref={htmlRef} center distanceFactor={10} style={{ transition: 'opacity 0.2s' }}>
        <div className="marker-label">{name}</div>
      </Html>
    </group>
  )
}
