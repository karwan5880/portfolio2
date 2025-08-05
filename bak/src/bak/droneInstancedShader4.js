// SHADER 1: The "Compute" Shader
// This runs off-screen. Its only job is to calculate the ideal, orchestrated
// flight path for each drone and write that position into a texture.

export const positionComputeShaderFS = /*glsl*/ `
  // All the logic from our old vertex shader is moved here.
  uniform float uTime;
  uniform float uScale;
  uniform float uMasterProgress;
  varying vec2 vUv; // The pixel coordinate in our texture

  // We are creating a DataTexture, so we need a way to read from our other data texture
  uniform sampler2D uTextPositions;

  #define PI 3.14159265359
  #define DRONE_COUNT 4096.0
  #define GRID_SIZE 16.0
  #define FLY_UP_HEIGHT 25.0
  #define FLIGHT_DURATION 10.0

  float random(float n) { return fract(sin(n) * 43758.5453123); }
  vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }

  void main() {
    float texSize = sqrt(DRONE_COUNT);
    // Calculate the drone ID from the pixel coordinate
    float a_id = floor(vUv.x * texSize) + floor(vUv.y * texSize) * texSize;
    
    // The entire flight path calculation from the old vertex shader
    float hue = random(a_id);
    float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
    float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
    float col = mod(a_id, GRID_SIZE);
    vec3 endPosA = vec3((col-7.5)*50.,(row-7.5)*50.,(layer-7.5)*50.);
    endPosA.y += FLY_UP_HEIGHT * uScale;
    float droneId_norm = a_id / DRONE_COUNT;
    float phi = acos(1. - 2. * droneId_norm);
    float theta = 2. * PI * random(a_id);
    float radius = 400.;
    vec3 endPosB = vec3(radius*sin(phi)*cos(theta), radius*sin(phi)*sin(theta), radius*cos(phi));
    endPosB.y += FLY_UP_HEIGHT * uScale;
    vec2 uv_text = vec2(mod(a_id, texSize)/texSize, floor(a_id/texSize)/texSize);
    vec3 endPosC = texture2D(uTextPositions, uv_text).xyz;
    endPosC.y += FLY_UP_HEIGHT * uScale;
    vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.,1.,uMasterProgress));
    finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.,2.,uMasterProgress));
    vec3 startPos = vec3((mod(a_id, 64.)-31.5)*40., -70., (floor(a_id/64.)-31.5)*40.);
    float rowDelay = (15. - row) * 0.2;
    float droneDelay = random(a_id) * 0.1;
    float startTime = rowDelay + droneDelay;
    float progress = smoothstep(0.,1.,clamp((uTime-startTime)/FLIGHT_DURATION,0.,1.));
    vec3 controlPos = endPosA + normalize(endPosA-vec3(0,FLY_UP_HEIGHT*uScale,0))*750.;
    vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);

    // Write the final calculated position to the output texture.
    // We can store other data (like color) in the alpha channel if needed.
    gl_FragColor = vec4(finalPos, 1.0);
  }
`

// 2. Grid Hashing (Fragment Shader)
// Takes a position and computes a spatial hash key.
export const hashComputeShaderFS = /*glsl*/`
    uniform sampler2D uPositionTexture;
    uniform float uGridCellSize;
    varying vec2 vUv;
    #define DRONE_COUNT 4096.0

    void main() {
        vec3 pos = texture2D(uPositionTexture, vUv).xyz;
        ivec3 cellCoords = ivec3(floor(pos / uGridCellSize));
        float hash = float(cellCoords.x*92837111 ^ cellCoords.y*689287499 ^ cellCoords.z*283923481);
        float droneId = floor(vUv.x * sqrt(DRONE_COUNT)) + floor(vUv.y * sqrt(DRONE_COUNT)) * sqrt(DRONE_COUNT);
        gl_FragColor = vec4(hash, droneId, 0.0, 1.0);
    }
`;

