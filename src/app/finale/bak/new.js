'use client'

import { OrbitControls, Text, shaderMaterial, useFBO } from '@react-three/drei'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

extend({ TextGeometry })

// --- Configuration ---
const NUM_PARTICLES = 1000
const FBO_WIDTH = 40
const FBO_HEIGHT = 25
const BOUNDS = 80

// --- Shaders ---
// Blit, Render, and PositionUpdate shaders are unchanged.
const BlitMaterial = shaderMaterial({ textureToBlit: null }, `...`, `...`) // Collapsed for brevity
const RenderMaterial = shaderMaterial(
  {
    /* ... */
  },
  `...`,
  `...`
)
const PositionUpdateMaterial = shaderMaterial(
  {
    /* ... */
  },
  `...`,
  `...`
)
extend({ BlitMaterial, RenderMaterial, PositionUpdateMaterial })

// --- MODIFIED Velocity Update Shader ---
// Now interpolates between two target textures for smooth morphing.
const VelocityUpdateMaterial = shaderMaterial(
  {
    positionsTexture: null,
    velocitiesTexture: null,
    targetTextureA: null, // The shape we are morphing FROM
    targetTextureB: null, // The shape we are morphing TO
    uTransitionProgress: 0.0, // The 0-1 progress of the morph
    uTime: 0,
    uDelta: 0,
    uMouse: new THREE.Vector3(),
    uMaxSpeed: 3.0,
    uTargetForce: 1.0,
  },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D positionsTexture;
    uniform sampler2D velocitiesTexture;
    uniform sampler2D targetTextureA;
    uniform sampler2D targetTextureB;
    uniform float uTransitionProgress;
    uniform float uTime;
    uniform float uDelta;
    uniform vec3 uMouse;
    uniform float uMaxSpeed;
    uniform float uTargetForce;

    void main() {
      vec3 pos = texture2D(positionsTexture, vUv).xyz;
      vec3 vel = texture2D(velocitiesTexture, vUv).xyz;
      
      // --- MORPHING LOGIC ---
      // Read from both target textures
      vec3 targetPosA = texture2D(targetTextureA, vUv).xyz;
      vec3 targetPosB = texture2D(targetTextureB, vUv).xyz;
      // Interpolate between them based on the progress uniform
      vec3 targetPos = mix(targetPosA, targetPosB, uTransitionProgress);

      vec3 targetForce = normalize(targetPos - pos) * uTargetForce * 2.0;

      vec3 mouseForce = vec3(0.0);
      float mouseDist = distance(pos, uMouse);
      if (mouseDist < 20.0) {
        mouseForce = normalize(pos - uMouse) / (mouseDist + 0.01) * 2.0;
      }
      
      vec3 acceleration = targetForce + mouseForce;
      
      vel += acceleration * uDelta * 10.0;
      vel *= 0.98; // General damping to keep the system stable
      
      if (length(vel) > uMaxSpeed) {
        vel = normalize(vel) * uMaxSpeed;
      }

      gl_FragColor = vec4(vel, 1.0);
    }
  `
)
extend({ VelocityUpdateMaterial })

// --- Main Boids Simulation Component ---
function BoidsSimulation() {
  const { gl, camera } = useThree()
  const font = useLoader(FontLoader, '/helvetiker_bold.typeface.json')

  const controls = useControls('Boids', {
    targetForce: { value: 0.5, min: 0.0, max: 1.0, label: 'Shape Force' },
    maxSpeed: { value: 6.0, min: 0.1, max: 20 },
    particleSize: { value: 40.0, min: 1, max: 100 },
    transitionSpeed: { value: 0.4, min: 0.1, max: 2.0 },
  })

  // State to manage the numbers
  const [currentNumber, setCurrentNumber] = useState(3)
  const [nextNumber, setNextNumber] = useState(2)

  // State to hold the raw point data for our textures
  const [currentPoints, setCurrentPoints] = useState(null)
  const [nextPoints, setNextPoints] = useState(null)

  // Refs to manage the transition animation
  const transitionProgress = useRef(0.0)
  const isTransitioning = useRef(false)

  // Two target textures for morphing
  const targetTextureA = useMemo(() => new THREE.DataTexture(new Float32Array(NUM_PARTICLES * 4), FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType), [])
  const targetTextureB = useMemo(() => new THREE.DataTexture(new Float32Array(NUM_PARTICLES * 4), FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType), [])

  // Helper function to generate points for a given number
  const generatePointsForNumber = useCallback(
    (num) => {
      if (!font) return null
      const geometry = new TextGeometry(num.toString(), {
        font: font,
        size: 40,
        height: 5,
        curveSegments: 12,
      })
      geometry.center()
      const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
      const points = new Float32Array(NUM_PARTICLES * 4)
      const _position = new THREE.Vector3()
      for (let i = 0; i < NUM_PARTICLES; i++) {
        sampler.sample(_position)
        points.set([_position.x, _position.y, _position.z, 1.0], i * 4)
      }
      geometry.dispose()
      return points
    },
    [font]
  )

  // Initial setup effect
  useEffect(() => {
    if (font) {
      setCurrentPoints(generatePointsForNumber(currentNumber))
      setNextPoints(generatePointsForNumber(nextNumber))
    }
  }, [font, currentNumber, nextNumber, generatePointsForNumber])

  // Timer to trigger transitions
  useEffect(() => {
    const timer = setInterval(() => {
      isTransitioning.current = true
    }, 4000) // Start a new transition every 4 seconds
    return () => clearInterval(timer)
  }, [])

  // Update textures whenever the underlying point data changes
  useEffect(() => {
    if (currentPoints) {
      targetTextureA.image.data.set(currentPoints)
      targetTextureA.needsUpdate = true
    }
  }, [currentPoints, targetTextureA])

  useEffect(() => {
    if (nextPoints) {
      targetTextureB.image.data.set(nextPoints)
      targetTextureB.needsUpdate = true
    }
  }, [nextPoints, targetTextureB])

  // --- The rest of the setup is the same as before ---
  const [initialPositions, initialVelocities] = useMemo(() => {
    const posData = new Float32Array(NUM_PARTICLES * 4)
    const velData = new Float32Array(NUM_PARTICLES * 4)
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i4 = i * 4
      const pos = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * BOUNDS)
      posData.set([pos.x, pos.y, pos.z, 1], i4)
      const vel = new THREE.Vector3().randomDirection()
      velData.set([vel.x, vel.y, vel.z, 1], i4)
    }
    const posTex = new THREE.DataTexture(posData, FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
    posTex.needsUpdate = true
    const velTex = new THREE.DataTexture(velData, FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
    velTex.needsUpdate = true
    return [posTex, velTex]
  }, [])
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const ref_uvs = new Float32Array(NUM_PARTICLES * 2)
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i2 = i * 2
      ref_uvs[i2] = (i % FBO_WIDTH) / FBO_WIDTH
      ref_uvs[i2 + 1] = Math.floor(i / FBO_WIDTH) / FBO_HEIGHT
    }
    geo.setAttribute('ref_uv', new THREE.BufferAttribute(ref_uvs, 2))
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NUM_PARTICLES * 3), 3))
    return geo
  }, [])
  const velMat = useRef()
  const posMat = useRef()
  const renderMat = useRef()
  const blitMat = useRef()
  const fboSettings = { type: THREE.FloatType }
  const posFBO1 = useFBO(FBO_WIDTH, FBO_HEIGHT, fboSettings)
  const posFBO2 = useFBO(FBO_WIDTH, FBO_HEIGHT, fboSettings)
  const velFBO1 = useFBO(FBO_WIDTH, FBO_HEIGHT, fboSettings)
  const velFBO2 = useFBO(FBO_WIDTH, FBO_HEIGHT, fboSettings)
  const fbos = useRef({
    pos: { read: posFBO1, write: posFBO2 },
    vel: { read: velFBO1, write: velFBO2 },
  })
  const [simScene, simCam, quad] = useMemo(() => {
    const scene = new THREE.Scene()
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    scene.add(mesh)
    return [scene, cam, mesh]
  }, [])
  useEffect(() => {
    quad.material = blitMat.current
    blitMat.current.uniforms.textureToBlit.value = initialPositions
    gl.setRenderTarget(fbos.current.pos.read)
    gl.render(simScene, simCam)
    blitMat.current.uniforms.textureToBlit.value = initialVelocities
    gl.setRenderTarget(fbos.current.vel.read)
    gl.render(simScene, simCam)
    gl.setRenderTarget(null)
  }, [gl, initialPositions, initialVelocities, simScene, simCam, quad])
  const mousePosition = new THREE.Vector3()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

  useFrame((state, delta) => {
    if (!font) return
    const dt = Math.min(delta, 0.02)

    // Handle the transition animation
    if (isTransitioning.current) {
      transitionProgress.current += dt * controls.transitionSpeed
      if (transitionProgress.current >= 1.0) {
        // --- Commit the transition ---
        transitionProgress.current = 0.0
        isTransitioning.current = false
        // The "next" shape becomes the "current" shape
        setCurrentPoints(nextPoints)
        // Update the number states
        const newNextNum = nextNumber > 0 ? nextNumber - 1 : 9
        setCurrentNumber(nextNumber)
        setNextNumber(newNextNum)
        // Immediately generate points for the new "next" shape
        setNextPoints(generatePointsForNumber(newNextNum))
      }
    }

    state.raycaster.setFromCamera(state.pointer, camera)
    state.raycaster.ray.intersectPlane(plane, mousePosition)

    // --- GPGPU Simulation Passes ---
    gl.setRenderTarget(fbos.current.vel.write)
    quad.material = velMat.current
    velMat.current.uniforms.positionsTexture.value = fbos.current.pos.read.texture
    velMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.read.texture
    velMat.current.uniforms.targetTextureA.value = targetTextureA
    velMat.current.uniforms.targetTextureB.value = targetTextureB
    velMat.current.uniforms.uTransitionProgress.value = transitionProgress.current
    velMat.current.uniforms.uDelta.value = dt
    velMat.current.uniforms.uMouse.value = mousePosition
    velMat.current.uniforms.uMaxSpeed.value = controls.maxSpeed
    velMat.current.uniforms.uTargetForce.value = controls.targetForce
    gl.render(simScene, simCam)

    gl.setRenderTarget(fbos.current.pos.write)
    quad.material = posMat.current
    posMat.current.uniforms.positionsTexture.value = fbos.current.pos.read.texture
    posMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.write.texture
    posMat.current.uniforms.uDelta.value = dt
    gl.render(simScene, simCam)

    // --- Final Render to Screen ---
    gl.setRenderTarget(null)
    renderMat.current.uniforms.positionsTexture.value = fbos.current.pos.write.texture
    renderMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.write.texture
    renderMat.current.uniforms.uPixelRatio.value = state.viewport.dpr
    renderMat.current.uniforms.uSize.value = controls.particleSize
    renderMat.current.uniforms.uMaxSpeed.value = controls.maxSpeed

    // --- Swap FBOs ---
    let tempPos = fbos.current.pos.read
    fbos.current.pos.read = fbos.current.pos.write
    fbos.current.pos.write = tempPos
    let tempVel = fbos.current.vel.read
    fbos.current.vel.read = fbos.current.vel.write
    fbos.current.vel.write = tempVel
  })

  return (
    <>
      <blitMaterial ref={blitMat} />
      <velocityUpdateMaterial ref={velMat} />
      <positionUpdateMaterial ref={posMat} />
      <points geometry={particleGeometry}>
        <renderMaterial ref={renderMat} />
      </points>
      <Text font="/helvetiker_bold.typeface.json" fontSize={8} color="gray" position-y={-60} anchorY="top">
        {`Morphing from ${isTransitioning.current ? currentNumber : '-'} to ${isTransitioning.current ? nextNumber : currentNumber}`}
      </Text>
    </>
  )
}

export function GpgpuBoidsDemo() {
  return (
    <>
      <Leva />
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#111' }}>
        <Canvas camera={{ position: [0, 0, 120] }}>
          <BoidsSimulation />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </>
  )
}
