'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import styles from './Earth.module.css'

// --- Constants (no changes) ---
const HOVER_COLOR = '#FFFF00' // Yellow
const DEFAULT_COLOR = '#32CD32' // Lime Green
const latLonToVector3 = (lat, lon, radius) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

const Earth = () => {
  const mountRef = useRef(null)
  const controlsRef = useRef()
  const countryLinesRef = useRef([])
  const hoveredCountryRef = useRef(null)
  // NEW: Refs for raycasting, prevents re-creation
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())

  useEffect(() => {
    const currentMount = mountRef.current

    // --- Scene, Camera, Renderer (unchanged) ---
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
    camera.position.z = 2
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    currentMount.appendChild(renderer.domElement)

    // --- Controls (unchanged) ---
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 1.2
    controls.maxDistance = 3
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // --- Lights (unchanged) ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 3, 5)
    scene.add(directionalLight)

    // --- Earth Sphere (OPTIMIZATION 2) ---
    // Reduced segments from (64, 64) to (32, 32)
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
    const sphereMaterial = new THREE.MeshPhongMaterial({ color: '#003366', shininess: 100 })
    const earthSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    scene.add(earthSphere)

    // --- GeoJSON Loading (unchanged logic) ---
    fetch('/data/countries.geojson')
      .then((res) => res.json())
      .then((data) => {
        data.features.forEach((feature) => {
          const geometry = feature.geometry
          const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates
          polygons.forEach((polygonCoords) => {
            polygonCoords.forEach((ring) => {
              const points = ring.map((point) => {
                const [lon, lat] = point
                return latLonToVector3(lat, lon, 1.005)
              })
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
              const lineMaterial = new THREE.LineBasicMaterial({ color: DEFAULT_COLOR })
              const countryLine = new THREE.Line(lineGeometry, lineMaterial)
              countryLine.userData = { country: feature.properties.ADMIN }
              earthSphere.add(countryLine)
              countryLinesRef.current.push(countryLine)
            })
          })
        })
      })

    // --- OPTIMIZATION 1: Event-driven Raycasting ---
    const onMouseMove = (event) => {
      // Stop auto-rotation on user interaction
      if (controlsRef.current.autoRotate) {
        controlsRef.current.autoRotate = false
      }

      // Calculate mouse position
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Perform raycasting only on mouse move
      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      const intersects = raycasterRef.current.intersectObjects(countryLinesRef.current)

      // Reset previous hover
      if (hoveredCountryRef.current) {
        hoveredCountryRef.current.material.color.set(DEFAULT_COLOR)
        hoveredCountryRef.current = null
      }

      // Set new hover
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object
        intersectedObject.material.color.set(HOVER_COLOR)
        hoveredCountryRef.current = intersectedObject
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    // --- Animation Loop (Now much lighter!) ---
    const animate = () => {
      requestAnimationFrame(animate)
      controlsRef.current.update() // Only updates controls now
      renderer.render(scene, camera)
    }
    animate()

    // --- Cleanup (unchanged) ---
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      currentMount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className={styles.earthContainer} />
}

export default Earth

// 'use client'

// import { useEffect, useRef } from 'react'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// import styles from './Earth.module.css'

// // Function to convert Latitude/Longitude to 3D coordinates
// const latLonToVector3 = (lat, lon, radius) => {
//   const phi = (90 - lat) * (Math.PI / 180)
//   const theta = (lon + 180) * (Math.PI / 180)

//   const x = -(radius * Math.sin(phi) * Math.cos(theta))
//   const z = radius * Math.sin(phi) * Math.sin(theta)
//   const y = radius * Math.cos(phi)

//   return new THREE.Vector3(x, y, z)
// }

// const Earth = () => {
//   const mountRef = useRef(null)

//   useEffect(() => {
//     const currentMount = mountRef.current

//     // 1. Scene
//     const scene = new THREE.Scene()

//     // 2. Camera
//     const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
//     camera.position.z = 2

//     // 3. Renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
//     renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
//     renderer.setPixelRatio(window.devicePixelRatio)
//     currentMount.appendChild(renderer.domElement)

//     // 4. Controls
//     const controls = new OrbitControls(camera, renderer.domElement)
//     controls.enableDamping = true
//     controls.dampingFactor = 0.05
//     controls.minDistance = 1.2
//     controls.maxDistance = 3
//     controls.autoRotate = true // Add auto-rotation
//     controls.autoRotateSpeed = 0.5

//     // 5. Lights
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
//     scene.add(ambientLight)

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
//     directionalLight.position.set(5, 3, 5)
//     scene.add(directionalLight)

//     // 6. Earth Sphere (Oceans)
//     const sphereGeometry = new THREE.SphereGeometry(1, 64, 64)
//     const sphereMaterial = new THREE.MeshPhongMaterial({
//       color: '#003366',
//       shininess: 100,
//     })
//     const earthSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
//     scene.add(earthSphere)

//     // 7. REVISED GEOJSON HANDLING: Draw lines for country borders
//     fetch('/data/countries.geojson')
//       .then((res) => res.json())
//       .then((data) => {
//         data.features.forEach((feature) => {
//           const geometry = feature.geometry
//           const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates

//           polygons.forEach((polygonCoords) => {
//             polygonCoords.forEach((ring) => {
//               const points = []
//               ring.forEach((point) => {
//                 const [lon, lat] = point
//                 points.push(latLonToVector3(lat, lon, 1.005)) // 1.005 to be slightly above the sphere
//               })

//               const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
//               const lineMaterial = new THREE.LineBasicMaterial({
//                 color: '#32CD32', // A bright, visible lime green
//               })
//               const countryLine = new THREE.Line(lineGeometry, lineMaterial)

//               earthSphere.add(countryLine) // Add the line as a child of the sphere
//             })
//           })
//         })
//       })

//     // 8. Animation Loop
//     const animate = () => {
//       requestAnimationFrame(animate)
//       controls.update()
//       renderer.render(scene, camera)
//     }
//     animate()

//     // 9. Handle window resize
//     const handleResize = () => {
//       camera.aspect = currentMount.clientWidth / currentMount.clientHeight
//       camera.updateProjectionMatrix()
//       renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
//     }
//     window.addEventListener('resize', handleResize)

//     // 10. Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize)
//       currentMount.removeChild(renderer.domElement)
//     }
//   }, [])

//   return <div ref={mountRef} className={styles.earthContainer} />
// }

// export default Earth