// 3. Bitonic Sort (Fragment Shader)
// The core of the GPU sort. It performs one step of a Bitonic Merge Sort.
// It will be run multiple times with different uniforms to sort the entire list.
export const bitonicSortShaderFS = /*glsl*/`
    uniform sampler2D uTexture;
    uniform int uStage;
    uniform int uSubStage;
    varying vec2 vUv;
    #define DRONE_COUNT 4096.0

    void main() {
        float droneIndex = floor(vUv.x * DRONE_COUNT) + floor(vUv.y * 1.0) * 0.0; // Simplified for 1D texture access
        
        int a = int(floor(droneIndex));
        int b = a ^ (1 << uSubStage);

        bool greater = (a > b);

        vec4 valA = texture2D(uTexture, vec2(float(a) / DRONE_COUNT, 0.5));
        vec4 valB = texture2D(uTexture, vec2(float(b) / DRONE_COUNT, 0.5));

        bool swap = greater;
        if ((a & (1 << uStage)) != 0) {
            swap = !greater;
        }

        if (valA.x > valB.x) {
            if (swap) gl_FragColor = valB;
            else gl_FragColor = valA;
        } else {
            if (swap) gl_FragColor = valA;
            else gl_FragColor = valB;
        }
    }
`;


// SHADER 2: The Final Rendering Vertex Shader
// This is now much simpler. It reads the ideal position from the texture, then
// adds the separation force.
export const finalRenderShaderVS  = /*glsl*/ `
  // This texture contains the ideal positions calculated in the compute pass
  uniform sampler2D uPositionTexture;
  uniform float uTime;

  // Parameters for the separation force
  uniform float uSafetyRadius;
  uniform float uSeparationStrength;

  attribute float a_id;
  varying vec3 vNormal;
  varying vec3 vColor;
  
  #define DRONE_COUNT 4096.0

  float random(float n) { return fract(sin(n + uTime) * 43758.5453123); }
  vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
      return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }
  mat4 createMatrix(vec3 p, float s) { return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    float hue = fract(sin(a_id) * 43758.5453123);
    vColor = hsl2rgb(vec3(hue, 0.8, 0.6));

    float texSize = sqrt(DRONE_COUNT);
    // Calculate this drone's UV coordinate to read from the position texture
    vec2 ownUv = vec2(mod(a_id, texSize) / texSize, floor(a_id / texSize) / texSize);
    vec3 idealPos = texture2D(uPositionTexture, ownUv).xyz;

    // --- COLLISION AVOIDANCE LOGIC ---
    vec3 separationForce = vec3(0.0);
    // To save performance, we don't check all 4095 other drones.
    // We check a small number of random neighbors. 16 is a good starting point.
    for (int i = 0; i < 16; i++) {
      // Get a random neighbor ID
      float neighborId = floor(random(float(i)) * DRONE_COUNT);
      // Don't check against ourselves
      if (neighborId == a_id) continue;

      // Find the neighbor's position in the texture
      vec2 neighborUv = vec2(mod(neighborId, texSize) / texSize, floor(neighborId / texSize) / texSize);
      vec3 neighborPos = texture2D(uPositionTexture, neighborUv).xyz;

      float dist = distance(idealPos, neighborPos);

      // If the neighbor is too close...
      if (dist < uSafetyRadius) {
        // ...calculate a force pushing away from it.
        vec3 pushVector = idealPos - neighborPos;
        // The closer the neighbor, the stronger the push.
        separationForce += normalize(pushVector) / dist;
      }
    }

    // Apply the separation force to the ideal position
    vec3 finalPos = idealPos + separationForce * uSeparationStrength;

    mat4 finalMatrix = createMatrix(finalPos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
  }
`



// This is correct and unchanged.
export const lightShaderFS  = /*glsl*/ `
  uniform float uTime;
  uniform float uPulseFrequency;
  varying vec3 vColor;
  void main() {
    float heartbeat = (sin(uTime * uPulseFrequency) + 1.0) / 2.0;
    heartbeat = pow(heartbeat, 3.0);
    float pulseIntensity = heartbeat * 5.0;
    float baseIntensity = 10.0;
    vec3 finalColor = vColor * (baseIntensity + pulseIntensity);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// THE NEW BODY SHADER: Performs simple, classic lighting.
export const bodyShaderFS  = /*glsl*/ `
  uniform vec3 uSunlightDirection;
  uniform float uAmbientLight;
  varying vec3 vNormal; // Receives the normal from the vertex shader

  void main() {
    // Calculate diffuse lighting
    float diffuse = max(0.0, dot(vNormal, uSunlightDirection));
    vec3 lighting = vec3(diffuse) + vec3(uAmbientLight);

    vec3 bodyColor = vec3(0.05, 0.05, 0.05); // Dark plastic color
    vec3 finalColor = bodyColor * lighting;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// export const DroneInstancedShader = {
//   positionComputeFragmentShader,
//   finalRenderVertexShader,
//   lightFragmentShader,
//   bodyFragmentShader,
// }
