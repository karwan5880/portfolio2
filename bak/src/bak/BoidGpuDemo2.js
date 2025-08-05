'use client'

import { OrbitControls, Text, shaderMaterial, useFBO } from '@react-three/drei'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import fontData from './helvetiker_bold.typeface.json'

// --- FIX: Parse the font data once, outside of any component ---
const font = new FontLoader().parse(fontData)

// import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

// extend({ TextGeometry })

// --- Configuration ---
const NUM_PARTICLES = 1000 // Using exactly 1000 particles as requested
const FBO_WIDTH = 40 // 40 * 25 = 1000
const FBO_HEIGHT = 25
const BOUNDS = 80

// --- Shader Definitions ---

// Blit Shader: Copies initial data into FBOs
const BlitMaterial = shaderMaterial(
  { textureToBlit: null },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  `precision highp float; varying vec2 vUv; uniform sampler2D textureToBlit;
   void main() { gl_FragColor = texture2D(textureToBlit, vUv); }`
)
extend({ BlitMaterial })

// Render Shader: Draws circular particles, colored by speed
const RenderMaterial = shaderMaterial(
  {
    positionsTexture: null,
    velocitiesTexture: null,
    uSize: 25.0,
    uPixelRatio: 1.0,
    uMaxSpeed: 3.0,
  },
  ` precision highp float; uniform sampler2D positionsTexture; uniform sampler2D velocitiesTexture;
    uniform float uSize; uniform float uPixelRatio; attribute vec2 ref_uv;
    varying vec3 vVelocity;
    void main() {
      vec3 pos = texture2D(positionsTexture, ref_uv).xyz;
      vec3 vel = texture2D(velocitiesTexture, ref_uv).xyz;
      vVelocity = vel;
      vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      gl_PointSize = uSize * uPixelRatio / max(1.0, -modelViewPosition.z); 
    }`,
  ` precision highp float; varying vec3 vVelocity; uniform float uMaxSpeed;
    void main() {
      if (distance(gl_PointCoord, vec2(0.5)) > 0.5) { discard; }
      float speed = length(vVelocity); float speedT = clamp(speed / uMaxSpeed, 0.0, 1.0);
      vec3 slowColor = vec3(0.1, 0.3, 1.0); vec3 fastColor = vec3(1.0, 0.1, 0.5);
      vec3 color = mix(slowColor, fastColor, speedT);
      gl_FragColor = vec4(color, 1.0);
    }`
)
extend({ RenderMaterial })

