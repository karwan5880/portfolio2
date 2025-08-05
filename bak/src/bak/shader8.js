export const ParticleShader = {
  // ========================================================================
  //                             VERTEX SHADER
  //  (Calculates the position of each drone on every frame)
  // ========================================================================
  vertexShader: /*glsl*/ `
    // Uniforms: "Knobs" we can turn from our React component
    uniform float uTime;
    uniform float uScale;
    uniform float uFlyUpHeight;
    uniform float uMasterProgress; // Our master timeline control (0=cube, 1=sphere, 2=text)
    uniform sampler2D uTextPositions; // The "blueprint" texture for our text shape
    uniform float uFlightDuration;

    // Attributes: Data that is unique to each individual drone
    attribute float a_id;

    // Varyings: Data passed from the Vertex Shader to the Fragment Shader
    varying vec3 vColor;
    varying float vProgress;

    // Constants
    const float PI = 3.14159265359;
    const float DRONE_COUNT = 4096.0;
    const float GRID_SIZE = 16.0;

    // Helper Functions
    float random(float n) {
        return fract(sin(n) * 43758.5453123);
    }
    vec3 hsl2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
        return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0));
    }
    vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) {
      return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C;
    }


    void main() {
        // --- Color ---
        // We'll give each drone a unique color based on its ID for a vibrant show.
        float hue = random(a_id);
        vColor = hsl2rgb(vec3(hue, 0.8, 0.6));

        // --- Choreography Target Positions ---

        // TARGET A: The Initial Cube
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3(
            (col - (GRID_SIZE - 1.0) / 2.0) * 3.0,
            (row - (GRID_SIZE - 1.0) / 2.0) * 3.0,
            (layer - (GRID_SIZE - 1.0) / 2.0) * 3.0
        ) * uScale;
        endPosA.y += uFlyUpHeight * uScale;

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
        endPosB.y += uFlyUpHeight * uScale;

        // TARGET C: The "FINALE" Text (from the Data Texture)
        float texSize = sqrt(DRONE_COUNT);
        vec2 uv = vec2(mod(a_id, texSize) / texSize, floor(a_id / texSize) / texSize);
        vec3 endPosC = texture2D(uTextPositions, uv).xyz;
        endPosC.y += uFlyUpHeight * uScale;

        // --- Multi-Stage Morphing ---
        // This logic smoothly transitions between our three target shapes.
        vec3 finalEndPos;
        // Blend from Cube to Sphere
        finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        // Then, blend from the result to the Text
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));


        // --- Initial Flight Animation ---
        vec3 startPos = vec3(
            (mod(a_id, 64.0) - 31.5) * 2.0,
            -70.0,
            (floor(a_id / 64.0) - 31.5) * 2.0
        ) * uScale;

        // float flightDuration = 8.0;
        // float rowDelay = (15.0 - row) * 2.0;
        float rowDelay = (15.0 - row) * .1;
        float droneDelay = random(a_id) * 0.002;
        float startTime = rowDelay + droneDelay;
        float progress = clamp((uTime - startTime) / uFlightDuration, 0.0, 1.0);
        vProgress = smoothstep(0.0, 1.0, progress);
        
        vec3 finalPos = mix(startPos, finalEndPos, vProgress);

        // --- Hover Effect ---
        float hoverAmplitude = 0.15;
        vec3 hoverOffset = vec3(
            sin(uTime * 1.5 + a_id * 5.0),
            cos(uTime * 1.2 + a_id * 3.5),
            cos(uTime * 1.8 + a_id * 4.2)
        ) * hoverAmplitude;
        finalPos += hoverOffset * vProgress;

        // --- Final Position Calculation ---
        vec4 modelPosition = modelMatrix * vec4(finalPos, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        gl_Position = projectionMatrix * viewPosition;
        
        gl_PointSize = 15.0;
    }
  `,

  // ========================================================================
  //                            FRAGMENT SHADER
  //        (Calculates the color and appearance of each drone)
  // ========================================================================
  fragmentShader: /*glsl*/ `
    uniform float uTime;
    varying vec3 vColor;

    void main() {
        float dist = length(gl_PointCoord - vec2(0.5));

        // Create a sharp inner core for the drone light
        float core = smoothstep(0.15, 0.1, dist);
        // Create a larger, soft glow shape
        float glowShape = smoothstep(0.5, 0.0, dist);

        // Create the "power-on" heartbeat pulse for the beginning of the show
        float heartbeat = (sin(uTime * 5.0) + 1.0) / 2.0;
        heartbeat = pow(heartbeat, 3.0);
        float launchFade = 1.0 - smoothstep(0.0, 14.0, uTime);
        // float launchFade = 1.0 - smoothstep(0.0, 4.0, uTime);

        // Combine the effects for the final alpha (brightness)
        float alpha = core * 1.5 + glowShape * heartbeat * launchFade;

        // Discard transparent pixels for better performance
        if (alpha < 0.01) discard;

        // Use the unique color passed from the vertex shader
        gl_FragColor = vec4(vColor, alpha);
    }
  `,
}
