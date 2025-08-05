'use client'

import { shaderMaterial, useFBO, useGLTF } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import React from 'react'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const SIZE = 256

// SimulationMaterial is UNCHANGED. It only cares about position, not color.
const SimulationMaterial = shaderMaterial(
  { uPositionTexture: null, uTargetPositionTexture: null, uDroneDataTexture: null, uTime: 0, uSwitchTime: 0, uTexelSize: new THREE.Vector2(1 / SIZE, 1 / SIZE), uRepulsionRadius: 0.1, uRepulsionStrength: 0.04 },
  /*glsl*/ `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
  /*glsl*/ `varying vec2 vUv;uniform sampler2D uPositionTexture;uniform sampler2D uTargetPositionTexture;uniform sampler2D uDroneDataTexture;uniform float uTime;uniform float uSwitchTime;uniform vec2 uTexelSize;uniform float uRepulsionRadius;uniform float uRepulsionStrength;vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}float cnoise(vec3 P){vec3 Pi0=floor(P);vec3 Pi1=Pi0+vec3(1.);Pi0=mod(Pi0,289.);Pi1=mod(Pi1,289.);vec3 Pf0=fract(P);vec3 Pf1=Pf0-vec3(1.);vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);vec4 iy=vec4(Pi0.yy,Pi1.yy);vec4 iz0=Pi0.zzzz;vec4 iz1=Pi1.zzzz;vec4 ixy=permute(permute(ix)+iy);vec4 ixy0=permute(ixy+iz0);vec4 ixy1=permute(ixy+iz1);vec4 gx0=ixy0/7.;vec4 gy0=fract(floor(gx0)/7.)-.5;gx0=fract(gx0);vec4 gz0=.5-abs(gx0)-abs(gy0);vec4 sz0=step(gz0,vec4(0.));gx0-=sz0*(step(0.,gx0)-.5);gy0-=sz0*(step(0.,gy0)-.5);vec4 gx1=ixy1/7.;vec4 gy1=fract(floor(gx1)/7.)-.5;gx1=fract(gx1);vec4 gz1=.5-abs(gx1)-abs(gy1);vec4 sz1=step(gz1,vec4(0.));gx1-=sz1*(step(0.,gx1)-.5);gy1-=sz1*(step(0.,gy1)-.5);vec3 g000=vec3(gx0.x,gy0.x,gz0.x);vec3 g100=vec3(gx0.y,gy0.y,gz0.y);vec3 g010=vec3(gx0.z,gy0.z,gz0.z);vec3 g110=vec3(gx0.w,gy0.w,gz0.w);vec3 g001=vec3(gx1.x,gy1.x,gz1.x);vec3 g101=vec3(gx1.y,gy1.y,gz1.y);vec3 g011=vec3(gx1.z,gy1.z,gz1.z);vec3 g111=vec3(gx1.w,gy1.w,gz1.w);vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;float n000=dot(g000,Pf0);float n100=dot(g100,vec3(Pf1.x,Pf0.yz));float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z));float n110=dot(g110,vec3(Pf1.xy,Pf0.z));float n001=dot(g001,vec3(Pf0.xy,Pf1.z));float n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));float n011=dot(g011,vec3(Pf0.x,Pf1.yz));float n111=dot(g111,Pf1);vec3 fade_xyz=fade(Pf0);vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);float n_xyz=mix(n_yz.x,n_yz.y,fade_xyz.x);return 2.2*n_xyz;}void main(){vec3 currentPos=texture2D(uPositionTexture,vUv).xyz;vec3 targetPos=texture2D(uTargetPositionTexture,vUv).xyz;vec4 droneData=texture2D(uDroneDataTexture,vUv);vec3 intendedPos=currentPos;float takeoffDelay=1.5;float takeoffTime=uSwitchTime+droneData.x*takeoffDelay;if(uTime>=takeoffTime){vec3 direction=targetPos-currentPos;float distance=length(direction);vec3 velocity=vec3(0.0);float speed=0.08;if(distance>0.01){if(distance<speed){velocity=direction;}else{velocity=normalize(direction)*speed;}}float noise=cnoise(currentPos*0.5+uTime*0.5);velocity+=noise*0.005;intendedPos=currentPos+velocity;}vec3 repulsionVector=vec3(0.0);vec3 neighbor_left=texture2D(uPositionTexture,vUv-vec2(uTexelSize.x,0.0)).xyz;vec3 neighbor_right=texture2D(uPositionTexture,vUv+vec2(uTexelSize.x,0.0)).xyz;vec3 neighbor_top=texture2D(uPositionTexture,vUv+vec2(0.0,uTexelSize.y)).xyz;vec3 neighbor_bottom=texture2D(uPositionTexture,vUv-vec2(0.0,uTexelSize.y)).xyz;vec3 diff_left=intendedPos-neighbor_left;if(length(diff_left)<uRepulsionRadius){repulsionVector+=normalize(diff_left)*(uRepulsionRadius-length(diff_left));}vec3 diff_right=intendedPos-neighbor_right;if(length(diff_right)<uRepulsionRadius){repulsionVector+=normalize(diff_right)*(uRepulsionRadius-length(diff_right));}vec3 diff_top=intendedPos-neighbor_top;if(length(diff_top)<uRepulsionRadius){repulsionVector+=normalize(diff_top)*(uRepulsionRadius-length(diff_top));}vec3 diff_bottom=intendedPos-neighbor_bottom;if(length(diff_bottom)<uRepulsionRadius){repulsionVector+=normalize(diff_bottom)*(uRepulsionRadius-length(diff_bottom));}vec3 finalPos=intendedPos+repulsionVector*uRepulsionStrength;gl_FragColor=vec4(finalPos,1.0);}`
)

// --- START OF RENDER SHADER CHANGES ---
const ParticlesMaterial = shaderMaterial(
  {
    uPositionTexture: null,
    // NEW: A texture dedicated to storing the drone's target color
    uTargetColorTexture: null,
  },
  /*glsl*/ `uniform sampler2D uPositionTexture;varying vec2 vUv;void main(){vec3 pos=texture2D(uPositionTexture,uv).xyz;vUv=uv;vec4 modelPosition=modelMatrix*vec4(pos,1.0);vec4 viewPosition=viewMatrix*modelPosition;vec4 projectedPosition=projectionMatrix*viewPosition;gl_Position=projectedPosition;gl_PointSize=1.7;}`,
  /*glsl*/ `
    varying vec2 vUv;
    uniform sampler2D uTargetColorTexture; // The texture containing the color

    void main() {
      // Read the color for this specific drone from the color texture
      vec3 finalColor = texture2D(uTargetColorTexture, vUv).rgb;

      // Make the colors glow. A simple brightness check determines if it's a "home" drone.
      float brightness = length(finalColor);
      float glow = brightness < 0.6 ? 0.8 : 1.5; // Dim colors get less glow

      gl_FragColor = vec4(finalColor * glow, 0.8);
    }
  `
)
// --- END OF RENDER SHADER CHANGES ---

extend({ SimulationMaterial, ParticlesMaterial })
useGLTF.preload('/monkey.glb')

function BoidsSimulation() {
  const simulationMaterial = useRef()
  const particlesMaterial = useRef()
  const frame = useRef(0)
  const switchTimeRef = useRef(0)
  const lastPhaseRef = useRef(-1)
  const currentTargetPosRef = useRef(null)
  const currentTargetColorRef = useRef(null) // NEW: Ref for the target color texture
  const gltf = useGLTF('/monkey.glb')

  // --- START OF DATA GENERATION CHANGES ---
  const { shapePositionTexture, shapeColorTexture, homePositionTexture, homeColorTexture, initialPositions, particleGeometry } = useMemo(() => {
    if (!gltf) return {}
    const mesh = gltf.nodes.mesh_0
    if (!mesh || !mesh.isMesh || !mesh.geometry) {
      return {}
    }
    const vertices = mesh.geometry.attributes.position.array
    const numVertices = vertices.length / 3
    if (numVertices === 0) {
      return {}
    }

    // Create Position and Color data for the 3D Shape
    const shapePosData = new Float32Array(SIZE * SIZE * 4)
    const shapeColorData = new Float32Array(SIZE * SIZE * 4)
    const colorA = new THREE.Color('#ff0022') // Red
    const colorB = new THREE.Color('#0055ff') // Blue
    // Find model's bounding box to normalize Y-axis for color gradient
    mesh.geometry.computeBoundingBox()
    const minY = mesh.geometry.boundingBox.min.y
    const maxY = mesh.geometry.boundingBox.max.y

    for (let i = 0; i < SIZE * SIZE; i++) {
      const k = i * 4
      const vIndex = (i % numVertices) * 3
      // Position Data
      const px = vertices[vIndex + 0] * 3
      const py = vertices[vIndex + 1] * 3
      const pz = vertices[vIndex + 2] * 3
      shapePosData[k + 0] = px
      shapePosData[k + 1] = py
      shapePosData[k + 2] = pz
      shapePosData[k + 3] = 1.0
      // Color Data (based on normalized height)
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

    // Create Position and Color data for the Home Grid
    const homePosData = new Float32Array(SIZE * SIZE * 4)
    const homeColorData = new Float32Array(SIZE * SIZE * 4)
    const homeCol = new THREE.Color(0.3, 0.3, 0.6) // Dim blue
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

    return { shapePositionTexture: shapePosTexture, shapeColorTexture: shapeColTexture, homePositionTexture: homePosTexture, homeColorTexture: homeColTexture, initialPositions: homePosTexture, particleGeometry: geometry }
  }, [gltf])
  // --- END OF DATA GENERATION CHANGES ---

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

  useFrame(({ gl, clock }) => {
    if (!shapePositionTexture) return
    const fbo = fbos.current
    const time = clock.getElapsedTime()
    const interval = 60.0
    const phaseDuration = interval / 2.0
    const timeInInterval = time % interval
    const currentPhase = Math.floor(timeInInterval / phaseDuration)

    // --- CHOREOGRAPHER UPDATES ---
    if (currentPhase === 0) {
      currentTargetPosRef.current = shapePositionTexture
      currentTargetColorRef.current = shapeColorTexture
    } else {
      currentTargetPosRef.current = homePositionTexture
      currentTargetColorRef.current = homeColorTexture
    }
    // ---

    if (currentPhase !== lastPhaseRef.current) {
      switchTimeRef.current = time
      lastPhaseRef.current = currentPhase
    }
    simScene.mesh.material = simulationMaterial.current
    simulationMaterial.current.uTime = time
    simulationMaterial.current.uSwitchTime = switchTimeRef.current
    simulationMaterial.current.uPositionTexture = frame.current === 0 ? initialPositions : fbo.read.texture
    simulationMaterial.current.uTargetPositionTexture = currentTargetPosRef.current
    simulationMaterial.current.uDroneDataTexture = droneDataTexture

    gl.setRenderTarget(fbo.write)
    gl.render(simScene.scene, simScene.camera)
    gl.setRenderTarget(null)

    // Pass the correct textures to the render material
    particlesMaterial.current.uPositionTexture = fbo.write.texture
    particlesMaterial.current.uTargetColorTexture = currentTargetColorRef.current

    fbo.swap()
    frame.current++
  })

  if (!particleGeometry) {
    return null
  }
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
  return (
    <React.Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <BoidsSimulation />
        <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={true} />
      </Canvas>
    </React.Suspense>
  )
}
