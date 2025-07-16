'use client'

import { OrbitControls, shaderMaterial, useFBO } from '@react-three/drei'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Leva, useControls } from 'leva'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const NUM_PARTICLES = 1000
const FBO_WIDTH = 40
const FBO_HEIGHT = 25
const BOUNDS = 80

const BlitMaterial = shaderMaterial(
  { textureToBlit: null },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
  `precision highp float; varying vec2 vUv; uniform sampler2D textureToBlit;
   void main() { gl_FragColor = texture2D(textureToBlit, vUv); }`
)
extend({ BlitMaterial })

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

const VelocityUpdateMaterial = shaderMaterial(
  {
    positionsTexture: null,
    velocitiesTexture: null,
    targetTexture: null,
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

      vec3 targetForce = normalize(targetPos - pos) * uTargetForce * 2.0;

      vec3 mouseForce = vec3(0.0);
      float mouseDist = distance(pos, uMouse);
      if (mouseDist < 20.0) {
        mouseForce = normalize(pos - uMouse) / (mouseDist + 0.01) * (1.0 - uTargetForce) * 2.0;
      }
      
      vec3 acceleration = targetForce + mouseForce;
      
      vel += acceleration * uDelta * 10.0;
      //vel *= (1.0 - uTargetForce * 0.1); // Dampen velocity
      
      if (length(vel) > uMaxSpeed) {
        vel = normalize(vel) * uMaxSpeed;
      }

      gl_FragColor = vec4(vel, 1.0);
    }
  `
)
extend({ VelocityUpdateMaterial })

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

function ShapeTargetManager({ onPointsGenerated, font }) {
  const [currentNumber, setCurrentNumber] = useState(3)

  useEffect(() => {
    if (!font) return
    const geometry = new TextGeometry(currentNumber.toString(), {
      font: font,
      size: 40,
      curveSegments: 12,
      bevelEnabled: false,
    })
    console.log(`Generated geometry for number "${currentNumber}". Vertex count:`, geometry.attributes.position.count)
    geometry.center()
    const mesh = new THREE.Mesh(geometry)
    mesh.updateMatrixWorld(true)
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
    // geometry.dispose()
  }, [currentNumber, onPointsGenerated, font])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNumber((prev) => (prev > 0 ? prev - 1 : 9))
    }, 13000)
    return () => clearInterval(timer)
  }, [])

  return null
}

function BoidsSimulation() {
  const { gl, camera } = useThree()

  //   const font = useLoader(FontLoader, '/helvetiker_bold.typeface.json')
  const font = useLoader(FontLoader, '/gentilis_bold.typeface.json')

  const controls = useControls('Boids', {
    targetForce: { value: 0.8, min: 0.0, max: 2.0 },
    maxSpeed: { value: 15.0, min: 0.1, max: 40 },
    particleSize: { value: 40.0, min: 1, max: 100 },
  })

  const [targetPoints, setTargetPoints] = useState(null)

  //   const handlePointsGenerated = useCallback((points, num) => {
  //     setTargetPoints(points)
  //   }, [])
  const handlePointsGenerated = useCallback((points, num) => {
    // 2. When new points arrive, create a brand new texture and set it in state.
    const newTexture = new THREE.DataTexture(points, FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
    newTexture.needsUpdate = true
    setTargetTexture(newTexture)
  }, [])

  //   useEffect(() => {
  //     if (targetPoints) {
  //       targetTexture.image.data.set(targetPoints)
  //       targetTexture.needsUpdate = true
  //     }
  //   }, [targetPoints, targetTexture])

  const [targetTexture, setTargetTexture] = useState(null)
  //   //   const targetTexture = useMemo(() => new THREE.DataTexture(new Float32Array(NUM_PARTICLES * 4), FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType), [])
  //   const targetTexture = useMemo(() => {
  //     if (!targetPoints) {
  //       // Return a placeholder texture while we wait for points
  //       return new THREE.DataTexture(new Float32Array(NUM_PARTICLES * 4), FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
  //     }
  //     // When we have points, create a new texture with that data
  //     const texture = new THREE.DataTexture(targetPoints, FBO_WIDTH, FBO_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
  //     texture.needsUpdate = true // Tell Three.js to upload it to the GPU
  //     return texture
  //   }, [targetPoints])

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
    pos: {
      read: posFBO1,
      write: posFBO2,
      swap: () => {
        ;[fbos.current.pos.read, fbos.current.pos.write] = [fbos.current.pos.write, fbos.current.pos.read]
      },
    },
    vel: {
      read: velFBO1,
      write: velFBO2,
      swap: () => {
        ;[fbos.current.vel.read, fbos.current.vel.write] = [fbos.current.vel.write, fbos.current.vel.read]
      },
    },
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

  //   const mousePosition = new THREE.Vector3()
  const mousePosition = new THREE.Vector3(10000, 10000, 10000)
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

  useFrame((state, delta) => {
    // if (!targetTexture.image.data || !targetPoints) return
    if (!targetTexture) return
    if (!targetTexture.image.data.length) return // Check if the texture data is empty
    const dt = Math.min(delta, 0.02)

    state.raycaster.setFromCamera(state.pointer, camera)
    state.raycaster.ray.intersectPlane(plane, mousePosition)

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

    gl.setRenderTarget(fbos.current.pos.write)
    quad.material = posMat.current
    posMat.current.uniforms.positionsTexture.value = fbos.current.pos.read.texture
    posMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.write.texture
    posMat.current.uniforms.uDelta.value = dt
    gl.render(simScene, simCam)

    gl.setRenderTarget(null)
    renderMat.current.uniforms.positionsTexture.value = fbos.current.pos.write.texture
    renderMat.current.uniforms.velocitiesTexture.value = fbos.current.vel.write.texture
    renderMat.current.uniforms.uPixelRatio.value = state.viewport.dpr
    renderMat.current.uniforms.uSize.value = controls.particleSize
    renderMat.current.uniforms.uMaxSpeed.value = controls.maxSpeed

    fbos.current.vel.swap()
    fbos.current.pos.swap()
  })

  return (
    <>
      <ShapeTargetManager onPointsGenerated={handlePointsGenerated} font={font} />
      <blitMaterial ref={blitMat} />
      <velocityUpdateMaterial ref={velMat} />
      <positionUpdateMaterial ref={posMat} />
      <points geometry={particleGeometry}>
        <renderMaterial ref={renderMat} />
      </points>
    </>
  )
}

export function GpgpuBoidsDemo() {
  return (
    <>
      <Leva />
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#111' }}>
        <Canvas camera={{ position: [0, 0, 120] }} style={{ backgroundColor: '#fefefe' }}>
          <BoidsSimulation />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </>
  )
}
