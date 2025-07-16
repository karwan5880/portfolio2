'use client'

import { gsap } from 'gsap'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const Scene = forwardRef(({ onMarkerClick, selectedSection }, ref) => {
  const mountRef = useRef(null)
  const controlsRef = useRef()
  const cameraRef = useRef()
  const isAnimatingRef = useRef(false)
  const activeTweenRef = useRef(null) // NEW: To store and kill active animations
  const hoveredMarkerRef = useRef(null)

  // NEW: useImperativeHandle exposes a function to the parent component (page.js)
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (activeTweenRef.current) {
        activeTweenRef.current.kill()
      }
      isAnimatingRef.current = true
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true
      }
      gsap.to(cameraRef.current.position, {
        duration: 2,
        x: 0,
        y: 0,
        z: 5,
        ease: 'power3.inOut',
        onComplete: () => {
          isAnimatingRef.current = false
        },
      })
      activeTweenRef.current = gsap.to(controlsRef.current.target, {
        duration: 2,
        x: 0,
        y: 0,
        z: 0,
        ease: 'power3.inOut',
      })
    },
  }))

  useEffect(() => {
    // === THREE.JS CODE START ===
    const currentMount = mountRef.current

    // 1. Scene
    const scene = new THREE.Scene()

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera // Store camera in ref

    // // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
    currentMount.appendChild(renderer.domElement)
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.1, 0.1)
    composer.addPass(bloomPass)

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.enablePan = false
    controls.enableZoom = false
    controls.minDistance = 3
    controls.maxDistance = 6
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controlsRef.current = controls

    // 6. The Planet
    const textureLoader = new THREE.TextureLoader()
    const planetTexture = textureLoader.load('/textures/earthmap.jpg')
    const planetGeometry = new THREE.SphereGeometry(2, 64, 64)
    const planetMaterial = new THREE.MeshStandardMaterial({ map: planetTexture })
    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    scene.add(planet)

    //
    // 6a. Atmosphere
    const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
    varying vec3 vertexNormal;
    void main() {
      vertexNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
      fragmentShader: `
    varying vec3 vertexNormal;
    void main() {
      float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
      gl_FragColor = vec4(0.8, 0.7, 1.0, 1.0) * intensity;
    }
  `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)
    //

    // after created the planet
    const cloudTexture = textureLoader.load('/textures/earth_clouds.png') // Add this to your /public/textures folder
    const cloudGeometry = new THREE.SphereGeometry(2.05, 64, 64)
    const cloudMaterial = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4,
    })
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
    planet.add(cloudMesh) // Add as a child so it rotates with the planet

    // 7. Markers
    const markers = [
      { name: 'About', position: new THREE.Vector3().setFromSphericalCoords(2.1, Math.PI / 4, Math.PI / 4) },
      { name: 'Projects', position: new THREE.Vector3().setFromSphericalCoords(2.1, Math.PI / 2, -Math.PI / 2) },
      { name: 'Contact', position: new THREE.Vector3().setFromSphericalCoords(2.1, (Math.PI * 3) / 4, Math.PI) },
    ]
    const markerMeshes = []
    markers.forEach((markerInfo) => {
      const markerGeometry = new THREE.SphereGeometry(0.08, 16, 16)
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xa770ef, toneMapped: false })
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial)
      markerMesh.position.copy(markerInfo.position)
      markerMesh.userData.name = markerInfo.name // Store name for raycasting
      planet.add(markerMesh) // Add marker as a child of the planet
      markerMeshes.push(markerMesh)
      gsap.to(markerMesh.scale, {
        duration: 2,
        x: 1.2,
        y: 1.2,
        z: 1.2,
        ease: 'sine.inOut',
        yoyo: true, // Reverses the animation on each repeat
        repeat: -1, // Repeats indefinitely
        delay: Math.random() * 2, // Stagger the start time for a more natural look
      })
    })

    // 8. Stars
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.015 })
    const starVertices = []
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000
      const y = (Math.random() - 0.5) * 2000
      const z = (Math.random() - 0.5) * 2000
      const dist = Math.sqrt(x * x + y * y + z * z)
      if (dist > 100) starVertices.push(x, y, z) // only push stars outside a certain radius
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // 9. Raycasting for marker clicks
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseClick = (event) => {
      // We only trigger the animation if no section is currently selected AND not already animating
      if (selectedSection || isAnimatingRef.current) {
        return
      }

      mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1
      mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markerMeshes)

      if (intersects.length > 0) {
        isAnimatingRef.current = true // Mark as animating
        controls.autoRotate = false
        const marker = intersects[0].object
        const markerPosition = new THREE.Vector3()
        marker.getWorldPosition(markerPosition)

        gsap.to(camera.position, {
          duration: 2,
          x: markerPosition.x * 2,
          y: markerPosition.y * 2,
          z: markerPosition.z * 2,
          ease: 'power3.inOut',
        })

        gsap.to(controls.target, {
          duration: 2,
          x: markerPosition.x,
          y: markerPosition.y,
          z: markerPosition.z,
          ease: 'power3.inOut',
          onComplete: () => {
            onMarkerClick(marker.userData.name)
            isAnimatingRef.current = false // Mark as done animating
          },
        })
      }
    }

    window.addEventListener('click', onMouseClick)
    let time = 0

    // 10. Animation Loop
    const animate = () => {
      requestAnimationFrame(animate)
      time += 0.01
      // if (!isAnimatingRef.current && !selectedSection) {
      //   cameraRef.current.position.x = 5 * Math.sin(time * 0.1)
      //   cameraRef.current.position.z = 5 * Math.cos(time * 0.1)
      //   cameraRef.current.lookAt(scene.position) // Ensure camera always looks at the center
      // }
      if (controlsRef.current && controlsRef.current.autoRotate) {
        // Slightly vary the rotation speed for a more organic feel
        controlsRef.current.autoRotateSpeed = 0.2 + Math.sin(time * 0.1) * 0.2
      }
      if (!isAnimatingRef.current) {
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(markerMeshes)
        if (intersects.length > 0) {
          const newHoveredMarker = intersects[0].object
          // If we are hovering over a new marker
          if (hoveredMarkerRef.current !== newHoveredMarker) {
            // Scale down the previously hovered marker
            if (hoveredMarkerRef.current) {
              gsap.to(hoveredMarkerRef.current.scale, { duration: 0.3, x: 1, y: 1, z: 1, ease: 'power2.out' })
            }
            // Scale up the new marker
            hoveredMarkerRef.current = newHoveredMarker
            gsap.to(hoveredMarkerRef.current.scale, { duration: 0.3, x: 1.5, y: 1.5, z: 1.5, ease: 'power2.out' })
            // Change cursor
            currentMount.style.cursor = 'pointer'
          }
        } else {
          // If we are not hovering over any marker
          if (hoveredMarkerRef.current) {
            // Scale down the previously hovered marker
            gsap.to(hoveredMarkerRef.current.scale, { duration: 0.3, x: 1, y: 1, z: 1, ease: 'power2.out' })
            hoveredMarkerRef.current = null

            // Change cursor back
            currentMount.style.cursor = 'auto'
          }
        }
      }
      controls.update() // only required if controls.enableDamping = true, or if controls.autoRotate = true
      //   renderer.render(scene, camera)
      composer.render()
      cloudMesh.rotation.y += 0.0002 // Slower, independent rotation for clouds
    }
    animate()

    // We need an event listener to track the mouse position continuously
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / currentMount.clientWidth) * 2 - 1
      mouse.y = -(event.clientY / currentMount.clientHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMouseMove)

    // 11. Handle window resize
    const onWindowResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight)
      composer.setSize(currentMount.clientWidth, currentMount.clientHeight) // also resize composer
    }
    window.addEventListener('resize', onWindowResize)

    // 12. Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('click', onMouseClick)
      currentMount.removeChild(renderer.domElement)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [selectedSection, onMarkerClick]) // THE FIX: Add dependencies here.

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
})

// NEW: Add display name for easier debugging
Scene.displayName = 'Scene'

export default Scene
