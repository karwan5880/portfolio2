'use client'

import { CameraControls, Environment, OrbitControls, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
// import { useEffect, useReducer, useRef, useState } from 'react'
import * as THREE from 'three'

import { AsteroidBelt } from './AsteroidBelt'
import { Atmosphere } from './Atmosphere'
import { CameraManager } from './CameraManager'
import { CameraRig } from './CameraRig'
import { Marker } from './Marker'
import { PhotorealisticPlanet } from './PhotorealisticPlanet'
import { Pin } from './Pin'
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

// // 2. DEFINE our state "reducer". This is a function that handles all state changes.
// const initialState = {
//   hasInteracted: false,
//   isInitialDelayOver: false,
//   planetRotationSpeed: 0,
// }

// function stateReducer(state, action) {
//   switch (action.type) {
//     case 'START_INTERACTION':
//       return { ...state, hasInteracted: true }
//     case 'END_INTERACTION':
//       return { ...state, hasInteracted: false }
//     case 'INITIAL_DELAY_OVER':
//       return { ...state, isInitialDelayOver: true, planetRotationSpeed: 0.02 }
//     case 'ACCELERATE':
//       return { ...state, planetRotationSpeed: Math.min(state.planetRotationSpeed + 0.005, 1.99) }
//     case 'RESET':
//       return { ...initialState } // Reset everything to the initial state
//     default:
//       return state
//   }
// }

// --- We define our constants outside the component for clarity ---
// Earth's axial tilt is approx 23.5 degrees. We convert it to radians.
const TILT_ANGLE = -23.5 * (Math.PI / 180)
// We create a vector representing the tilted axis of rotation.
const ROTATION_AXIS = new THREE.Vector3(Math.sin(TILT_ANGLE), Math.cos(TILT_ANGLE), 0).normalize()

// export function Experience({
const Experience = React.forwardRef(function Experience(
  {
    lightTracker,
    sunRef,
    setControls,
    resetTrigger,
    controls,
    // selectedLocation,
    // onMarkerClick, //
    // cameraFocusSection,
    // setCameraFocusSection,
    // onAnimationComplete,
    // isAnimating,
    // initialCameraPosition,
    ...props
  },
  ref
) {
  // }) {
  // const cameraControlsRef = useRef()
  // const [isInteracting, setIsInteracting] = useState(false) // Needed for CameraRig
  const [targetPosition, setTargetPosition] = useState(null)
  const [lookAtPosition, setLookAtPosition] = useState(null)
  // const sunInitialAngle = 0
  const sunInitialAngle = Math.PI
  const delayEndTimeRef = useRef(0)
  const solidPlanetRef = useRef()
  const initialRotationSpeed = 0.02
  const controlsRef = useRef()
  const directionalLightRef = useRef()
  const planetGroupRef = useRef()
  const starsRef = useRef()
  const sunPosition = new THREE.Vector3()
  const inactivityTimerRef = useRef()
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isInitialDelayOver, setIsInitialDelayOver] = useState(false)
  const [rotationSpeed, setRotationSpeed] = useState(initialRotationSpeed)
  const [planetRotationSpeed, setPlanetRotationSpeed] = useState(0)
  const initialStarsSpeed = 0.004
  const [starsRotationSpeed, setStarsRotationSpeed] = useState(0)
  const deltaRotation = new THREE.Quaternion()
  const [isResetting, setIsResetting] = useState(false)
  // const [state, dispatch] = useReducer(stateReducer, initialState)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialDelayOver(true)
      setPlanetRotationSpeed(0.92)
      setStarsRotationSpeed(initialStarsSpeed)
    }, 4500)
    // }, 45000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isInitialDelayOver || planetRotationSpeed >= 0.69) {
      return
    }
    const accelerationInterval = setInterval(() => {
      // Use the functional update to safely access the previous speed.
      setPlanetRotationSpeed((prevSpeed) => {
        // Choose an increment. 0.05 is noticeable every second.
        const newSpeed = prevSpeed + 0.05
        // Ensure we don't overshoot the maximum speed.
        return Math.min(newSpeed, 1.99)
      })
      // setPlanetRotationSpeed((prevSpeed) => {
      //   console.log(``)
      //   if (prevSpeed > 1.99) return 2.01
      //   return prevSpeed + 0.005
      // })
      // // Also increment the stars' speed, but by a smaller amount
      // setStarsRotationSpeed((prevSpeed) => prevSpeed + 0.0)
    }, 1000)
    return () => clearInterval(accelerationInterval)
  }, [isInitialDelayOver, planetRotationSpeed])

  // useEffect(() => {
  //   if (isInitialDelayOver) {
  //     const accelerationInterval = setInterval(() => {
  //       setPlanetRotationSpeed((prev) => Math.min(prev + 0.005, 1.99))
  //       setStarsRotationSpeed((prev) => prev + 0.001)
  //     }, 100)
  //     return () => clearInterval(accelerationInterval)
  //   }
  // }, [isInitialDelayOver])

  // useEffect(() => {
  //   // When the component mounts, perform the initial delay
  //   const timer = setTimeout(() => dispatch({ type: 'INITIAL_DELAY_OVER' }), 3000)
  //   return () => clearTimeout(timer)
  // }, []) // Empty array means this runs only once.

  // useEffect(() => {
  //   // The acceleration effect
  //   if (state.isInitialDelayOver && state.planetRotationSpeed < 1.99) {
  //     const interval = setInterval(() => dispatch({ type: 'ACCELERATE' }), 1000)
  //     return () => clearInterval(interval)
  //   }
  // }, [state.isInitialDelayOver, state.planetRotationSpeed])

  // useEffect(() => {
  //   // The reset effect
  //   if (resetTrigger > 0) {
  //     if (controls) controls.reset(true)
  //     if (planetGroupRef.current) planetGroupRef.current.quaternion.set(0, 0, 0, 1)
  //     // We now send ONE single, atomic command to reset the state.
  //     dispatch({ type: 'RESET' })
  //   }
  // }, [resetTrigger, controls])

  // // --- THIS IS THE NEW, UNIFIED RESET LOGIC ---
  // useEffect(() => {
  //   console.log(`experience1`)
  //   // Don't do anything on the initial render (when resetTrigger is 0)
  //   if (resetTrigger === 0) {
  //     console.log(`resetTrigger===0`)
  //     return
  //   }
  //   console.log(`setIsResetting(true)`)
  //   setIsResetting(true)
  //   // 1. Reset the camera using the controls object
  //   console.log(`experience2`)
  //   if (controls) {
  //     console.log(`experience3`)
  //     controls.reset(true) // `true` for smooth animation
  //   }
  //   console.log(`experience4`)
  //   // 2. Reset the planet's rotation
  //   if (planetGroupRef.current) {
  //     console.log(`experience5`)
  //     // We can reset its rotation using a smooth animation with GSAP,
  //     // or snap it instantly. Let's snap it for simplicity.
  //     planetGroupRef.current.quaternion.set(0, 0, 0, 1) // Reset to no rotation
  //     console.log(`experience6`)
  //   }
  //   // // 3. Reset the interaction and delay states to restart the "attract mode"
  //   // console.log(`experience7`)
  //   // setHasInteracted(false)
  //   // console.log(`experience8`)
  //   // setIsInitialDelayOver(false) // This will re-trigger the 3-second delay
  //   // console.log(`experience9`)
  //   // setPlanetRotationSpeed(0) // Stop the rotation immediately
  //   console.log(`experience10`)
  // }, [resetTrigger, controls]) // This effect runs whenever the reset button is clicked

  // // This useEffect now correctly sets the "home" position when focus is null
  // useEffect(() => {
  //   if (cameraFocusSection) {
  //     // This part is for when we re-add clickable markers later
  //   } else {
  //     // WHEN RESETTING: Set the target to our Asia view.
  //     // NOTE: We have to hard-code the position here, which is okay.
  //     // A more advanced version could pass this from Scene.js.
  //     setTargetPosition(new THREE.Vector3(-6.5, 2.5, 5))
  //     setLookAtPosition(new THREE.Vector3(0, 0, 0))
  //   }
  // }, [cameraFocusSection])

  // useEffect(() => {
  //   // Set a timer for 3000 milliseconds (3 seconds)
  //   const timer = setTimeout(() => {
  //     setIsInitialDelayOver(true)
  //     const nowInSeconds = performance.now() / 1000
  //     delayEndTimeRef.current = nowInSeconds
  //     // Set the initial speed once the delay is over
  //     setRotationSpeed(initialRotationSpeed)
  //   }, 20000)
  //   // This is a cleanup function to clear the timer if the component unmounts
  //   return () => clearTimeout(timer)
  // }, []) // The empty dependency array [] ensures this runs only once.

  // // --- NEW useEffect TO HANDLE SPEED ACCELERATION ---
  // useEffect(() => {
  //   // Only start the acceleration interval AFTER the initial delay
  //   if (isInitialDelayOver) {
  //     const accelerationInterval = setInterval(() => {
  //       // Increment the speed by a small amount every 10 seconds
  //       setRotationSpeed((prevSpeed) => prevSpeed + 0.005)
  //     }, 10000) // 10000 milliseconds = 10 seconds
  //     // Cleanup function to clear the interval
  //     return () => clearInterval(accelerationInterval)
  //   }
  // }, [isInitialDelayOver]) // This effect runs when the initial delay is over

  // useEffect(() => {
  //   if (cameraFocusSection) {
  //     const location = locations.find((l) => l.name === cameraFocusSection)
  //     if (location) {
  //       const markerPos = latLonToVector3(location.coords[0], location.coords[1], 2.1)
  //       setTargetPosition(new THREE.Vector3().copy(markerPos).multiplyScalar(2.5))
  //       setLookAtPosition(new THREE.Vector3().copy(markerPos).multiplyScalar(0.5))
  //     }
  //   } else {
  //     setTargetPosition(new THREE.Vector3(0, 2, 7)) //
  //     setLookAtPosition(new THREE.Vector3(0, 0, 0)) //
  //   }
  // }, [cameraFocusSection])

  // 3. THIS IS THE IMPERATIVE HANDLE
  useImperativeHandle(ref, () => ({
    // We are exposing a function named "reset"
    reset: () => {
      console.log('Reset command received inside Experience!')
      // Reset the camera
      if (controlsRef.current) {
        controlsRef.current.reset(true)
      }
      // Reset the planet's rotation
      if (planetGroupRef.current) {
        planetGroupRef.current.quaternion.set(0, 0, 0, 1)
      }
      // Reset the interaction state
      setHasInteracted(false)
    },
  }))

  // The useFrame hook is now much simpler, only handling rotation
  useFrame((state, delta) => {
    if (controlsRef.current) controlsRef.current.update()
    // ... (sun and stars logic) ...
    const time = state.clock.getElapsedTime()
    const sunInitialAngle = Math.PI
    const angle = time * 0.1 + sunInitialAngle
    const orbitRadius = 12
    sunPosition.set(Math.sin(angle) * orbitRadius, 0, Math.cos(angle) * orbitRadius)
    if (sunRef) sunRef.position.copy(sunPosition)
    if (lightTracker) lightTracker.position.copy(sunPosition)
    if (directionalLightRef.current) {
      directionalLightRef.current.position.copy(sunPosition)
      directionalLightRef.current.target.position.set(0, 0, 0)
    }
    // ... (stars logic) ...
    if (starsRef.current) {
      if (isInitialDelayOver) {
        starsRef.current.rotation.y += starsRotationSpeed * delta
        starsRef.current.rotation.x += (starsRotationSpeed / 2) * delta
      }
    }
    if (planetGroupRef.current) {
      if (!hasInteracted) {
        // Simplified rotation logic
        const rotationAmount = 0.02 * delta // A simpler, non-accelerating speed
        deltaRotation.setFromAxisAngle(ROTATION_AXIS, rotationAmount)
        planetGroupRef.current.quaternion.premultiply(deltaRotation)
      }
    }
  })

  // useFrame((state, delta) => {
  //   if (controlsRef.current) {
  //     controlsRef.current.update()
  //   }
  //   const time = state.clock.getElapsedTime()
  //   const sunInitialAngle = Math.PI
  //   const angle = time * 0.1 + sunInitialAngle
  //   const orbitRadius = 12
  //   // // We calculate the vertical amplitude based on the orbit radius and tilt angle.
  //   // const verticalAmplitude = orbitRadius * Math.sin(TILT_ANGLE)
  //   sunPosition.set(
  //     Math.sin(angle) * orbitRadius,
  //     // The Y position is now locked to 0. The sun's orbit is flat.
  //     0,
  //     Math.cos(angle) * orbitRadius
  //     // Math.sin(angle) * orbitRadius,
  //     // // The Y position now follows a cosine wave, creating the seasonal up/down movement.
  //     // Math.cos(angle) * verticalAmplitude,
  //     // Math.cos(angle) * orbitRadius
  //   )
  //   // sunPosition.set(Math.sin(angle) * 12, 2, Math.cos(angle) * 12)
  //   // if (sunRef) sunRef.position.copy(sunPosition)
  //   // if (lightTracker) lightTracker.position.copy(sunPosition)
  //   // // // --- 2. STATIC SUN LOGIC ---
  //   // // // If the delay is over, make the sun move.
  //   // // if (isInitialDelayOver) {
  //   // //   const sunTime = state.clock.elapsedTime - delayEndTimeRef.current
  //   // //   angle = sunTime * 0.1 + sunInitialAngle
  //   // // }
  //   // // const time = state.clock.getElapsedTime()
  //   // // const angle = time * 0.1 + sunInitialAngle
  //   // // sunPosition.set(Math.sin(angle) * 12, 2, Math.cos(angle) * 12)
  //   // // // sunPosition.set(Math.sin(time * 0.1) * 12, 2, Math.cos(time * 0.1) * 12)
  //   if (sunRef) sunRef.position.copy(sunPosition)
  //   if (lightTracker) lightTracker.position.copy(sunPosition)
  //   if (directionalLightRef.current) {
  //     directionalLightRef.current.position.copy(sunPosition)
  //     directionalLightRef.current.target.position.set(0, 0, 0)
  //   }
  //   // Rotate the entire planet system group.
  //   if (planetGroupRef.current) {
  //     // We only perform ANY rotation if the delay is over AND the user has not interacted.
  //     if (state.isInitialDelayOver && !state.hasInteracted) {
  //       // Calculate the small rotation for this frame.
  //       const rotationAmount = state.planetRotationSpeed * delta
  //       // Set our delta quaternion to rotate around our custom tilted axis.
  //       deltaRotation.setFromAxisAngle(ROTATION_AXIS, rotationAmount)
  //       // Multiply the planet's current rotation by this small delta rotation.
  //       // `premultiply` ensures the rotation happens in the object's local space.
  //       planetGroupRef.current.quaternion.premultiply(deltaRotation)
  //       // // Increment the rotation based on the current speed and frame delta
  //       // // This ensures smooth acceleration.
  //       // planetGroupRef.current.rotation.y += rotationSpeed * delta
  //       // // // ...start spinning the planet.
  //       // // // We subtract the delay end time to start the rotation from 0.
  //       // // const rotationTime = state.clock.elapsedTime - delayEndTimeRef.current
  //       // // planetGroupRef.current.rotation.y = rotationTime * 0.92
  //     }
  //     // planetGroupRef.current.rotation.y = time * 0.02
  //   }
  //   // // --- BRING BACK THE CAMERA ANIMATION LOGIC ---
  //   // if (isAnimating && targetPosition && lookAtPosition && controlsRef.current) {
  //   //   const camera = state.camera
  //   //   const controls = controlsRef.current
  //   //   const lerpFactor = Math.min(delta * 1.5, 1)
  //   //   camera.position.lerp(targetPosition, lerpFactor)
  //   //   controls.target.lerp(lookAtPosition, lerpFactor)
  //   //   const distanceToTarget = camera.position.distanceTo(targetPosition)
  //   //   if (distanceToTarget < 0.05) {
  //   //     camera.position.copy(targetPosition)
  //   //     controls.target.copy(lookAtPosition)
  //   //     if (onAnimationComplete) {
  //   //       onAnimationComplete()
  //   //     }
  //   //   }
  //   // }
  //   // // if (isAnimating && targetPosition && lookAtPosition && controlsRef.current) {
  //   // //   const camera = state.camera
  //   // //   const controls = controlsRef.current
  //   // //   const lerpFactor = Math.min(delta * 1.5, 1)
  //   // //   camera.position.lerp(targetPosition, lerpFactor)
  //   // //   controls.target.lerp(lookAtPosition, lerpFactor)
  //   // //   const distanceToTarget = camera.position.distanceTo(targetPosition)
  //   // //   if (distanceToTarget < 0.05) {
  //   // //     camera.position.copy(targetPosition)
  //   // //     controls.target.copy(lookAtPosition)
  //   // //     if (onAnimationComplete) {
  //   // //       onAnimationComplete()
  //   // //     }
  //   // //   }
  //   // // }
  //   if (starsRef.current) {
  //     if (isInitialDelayOver) {
  //       starsRef.current.rotation.y += starsRotationSpeed * delta
  //       starsRef.current.rotation.x += (starsRotationSpeed / 2) * delta
  //     }
  //   }
  // })

  // const controlsCallbackRef = (instance) => {
  //   if (instance) {
  //     // Pass the instance up to the parent component's state.
  //     setControls(instance)
  //   }
  // }

  // // We use the `onEnd` prop of OrbitControls to know when the animation is done
  // const handleControlsEnd = () => {
  //   // If the `onEnd` event fired because our reset just finished...
  //   if (isResetting) {
  //     // ...then it is now safe to reset our state flags.
  //     console.log(`isResetting`)
  //     setHasInteracted(false)
  //     console.log(`isResetting2`)
  //     setIsInitialDelayOver(false)
  //     console.log(`isResetting3`)
  //     setPlanetRotationSpeed(0)
  //     console.log(`isResetting4`)
  //     // Finally, turn off the resetting flag.
  //     setIsResetting(false)
  //     console.log(`isResetting5`)
  //   }
  // }

  return (
    <>
      {/* <CameraManager
        initialCameraPosition={initialCameraPosition} //
        selectedLocation={selectedLocation}
      /> */}
      <ambientLight intensity={0.05} />
      <directionalLight ref={directionalLightRef} intensity={4} />
      {/* <directionalLight ref={directionalLightRef} position={[-10, 2, 10]} intensity={4} /> */}
      {/* The cosmetic sun mesh */}
      {/* <mesh position={[-10, 2, 10]} ref={sunRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={'white'} toneMapped={false} />
      </mesh> */}
      <Stars ref={starsRef} radius={400} depth={50} count={15000} factor={10} saturation={0} fade speed={1.5} />
      <AsteroidBelt />
      <group
        ref={planetGroupRef} //
        // rotation={[0.15, 0, 0]}
        rotation={[-0.26, 0, 0]}
      >
        <PhotorealisticPlanet ref={solidPlanetRef} />
        {locations.map((loc) => (
          // // <Marker
          // //   key={loc.name}
          // //   name={loc.name}
          // //   position={latLonToVector3(loc.coords[0], loc.coords[1], 2.1)} //
          // //   onClick={() => onMarkerClick(loc)}
          // //   // isAnimating={isAnimating}
          // //   // isSelected={cameraFocusSection === loc.name}
          // // />
          <Pin
            key={loc.name} //
            status={loc.status}
            occluderRef={solidPlanetRef}
            position={latLonToVector3(loc.coords[0], loc.coords[1], 2.02)}
            tooltip={`${loc.name} - ${loc.subtitle}`}
          />
        ))}
        {/* <Atmosphere /> */}
      </group>
      <Atmosphere sunPosition={sunPosition} />
      {/* <CameraControls ref={cameraControlsRef} minDistance={2.5} maxDistance={19} /> */}
      <OrbitControls
        ref={controlsRef}
        // ref={controlsCallbackRef}
        onStart={() => {
          // // // 1. When user starts interacting, permanently set hasInteracted.
          setHasInteracted(true)
          // // // 2. IMPORTANT: Clear any pending "resume" timer.
          clearTimeout(inactivityTimerRef.current)
          // // // setIsInteracting(true)
          // // // if (setCameraFocusSection) setCameraFocusSection(null)
          // // // if (isAnimating) {
          // // //   if (onAnimationComplete) onAnimationComplete()
          // // // }
          // dispatch({ type: 'START_INTERACTION' })
        }}
        // onEnd={() => {
        //   inactivityTimerRef.current = setTimeout(() => dispatch({ type: 'END_INTERACTION' }), 2000)
        // }}
        // onEnd={handleControlsEnd}
        onEnd={() => {
          // 3. When user stops, start a new timer to resume auto-rotation.
          inactivityTimerRef.current = setTimeout(() => {
            // After 2 seconds of inactivity, we reset the interaction flag.
            setHasInteracted(false)
          }, 2000) // 2000 milliseconds = 2 seconds
        }}
        // // onEnd={() => {
        // //   setTimeout(() => setIsInteracting(false), 500)
        // // }}
        // // target={[-1, 0, 0]}
        enableDamping={true} //
        dampingFactor={0.05} //
        // autoRotate={!hasInteracted} //
        // autoRotate={!hasInteracted && isInitialDelayOver}
        autoRotate={false}
        // autoRotate={!state.hasInteracted && state.isInitialDelayOver}
        autoRotateSpeed={0.1} //
        enablePan={false}
        minDistance={2.5}
        maxDistance={19} //
      />
    </>
  )
  // }
})

export { Experience } // Update export style for forwardRef
