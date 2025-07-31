// droneInstancedShader.js

// This vertex shader is now used by BOTH the light and the body.
// It calculates the final position and passes the normal for lighting.
const vertexShader = /*glsl*/ `
  uniform float uTime;
  uniform float uScale;
  uniform float uMasterProgress;
  uniform sampler2D uTextPositions;
  attribute float a_id;

  // We need to pass the normal to the fragment shader for lighting
  varying vec3 vNormal;
  varying vec3 vColor;

  #define PI 3.14159265359
  #define DRONE_COUNT 4096.0
  #define GRID_SIZE 16.0
  #define FLY_UP_HEIGHT 25.0
  #define FLIGHT_DURATION 10.0

  float random(float n) { return fract(sin(n) * 43758.5453123); }
  vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }
    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }  
    mat4 createMatrix(vec3 p, float s) { return mat4(s,0,0,0, 0,s,0,0, 0,0,s,0, p.x,p.y,p.z,1.0); }

  void main() {
    // Pass the model's normal, transformed to world space, to the fragment shader
    vNormal = normalize(normalMatrix * normal);
    
    // The rest of this is the same proven flight path logic
    float hue = random(a_id);
    vColor = hsl2rgb(vec3(hue, 0.8, 0.6));
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
    float texSize = sqrt(DRONE_COUNT);
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
    mat4 finalMatrix = createMatrix(finalPos, 1.0);
    gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
  }
`

// This is correct and unchanged.
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
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

// THE NEW BODY SHADER: Performs simple, classic lighting.
const bodyFragmentShader = /*glsl*/ `
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

export const DroneInstancedShader = {
  vertexShader,
  lightFragmentShader,
  bodyFragmentShader,
}
