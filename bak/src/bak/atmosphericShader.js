// Atmospheric effects for realistic drone show lighting

export const volumetricFogVS = /*glsl*/ `
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vec4 viewPosition = viewMatrix * worldPosition;
    vViewPosition = viewPosition.xyz;
    
    gl_Position = projectionMatrix * viewPosition;
  }
`

export const volumetricFogFS = /*glsl*/ `
  uniform float uTime;
  uniform vec3 uCameraPosition;
  uniform sampler2D uPositionTexture;
  uniform float uTextureSize;
  uniform float uDroneCount;
  
  varying vec3 vWorldPosition;
  varying vec3 vViewPosition;
  
  vec3 getFormationColor(float formationGroup) {
    if (formationGroup < 0.5) {
      return vec3(1.0, 0.95, 0.8) * 0.3; // Soft white glow
    } else if (formationGroup < 1.5) {
      return vec3(0.1, 0.4, 1.0) * 0.4; // Blue atmospheric scatter
    } else if (formationGroup < 2.5) {
      return vec3(1.0, 0.2, 0.8) * 0.3; // Magenta haze
    } else {
      return vec3(1.0, 0.3, 0.1) * 0.25; // Orange glow
    }
  }
  
  void main() {
    vec3 rayDir = normalize(vWorldPosition - uCameraPosition);
    vec3 rayStart = uCameraPosition;
    
    vec3 fogColor = vec3(0.0);
    float totalDensity = 0.0;
    
    // Sample along the ray to create volumetric effect
    int steps = 8;
    float stepSize = length(vViewPosition) / float(steps);
    
    for (int i = 0; i < steps; i++) {
      vec3 samplePos = rayStart + rayDir * (float(i) * stepSize);
      
      // Check proximity to drones for light scattering
      float minDist = 999999.0;
      vec3 closestDroneColor = vec3(0.0);
      
      // Sample a subset of drones for performance
      for (float j = 0.0; j < 64.0; j++) {
        vec2 uv = vec2(mod(j, uTextureSize) + 0.5, floor(j / uTextureSize) + 0.5) / uTextureSize;
        vec4 droneData = texture2D(uPositionTexture, uv);
        vec3 dronePos = droneData.xyz;
        float formationGroup = droneData.w;
        
        float dist = distance(samplePos, dronePos);
        if (dist < minDist) {
          minDist = dist;
          closestDroneColor = getFormationColor(formationGroup);
        }
      }
      
      // Create fog density based on distance to nearest drone
      float density = 1.0 / (1.0 + minDist * 0.01);
      density *= 0.1; // Overall fog intensity
      
      // Add some noise for realistic atmospheric variation
      float noise = sin(samplePos.x * 0.01 + uTime * 0.5) * 
                   cos(samplePos.y * 0.01 + uTime * 0.3) * 
                   sin(samplePos.z * 0.01 + uTime * 0.7);
      density *= (0.8 + noise * 0.2);
      
      fogColor += closestDroneColor * density;
      totalDensity += density;
    }
    
    // Fade based on distance
    float fade = 1.0 - smoothstep(500.0, 2000.0, length(vViewPosition));
    
    gl_FragColor = vec4(fogColor * fade, totalDensity * fade * 0.3);
  }
`
