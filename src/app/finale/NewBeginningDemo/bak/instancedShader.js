export const InstancedParticleShader = {
  vertexShader: /*glsl*/ `
    // Uniforms
    uniform float uTime;
    uniform float uScale;
    uniform float uMasterProgress;

    // Attributes
    attribute float a_id;

    // Constants
    const float PI = 3.14159265359;
    const float DRONE_COUNT = 4096.0;
    const float GRID_SIZE = 16.0;
    const float FLY_UP_HEIGHT = 25.0;
    const float FLIGHT_DURATION = 10.0;

    // Helper Functions
    float random(float n) { return fract(sin(n) * 43758.5453123); }
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }
    
    mat4 createMatrix(vec3 position, vec3 lookAtTarget, float scale) {
      vec3 forward = normalize(lookAtTarget - position);
      vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
      vec3 up = normalize(cross(forward, right));
      return mat4( vec4(right * scale, 0.0), vec4(up * scale, 0.0), vec4(forward * scale, 0.0), vec4(position, 1.0) );
    }

    void main() {
        // --- Choreography Target Positions ---
        
        // TARGET A: Cube
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3(
            (col - (GRID_SIZE - 1.0) / 2.0) * 30.0,
            (row - (GRID_SIZE - 1.0) / 2.0) * 30.0,
            (layer - (GRID_SIZE - 1.0) / 2.0) * 30.0
        );
        endPosA.y += FLY_UP_HEIGHT;
        endPosA *= uScale;

        // TARGET B: Sphere
        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1.0 - 2.0 * droneId_norm);
        float theta = 2.0 * PI * random(a_id);
        float radius = 150.0; // A single, large sphere for now
        vec3 endPosB = vec3( radius * sin(phi) * cos(theta), radius * sin(phi) * sin(theta), radius * cos(phi) );
        endPosB.y += FLY_UP_HEIGHT * uScale;

        // --- Morphing ---
        vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        
        // --- Flight Animation ---
        vec3 startPos = vec3( (mod(a_id, 64.0) - 31.5) * 20.0, -70.0, (floor(a_id / 64.0) - 31.5) * 20.0 );
        float rowDelay = (15.0 - row) * 0.2;
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = smoothstep(0.0, 1.0, clamp((uTime - startTime) / FLIGHT_DURATION, 0.0, 1.0));

        // --- Collision Avoidance ---
        vec3 controlPos = endPosA + normalize(endPosA - vec3(0.0, FLY_UP_HEIGHT * uScale, 0.0)) * 750.0;
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);

        // --- Orientation ---
        vec3 lookAtPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress + 0.01);
        mat4 finalMatrix = createMatrix(finalPos, lookAtPos, 1.0);
        
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /*glsl*/ `
    void main() {
      // A simple, bright, emissive material
      gl_FragColor = vec4(0.5, 1.5, 0.9, 1.0); 
    }
  `,
}
