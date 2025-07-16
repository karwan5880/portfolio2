// In a new file: finalInstancedShader.js
import { shader } from 'postprocessing'

export const FinalInstancedShader = {
  uniforms: {
    uTime: { value: 0 },
    uScale: { value: 1.0 },
    uMasterProgress: { value: 0.0 },
    uTextPositions: { value: null }, // Our blueprint texture

    uPulseFrequency: { value: 5.0 }, // How fast the pulse beats
    uPulseDuration: { value: 44.0 }, // How long the launch pulse lasts
    uPulseIsPerpetual: { value: 1.0 }, // A switch (0 for off, 1 for on)
  },
  vertexShader: /*glsl*/ `
    // Uniforms from our React component
    uniform float uTime;
    uniform float uScale;
    uniform float uMasterProgress;
    uniform sampler2D uTextPositions;

    // The unique ID for each drone instance
    attribute float a_id;

    varying vec3 vColor;

    // Constants
    const float PI = 3.14159265359;
    const float DRONE_COUNT = 4096.0;
    const float GRID_SIZE = 16.0;
    const float FLY_UP_HEIGHT = 25.0;
    const float FLIGHT_DURATION = 10.0;

    // Helper Functions
    float random(float n) { return fract(sin(n) * 43758.5453123); }
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }
    
    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }

    // The "Always Upright" Matrix function
    mat4 createMatrix(vec3 position, float scale) {
        return mat4(
            vec4(scale, 0.0,   0.0,   0.0),
            vec4(0.0,   scale, 0.0,   0.0),
            vec4(0.0,   0.0,   scale, 0.0),
            vec4(position, 1.0)
        );
    }

    void main() {
        float hue = random(a_id);
        // We pass the final color to the fragment shader.
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6)); // Hue, Saturation, Lightness


        // --- CHOREOGRAPHY TARGET POSITIONS ---
        
        // TARGET A: The Cube
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3(
            (col - 7.5) * 50.0,
            (row - 7.5) * 50.0,
            (layer - 7.5) * 50.0
        );
        endPosA.y += FLY_UP_HEIGHT * uScale;

        // TARGET B: The Sphere
        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1.0 - 2.0 * droneId_norm);
        float theta = 2.0 * PI * random(a_id);
        float radius = 400.0; // The large, non-colliding radius
        vec3 endPosB = vec3( radius * sin(phi) * cos(theta), radius * sin(phi) * sin(theta), radius * cos(phi) );
        endPosB.y += FLY_UP_HEIGHT * uScale;

        // --- TARGET C: THE "FINALE" TEXT ---
        float texSize = sqrt(DRONE_COUNT);
        vec2 uv = vec2(mod(a_id, texSize) / texSize, floor(a_id / texSize) / texSize);
        vec3 endPosC = texture2D(uTextPositions, uv).xyz;
        endPosC.y += FLY_UP_HEIGHT * uScale; // Center the text vertically

        
        vec3 finalEndPos;
        // Blend from Cube to Sphere
        finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        // Then, blend from the Sphere to the Text
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));

        // // --- MORPHING ---
        // // We smoothly interpolate between the cube and the sphere
        // vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        
        // --- FLIGHT ANIMATION ---
        vec3 startPos = vec3( (mod(a_id, 64.0) - 31.5) * 40.0, -70.0, (floor(a_id / 64.0) - 31.5) * 40.0 );
        float rowDelay = (15.0 - row) * 0.2;
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = smoothstep(0.0, 1.0, clamp((uTime - startTime) / FLIGHT_DURATION, 0.0, 1.0));

        // --- COLLISION AVOIDANCE & FINAL POSITION ---
        vec3 controlPos = endPosA + normalize(endPosA - vec3(0.0, FLY_UP_HEIGHT * uScale, 0.0)) * 750.0;
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);

        // --- MATRIX CREATION ---
        mat4 finalMatrix = createMatrix(finalPos, 1.0);
        
        // This is the instancing magic: we apply our calculated matrix to the vertex position
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /*glsl*/ `
    uniform float uTime;
    varying vec3 vColor;
    
    uniform float uPulseFrequency;
    uniform float uPulseDuration;
    uniform float uPulseIsPerpetual;

    void main() {
        
        float heartbeat = (sin(uTime * uPulseFrequency) + 1.0) / 2.0;
        heartbeat = pow(heartbeat, 3.0);        
        
        float pulseIntensity;
        // pulseIntensity = heartbeat * 5.0;
        float launchFade = 1.0 - smoothstep(0.0, uPulseDuration, uTime);
        pulseIntensity = heartbeat * launchFade * 5.0;
        // if (uPulseIsPerpetual > 0.5) {
        //   pulseIntensity = heartbeat * 5.0;
        // } else {          
        //   float launchFade = 1.0 - smoothstep(0.0, uPulseDuration, uTime);
        //   pulseIntensity = heartbeat * launchFade * 5.0;
        // }
        
        float baseIntensity = 1.5;
        // float emissiveIntensity = baseIntensity + pulseIntensity;
        float emissiveIntensity = baseIntensity + 15.5;

        vec3 finalColor = vColor * emissiveIntensity;        
        gl_FragColor = vec4(finalColor, 1.0);
    
        // float pulse = (sin(uTime * 5.0) + 1.0) / 2.0;
        // float heartbeat = (sin(uTime * 5.0) + 1.0) / 2.0;
        // heartbeat = pow(heartbeat, 3.0);
        // float launchFade = 1.0 - smoothstep(0.0, 4.0, uTime);

        // vec3 finalColor = vColor;
        // float brightness = 1.5 + (pulse * launchFade * 4.0);
        // finalColor += brightness;
        // gl_FragColor = vec4(finalColor, 1.0);

        // float emissiveIntensity = 1.5 + heartbeat * launchFade * 2.0;
        // gl_FragColor = vec4(vColor, 1.0) * emissiveIntensity;
      
        // float pulse = (sin(uTime * 5.0) + 1.0) / 2.0;
        // float launchFade = 1.0 - smoothstep(0.0, 4.0, uTime);
        // float emissiveIntensity = 1.5 + pulse * launchFade * 2.0;
        // gl_FragColor = vec4(0.0, 1.0, 0.4, 1.0) * emissiveIntensity;
    }
  `,
}
