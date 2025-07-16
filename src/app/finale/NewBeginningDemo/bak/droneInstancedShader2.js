// droneInstancedShader.js

// This is the shared logic for calculating the flight path of EVERY drone part.
// It is identical to our previous vertex shader.
const vertexShader = /*glsl*/ `
  uniform float uTime;
  uniform float uScale;
  uniform float uMasterProgress;
  uniform sampler2D uTextPositions;

  attribute float a_id;

  varying vec3 vColor;

  const float PI = 3.14159265359;
  const float DRONE_COUNT = 4096.0;
  const float GRID_SIZE = 16.0;
  const float FLY_UP_HEIGHT = 25.0;
  const float FLIGHT_DURATION = 10.0;

  float random(float n) { return fract(sin(n) * 43758.5453123); }
  vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }
  vec3 hsl2rgb(vec3 c) {
      vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
      return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
  }
  mat4 createMatrix(vec3 position, float scale) {
      return mat4(vec4(scale,0,0,0), vec4(0,scale,0,0), vec4(0,0,scale,0), vec4(position, 1.0));
  }

  void main() {
    float hue = random(a_id);
    vColor = hsl2rgb(vec3(hue, 0.8, 0.6));

    float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
    float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
    float col = mod(a_id, GRID_SIZE);
    vec3 endPosA = vec3((col-7.5)*50.0, (row-7.5)*50.0, (layer-7.5)*50.0);
    endPosA.y += FLY_UP_HEIGHT * uScale;

    float droneId_norm = a_id / DRONE_COUNT;
    float phi = acos(1.0 - 2.0 * droneId_norm);
    float theta = 2.0 * PI * random(a_id);
    float radius = 400.0;
    vec3 endPosB = vec3(radius*sin(phi)*cos(theta), radius*sin(phi)*sin(theta), radius*cos(phi));
    endPosB.y += FLY_UP_HEIGHT * uScale;

    float texSize = sqrt(DRONE_COUNT);
    vec2 uv_text = vec2(mod(a_id, texSize)/texSize, floor(a_id/texSize)/texSize);
    vec3 endPosC = texture2D(uTextPositions, uv_text).xyz;
    endPosC.y += FLY_UP_HEIGHT * uScale;

    vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
    finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));

    vec3 startPos = vec3((mod(a_id, 64.0)-31.5)*40.0, -70.0, (floor(a_id/64.0)-31.5)*40.0);
    float rowDelay = (15.0 - row) * 0.2;
    float droneDelay = random(a_id) * 0.1;
    float startTime = rowDelay + droneDelay;
    float progress = smoothstep(0.0, 1.0, clamp((uTime - startTime) / FLIGHT_DURATION, 0.0, 1.0));

    vec3 controlPos = endPosA + normalize(endPosA-vec3(0,FLY_UP_HEIGHT*uScale,0)) * 750.0;
    vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);

    // The 'position' attribute here comes from the model (sphere or body)
    // and is placed at the final calculated drone position.
    mat4 finalMatrix = createMatrix(finalPos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
  }
`

// This is the simple appearance for the glowing light sphere.
const lightFragmentShader = /*glsl*/ `
  uniform float uTime;
  uniform float uPulseFrequency;
  varying vec3 vColor;

  void main() {
    float heartbeat = (sin(uTime * uPulseFrequency) + 1.0) / 2.0;
    heartbeat = pow(heartbeat, 3.0);
    
    float pulseIntensity = heartbeat * 5.0;
    float baseIntensity = 10.0;
    
    vec3 finalColor = vColor * (baseIntensity + pulseIntensity);
    
    // We use gl_FragColor here. For more advanced pipelines you might use custom output variables.
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// This is the simple appearance for the dark, non-glowing body.
const bodyFragmentShader = /*glsl*/ `
  void main() {
    // A simple, hardcoded dark color for the drone body.
    // It will be lit by the global lights in your main R3F scene.
    gl_FragColor = vec4(0.05, 0.05, 0.05, 1.0);
  }
`

export const DroneInstancedShader = {
  vertexShader,
  lightFragmentShader,
  bodyFragmentShader,
}