// MODIFIED Velocity Update Shader: Includes a new "targetForce"
const VelocityUpdateMaterial = shaderMaterial(
  {
    positionsTexture: null,
    velocitiesTexture: null,
    targetTexture: null, // NEW: Texture with target positions
    uTime: 0,
    uDelta: 0,
    uMouse: new THREE.Vector3(),
    uMaxSpeed: 3.0,
    uTargetForce: 1.0, // NEW: Strength of the attraction to the target shape
  },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D positionsTexture;
    uniform sampler2D velocitiesTexture;
    uniform sampler2D targetTexture;
    uniform float uTime;
    uniform float uDelta;
    uniform vec3 uMouse;
    uniform float uMaxSpeed;
    uniform float uTargetForce;

    void main() {
      vec3 pos = texture2D(positionsTexture, vUv).xyz;
      vec3 vel = texture2D(velocitiesTexture, vUv).xyz;
      vec3 targetPos = texture2D(targetTexture, vUv).xyz;

      // Force to steer towards the target position
      vec3 targetForce = normalize(targetPos - pos) * uTargetForce * 2.0;

      // Repulsion force from the mouse
      vec3 mouseForce = vec3(0.0);
      float mouseDist = distance(pos, uMouse);
      if (mouseDist < 20.0) {
        mouseForce = normalize(pos - uMouse) / (mouseDist + 0.01) * (1.0 - uTargetForce) * 2.0;
      }
      
      // Combine forces
      vec3 acceleration = vec3(0.0);
      acceleration += targetForce;
      acceleration += mouseForce;
      
      // Apply acceleration to velocity
      vel += acceleration * uDelta * 10.0;
      
      // Dampen velocity when target force is high to prevent overshooting
      vel *= (1.0 - uTargetForce * 0.1);
      
      // Limit speed
      if (length(vel) > uMaxSpeed) {
        vel = normalize(vel) * uMaxSpeed;
      }

      gl_FragColor = vec4(vel, 1.0);
    }
  `
)
extend({ VelocityUpdateMaterial })

// Position Update Shader: No wrapping, particles move freely
const PositionUpdateMaterial = shaderMaterial(
  {
    positionsTexture: null,
    velocitiesTexture: null,
    uDelta: 0,
  },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  ` precision highp float; varying vec2 vUv; uniform sampler2D positionsTexture; uniform sampler2D velocitiesTexture;
    uniform float uDelta;
    void main() {
      vec3 pos = texture2D(positionsTexture, vUv).xyz;
      vec3 vel = texture2D(velocitiesTexture, vUv).xyz;
      pos += vel * uDelta;
      gl_FragColor = vec4(pos, 1.0);
    }`
)
extend({ PositionUpdateMaterial })

// --- Helper Component to manage shape generation ---
function ShapeTargetManager({ onPointsGenerated }) {
  const [currentNumber, setCurrentNumber] = useState(3)
  //   const font = useLoader(FontLoader, '/helvetiker_bold.typeface.json')
  //   const font = '/helvetiker_bold.typeface.json' // Just the path is needed for <Text>
  const textMeshRef = useRef()

  //   // This effect runs when the text mesh is ready or the number changes
  //   useEffect(() => {
  //     // We wait for the invisible Text component to render its mesh
  //     if (!textMeshRef.current) return
  //     const sampler = new MeshSurfaceSampler(textMeshRef.current).build()
  //     const points = new Float32Array(NUM_PARTICLES * 4)
  //     const _position = new THREE.Vector3()
  //     for (let i = 0; i < NUM_PARTICLES; i++) {
  //       sampler.sample(_position)
  //       points[i * 4 + 0] = _position.x
  //       points[i * 4 + 1] = _position.y
  //       points[i * 4 + 2] = _position.z
  //       points[i * 4 + 3] = 1.0
  //     }
  //     onPointsGenerated(points, currentNumber)
  //   }, [currentNumber, onPointsGenerated]) // Re-run when number changes

  // This effect re-samples the points whenever the currentNumber changes
  useEffect(() => {
    if (!font) return
    // const geometry = new THREE.TextGeometry(currentNumber.toString(), {
    const geometry = new TextGeometry(currentNumber.toString(), {
      font: font,
      size: 40,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 2,
      bevelSize: 1,
      bevelOffset: 0,
      bevelSegments: 5,
    })
    geometry.center()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
    const points = new Float32Array(NUM_PARTICLES * 4)
    const _position = new THREE.Vector3()
    for (let i = 0; i < NUM_PARTICLES; i++) {
      sampler.sample(_position)
      points[i * 4 + 0] = _position.x
      points[i * 4 + 1] = _position.y
      points[i * 4 + 2] = _position.z
      points[i * 4 + 3] = 1.0
    }
    onPointsGenerated(points, currentNumber)
    geometry.dispose()
  }, [currentNumber, font, onPointsGenerated])

  // This effect runs a timer to change the number every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNumber((prev) => (prev > 0 ? prev - 1 : 9))
    }, 3000) // Change number every 3 seconds
    return () => clearInterval(timer)
  }, [])

  return null
  //   return (
  //     <Text
  //       ref={textMeshRef}
  //       font={font}
  //       visible={false} // <-- The magic
  //       position={[0, 0, 0]}
  //       fontSize={40}
  //       bevelEnabled
  //       bevelThickness={2}
  //       bevelSize={1}
  //     >
  //       {currentNumber.toString()}
  //     </Text>
  //   )
}

// --- Main Boids Simulation Component ---
function BoidsSimulation() {
  const { gl, camera } = useThree()

  const controls = useControls('Boids', {
    targetForce: { value: 0.5, min: 0.0, max: 1.0 },
    maxSpeed: { value: 6.0, min: 0.1, max: 20 },
    particleSize: { value: 40.0, min: 1, max: 100 },
  })

  const [targetPoints, setTargetPoints] = useState(null)
  const [visibleNumber, setVisibleNumber] = useState(3)

  const targetTexture = useMemo(() => new THREE.DataTexture(new Float32Array(NUM_PARTICLES * 4), FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType), [])

  useEffect(() => {
    if (targetPoints) {
      targetTexture.image.data.set(targetPoints)
      targetTexture.needsUpdate = true
    }
  }, [targetPoints, targetTexture])

  const [initialPositions, initialVelocities] = useMemo(() => {
    const posData = new Float32Array(NUM_PARTICLES * 4)
    const velData = new Float32Array(NUM_PARTICLES * 4)
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const i4 = i * 4
      const pos = new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * BOUNDS)
      posData[i4] = pos.x
      posData[i4 + 1] = pos.y
      posData[i4 + 2] = pos.z
      posData[i4 + 3] = 1
      const vel = new THREE.Vector3().randomDirection()
      velData[i4] = vel.x
      velData[i4 + 1] = vel.y
      velData[i4 + 2] = vel.z
      velData[i4 + 3] = 1
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
  const raycaster = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

  useFrame((state, delta) => {
    if (!targetTexture || !targetPoints) return
    const dt = Math.min(delta, 0.02)
    raycaster.setFromCamera(state.pointer, camera)
    raycaster.ray.intersectPlane(plane, mousePosition)

    // Update Velocity
    gl.setRenderTarget(fbos.current.vel.write)
    quad.material = velMat.current
    velMat.current.uniforms.positionsTexture.value = fbos.current.pos.read.texture
    velMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.read.texture
    velMat.current.uniforms.targetTexture.value = targetTexture
    velMat.current.uniforms.uDelta.value = dt
    velMat.current.uniforms.uMouse.value = mousePosition
    velMat.current.uniforms.uMaxSpeed.value = controls.maxSpeed
    velMat.current.uniforms.uTargetForce.value = controls.targetForce
    gl.render(simScene, simCam)

    // Update Position
    gl.setRenderTarget(fbos.current.pos.write)
    quad.material = posMat.current
    posMat.current.uniforms.positionsTexture.value = fbos.current.pos.read.texture
    posMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.write.texture
    posMat.current.uniforms.uDelta.value = dt
    gl.render(simScene, simCam)

    // Render to screen
    gl.setRenderTarget(null)
    renderMat.current.uniforms.positionsTexture.value = fbos.current.pos.write.texture
    renderMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.write.texture
    renderMat.current.uniforms.uPixelRatio.value = state.viewport.dpr
    renderMat.current.uniforms.uSize.value = controls.particleSize
    renderMat.current.uniforms.uMaxSpeed.value = controls.maxSpeed

    // Ping-Pong FBOs
    let tempPos = fbos.current.pos.read
    fbos.current.pos.read = fbos.current.pos.write
    fbos.current.pos.write = tempPos
    let tempVel = fbos.current.vel.read
    fbos.current.vel.read = fbos.current.vel.write
    fbos.current.vel.write = tempVel
  })

  return (
    <>
      <ShapeTargetManager
        onPointsGenerated={(points, num) => {
          setTargetPoints(points)
          setVisibleNumber(num)
        }}
      />
      <blitMaterial ref={blitMat} />
      <velocityUpdateMaterial ref={velMat} />
      <positionUpdateMaterial ref={posMat} />
      <points geometry={particleGeometry}>
        <renderMaterial ref={renderMat} />
      </points>
      <Text
        font="/helvetiker_bold.typeface.json" //
        fontSize={8}
        color="gray"
        position-y={-60}
        anchorY="top"
      >
        {`Target: ${visibleNumber}`}
      </Text>
      {/* <mesh position-y={-60}>
        <textGeometry args={[`Target: ${visibleNumber}`, { font, size: 8, height: 1 }]} />
        <meshBasicMaterial color="gray" />
      </mesh> */}
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
