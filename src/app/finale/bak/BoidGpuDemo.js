'use client'

import { shaderMaterial, useFBO, useGLTF } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { button, useControls } from 'leva'
import React from 'react'
// --- NEW: Import useState and useEffect for state management ---
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const SIZE = 256

const SimulationMaterial = shaderMaterial(
  { uPositionTexture: null, uTargetPositionTexture: null, uDroneDataTexture: null, uTime: 0, uSwitchTime: 0, uTexelSize: new THREE.Vector2(1 / SIZE, 1 / SIZE), uRepulsionRadius: 0.1, uRepulsionStrength: 0.04, uSearchRadius: 1.0 },
  /*glsl*/ `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  /*glsl*/ `varying vec2 vUv;uniform sampler2D uPositionTexture;uniform sampler2D uTargetPositionTexture;uniform sampler2D uDroneDataTexture;uniform float uTime;uniform float uSwitchTime;uniform vec2 uTexelSize;uniform float uRepulsionRadius;uniform float uRepulsionStrength;uniform float uSearchRadius;vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod(Pi0,289.);Pi1=mod(Pi1,289.);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0/7.;vec4 gy0=fract(floor(gx0)/7.)-.5;gx0=fract(gx0);vec4 gz0=.5-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1/7.;vec4 gy1=fract(floor(gx1)/7.)-.5;gx1=fract(gx1);vec4 gz1=.5-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}
    void main(){
      vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
      vec3 targetPos = texture2D(uTargetPositionTexture, vUv).xyz;
      vec4 droneData = texture2D(uDroneDataTexture, vUv);
      vec3 intendedPos = currentPos;
      float takeoffDelay = 1.5;
      float takeoffTime = uSwitchTime + droneData.x * takeoffDelay;
      if(uTime >= takeoffTime){
        vec3 direction = targetPos - currentPos;
        float distance = length(direction);
        vec3 velocity = vec3(0.0);
        float speed = 0.08;
        if(distance > 0.01){
          if(distance < speed){
            velocity = direction;
          } else {
            velocity = normalize(direction) * speed;
          }
        }
        float noise = cnoise(currentPos * 0.5 + uTime * 0.5);
        velocity += noise * 0.005;
        intendedPos = currentPos + velocity;
      }
      vec3 repulsionVector = vec3(0.0);
      for (float x = -uSearchRadius; x <= uSearchRadius; x++) {
        for (float y = -uSearchRadius; y <= uSearchRadius; y++) {
          if (x == 0.0 && y == 0.0) continue;
          vec2 neighborUv = vUv + vec2(x, y) * uTexelSize;
          vec3 neighborPos = texture2D(uPositionTexture, neighborUv).xyz;
          vec3 diff = intendedPos - neighborPos;
          float dist = length(diff);
          if (dist < uRepulsionRadius) {
            repulsionVector += normalize(diff) * (uRepulsionRadius - dist);
          }
        }
      }
      vec3 finalPos = intendedPos + repulsionVector * uRepulsionStrength;
      gl_FragColor = vec4(finalPos, 1.0);
    }`
)

const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTargetColorTexture: null }, /*glsl*/ `uniform sampler2D uPositionTexture;varying vec2 vUv;void main(){vec3 pos=texture2D(uPositionTexture,uv).xyz;vUv=uv;vec4 modelPosition=modelMatrix*vec4(pos,1.0);vec4 viewPosition=viewMatrix*modelPosition;vec4 projectedPosition=projectionMatrix*viewPosition;gl_Position=projectedPosition;gl_PointSize=1.7;}`, /*glsl*/ `varying vec2 vUv; uniform sampler2D uTargetColorTexture; void main() { vec3 finalColor = texture2D(uTargetColorTexture, vUv).rgb; float brightness = length(finalColor); float glow = brightness < 0.6 ? 0.8 : 1.5; gl_FragColor = vec4(finalColor * glow, 0.8); }`)

extend({ SimulationMaterial, ParticlesMaterial })
useGLTF.preload('/monkey.glb')

// --- UPDATED: The simulation now accepts `currentPhase` as a prop ---
function BoidsSimulation({ currentPhase }) {
  const simulationMaterial = useRef()
  const particlesMaterial = useRef()
  const frame = useRef(0)
  const switchTimeRef = useRef(0)
  const gltf = useGLTF('/monkey.glb')
  const { clock } = useFrame() // Get clock for useEffect

  const { repulsionRadius, repulsionStrength, searchRadius } = useControls('Drone Spacing', {
    repulsionRadius: { value: 0.1, min: 0, max: 1.0, step: 0.01 },
    repulsionStrength: { value: 0.04, min: 0, max: 0.5, step: 0.01 },
    searchRadius: { value: 1, min: 1, max: 5, step: 1 },
  })

  // --- NEW: Use useEffect to update the switch time when the phase changes ---
  // This is a "side effect" of the `currentPhase` prop changing.
  useEffect(() => {
    switchTimeRef.current = clock.getElapsedTime()
  }, [currentPhase, clock])

  const { shapePositionTexture, shapeColorTexture, homePositionTexture, homeColorTexture, initialPositions, particleGeometry } = useMemo(() => {
    // Data generation `useMemo` block is UNCHANGED
    if (!gltf) return {}
    const mesh = gltf.nodes.mesh_0
    if (!mesh || !mesh.isMesh || !mesh.geometry) return {}
    const vertices = mesh.geometry.attributes.position.array
    const numVertices = vertices.length / 3
    if (numVertices === 0) return {}
    const shapePosData = new Float32Array(SIZE * SIZE * 4)
    const shapeColorData = new Float32Array(SIZE * SIZE * 4)
    const colorA = new THREE.Color('#ff0022')
    const colorB = new THREE.Color('#0055ff')
    mesh.geometry.computeBoundingBox()
    const minY = mesh.geometry.boundingBox.min.y
    const maxY = mesh.geometry.boundingBox.max.y
    for (let i = 0; i < SIZE * SIZE; i++) {
      const k = i * 4
      const vIndex = (i % numVertices) * 3
      const px = vertices[vIndex + 0] * 3,
        py = vertices[vIndex + 1] * 3,
        pz = vertices[vIndex + 2] * 3
      shapePosData[k + 0] = px
      shapePosData[k + 1] = py
      shapePosData[k + 2] = pz
      shapePosData[k + 3] = 1.0
      const normalizedY = (vertices[vIndex + 1] - minY) / (maxY - minY)
      const finalColor = new THREE.Color().lerpColors(colorA, colorB, normalizedY)
      shapeColorData[k + 0] = finalColor.r
      shapeColorData[k + 1] = finalColor.g
      shapeColorData[k + 2] = finalColor.b
      shapeColorData[k + 3] = 1.0
    }
    const shapePosTexture = new THREE.DataTexture(shapePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    shapePosTexture.needsUpdate = true
    const shapeColTexture = new THREE.DataTexture(shapeColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    shapeColTexture.needsUpdate = true
    const homePosData = new Float32Array(SIZE * SIZE * 4)
    const homeColorData = new Float32Array(SIZE * SIZE * 4)
    const homeCol = new THREE.Color(0.3, 0.3, 0.6)
    const s = 0.1
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = (i * SIZE + j) * 4
        homePosData[k + 0] = (i - SIZE / 2) * s
        homePosData[k + 1] = (j - SIZE / 2) * s
        homePosData[k + 2] = -5.0
        homePosData[k + 3] = 1.0
        homeColorData[k + 0] = homeCol.r
        homeColorData[k + 1] = homeCol.g
        homeColorData[k + 2] = homeCol.b
        homeColorData[k + 3] = 1.0
      }
    }
    const homePosTexture = new THREE.DataTexture(homePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    homePosTexture.needsUpdate = true
    const homeColTexture = new THREE.DataTexture(homeColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    homeColTexture.needsUpdate = true
    const count = SIZE * SIZE
    const geometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(count * 2)
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = (i * SIZE + j) * 2
        uvs[k] = i / (SIZE - 1)
        uvs[k + 1] = j / (SIZE - 1)
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    return { shapePositionTexture: shapePosTexture, shapeColorTexture: shapeColorTexture, homePositionTexture: homePosTexture, homeColorTexture: homeColTexture, initialPositions: homePosTexture, particleGeometry: geometry }
  }, [gltf])

  const fbos = useRef({
    read: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    write: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    swap: function () {
      const t = this.read
      this.read = this.write
      this.write = t
    },
  })
  const droneDataTexture = useMemo(() => {
    const d = new Float32Array(SIZE * SIZE * 4)
    for (let i = 0; i < SIZE * SIZE; i++) {
      const k = i * 4
      d[k + 0] = Math.random()
      d[k + 1] = 0
      d[k + 2] = 0
      d[k + 3] = 1
    }
    const t = new THREE.DataTexture(d, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    t.needsUpdate = true
    return t
  }, [])
  const simScene = useMemo(() => {
    const s = new THREE.Scene()
    const c = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    s.add(m)
    return { scene: s, camera: c, mesh: m }
  }, [])

  useFrame(({ gl }) => {
    if (!shapePositionTexture) return
    const fbo = fbos.current
    const time = clock.getElapsedTime()

    // --- REMOVED: The rigid, time-based phase calculation is gone! ---
    // const interval = 60.0, phaseDuration = interval / 2.0;
    // const timeInInterval = time % interval;
    // const currentPhase = Math.floor(timeInInterval / phaseDuration);

    const targetPosTexture = currentPhase === 0 ? shapePositionTexture : homePositionTexture
    const targetColorTexture = currentPhase === 0 ? shapeColorTexture : homeColorTexture

    simScene.mesh.material = simulationMaterial.current
    simulationMaterial.current.uTime = time
    simulationMaterial.current.uSwitchTime = switchTimeRef.current
    simulationMaterial.current.uPositionTexture = frame.current === 0 ? initialPositions : fbo.read.texture
    simulationMaterial.current.uTargetPositionTexture = targetPosTexture
    simulationMaterial.current.uDroneDataTexture = droneDataTexture
    simulationMaterial.current.uniforms.uRepulsionRadius.value = repulsionRadius
    simulationMaterial.current.uniforms.uRepulsionStrength.value = repulsionStrength
    simulationMaterial.current.uniforms.uSearchRadius.value = searchRadius

    gl.setRenderTarget(fbo.write)
    gl.render(simScene.scene, simScene.camera)
    gl.setRenderTarget(null)

    particlesMaterial.current.uPositionTexture = fbo.write.texture
    particlesMaterial.current.uTargetColorTexture = targetColorTexture

    fbo.swap()
    frame.current++
  })

  if (!particleGeometry) return null
  return (
    <>
      <simulationMaterial ref={simulationMaterial} />
      <points>
        <primitive object={particleGeometry} />
        <particlesMaterial ref={particlesMaterial} transparent={true} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </>
  )
}

export function GpgpuBoidsDemo() {
  // --- NEW: State is now managed here, in the parent component ---
  const [currentPhase, setCurrentPhase] = useState(0)

  // --- NEW: Leva controls for choreography and bloom ---
  useControls('Choreography', {
    'Form Shape': button(() => setCurrentPhase(0)),
    'Go Home': button(() => setCurrentPhase(1)),
  })

  const { intensity, luminanceThreshold, luminanceSmoothing } = useControls('Bloom Effect', {
    intensity: { value: 1.2, min: 0, max: 2.0, step: 0.05 },
    luminanceThreshold: { value: 0.1, min: 0, max: 1.0, step: 0.05 },
    luminanceSmoothing: { value: 0.2, min: 0, max: 1.0, step: 0.05 },
  })

  return (
    <React.Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        {/* Pass the state down as a prop */}
        <BoidsSimulation currentPhase={currentPhase} />
        <OrbitControls autoRotate={false} /* Disabled autoRotate for better manual control */ enableZoom={true} />
        <EffectComposer>
          <Bloom intensity={intensity} luminanceThreshold={luminanceThreshold} luminanceSmoothing={luminanceSmoothing} mipmapBlur={true} />
        </EffectComposer>
      </Canvas>
    </React.Suspense>
  )
}
