import { useFBO } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Advanced HDR Bloom System with multiple passes and tone mapping
export function HDRBloomSystem({ children }) {
  const { gl, scene, camera, size } = useThree()

  // Multiple FBOs for different bloom passes
  const mainFBO = useFBO(size.width, size.height, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  })

  const bloomFBO1 = useFBO(size.width / 2, size.height / 2, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  })

  const bloomFBO2 = useFBO(size.width / 4, size.height / 4, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  })

  const bloomFBO3 = useFBO(size.width / 8, size.height / 8, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  })

  // Quad for full-screen passes
  const quad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial()), [])

  // HDR Extraction Material (extracts bright areas)
  const extractMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          threshold: { value: 0.8 },
          smoothWidth: { value: 0.01 },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float threshold;
      uniform float smoothWidth;
      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(tDiffuse, vUv);
        
        // HDR-aware luminance calculation
        float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        
        // Smooth threshold for better quality
        float alpha = smoothstep(threshold - smoothWidth, threshold + smoothWidth, luminance);
        
        // Extract bright areas with HDR preservation
        gl_FragColor = vec4(color.rgb * alpha, 1.0);
      }
    `,
      }),
    []
  )

  // Gaussian Blur Material
  const blurMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          resolution: { value: new THREE.Vector2() },
          direction: { value: new THREE.Vector2(1, 0) },
          radius: { value: 1.0 },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform vec2 direction;
      uniform float radius;
      varying vec2 vUv;
      
      void main() {
        vec2 texelSize = 1.0 / resolution;
        vec4 color = vec4(0.0);
        
        // High-quality gaussian blur
        float weights[9];
        weights[0] = 0.227027; weights[1] = 0.1945946; weights[2] = 0.1216216;
        weights[3] = 0.054054; weights[4] = 0.016216; weights[5] = 0.016216;
        weights[6] = 0.054054; weights[7] = 0.1216216; weights[8] = 0.1945946;
        
        color += texture2D(tDiffuse, vUv) * weights[0];
        
        for(int i = 1; i < 9; i++) {
          vec2 offset = direction * texelSize * float(i) * radius;
          color += texture2D(tDiffuse, vUv + offset) * weights[i];
          color += texture2D(tDiffuse, vUv - offset) * weights[i];
        }
        
        gl_FragColor = color;
      }
    `,
      }),
    []
  )

  // Final Composite Material with HDR tone mapping
  const compositeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          tBloom1: { value: null },
          tBloom2: { value: null },
          tBloom3: { value: null },
          bloomIntensity: { value: 2.0 },
          exposure: { value: 1.0 },
          gamma: { value: 2.2 },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform sampler2D tBloom1;
      uniform sampler2D tBloom2;
      uniform sampler2D tBloom3;
      uniform float bloomIntensity;
      uniform float exposure;
      uniform float gamma;
      varying vec2 vUv;
      
      // Advanced tone mapping functions
      vec3 reinhardToneMapping(vec3 color) {
        return color / (color + vec3(1.0));
      }
      
      vec3 filmicToneMapping(vec3 color) {
        vec3 x = max(vec3(0.0), color - 0.004);
        return (x * (6.2 * x + 0.5)) / (x * (6.2 * x + 1.7) + 0.06);
      }
      
      vec3 acesToneMapping(vec3 color) {
        const float a = 2.51;
        const float b = 0.03;
        const float c = 2.43;
        const float d = 0.59;
        const float e = 0.14;
        return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
      }
      
      void main() {
        // Sample all textures
        vec4 base = texture2D(tDiffuse, vUv);
        vec4 bloom1 = texture2D(tBloom1, vUv);
        vec4 bloom2 = texture2D(tBloom2, vUv);
        vec4 bloom3 = texture2D(tBloom3, vUv);
        
        // Combine bloom passes with different intensities
        vec3 bloom = bloom1.rgb * 1.0 + bloom2.rgb * 0.8 + bloom3.rgb * 0.6;
        
        // HDR combination
        vec3 hdrColor = base.rgb + bloom * bloomIntensity;
        
        // Apply exposure
        hdrColor *= exposure;
        
        // Advanced tone mapping (ACES for film-like look)
        vec3 toneMapped = acesToneMapping(hdrColor);
        
        // Gamma correction
        toneMapped = pow(toneMapped, vec3(1.0 / gamma));
        
        gl_FragColor = vec4(toneMapped, 1.0);
      }
    `,
      }),
    []
  )

  const tempScene = useMemo(() => new THREE.Scene(), [])
  const tempCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])

  useFrame(() => {
    // 1. Render main scene to HDR buffer
    gl.setRenderTarget(mainFBO)
    gl.render(scene, camera)

    // 2. Extract bright areas
    quad.material = extractMaterial
    extractMaterial.uniforms.tDiffuse.value = mainFBO.texture
    gl.setRenderTarget(bloomFBO1)
    gl.render(tempScene, tempCamera)

    // 3. Blur pass 1 (horizontal)
    quad.material = blurMaterial
    blurMaterial.uniforms.tDiffuse.value = bloomFBO1.texture
    blurMaterial.uniforms.resolution.value.set(bloomFBO1.width, bloomFBO1.height)
    blurMaterial.uniforms.direction.value.set(1, 0)
    blurMaterial.uniforms.radius.value = 1.0
    gl.setRenderTarget(bloomFBO2)
    gl.render(tempScene, tempCamera)

    // 4. Blur pass 1 (vertical)
    blurMaterial.uniforms.tDiffuse.value = bloomFBO2.texture
    blurMaterial.uniforms.direction.value.set(0, 1)
    gl.setRenderTarget(bloomFBO1)
    gl.render(tempScene, tempCamera)

    // 5. Blur pass 2 (larger radius)
    blurMaterial.uniforms.tDiffuse.value = bloomFBO1.texture
    blurMaterial.uniforms.resolution.value.set(bloomFBO2.width, bloomFBO2.height)
    blurMaterial.uniforms.direction.value.set(1, 0)
    blurMaterial.uniforms.radius.value = 2.0
    gl.setRenderTarget(bloomFBO2)
    gl.render(tempScene, tempCamera)

    blurMaterial.uniforms.tDiffuse.value = bloomFBO2.texture
    blurMaterial.uniforms.direction.value.set(0, 1)
    gl.setRenderTarget(bloomFBO3)
    gl.render(tempScene, tempCamera)

    // 6. Final composite with tone mapping
    quad.material = compositeMaterial
    compositeMaterial.uniforms.tDiffuse.value = mainFBO.texture
    compositeMaterial.uniforms.tBloom1.value = bloomFBO1.texture
    compositeMaterial.uniforms.tBloom2.value = bloomFBO2.texture
    compositeMaterial.uniforms.tBloom3.value = bloomFBO3.texture

    // Render to screen
    gl.setRenderTarget(null)
    gl.render(tempScene, tempCamera)
  })

  // Add quad to temp scene
  React.useEffect(() => {
    tempScene.add(quad)
    return () => tempScene.remove(quad)
  }, [tempScene, quad])

  return <>{children}</>
}
