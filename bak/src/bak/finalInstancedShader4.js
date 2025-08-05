import { shader } from 'postprocessing'

export const FinalInstancedShader = {
  uniforms: {
    uTime: { value: 0 },
    uScale: { value: 1.0 },
    uMasterProgress: { value: 0.0 },
    uTextPositions: { value: null }, //

    uPulseFrequency: { value: 5.0 }, //
    uPulseDuration: { value: 44.0 }, //
    uPulseIsPerpetual: { value: 1.0 }, //
    //
    uSunlightDirection: { value: null },
    uSunlightColor: { value: null },
    uAmbientLight: { value: null },
  },
  vertexShader: /*glsl*/ `
    uniform float uTime;
    uniform float uScale;
    uniform float uMasterProgress;
    uniform sampler2D uTextPositions;

    attribute float a_id;
        
    // attribute vec2 uv;     // <-- ADD: Receive UV attribute
    // attribute vec3 normal; // <-- ADD: Receive normal attribute

    varying vec3 vColor;
    varying vec2 vUv;      // <-- ADD: Varying to pass UVs
    varying vec3 vNormal;  // <-- ADD: Varying to pass normals


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
        return mat4(
            vec4(scale, 0.0,   0.0,   0.0),
            vec4(0.0,   scale, 0.0,   0.0),
            vec4(0.0,   0.0,   scale, 0.0),
            vec4(position, 1.0)
        );
    }

    void main() {
        vUv = uv; // <-- ADD: Pass the UV coordinates through

        // ADD: Transform the normal to world space for lighting
        vNormal = normalize(normalMatrix * normal);

        float hue = random(a_id);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6)); //


        
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3(
            (col - 7.5) * 50.0,
            (row - 7.5) * 50.0,
            (layer - 7.5) * 50.0
        );
        endPosA.y += FLY_UP_HEIGHT * uScale;

        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1.0 - 2.0 * droneId_norm);
        float theta = 2.0 * PI * random(a_id);
        float radius = 400.0; // The large, non-colliding radius
        vec3 endPosB = vec3( radius * sin(phi) * cos(theta), radius * sin(phi) * sin(theta), radius * cos(phi) );
        endPosB.y += FLY_UP_HEIGHT * uScale;

        float texSize = sqrt(DRONE_COUNT);
        vec2 uv = vec2(mod(a_id, texSize) / texSize, floor(a_id / texSize) / texSize);
        vec3 endPosC = texture2D(uTextPositions, uv).xyz;
        endPosC.y += FLY_UP_HEIGHT * uScale; // Center the text vertically

        
        vec3 finalEndPos;
        finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));

        vec3 startPos = vec3( (mod(a_id, 64.0) - 31.5) * 40.0, -70.0, (floor(a_id / 64.0) - 31.5) * 40.0 );
        float rowDelay = (15.0 - row) * 0.2;
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = smoothstep(0.0, 1.0, clamp((uTime - startTime) / FLIGHT_DURATION, 0.0, 1.0));

        vec3 controlPos = endPosA + normalize(endPosA - vec3(0.0, FLY_UP_HEIGHT * uScale, 0.0)) * 750.0;
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);

            
        mat4 finalMatrix = createMatrix(finalPos, 1.0);
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
        
        
    }
  `,
  fragmentShader: /*glsl*/ `
    uniform float uTime;
    
    uniform float uPulseFrequency;
    uniform float uPulseDuration;
    uniform float uPulseIsPerpetual;

    // NEW Lighting Uniforms
    uniform vec3 uSunlightDirection;
    uniform vec3 uSunlightColor;
    uniform float uAmbientLight;
    
    varying vec3 vColor;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {

      vec3 finalColor;
      // The UV Check!
      // We check if the pixel's y-coordinate on the UV map is in the top 5%
      if (vUv.y > 0.95) {
        // THIS IS AN LED PIXEL
        float heartbeat = (sin(uTime * uPulseFrequency) + 1.0) / 2.0;
        heartbeat = pow(heartbeat, 3.0);        
        float pulseIntensity = heartbeat * 5.0; // Pulse with high intensity
        float baseIntensity = 10.0; // LEDs are always bright
        finalColor = vColor * (baseIntensity + pulseIntensity);
      } else {
        // THIS IS A BODY PIXEL
        float diffuse = max(0.0, dot(vNormal, uSunlightDirection));
        vec3 lighting = (uSunlightColor * diffuse) + uAmbientLight;
        // The drone body is a dark, non-emissive plastic material
        vec3 bodyColor = vec3(0.05, 0.05, 0.05); 
        finalColor = bodyColor * lighting;
      }      
      gl_FragColor = vec4(finalColor, 1.0);

      // gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);

        // float heartbeat = (sin(uTime * uPulseFrequency) + 1.0) / 2.0;
        // heartbeat = pow(heartbeat, 3.0);        
        // float pulseIntensity;
        // float launchFade = 1.0 - smoothstep(0.0, uPulseDuration, uTime);
        // pulseIntensity = heartbeat * launchFade * 5.0;
        // float baseIntensity = 1.5;
        // float emissiveIntensity = baseIntensity + 0.01;
        // // float emissiveIntensity = baseIntensity + 15.5;
        // vec3 finalColor = vColor * emissiveIntensity;        
        // gl_FragColor = vec4(finalColor, 1.0);    
    }
  `,
}
