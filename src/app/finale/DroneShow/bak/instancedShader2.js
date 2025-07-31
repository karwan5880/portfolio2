export const InstancedParticleShader = {
  vertexShader: /*glsl*/ `
    // Uniforms from our React component
    uniform float uTime;
    uniform float uScale;
    uniform float uMasterProgress;
    uniform sampler2D uTextPositions;

    // Attributes: Data unique to each instance
    attribute float a_id;

    // Constants
    const float PI = 3.14159265359;
    const float DRONE_COUNT = 4096.0;
    const float GRID_SIZE = 16.0;
    const float FLY_UP_HEIGHT = 25.0;
    const float FLIGHT_DURATION = 10.0; // We can make this a uniform later if needed

    // Helper Functions
    float random(float n) {
        return fract(sin(n) * 43758.5453123);
    }
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) {
      return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C;
    }

    // mat4 createMatrix(vec3 position, vec3 lookAtTarget, float scale) {
    //   vec3 z = normalize(lookAtTarget - position);
    //   vec3 x = normalize(cross(vec3(0.0, 1.0, 0.0), z));
    //   vec3 y = normalize(cross(z, x));
    //   return mat4(
    //     vec4(x * scale, 0.0),
    //     vec4(y * scale, 0.0),
    //     vec4(z * scale, 0.0),
    //     vec4(position, 1.0)
    //   );
    // }

        
    // ========================================================================
    // --- FIX 1: THE STABLE ORIENTATION MATRIX ---
    // This new version ensures the drone's "up" vector is always (0, 1, 0)
    // ========================================================================
    mat4 createMatrix(vec3 position, vec3 lookAtTarget, float scale) {
        // The "forward" direction is from the drone to its target
        vec3 forward = normalize(lookAtTarget - position);
        // The "right" direction is always perpendicular to the world's up vector
        vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
        // The "up" direction is perpendicular to the forward and right vectors
        vec3 up = normalize(cross(forward, right));

        return mat4(
            vec4(right * scale, 0.0),
            vec4(up * scale, 0.0), // Use the newly calculated 'up' vector
            vec4(forward * scale, 0.0),
            vec4(position, 1.0)
        );
    }


    void main() {
        // --- Choreography Target Positions ---
        
        // TARGET A: The Initial Cube
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

        // TARGET B: The Sphere
        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1.0 - 2.0 * droneId_norm);
        float theta = 2.0 * PI * random(a_id);
        float radius = 15.0 * uScale;
        vec3 endPosB = vec3(
            radius * sin(phi) * cos(theta),
            radius * sin(phi) * sin(theta),
            radius * cos(phi)
        );
        endPosB.y += FLY_UP_HEIGHT * uScale;

        // TARGET C: The "FINALE" Text
        float texSize = sqrt(DRONE_COUNT);
        vec2 uv = vec2(mod(a_id, texSize) / texSize, floor(a_id / texSize) / texSize);
        vec3 endPosC = texture2D(uTextPositions, uv).xyz;
        endPosC.y += FLY_UP_HEIGHT * uScale;

        // --- Multi-Stage Morphing ---
        vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));
        
        // ========================================================================
        // --- COMPLETE CODE FOR THIS SECTION ---
        // ========================================================================

        // --- Initial Launchpad Position ---
        vec3 startPos = vec3(
            (mod(a_id, 64.0) - 31.5) * 2.0,
            -70.0,
            (floor(a_id / 64.0) - 31.5) * 2.0
        ) * uScale;

        // --- Flight Timing ---
        float rowDelay = (15.0 - row) * 0.2; // Use the cube's row for staggered launch
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = clamp((uTime - startTime) / FLIGHT_DURATION, 0.0, 1.0);
        progress = smoothstep(0.0, 1.0, progress);

        // --- Collision Avoidance Control Point ---
        vec3 formationCenter = vec3(0.0, FLY_UP_HEIGHT * uScale, 0.0);
        vec3 outwardDirection = normalize(endPosA - formationCenter);
        float detourDistance = 75.0 * uScale;
        vec3 controlPos = endPosA + outwardDirection * detourDistance;

        // --- Final Position on the Curve ---
        // The drone's position is calculated on a curve from its start position
        // to its final, morphed destination.
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);

        // ========================================================================

        // --- Drone Orientation ---
        vec3 lookAtPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress + 0.01);

        // --- Final Matrix Calculation ---
        mat4 finalMatrix = createMatrix(finalPos, lookAtPos, 1.0);
        
        // This is the standard instancing formula
        gl_Position = projectionMatrix * viewMatrix * finalMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /*glsl*/ `
    // A simple glowing fragment shader for our new 3D model
    void main() {
      // We can make the emissive color pulse here if we want!
      gl_FragColor = vec4(0.0, 1.0, 0.4, 1.0);
    }
  `,
}
